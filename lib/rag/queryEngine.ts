import { getMongoDb } from '../database/mongodb';
import { generateEmbeddings, queryLLM } from '../ai/gemini';
import { processCompanySearch } from './companyProcessor';
import { QueryResult } from './types';
import { createVectorStore } from './vectorStore';
import { ObjectId } from 'mongodb';

/**
 * Check if company exists and return its data
 */
export async function getCompanyIfExists(companyName: string): Promise<{ exists: boolean; company?: any; companyId?: ObjectId }> {
  const db = await getMongoDb();
  await ensureCollections(db);
  
  const companiesCollection = db.collection('companies');
  
  // Find company
  const company = await companiesCollection.findOne({ companyName });
  
  if (company) {
    return {
      exists: true,
      company,
      companyId: company._id
    };
  }
  
  return { exists: false };
}

/**
 * Ensure company exists and has vector embeddings
 */
export async function ensureCompanyWithEmbeddings(companyName: string, additionalInfo: string = ''): Promise<ObjectId> {
  // Check if company already exists
  const { exists, companyId, company } = await getCompanyIfExists(companyName);
  
  if (exists && company.processedContent && company.processedContent.length > 0) {
    const db = await getMongoDb();
    const vectorCollection = db.collection('vector_embeddings');
    
    // Check if vector embeddings exist for this company
    const vectorCount = await vectorCollection.countDocuments({ 
      "metadata.companyId": companyId.toString() 
    });
    
    // If no vector embeddings exist, create them
    if (vectorCount === 0) {
      console.log(`No vector embeddings found for ${companyName}. Creating vector store...`);
      await createVectorStore(companyId, company.processedContent);
    }
    
    return companyId;
  }
  
  // If company doesn't exist or has no content, search for it and process the results
  const db = await getMongoDb();
  const companiesCollection = db.collection('companies');
  
  const result = await processCompanySearch(companyName, additionalInfo);
  if (result.isNew) {
    const newCompany = await companiesCollection.findOne({ companyName });
    return newCompany._id;
  } else {
    throw new Error(`Failed to retrieve information about ${companyName}.`);
  }
}

/**
 * Search for information using vector search
 */
