import { cppTemplate } from "@/components/dsa-template/templates/language_templates";
import { addTwoNumbersTemplate } from "@/components/dsa-template/templates/add_two_numbers_template";
import { longestSubstringTemplate } from "@/components/dsa-template/templates/longest_substring_template";
import { medianTwoArraysTemplate } from "@/components/dsa-template/templates/median_two_arrays_template";
import { longestPalindromeTemplate } from "@/components/dsa-template/templates/longest_palindrome_template";

// Updated language codes to match the ones used in page.tsx
const languageCodeMap = {
    cpp: 52,
    python: 71,
    javascript: 63,
    java: 62
}

// Import language templates

// Constants for API configuration
const JUDGE0_API_HOST = 'judge0-ce.p.rapidapi.com';
const JUDGE0_API_KEY = process.env.NEXT_PUBLIC_JUDGE0_API_KEY || '';
const SUBMISSION_TIMEOUT = 30000; // 30 seconds
const MAX_POLLING_ATTEMPTS = 10;
const POLLING_INTERVAL = 1000; // 1 second

// Helper function to create API request headers
const getApiHeaders = () => ({
    'x-rapidapi-key': JUDGE0_API_KEY,
    'x-rapidapi-host': JUDGE0_API_HOST,
    'Content-Type': 'application/json'
});

// get a submission
async function getSubmission(tokenId, callback) {
    const url = `https://judge0-ce.p.rapidapi.com/submissions/${tokenId}?base64_encoded=true&fields=*`;
    const options = {
        method: 'GET',
        headers: getApiHeaders()
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

// Helper function to safely decode base64 strings
const safeAtob = (base64String) => {
    if (!base64String) return '';
    try {
        return atob(base64String);
    } catch (e) {
        console.error('Failed to decode base64 string:', e);
        return '';
    }
};

// Helper function to safely encode strings to base64
const safeEncode = (text) => {
    if (!text) return null;
    try {
        return btoa(unescape(encodeURIComponent(text)));
    } catch (e) {
        console.error('Failed to encode string to base64:', e);
        try {
            return btoa(text);
        } catch (e2) {
            console.error('Fallback encoding failed:', e2);
            return null;
        }
    }
};

export async function makeSubmission ({ code, language, stdin, questionTitle }) {
    // make a submission handle the status of the submission
    const url = 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true';
    
    // Prepare code based on language
    let processedCode = code;
    
    // For C++, wrap the user's code with a template that includes a main function
    if (language === 52) { // C++ language ID
        // Check which problem we're dealing with based on question title or input format
        if (questionTitle === "Add Two Numbers" || (stdin && stdin.includes('l1 = ') && stdin.includes('l2 = '))) {
            // Add Two Numbers problem
            processedCode = addTwoNumbersTemplate.replace('ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {\n    // This is a placeholder. The actual solution will be provided by the user\n    return nullptr;\n}', code);
        } else if (questionTitle === "Longest Substring Without Repeating Characters" || (stdin && stdin.includes('s = ') && !stdin.includes('nums'))) {
            // Longest Substring Without Repeating Characters problem
            processedCode = longestSubstringTemplate.replace('int lengthOfLongestSubstring(string s) {\n    // This is a placeholder. The actual solution will be provided by the user\n    return 0;\n}', code);
        } else if (questionTitle === "Median of Two Sorted Arrays" || (stdin && stdin.includes('nums1 = ') && stdin.includes('nums2 = '))) {
            // Median of Two Sorted Arrays problem
            processedCode = medianTwoArraysTemplate.replace('double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n    // This is a placeholder. The actual solution will be provided by the user\n    return 0.0;\n}', code);
        } else if (questionTitle === "Longest Palindromic Substring" || (stdin && stdin.includes('s = ') && !stdin.includes('nums'))) {
            // Longest Palindromic Substring problem
            processedCode = longestPalindromeTemplate.replace('string longestPalindrome(string s) {\n    // This is a placeholder. The actual solution will be provided by the user\n    return "";\n}', code);
        } else {
            // Use the default template for other problems
            processedCode = cppTemplate.replace('// User\'s solution function will be inserted here', code);
        }
    }
    
    // Ensure code is properly encoded
    const encodedCode = safeEncode(processedCode);
    if (!encodedCode) {
        return { error: 'Failed to encode source code', message: 'Could not properly encode the source code.' };
    }
    
    // Format stdin for proper encoding
    const encodedStdin = stdin ? safeEncode(stdin) : null;
    
    const requestBody = {
        language_id: language,
        source_code: encodedCode,
        stdin: encodedStdin
    };
    
    const httpOption = {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify(requestBody)
    };
    
    // Add a timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), SUBMISSION_TIMEOUT);
    httpOption.signal = controller.signal;

    try {
        const response = await fetch(url, httpOption);
        clearTimeout(timeoutId); // Clear the timeout
        
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
        
        // Poll for results
        for (let attempts = 0; attempts < MAX_POLLING_ATTEMPTS; attempts++) {
            try {
                // Wait between polling attempts
                await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL));
                
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
                console.error('Error during polling:', error);
            }
        }

        // Process the final result
        if (apiSubmissionResult) {
            // Decode base64 outputs
            if (apiSubmissionResult.stdout) {
                apiSubmissionResult.stdout = safeAtob(apiSubmissionResult.stdout);
            }
            
            if (apiSubmissionResult.stderr) {
                apiSubmissionResult.stderr = safeAtob(apiSubmissionResult.stderr);
            }
            
            if (apiSubmissionResult.compile_output) {
                apiSubmissionResult.compile_output = safeAtob(apiSubmissionResult.compile_output);
            }
            
            return apiSubmissionResult;
        } else {
            return { error: 'Failed to get submission result after multiple attempts' };
        }
    } catch (error) {
        clearTimeout(timeoutId); // Clear the timeout
        
        if (error.name === 'AbortError') {
            return {
                error: 'Request timeout',
                message: 'The request to the Judge0 API timed out. Please try again later.'
            };
        }
        
        return { 
            error: true, 
            message: error.toString() 
        };
    }
}