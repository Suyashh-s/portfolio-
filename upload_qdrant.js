import { QdrantClient } from "@qdrant/js-client-rest";
import { pipeline } from "@xenova/transformers";
import fs from "fs";

// ✅ Qdrant setup with your new API key
const qdrant = new QdrantClient({
  url: "https://b266344a-9319-41de-92c5-e3042ae0735c.eu-west-2-0.aws.cloud.qdrant.io:6333",
  apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.MrrpTeWT0if2DFKgpnU5XA2N6ZMIGf3BcvthRfaCBD8",
});

const COLLECTION_NAME = "portfolio";

async function uploadData() {
  try {
    console.log("⏳ Loading embedding model...");
    const embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    console.log("✅ Embedding model loaded!");

    // Read the JSON data
    console.log("📖 Reading my_data.json...");
    const data = JSON.parse(fs.readFileSync("my_data.json", "utf-8"));
    console.log(`✅ Found ${data.length} entries to upload`);

    // Check if collection exists, create if not
    try {
      const collections = await qdrant.getCollections();
      const collectionExists = collections.collections.some(c => c.name === COLLECTION_NAME);
      
      if (collectionExists) {
        console.log(`✅ Collection '${COLLECTION_NAME}' already exists`);
        
        // Delete existing collection to start fresh
        console.log(`🗑️  Deleting existing collection to start fresh...`);
        await qdrant.deleteCollection(COLLECTION_NAME);
        console.log(`✅ Collection deleted`);
      }
      
      console.log(`📦 Creating collection '${COLLECTION_NAME}'...`);
      await qdrant.createCollection(COLLECTION_NAME, {
        vectors: {
          size: 384, // all-MiniLM-L6-v2 produces 384-dimensional vectors
          distance: "Cosine",
        },
      });
      console.log(`✅ Collection '${COLLECTION_NAME}' created!`);
    } catch (error) {
      console.error("❌ Error with collection setup:", error.message);
      throw error;
    }

    // Upload each entry
    console.log("\n🚀 Starting upload...\n");
    for (let i = 0; i < data.length; i++) {
      const entry = data[i];
      console.log(`[${i + 1}/${data.length}] Processing: ${entry.id}`);

      // Generate embedding for the text
      const embeddings = await embedder(entry.text, {
        pooling: "mean",
        normalize: true,
      });
      const vector = Array.from(embeddings.data);

      // Prepare the payload
      const payload = {
        id: entry.id,
        text: entry.text,
      };

      // Add optional fields if they exist
      if (entry.images) {
        payload.images = entry.images;
      }
      if (entry.example_questions) {
        payload.example_questions = entry.example_questions;
      }

      // Upload to Qdrant
      await qdrant.upsert(COLLECTION_NAME, {
        wait: true,
        points: [
          {
            id: i + 1, // Use numeric ID for Qdrant
            vector: vector,
            payload: payload,
          },
        ],
      });

      console.log(`   ✅ Uploaded successfully!`);
    }

    console.log("\n🎉 All data uploaded to Qdrant successfully!");
    console.log(`\n📊 Summary:`);
    console.log(`   - Collection: ${COLLECTION_NAME}`);
    console.log(`   - Total entries: ${data.length}`);
    console.log(`   - Vector dimensions: 384`);
    
    // Verify the upload
    const collectionInfo = await qdrant.getCollection(COLLECTION_NAME);
    console.log(`   - Points in collection: ${collectionInfo.points_count}`);

  } catch (error) {
    console.error("❌ Error uploading data:", error);
    process.exit(1);
  }
}

uploadData();