export async function searchCompanyVectors(companyId: ObjectId, userQuery: string): Promise<{
  context: string;
  sources: { title: string; url: string }[];
}> {
  const db = await getMongoDb();
  const companiesCollection = db.collection('companies');
  const vectorCollection = db.collection('vector_embeddings');
  
  // Debug: Check if there are any vector embeddings for this company
  const vectorDocs = await vectorCollection.find({ 
    "metadata.companyId": companyId.toString() 
  }).toArray();
  
  console.log(`Found ${vectorDocs.length} vector embeddings for company ID ${companyId.toString()}`);
  
  // Get company data for fallback
  const company = await companiesCollection.findOne({ _id: companyId });
  
  // Try vector search with rate limit handling
  let vectorSearchResults = [];
  let context;
  let sources;
  
  try {
    // Generate embedding for the query with retry logic
    const queryEmbedding = await generateQueryEmbedding(userQuery);
    
    if (queryEmbedding && vectorDocs.length > 0) {
      console.log("Running vector search with companyId:", companyId.toString());
      
      // Vector search in MongoDB
      try {
        // Check if index exists
        let indexExists = false;
        try {
          const cursor = vectorCollection.listSearchIndexes();
          for await (const idx of cursor) {
            if (idx.name === "vector_index") {
              indexExists = true;
              break;
            }
          }
        } catch (error) {
          console.log("Error checking vector index:", error);
        }
        
        if (!indexExists) {
          console.log("Vector index not found. Using all company documents instead.");
          // Instead of throwing an error, use all vector documents for this company
          vectorSearchResults = vectorDocs;
        } else {
          vectorSearchResults = await vectorCollection.aggregate([
            {
              $vectorSearch: {
                index: "vector_index",
                queryVector: queryEmbedding,
                path: "embedding",
                numCandidates: 100,
                limit: 10,
                filter: { "metadata.companyId": companyId.toString() }
              }
            },
            {
              $project: {
                text: 1,
                metadata: 1,
                score: { $meta: "vectorSearchScore" }
              }
            }
          ]).toArray();
          
          console.log(`Vector search returned ${vectorSearchResults.length} results`);
          
          // If vector search returned no results, use all vector documents
          if (vectorSearchResults.length === 0 && vectorDocs.length > 0) {
            console.log("Vector search returned no results. Using all company vector documents.");
            vectorSearchResults = vectorDocs;
          }
        }
      } catch (searchError) {
        console.error("Vector search operation failed:", searchError);
        
        // Use all vector documents as fallback
        console.log("Using all company vector documents instead of vector search");
        vectorSearchResults = vectorDocs;
      }
    } else if (vectorDocs.length > 0) {
      // If we have vector docs but no embedding, use them all
      console.log("Using all company vector documents (no embedding generated)");
      vectorSearchResults = vectorDocs;
    }
  } catch (error) {
    console.error("Error in vector search process:", error);
    // Continue with fallback approach
  }
  
  // If we still have no results, use all company content as context
  if (!vectorSearchResults || vectorSearchResults.length === 0) {
    console.log(`No vector documents for company ID ${companyId}. Using all processed content as context.`);
    if (company && company.processedContent && company.processedContent.length > 0) {
      context = company.processedContent.map(item => item.content).join("\n\n");
      sources = company.processedContent.map(item => ({
        title: item.title,
        url: item.url
      }));
    } else {
      console.log("Warning: No processed content available for fallback");
      context = "No information available for this company.";
      sources = [];
    }
  } else {
    // Combine all the relevant chunks
    context = vectorSearchResults.map(r => r.text).join("\n\n");
    sources = vectorSearchResults.map(r => ({
      title: r.metadata.title,
      url: r.metadata.url
    }));
  }
  
  return { context, sources };
}

/**
 * Query company information (main function that uses the separated functions)
 */
export async function queryCompany(companyName: string, userQuery: string, additionalInfo: string): Promise<QueryResult> {
  // Step 1: Ensure company exists with embeddings
  const companyId = await ensureCompanyWithEmbeddings(companyName, additionalInfo);
  
  // Step 2: Search for relevant information
  const { context, sources } = await searchCompanyVectors(companyId, userQuery);
  
  return  {
    sources,
    companyId: companyId.toString(),
    context
  }
}

/**
 * Generate query embedding with retry and fallback
 */
async function generateQueryEmbedding(query: string, maxRetries = 3): Promise<number[] | null> {
  let retryCount = 0;
  let backoffTime = 1000; // Start with 1 second
  
  while (retryCount < maxRetries) {
    try {
      const [embedding] = await generateEmbeddings([query]);
      return embedding;
    } catch (error) {
      retryCount++;
      console.log(`Embedding generation failed (attempt ${retryCount}/${maxRetries}). ${error.message}`);
      
      // If we've reached max retries, return null to trigger fallback
      if (retryCount >= maxRetries) {
        console.log("Max retries reached for embedding generation. Using fallback approach.");
        return null;
      }
      
      // Exponential backoff
      console.log(`Waiting ${backoffTime}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, backoffTime));
      backoffTime *= 2; // Double the backoff time for next retry
    }
  }
  
  return null;
}

/**
 * Ensure required collections exist
 */
async function ensureCollections(db) {
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map(c => c.name);
  console.log("Collections in database:", collectionNames);
  
  if (!collectionNames.includes('companies')) {
    console.log("Creating 'companies' collection...");
    await db.createCollection('companies');
  }
  
  if (!collectionNames.includes('vector_embeddings')) {
    console.log("Creating 'vector_embeddings' collection...");
    await db.createCollection('vector_embeddings');
  }
}