import clientPromise from '@/lib/database/mongodb';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request
): Promise<NextResponse> {
  try {
    const client = await clientPromise;
    const db = client.db('rag-knowledge-base');
    
    // Parse URL and get query parameters
    const url = new URL(request.url);
    const company = url.searchParams.get('company');
    const difficulty = url.searchParams.get('difficulty');

    // If company and difficulty are provided, use them for filtering
    if (company && difficulty) {
      const questions = await db.collection('leetcode_questions')
        .find({ 
          company: company,
          difficulty: difficulty 
        })
        .toArray();
      return NextResponse.json(questions);
    }

    // Otherwise, proceed with qid-based lookup
    const questionId = parseInt(params.qid);

    console.log(`API: Attempting to fetch question with ID ${questionId}`);

    if (isNaN(questionId)) {
      return NextResponse.json({ error: 'Invalid question ID' }, { status: 400 });
    }

    // Try to find the question in the database
    const question = await db.collection('leetcode_questions').findOne({ qid: questionId });
    
    if (!question) {
      console.log(`API: Question with ID ${questionId} not found in database`);
      
      // Check if we have any questions with higher IDs
      const nextAvailableQuestion = await db.collection('leetcode_questions')
        .find({ qid: { $gt: questionId } })
        .sort({ qid: 1 })
        .limit(1)
        .toArray();
      
      if (nextAvailableQuestion.length > 0) {
        console.log(`API: Found next available question with ID ${nextAvailableQuestion[0].qid}`);
        return NextResponse.json(nextAvailableQuestion[0]);
      }
      
      // Check if we have any questions with lower IDs that haven't been fetched yet
      const prevAvailableQuestion = await db.collection('leetcode_questions')
        .find({ qid: { $lt: questionId } })
        .sort({ qid: -1 })
        .limit(1)
        .toArray();
      
      if (prevAvailableQuestion.length > 0) {
        console.log(`API: No question with ID ${questionId} or higher, returning previous question with ID ${prevAvailableQuestion[0].qid}`);
        return NextResponse.json(prevAvailableQuestion[0]);
      }
      
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    console.log(`API: Successfully found question: ${question.title}`);
    return NextResponse.json(question);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch question' }, { status: 500 });
  }
}