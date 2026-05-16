import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { QdrantClient } from "@qdrant/js-client-rest";
import OpenAI from "openai";
import { pipeline } from "@xenova/transformers";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Qdrant setup
const QDRANT_API_KEY = process.env.QDRANT_API_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.MrrpTeWT0if2DFKgpnU5XA2N6ZMIGf3BcvthRfaCBD8";
const qdrant = new QdrantClient({
  url: "https://b266344a-9319-41de-92c5-e3042ae0735c.eu-west-2-0.aws.cloud.qdrant.io:6333",
  apiKey: QDRANT_API_KEY,
  checkCompatibility: false,
});

// ✅ OpenAI setup
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.warn("⚠️  OPENAI_API_KEY not found in environment variables");
}
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// ✅ Load local portfolio data as Qdrant fallback
let localPortfolioText = "";
try {
  const raw = fs.readFileSync(new URL('./my_data.json', import.meta.url), 'utf8');
  const entries = JSON.parse(raw);
  localPortfolioText = entries.map(e => e.text || "").filter(Boolean).join("\n\n");
  console.log(`✅ Loaded ${entries.length} local portfolio entries as fallback`);
} catch (e) {
  console.warn("⚠️  Could not load my_data.json:", e.message);
}

// ✅ Load embedding model
let embedder;
let embedderReady = false;
(async () => {
  try {
    console.log("⏳ Loading embedding model...");
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    embedderReady = true;
    console.log("✅ Embedding model loaded!");
  } catch (err) {
    console.error("Failed to load embedding model:", err?.message || err);
  }
})();

function debugLog(...args) {
  const line = new Date().toISOString() + ' ' + args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
  console.log(line);
  try { fs.appendFileSync('server-debug.log', line + '\n'); } catch (e) {}
}

// ✅ API route
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "No message provided" });
  debugLog('[ /api/chat ] request received');
  if (!embedderReady) {
    return res.status(503).json({ response: "Server starting up: embedding model still loading — please try again in a few seconds.", images: [] });
  }

  if (!OPENAI_API_KEY) {
    console.error("OpenAI API key missing when handling /api/chat request");
    return res.status(500).json({ response: "Server misconfiguration: missing OpenAI API key.", images: [] });
  }

  let qdrantText = localPortfolioText || "I couldn't find any exact match in my data.";
  let images = [];

  // ── Qdrant vector search (best-effort — falls back to local data if unavailable) ──
  try {
    debugLog('[ /api/chat ] computing embeddings');
    const embeddings = await embedder(message, { pooling: "mean", normalize: true });
    debugLog('[ /api/chat ] embeddings computed');
    const vector = Array.from(embeddings.data);

    debugLog('[ /api/chat ] searching qdrant');
    const results = await qdrant.search("portfolio", {
      vector,
      limit: 1,
      with_payload: true,
    });
    debugLog('[ /api/chat ] qdrant search complete - results:', results.length);

    if (results.length > 0 && results[0].payload && results[0].payload.text) {
      qdrantText = results[0].payload.text;
      const lowerQuery = message.toLowerCase();
      if (/(achievement|hackathon|about me|tell me about yourself)/.test(lowerQuery)) {
        images = results[0].payload.images || [];
      }
    }
  } catch (qdrantErr) {
    debugLog('[ /api/chat ] Qdrant unavailable, using local fallback:', qdrantErr.message);
  }

  try {
    debugLog('[ /api/chat ] calling OpenAI chat completion');
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are Suyash Sawant, and you're answering in first person but don't write 'As Suyash Sawant' unnecessarily. Write clearly, professionally, and in a structured, elegant style. Use bullet points, line breaks, and markdown formatting as needed. When necessary, bold important words (using ** **), or use headings (like ## or ###) to organize sections and emphasize key points. Avoid overly casual words or emojis. Only provide a direct answer — do not mention that you are an assistant or AI."
        },
        {
          role: "user",
          content: `Use this context if helpful: "${qdrantText}". User question: "${message}"`
        }
      ],
    });
    debugLog('[ /api/chat ] OpenAI returned completion');
    let cleanedAnswer = completion.choices[0].message.content.trim();
    if (cleanedAnswer.startsWith("```html")) cleanedAnswer = cleanedAnswer.slice(6).trim();
    if (cleanedAnswer.startsWith("```"))     cleanedAnswer = cleanedAnswer.slice(3).trim();
    if (cleanedAnswer.endsWith("```"))       cleanedAnswer = cleanedAnswer.slice(0, -3).trim();
    res.json({ response: cleanedAnswer, images });
  } catch (error) {
    console.error("Error in /api/chat:", error?.message || error);
    return res.status(500).json({ response: "Sorry, I'm having trouble connecting right now. Please try again in a moment.", images: [] });
  }
});

