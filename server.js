import express from "express";
import cors from "cors";
import { QdrantClient } from "@qdrant/js-client-rest";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { pipeline } from "@xenova/transformers";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Qdrant setup
const qdrant = new QdrantClient({
  url: "https://a05e110a-6fff-4675-856c-f997cf369393.us-east4-0.gcp.cloud.qdrant.io",
  apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.N_HbVOoGaSz-96bOrWMvORXGOA1JyiPkoXuau9eSiqk",
});

// ✅ Gemini setup
const genAI = new GoogleGenerativeAI("AIzaSyAg8OAi5CrFDPj341wBHMdDUvpBTwLea2Q");

// ✅ Load embedding model
let embedder;
(async () => {
  console.log("⏳ Loading embedding model...");
  embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  console.log("✅ Embedding model loaded!");
})();

app.post("/api/query", async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "No query provided" });

  try {
    // Create embedding vector
    const embeddings = await embedder(query, { pooling: "mean", normalize: true });
    const vector = Array.from(embeddings.data);

    // ✅ Qdrant search
    const results = await qdrant.search("portfolio", {
      vector,
      limit: 1,
      with_payload: true,
    });

    let qdrantText = "I couldn’t find any exact match in my data.";
    let images = [];
    if (results.length > 0 && results[0].payload && results[0].payload.text) {
      qdrantText = results[0].payload.text;
      // Only return images if query includes certain keywords
      const lowerQuery = query.toLowerCase();
      if (/(achievement|hackathon|about me|tell me about yourself)/.test(lowerQuery)) {
        images = results[0].payload.images || [];
      } else {
        images = [];
      }
    }

    // ✅ Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // ✅ Prompt
    const prompt = `
You are Suyash Sawant, and you're answering in first person but don't write "As Suyash Sawant" unnecessarily.
Write clearly, professionally, and in a structured, elegant style.
Use bullet points, line breaks, and markdown formatting as needed.
When necessary, bold important words (using ** **), or use headings (like ## or ###) to organize sections and emphasize key points.
Avoid overly casual words or emojis.
Use this context if helpful: "${qdrantText}".
User question: "${query}".
Only provide a direct answer — do not mention that you are an assistant or AI.
`;

    const result = await model.generateContent(prompt);
    let geminiAnswer = result.response.text();

    // ✅ Clean up Gemini code block artifacts
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

    // ✅ Friendly fallback message
    res.status(200).json({
      answer: `The server is currently overloaded. Please try again in 5–10 seconds.

Meanwhile, feel free to explore my **projects**, **skills**, or **achievements** using the buttons below.`,
      images: [],
    });
  }
});

app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});
