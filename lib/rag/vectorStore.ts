import { getMongoDb } from '../database/mongodb';
import { generateEmbeddings } from '../ai/gemini';
import { ObjectId } from 'mongodb';
import { ChunkWithMetadata, ProcessedContent } from './types';

/**
 * Create vector store from processed content
 */
export async function createVectorStore(companyId: ObjectId, processedContent: ProcessedContent[]): Promise<boolean> {
  const db = await getMongoDb();
  const vectorCollection = db.collection('vector_embeddings');
  
  // Process all content into chunks
  const allChunksWithMetadata: ChunkWithMetadata[] = [];
  
  const generateChunks = (input: string): string[] => {
    return input
      .trim()
      .split('.')
      .filter(i => i !== '');
  };
  for (const item of processedContent) {
    if (item.content) {
      const chunks = generateChunks(item.content);
      
      for (const chunk of chunks) {
        allChunksWithMetadata.push({
          text: chunk,
          metadata: {
            companyId: companyId.toString(),
            url: item.url,
            title: item.title
          }
        });
      }
    }
  }
  
  if (allChunksWithMetadata.length === 0) {
    console.log("No content available to create vector store");
    return false;
  }
  
  try {
    // Generate embeddings for all chunks
    const texts = allChunksWithMetadata.map(item => item.text);
    const embeddings = await generateEmbeddings(texts);
    
    // Store chunks with embeddings
    const vectorDocs = allChunksWithMetadata.map((item, index) => ({
      text: item.text,
      embedding: embeddings[index],
      metadata: item.metadata
    }));
    
    // Insert all vector documents
    if (vectorDocs.length > 0) {
      await vectorCollection.insertMany(vectorDocs);
      
      // Create vector search index if it doesn't exist
      await ensureVectorIndex(db, embeddings[0].length);
      
      console.log(`Created vector store with ${vectorDocs.length} chunks`);
      return true;
    }
  } catch (error) {
    console.error("Error creating vector store:", error);
  }
  
  return false;
}

/**
 * Ensure vector search index exists
 */
async function ensureVectorIndex(db, dimension: number): Promise<void> {
  try {
    const vectorCollection = db.collection('vector_embeddings');
    const indexes = await vectorCollection.listIndexes().toArray();
    const hasVectorIndex = indexes.some(index => index.name === "vector_index");
    
    if (!hasVectorIndex) {
      await db.command({
        createIndexes: "vector_embeddings",
        indexes: [{
          name: "vector_index",
          key: { embedding: "vector" },
          vectorOptions: { 
            dimension, 
            type: "cosine" 
          }
        }]
      });
      console.log("Created vector search index");
    }
  } catch (error) {
    console.error("Error creating vector index:", error);
  }
}