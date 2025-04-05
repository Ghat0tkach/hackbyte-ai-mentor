import { NextResponse } from 'next/server';
import clientPromise from '@/lib/database/mongodb';

export async function GET(request: Request) {
  try {
    // Get query parameters from the URL
    const url = new URL(request.url);
    const company = url.searchParams.get('company');
    const difficulty = url.searchParams.get('difficulty');
    
    console.log(`API: Filtering questions - Company: ${company}, Difficulty: ${difficulty}`);
    
    const client = await clientPromise;
    const db = client.db('rag-knowledge-base');
    
    // Build the query based on provided filters
    const query: any = {};
    
    if (company && company !== 'all') {
      // Case-insensitive search for the company in the Companies field
      query.Companies = { $regex: company, $options: 'i' };
    }
    
    if (difficulty && difficulty !== 'all') {
      // Match the exact difficulty level (case-insensitive)
      query.difficulty = { $regex: `^${difficulty}$`, $options: 'i' };
    }
    
    console.log('MongoDB query:', JSON.stringify(query));
    
    // Find questions matching the criteria and limit to 5
    const questions = await db.collection('leetcode_questions')
      .find(query)
      .limit(5) // Limit to exactly 5 questions as requested
      .toArray();

    console.log('Selected questions:', questions.map(q => ({ qid: q.qid, title: q.title })));
    
    console.log(`API: Found ${questions.length} questions matching filters`);
    
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error filtering questions:', error);
    return NextResponse.json({ error: 'Failed to filter questions' }, { status: 500 });
  }
}