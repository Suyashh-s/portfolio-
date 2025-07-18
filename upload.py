import json
from qdrant_client import QdrantClient, models
from sentence_transformers import SentenceTransformer

# === CONFIG ===
QDRANT_URL = "https://a05e110a-6fff-4675-856c-f997cf369393.us-east4-0.gcp.cloud.qdrant.io"
QDRANT_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.N_HbVOoGaSz-96bOrWMvORXGOA1JyiPkoXuau9eSiqk"
COLLECTION_NAME = "portfolio"

# === Initialize clients ===
qdrant = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)

# === Load dataset ===
with open("my_data.json", "r", encoding="utf-8") as f:
    dataset = json.load(f)

# === Load local embedding model ===
model = SentenceTransformer("all-MiniLM-L6-v2")
print("✅ Loaded local embedding model.")

# === Create new collection (after manual delete) ===
qdrant.recreate_collection(
    collection_name=COLLECTION_NAME,
    vectors_config=models.VectorParams(size=384, distance=models.Distance.COSINE),
)
print("✅ Created new collection.")

# === Upload points ===
points = []

for idx, item in enumerate(dataset):
    combined_text = " ".join(item["example_questions"]) + " " + item["text"]
    vector = model.encode(combined_text).tolist()

    payload = {
        "text": item["text"],
        "example_questions": item["example_questions"],
    }
    if "images" in item:
        payload["images"] = item["images"]

    points.append(
        models.PointStruct(
            id=idx + 1,  # ✅ Use numeric ID instead of string
            vector=vector,
            payload=payload
        )
    )
    print(f"✅ Processed: {item.get('id', 'unknown')}")

# Upsert to Qdrant
qdrant.upsert(collection_name=COLLECTION_NAME, points=points)
print("🚀 All points uploaded successfully!")
