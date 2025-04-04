import { getMongoDb } from '../database/mongodb';
import { searchCompanyInfo } from './tavily';
import { ObjectId } from 'mongodb';
import { ProcessedContent } from './types';
import { createVectorStore } from './vectorStore';

/**
 * Process a company search request
 */
export async function processCompanySearch(companyName: string, additionalInfo: string) {
  const db = await getMongoDb();
  const companiesCollection = db.collection('companies');
  
  // Check if company already exists in database
  const existingCompany = await companiesCollection.findOne({ companyName });
  
  if (existingCompany && existingCompany.processedContent.length > 0) {
    return {
      companyId: existingCompany._id,
      isNew: false,
      message: `Information about ${companyName} already exists in database.`
    };
  }
  
  // Search using Tavily API
  const searchResults = await searchCompanyInfo(companyName, additionalInfo);
  
  // Store raw search results
  const insertResult = await companiesCollection.insertOne({
    companyName,
    searchResults,
    processedContent: [],
    createdAt: new Date()
  });
  
  const companyId = insertResult.insertedId;
  
  // Process search results
  await processSearchResults(companyId, searchResults);
  
  return {
    companyId,
    isNew: true,
    message: `Successfully retrieved and processed information about ${companyName}.`
  };
}

/**
 * Process search results and extract content
 */
async function processSearchResults(companyId: ObjectId, searchResults: any) {
  const db = await getMongoDb();
  const companiesCollection = db.collection('companies');
  
  const processedContent: ProcessedContent[] = [];
  
  // Extract content from raw search results
  if (searchResults.results && searchResults.results.length > 0) {
    for (const result of searchResults.results) {
      const { content, url, title } = result;
      
      if (content) {
        // Use content directly from Tavily
        processedContent.push({
          url,
          title,
          content: content.replace(/\s+/g, ' ').trim()
        });
      }
    }
  }
  
  // Update the document with processed content
  await companiesCollection.updateOne(
    { _id: companyId },
    { $set: { processedContent } }
  );
  
  // Create vector store from processed content
  await createVectorStore(companyId, processedContent);
}