// Keep the original /api/query endpoint for compatibility
app.post("/api/query", async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "No query provided" });
  debugLog('[ /api/query ] request received');
  if (!embedderReady) {
    return res.status(503).json({ answer: "Server starting up: embedding model still loading — please try again in a few seconds.", images: [] });
  }

  if (!OPENAI_API_KEY) {
    console.error("OpenAI API key missing when handling /api/query request");
    return res.status(500).json({ answer: "Server misconfiguration: missing OpenAI API key.", images: [] });
  }

  let qdrantText = localPortfolioText || "I couldn't find any exact match in my data.";
  let images = [];

  // ── Qdrant vector search (best-effort — falls back to local data if unavailable) ──
  try {
    debugLog('[ /api/query ] computing embeddings');
    const embeddings = await embedder(query, { pooling: "mean", normalize: true });
    debugLog('[ /api/query ] embeddings computed');
    const vector = Array.from(embeddings.data);

    debugLog('[ /api/query ] searching qdrant');
    const results = await qdrant.search("portfolio", {
      vector,
      limit: 1,
      with_payload: true,
    });
    debugLog('[ /api/query ] qdrant search complete - results:', results.length);

    if (results.length > 0 && results[0].payload && results[0].payload.text) {
      qdrantText = results[0].payload.text;
      const lowerQuery = query.toLowerCase();
      if (/(achievement|hackathon|about me|tell me about yourself)/.test(lowerQuery)) {
        images = results[0].payload.images || [];
      }
    }
  } catch (qdrantErr) {
    debugLog('[ /api/query ] Qdrant unavailable, using local fallback:', qdrantErr.message);
  }

  try {
    debugLog('[ /api/query ] calling OpenAI chat completion');
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are Suyash Sawant, and you're answering in first person but don't write 'As Suyash Sawant' unnecessarily. Write clearly, professionally, and in a structured, elegant style. Use bullet points, line breaks, and markdown formatting as needed. When necessary, bold important words (using ** **), or use headings (like ## or ###) to organize sections and emphasize key points. Avoid overly casual words or emojis. Only provide a direct answer — do not mention that you are an assistant or AI."
        },
        {
          role: "user",
          content: `Use this context if helpful: "${qdrantText}". User question: "${query}"`
        }
      ],
    });
    debugLog('[ /api/query ] OpenAI returned completion');
    let cleanedAnswer = completion.choices[0].message.content.trim();
    if (cleanedAnswer.startsWith("```html")) cleanedAnswer = cleanedAnswer.slice(6).trim();
    if (cleanedAnswer.startsWith("```"))     cleanedAnswer = cleanedAnswer.slice(3).trim();
    if (cleanedAnswer.endsWith("```"))       cleanedAnswer = cleanedAnswer.slice(0, -3).trim();
    res.json({ answer: cleanedAnswer, images });
  } catch (error) {
    console.error("Error in /api/query:", error?.message || error);
    return res.status(500).json({ answer: "Sorry, I'm having trouble connecting right now. Please try again in a moment.", images: [] });
  }
});

// ✅ Serve Vite frontend from dist in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
