

// Let's check how the Gemini API is being initialized and used
import { GoogleGenAI } from "@google/genai";

// Make sure the API key is properly accessed from environment variables
const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

// Add validation for the API key
if (!apiKey) {
  console.error("GOOGLE_GEMINI_API_KEY is not defined in environment variables");
}

// Initialize the Google Generative AI with proper error handling
const ai = new GoogleGenAI({ apiKey: apiKey });
console.log(`Google Generative AI initialized with API key: ${apiKey ? "Available" : "MISSING"}`);

export async function generateEmbeddings(textArray: string[]) {
  console.log("textArray: ", textArray)
  try {
    console.log(`Generating embeddings for ${textArray.length} chunks using API key: ${apiKey ? "Available" : "MISSING"}`);
    
    const embeddings = await Promise.all(
      textArray.map(async (text) => {
        try {
          // Using the correct API format for embeddings
          const response = await ai.models.embedContent({
            model: 'text-embedding-004',
            contents: text,
          });
          
          // The response structure is correct, but we need to access the values properly
          if (response.embeddings && response.embeddings[0] && response.embeddings[0].values) {
            return response.embeddings[0].values;
          } else {
            console.error("Unexpected embedding response structure:", response);
            throw new Error("Invalid embedding response structure");
          }
        } catch (error) {
          console.error(`Error embedding specific text chunk: ${error}`);
          throw error; // Re-throw to be caught by the outer try/catch
        }
      })
    );
    
    return embeddings;
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw new Error(`Failed to generate embeddings: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function queryLLM(query: string, context: string) {
  console.log("query: ", query)
  console.log("context: ", context)
  try {
    const prompt = `
    You are a helpful AI assistant that provides accurate information about companies.
    
    Context information is below.
    ---------------------
    ${context}
    ---------------------
    
    Given the context information and not prior knowledge, answer the question: ${query}
    
    If the context doesn't contain relevant information to answer the question, just say "I don't have enough information to answer this question."
    `;
    
    // Using the correct API format for text generation
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error querying LLM:", error);
    throw new Error(`Failed to query LLM: ${error instanceof Error ? error.message : String(error)}`);
  }
}