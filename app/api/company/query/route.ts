import { ensureCompanyWithEmbeddings, searchCompanyVectors, queryCompany, getCompanyIfExists } from '@/lib/rag/queryEngine';
import { queryLLM } from '@/lib/ai/gemini';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      companyName, 
      query, 
      type = 'custom', 
      additionalInfo = '', 
      mode = 'existing'
    } = body;
    
    if (!companyName) {
      return NextResponse.json(
        { message: 'Company name is required' },
        { status: 400 }
      );
    }
    
    if (!query) {
      return NextResponse.json(
        { message: 'Query is required' },
        { status: 400 }
      );
    }
    
    // Handle based on mode
    if (mode === 'new') {
      // For new companies, use the embedding generation flow
      const result = await queryCompany(companyName, query, additionalInfo);
      return NextResponse.json(result);
    } else {
      // For existing companies, use the lookup flow
      const { exists, companyId } = await getCompanyIfExists(companyName);
      
      if (!exists) {
        // If company doesn't exist but we're in existing mode, try to create it
        console.log(`Company "${companyName}" not found, attempting to create...`);
        const result = await queryCompany(companyName, query, additionalInfo);
        return NextResponse.json(result);
      }
      
      console.log(`Searching company "${companyName}" with ID: ${companyId}...`);
      const { context, sources } = await searchCompanyVectors(companyId, query);
      const answer = await queryLLM(query, context);
      
      return NextResponse.json({
        answer,
        sources,
        companyId: companyId.toString()
      });
    }
  } catch (error) {
    console.error('Error in company query API:', error);
    return NextResponse.json(
      { 
        message: 'Error processing query', 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}