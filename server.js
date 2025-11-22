import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { QdrantClient } from "@qdrant/js-client-rest";
import OpenAI from "openai";
import { pipeline } from "@xenova/transformers";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Qdrant setup
const qdrant = new QdrantClient({
  url: "https://a05e110a-6fff-4675-856c-f997cf369393.us-east4-0.gcp.cloud.qdrant.io",
  apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.N_HbVOoGaSz-96bOrWMvORXGOA1JyiPkoXuau9eSiqk",
});

// ✅ xAI Grok setup
const xai = new OpenAI({
  apiKey: process.env.XAI_API_KEY || "your-xai-api-key",
  baseURL: "https://api.x.ai/v1",
});

// ✅ Load embedding model
let embedder;
(async () => {
  console.log("⏳ Loading embedding model...");
  embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  console.log("✅ Embedding model loaded!");
})();

// ✅ API route
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "No message provided" });

  try {
    const embeddings = await embedder(message, { pooling: "mean", normalize: true });
    const vector = Array.from(embeddings.data);

    const results = await qdrant.search("portfolio", {
      vector,
      limit: 1,
      with_payload: true,
    });

    let qdrantText = "I couldn't find any exact match in my data.";
    let images = [];

    if (results.length > 0 && results[0].payload && results[0].payload.text) {
      qdrantText = results[0].payload.text;
      const lowerQuery = message.toLowerCase();
      if (/(achievement|hackathon|about me|tell me about yourself)/.test(lowerQuery)) {
        images = results[0].payload.images || [];
      }
    }

    const completion = await xai.chat.completions.create({
      model: "grok-2-1212",
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

    let geminiAnswer = completion.choices[0].message.content;

    let cleanedAnswer = geminiAnswer.trim();
    if (cleanedAnswer.startsWith("```html")) {
      cleanedAnswer = cleanedAnswer.slice(6).trim();
    }
    if (cleanedAnswer.startsWith("```")) {
      cleanedAnswer = cleanedAnswer.slice(3).trim();
    }
    if (cleanedAnswer.endsWith("```")) {
      cleanedAnswer = cleanedAnswer.slice(0, -3).trim();
    }

    res.json({ response: cleanedAnswer, images });
  } catch (error) {
    console.error("Error:", error);
    res.status(200).json({
      response: `The server is currently overloaded. Please try again in 5–10 seconds.

Meanwhile, feel free to explore my **projects**, **skills**, or **achievements** using the buttons below.`,
      images: [],
    });
  }
});

// Keep the original /api/query endpoint for compatibility
app.post("/api/query", async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "No query provided" });

  try {
    const embeddings = await embedder(query, { pooling: "mean", normalize: true });
    const vector = Array.from(embeddings.data);

    const results = await qdrant.search("portfolio", {
      vector,
      limit: 1,
      with_payload: true,
    });

    let qdrantText = "I couldn’t find any exact match in my data.";
    let images = [];

    if (results.length > 0 && results[0].payload && results[0].payload.text) {
      qdrantText = results[0].payload.text;
      const lowerQuery = query.toLowerCase();
      if (/(achievement|hackathon|about me|tell me about yourself)/.test(lowerQuery)) {
        images = results[0].payload.images || [];
      }
    }

    const completion = await xai.chat.completions.create({
      model: "grok-2-1212",
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

    let geminiAnswer = completion.choices[0].message.content;

    let cleanedAnswer = geminiAnswer.trim();
    if (cleanedAnswer.startsWith("```html")) {
      cleanedAnswer = cleanedAnswer.slice(6).trim();
    }
    if (cleanedAnswer.startsWith("```")) {
      cleanedAnswer = cleanedAnswer.slice(3).trim();
    }
    if (cleanedAnswer.endsWith("```")) {
      cleanedAnswer = cleanedAnswer.slice(0, -3).trim();
    }

    res.json({ answer: cleanedAnswer, images });
  } catch (error) {
    console.error("Error:", error);
    res.status(200).json({
      answer: `The server is currently overloaded. Please try again in 5–10 seconds.

Meanwhile, feel free to explore my **projects**, **skills**, or **achievements** using the buttons below.`,
      images: [],
    });
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
