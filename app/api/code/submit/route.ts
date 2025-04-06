import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { code, language, stdin } = await request.json();

    if (!code || !language) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Encode the code and stdin in base64
    const encodedCode = Buffer.from(code).toString('base64');
    const encodedStdin = stdin ? Buffer.from(stdin).toString('base64') : null;

    // First, create a submission
    let submissionResponse;
    try {
      submissionResponse = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': process.env.NEXT_PUBLIC_JUDGE0_API_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        body: JSON.stringify({
          language_id: language,
          source_code: encodedCode,
          stdin: encodedStdin,
        }),
      });

      if (!submissionResponse.ok) {
        const errorData = await submissionResponse.text();
        throw new Error(`Submission failed with status ${submissionResponse.status}: ${errorData}`);
      }
    } catch (error) {
      console.error('Failed to create submission:', error);
      throw new Error(`Failed to create submission: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    const { token } = await submissionResponse.json();

    // Then, get the submission result
    const resultResponse = await fetch(
      `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=true&fields=*`,
      {
        headers: {
          'X-RapidAPI-Key': process.env.NEXT_PUBLIC_JUDGE0_API_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
      }
    );

    if (!resultResponse.ok) {
      throw new Error('Failed to get submission result');
    }

    const result = await resultResponse.json();

    // Decode the output if it exists
    if (result.stdout) {
      result.stdout = Buffer.from(result.stdout, 'base64').toString();
    }
    if (result.stderr) {
      result.stderr = Buffer.from(result.stderr, 'base64').toString();
    }
    if (result.compile_output) {
      result.compile_output = Buffer.from(result.compile_output, 'base64').toString();
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Code submission error:', error);
    return NextResponse.json(
      { error: 'Submission failed', message: error.message },
      { status: 500 }
    );
  }
}