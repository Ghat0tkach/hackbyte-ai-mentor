import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rag-knowledge-base');
    const collection = db.collection('questions');
    
    // Get the count of existing questions
    const count = await collection.countDocuments();
    
    return NextResponse.json({ 
      message: `Database has ${count} questions`,
      count: count 
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to check questions' }, { status: 500 });
  }
}