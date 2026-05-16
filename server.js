import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";
import { pipeline } from "@xenova/transformers";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// â”€â”€ OpenAI â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.warn("âš ï¸  OPENAI_API_KEY not found in environment variables");
}
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// â”€â”€ Load local portfolio data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
let localPortfolioText = "";
let localEntries = [];
try {
  const raw = fs.readFileSync(new URL('./my_data.json', import.meta.url), 'utf8');
  localEntries = JSON.parse(raw);
  localPortfolioText = localEntries.map(e => e.text || "").filter(Boolean).join("\n\n");
  console.log(`âœ… Loaded ${localEntries.length} local portfolio entries`);
} catch (e) {
  console.warn("âš ï¸  Could not load my_data.json:", e.message);
}

// â”€â”€ In-memory vector store (replaces Qdrant) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Each entry: { id, text, images, vector: Float32Array }
let vectorStore = [];

function cosineSimilarity(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na  += a[i] * a[i];
    nb  += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

function vectorSearch(queryVec) {
  if (vectorStore.length === 0) return null;
  let best = -2, bestEntry = null;
  for (const entry of vectorStore) {
    const sim = cosineSimilarity(queryVec, entry.vector);
    if (sim > best) { best = sim; bestEntry = entry; }
  }
  return bestEntry;
}

// â”€â”€ Keyword fallback (instant, no embedding) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function findLocalContext(query) {
  const q = query.toLowerCase();
  const keywordMap = [
    { ids: ["achievements"], keywords: ["achievement", "hackathon", "award", "win", "won", "prize", "competition", "milestone", "accomplishment", "recognition", "gitex", "hackup", "dubai"] },
    { ids: ["skills"],       keywords: ["skill", "tech", "language", "framework", "stack", "code", "programming", "tool", "expertise", "experience"] },
    { ids: ["projects"],     keywords: ["project", "built", "build", "work", "portfolio", "app", "software", "developed"] },
    { ids: ["goals"],        keywords: ["goal", "future", "plan", "vision", "aspire", "ambition", "startup", "dream"] },
    { ids: ["fun"],          keywords: ["hobby", "fun", "interest", "free time", "outside", "relax", "passion", "enjoy"] },
    { ids: ["bio"],          keywords: ["who", "about", "yourself", "background", "introduce", "bio", "story"] },
  ];
  for (const { ids, keywords } of keywordMap) {
    if (keywords.some(k => q.includes(k))) {
      const entries = localEntries.filter(e => ids.includes(e.id));
      if (entries.length > 0) {
        return {
          text:   entries.map(e => e.text || "").join("\n\n"),
          images: entries.flatMap(e => e.images || []),
        };
      }
    }
  }
  return { text: localPortfolioText, images: [] };
}

// â”€â”€ Load embedding model + build vector store â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
let embedder;
let embedderReady = false;

(async () => {
  try {
    console.log("â³ Loading embedding model...");
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    console.log("âœ… Embedding model loaded! Building vector store...");

    for (const entry of localEntries) {
      if (!entry.text) continue;
      const emb = await embedder(entry.text, { pooling: "mean", normalize: true });
      vectorStore.push({
        id:     entry.id,
        text:   entry.text,
        images: entry.images || [],
        vector: Array.from(emb.data),
      });
    }
    embedderReady = true;
    console.log(`âœ… Vector store ready â€” ${vectorStore.length} entries indexed`);
  } catch (err) {
    console.error("Failed to load embedding model:", err?.message || err);
  }
})();

// â”€â”€ Debug logger â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function debugLog(...args) {
  const line = new Date().toISOString() + ' ' + args.map(a => typeof a === 'string' ? a : JSON.stringify(a)).join(' ');
  console.log(line);
  try { fs.appendFileSync('server-debug.log', line + '\n'); } catch (_) {}
}

// â”€â”€ Shared search helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function retrieveContext(query) {
  // 1. Fast keyword match
  const localCtx = findLocalContext(query);

  // 2. Semantic vector search (when embedder is ready)
  if (embedderReady) {
    try {
      const emb = await embedder(query, { pooling: "mean", normalize: true });
      const queryVec = Array.from(emb.data);
      const best = vectorSearch(queryVec);
      if (best) {
        debugLog(`[ vector ] matched entry: ${best.id}`);
        const lowerQ = query.toLowerCase();
        const showImages = /(achievement|hackathon|about me|tell me about yourself)/.test(lowerQ);
        return { text: best.text, images: showImages ? best.images : localCtx.images };
      }
    } catch (e) {
      debugLog('[ vector ] search failed, using keyword fallback:', e.message);
    }
  }

  return localCtx;
}

const SYSTEM_PROMPT = "You are Suyash Sawant answering in first person. Be concise and direct — 3 to 6 sentences or a short bullet list unless the question genuinely needs more. Use markdown: bold key terms with **bold**, use - bullet points for lists. Never add blank lines between list items. No preamble, no sign-off, no filler. Never mention being an AI or assistant.";

// â”€â”€ /api/chat â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.post("/api/chat", async (req, res) => {
  const { message, stream: wantStream } = req.body;
  if (!message) return res.status(400).json({ error: "No message provided" });
  debugLog('[ /api/chat ] received:', message.slice(0, 80));

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ response: "Server misconfiguration: missing OpenAI API key.", images: [] });
  }

  const { text: contextText, images } = await retrieveContext(message);

  // ── Streaming mode ────────────────────────────────────────────────────────
  if (wantStream) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    // Send images immediately
    res.write(`data: ${JSON.stringify({ images })}\n\n`);
    try {
      const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        stream: true,
        max_tokens: 300,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user",   content: `Context: "${contextText}"\n\nQuestion: "${message}"` },
        ],
      });
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    } catch (err) {
      console.error("Streaming error:", err?.message);
      res.write(`data: ${JSON.stringify({ content: "\n\nSorry, something went wrong." })}\n\n`);
    }
    res.write('data: [DONE]\n\n');
    res.end();
    debugLog('[ /api/chat ] stream done');
    return;
  }

  // ── Non-streaming fallback ────────────────────────────────────────────────
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 300,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user",   content: `Context: "${contextText}"\n\nQuestion: "${message}"` },
      ],
    });
    let answer = completion.choices[0].message.content.trim()
      .replace(/^```html\n?/, "").replace(/^```\n?/, "").replace(/```$/, "").trim();
    debugLog('[ /api/chat ] done');
    res.json({ response: answer, images });
  } catch (error) {
    console.error("Error in /api/chat:", error?.message || error);
    res.status(500).json({ response: "Sorry, I'm having trouble connecting right now. Please try again in a moment.", images: [] });
  }
});

// â”€â”€ /api/query (kept for compatibility) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.post("/api/query", async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "No query provided" });
  debugLog('[ /api/query ] received:', query.slice(0, 80));

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ answer: "Server misconfiguration: missing OpenAI API key.", images: [] });
  }

  const { text: contextText, images } = await retrieveContext(query);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 300,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user",   content: `Context: "${contextText}"\n\nQuestion: "${query}"` },
      ],
    });
    let answer = completion.choices[0].message.content.trim()
      .replace(/^```html\n?/, "").replace(/^```\n?/, "").replace(/```$/, "").trim();
    debugLog('[ /api/query ] done');
    res.json({ answer, images });
  } catch (error) {
    console.error("Error in /api/query:", error?.message || error);
    res.status(500).json({ answer: "Sorry, I'm having trouble connecting right now. Please try again in a moment.", images: [] });
  }
});

// â”€â”€ Serve Vite frontend (production) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// â”€â”€ Start â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`âœ… Server running on http://localhost:${PORT}`);
});
