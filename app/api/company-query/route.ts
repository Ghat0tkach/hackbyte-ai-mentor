import { ensureCompanyWithEmbeddings, searchCompanyVectors, queryCompany } from '@/lib/rag/queryEngine';
import { queryLLM } from '@/lib/ai/gemini';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { companyName, query, type = 'custom', additionalInfo = '', skipEmbedding = false } = body;
    
    if (!companyName) {
      return NextResponse.json(
        { message: 'Company name is required' },
        { status: 400 }
      );
    }
    
    // For standard queries, use the combined queryCompany function
    if (query && !skipEmbedding) {
      const result = await queryCompany(companyName, query, additionalInfo);
      return NextResponse.json(result);
    }
    // For custom processing where we want to separate the steps
    else if (query && skipEmbedding) {
      // Step 1: Get company ID without regenerating embeddings
      const companyId = await ensureCompanyWithEmbeddings(companyName, additionalInfo);
      
      // Step 2: Search for relevant information
      const { context, sources } = await searchCompanyVectors(companyId, query);
      console.log(context);
      
      // Step 3: Generate answer using LLM
      const answer = await queryLLM(query, context);
      
      return NextResponse.json({
        answer,
        sources,
        companyId: companyId.toString()
      });
    } else {
      return NextResponse.json(
        { message: 'Query is required for custom queries' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error in query API:', error);
    return NextResponse.json(
      { 
        message: 'Error processing query', 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}