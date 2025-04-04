// API service for Judge0 and Gemini integration

// Judge0 API endpoints
const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_API_KEY = process.env.NEXT_PUBLIC_JUDGE0_API_KEY || '';

// Gemini API endpoint
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

// Language IDs for Judge0
const LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
};

// Submit code to Judge0
export async function submitCode(code: string, language: string, input: string) {
const languageId = LANGUAGE_IDS[language.toLowerCase() as keyof typeof LANGUAGE_IDS] || 63; // Default to JavaScript
  
  try {
    // Create submission
    const createResponse = await fetch(`${JUDGE0_API_URL}/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': JUDGE0_API_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      },
      body: JSON.stringify({
        source_code: code,
        language_id: languageId,
        stdin: input,
      }),
    });
    
    const createData = await createResponse.json();
    const token = createData.token;
    
    if (!token) {
      throw new Error('Failed to create submission');
    }
    
    // Poll for results
    let status = 'Processing';
    let result = null;
    
    while (status === 'Processing' || status === 'In Queue') {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      
      const statusResponse = await fetch(`${JUDGE0_API_URL}/submissions/${token}`, {
        headers: {
          'X-RapidAPI-Key': JUDGE0_API_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
      });
      
      result = await statusResponse.json();
      status = result.status?.description || 'Unknown';
    }
    
    return {
      stdout: result.stdout || '',
      stderr: result.stderr || '',
      compile_output: result.compile_output || '',
      message: result.message || '',
      status: status,
    };
  } catch (error) {
    console.error('Error submitting code:', error);
    throw error;
  }
}

// Get AI suggestions from Gemini
export async function getAISuggestions(code: string, question: any) {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `I'm solving this coding problem: "${question.title}". 
            
Problem description: ${question.description}

Here's my current code:
\`\`\`
${code}
\`\`\`

Please provide:
1. Feedback on my approach
2. Suggestions for improvement
3. Any edge cases I should consider
4. A follow-up question to deepen my understanding
5. Time and space complexity analysis`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      }),
    });
    
    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || 'No suggestions available';
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    throw error;
  }
}