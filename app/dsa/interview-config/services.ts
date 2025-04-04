"use client"
import { cppTemplate } from "@/app/templates/cpp_template";

// Updated language codes to match the ones used in page.tsx
const languageCodeMap = {
    cpp: 52,
    python: 71,
    javascript: 63,
    java: 62
}

// get a submission
async function getSubmission(tokenId, callback) {
    const url = `https://judge0-ce.p.rapidapi.com/submissions/${tokenId}?base64_encoded=true&fields=*`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'eb4640f76cmshede9f2d372dc794p169663jsn407d5c41fb79',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
        }
    };
  
    try {
        const response = await fetch(url, options);
        
        // Check if the response is OK before trying to parse JSON
        if (!response.ok) {
            const errorText = await response.text();
            if (callback) {
                callback({apiStatus: 'error', message: `API error: ${response.status} ${response.statusText}`})
            }
            return { error: `API error: ${response.status} ${response.statusText}`, message: errorText };
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        if (callback) {
            callback({apiStatus: 'error', message: JSON.stringify(error)})
        }
        return { error: true, message: error.toString() };
    }
  }

// Import language templates


export async function makeSubmission ({ code, language, stdin }) {
    // make a submission handle the status of the submission
    const url = 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true';
    
    // Prepare code based on language
    let processedCode = code;
    
    // For C++, wrap the user's code with a template that includes a main function
    if (language === 52) { // C++ language ID
        // Extract the user's solution function and insert it into the template
        processedCode = cppTemplate.replace('// User\'s solution function will be inserted here', code);
    }
    
    // Ensure code is properly encoded
    const encodedCode = btoa(unescape(encodeURIComponent(processedCode)));
    
    // Format stdin for proper encoding
    let encodedStdin = null;
    if (stdin) {
        try {
            encodedStdin = btoa(unescape(encodeURIComponent(stdin)));
        } catch (e) {
            // Fallback to simple encoding if the above fails
            encodedStdin = btoa(stdin);
        }
    }
    
    const requestBody = {
        language_id: language,
        source_code: encodedCode,
        stdin: encodedStdin
    };
    
    const httpOption = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': 'eb4640f76cmshede9f2d372dc794p169663jsn407d5c41fb79',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    };
    
    // Add a timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    httpOption.signal = controller.signal;

    try {
        const response = await fetch(url, httpOption);
        
        // Check if the response is OK before trying to parse JSON
        if (!response.ok) {
            const errorText = await response.text();
            
            // Handle specific error codes
            if (response.status === 429) {
                return { 
                    error: 'Rate limit exceeded', 
                    message: 'You have exceeded the RapidAPI rate limit. Please wait a moment before trying again.'
                };
            } else if (response.status === 401 || response.status === 403) {
                return { 
                    error: 'Authentication error', 
                    message: 'Your API key may be invalid or expired. Please check your RapidAPI subscription.'
                };
            } else if (response.status >= 500) {
                return { 
                    error: 'Judge0 server error', 
                    message: 'The Judge0 API is experiencing issues. Please try again later.'
                };
            }
            
            return { error: `API error: ${response.status} ${response.statusText}`, message: errorText };
        }
        
        let result;
        try {
            result = await response.json();
        } catch (jsonError) {
            return { 
                error: 'Invalid response format', 
                message: 'The API returned an invalid JSON response. This might indicate a temporary API issue.'
            };
        }
        
        if (!result.token) {
            // Check for specific error messages in the result
            if (result.error) {
                return { 
                    error: 'API error', 
                    message: `Judge0 API error: ${result.error}`,
                    details: result 
                };
            }
            return { error: 'No token received from API', details: result };
        }
        
        const tokenId = result.token;
        let statusCode = 1; // in queue
        let apiSubmissionResult = null;
        
        // Poll for results (max 10 attempts with 1 second delay)
        for (let attempts = 0; attempts < 10; attempts++) {
            try {
                // Wait 1 second between polling attempts
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                apiSubmissionResult = await getSubmission(tokenId);
                
                if (!apiSubmissionResult) continue;
                
                statusCode = apiSubmissionResult.status?.id;
                
                // Status codes: 1=In Queue, 2=Processing
                // If not in queue or processing, break the loop
                if (statusCode !== 1 && statusCode !== 2) {
                    break;
                }
            } catch (error) {
                // Continue polling despite errors
            }
        }

        // Process the final result
        if (apiSubmissionResult) {
            // Decode base64 output if present
            if (apiSubmissionResult.stdout) {
                try {
                    apiSubmissionResult.stdout = atob(apiSubmissionResult.stdout);
                } catch (e) {
                    // Failed to decode stdout
                }
            }
            
            if (apiSubmissionResult.stderr) {
                try {
                    apiSubmissionResult.stderr = atob(apiSubmissionResult.stderr);
                } catch (e) {
                    // Failed to decode stderr
                }
            }
            
            if (apiSubmissionResult.compile_output) {
                try {
                    apiSubmissionResult.compile_output = atob(apiSubmissionResult.compile_output);
                } catch (e) {
                    // Failed to decode compile_output
                }
            }
            
            return apiSubmissionResult;
        } else {
            return { error: 'Failed to get submission result after multiple attempts' };
        }
    } catch (error) {
        return { 
            error: true, 
            message: error.toString() 
        };
    }
}