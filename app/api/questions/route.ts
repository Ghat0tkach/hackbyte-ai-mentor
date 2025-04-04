import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { loadQuestions } from '@/app/utils/csv-loader';
import path from 'path';

export async function GET() {
  try {
    const client = await clientPromise;
    console.log('MongoDB connected successfully');
    
    const db = client.db('rag-knowledge-base');
    const collection = db.collection('leetcode_questions');
    
    // Check if collection is empty
    const count = await collection.countDocuments();
    
    if (count === 0) {
      console.log('Questions collection is empty, loading from CSV...');
      const questions = await loadQuestions();
      
      if (questions.length > 0) {
        const result = await collection.insertMany(questions);
        console.log(`Successfully loaded ${result.insertedCount} questions from CSV`);
      }
    }
    
    // Fetch questions with Google company tag and medium difficulty
    const questions = await collection.find({
      Companies: { $regex: /google/i },  // Case-insensitive search for 'google'
      difficulty: 'Medium'
    }).limit(5).toArray();
    
    console.log(`Returning ${questions.length} filtered Google medium questions`);
    
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Detailed database error:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}