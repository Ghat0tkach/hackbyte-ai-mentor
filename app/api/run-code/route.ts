import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code, language, testCases } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Code is required' },
        { status: 400 }
      );
    }

    // Here you would integrate with Judge0 API
    // For now, we'll mock the response
    
    // Mock execution delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock response
    const output = `Running test cases...\n\n` + 
      testCases.map((testCase: any, index: number) => 
        `Test Case ${index + 1}: ${testCase.input}\n` +
        `Expected: ${testCase.expectedOutput}\n` +
        `Your code executed successfully!`
      ).join('\n\n');

    return NextResponse.json({ output });
  } catch (error) {
    console.error('Error running code:', error);
    return NextResponse.json(
      { error: 'Failed to run code' },
      { status: 500 }
    );
  }
}