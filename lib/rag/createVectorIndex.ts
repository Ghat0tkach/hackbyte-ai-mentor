import { getMongoDb } from '../database/mongodb';

/**
 * Create vector search index in MongoDB Atlas
 */
export async function createVectorSearchIndex() {
  const db = await getMongoDb();
  const vectorCollection = db.collection('vector_embeddings');
  
  console.log("Creating vector search index...");
  
  // Define the Atlas Vector Search index
  const index = {
    name: "vector_index",
    type: "vectorSearch",
    definition: {
      "fields": [
        {
          "type": "vector",
          "numDimensions": 768, // Adjust based on your embedding dimensions
          "path": "embedding",
          "similarity": "dotProduct",
          "quantization": "scalar"
        }
      ]
    }
  };

  try {
    // Create the search index
    const result = await vectorCollection.createSearchIndex(index);
    console.log(`New search index named ${result} is building.`);

    // Wait for the index to be ready to query
    console.log("Polling to check if the index is ready. This may take up to a minute.");
    let isQueryable = false;
    while (!isQueryable) {
      const cursor = vectorCollection.listSearchIndexes();
      for await (const idx of cursor) {
        if (idx.name === result) {
          if (idx.queryable) {
            console.log(`${result} is ready for querying.`);
            isQueryable = true;
          } else {
            console.log("Index still building, waiting 5 seconds...");
            await new Promise(resolve => setTimeout(resolve, 5000));
          }
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error creating vector search index:", error);
    return false;
  }
}