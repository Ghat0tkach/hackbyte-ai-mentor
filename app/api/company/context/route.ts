import { NextRequest, NextResponse } from 'next/server';
import { searchCompanyVectors, getCompanyIfExists } from '@/lib/rag/queryEngine';
import { queryLLM } from '@/lib/ai/gemini';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { companyName, query } = body;
    
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
    
    // Get company ID from company name
    const { exists, companyId } = await getCompanyIfExists(companyName);
    
    if (!exists) {
      return NextResponse.json(
        { message: `Company "${companyName}" not found` },
        { status: 404 }
      );
    }
    
    console.log(`Searching company "${companyName}" with ID: ${companyId}...`);
    const { context, sources } = await searchCompanyVectors(companyId, query);

    console.log(`Context: ${context}`);
    console.log(`Sources: ${JSON.stringify(sources)}`);
    return NextResponse.json({
      context,
      sources,
      companyId: companyId.toString()
    });
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