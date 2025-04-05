"use client"
import * as React from "react";

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Bot, Play, Send, CheckCircle2, XCircle, X, Settings } from "lucide-react"

import dynamic from "next/dynamic"


import { LeetCodeQuestion } from "@/utils/csv-loader";
import { QuestionSelector } from "@/components/dsa-template/question-selector";
import { QuestionDisplay } from "@/components/dsa-template/question-display";
import { makeSubmission } from "@/utils/services";


const languageMap: { [key: string]: number } = {
  cpp: 52,
  java: 62,
  javascript: 63,
  python: 71,
};

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import("@/components/monaco-editor"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-zinc-900 animate-pulse" />,
});

export default function LeetCodeUI() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [questions, setQuestions] = useState<LeetCodeQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<LeetCodeQuestion | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get company and difficulty from localStorage
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  // Check if configuration exists in localStorage
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const company = localStorage.getItem('selectedCompany');
      const difficulty = localStorage.getItem('selectedDifficulty');
      
      setSelectedCompany(company);
      setSelectedDifficulty(difficulty);
      
      // If no configuration exists, redirect to config page
      if (!company || !difficulty) {
        router.push('/ds');
      }
    }
  }, [router]);

  // Remove the CSV loader import and replace with this interface
  interface MongoQuestion {
    _id: string;
    qid: number;
    title: string;
    title_slug: string;
    difficulty: string;
    acceptance_rate: number;
    paid_only: boolean;
    topic_tags: string[];
    category_slug: string;
    question_body: string;
    examples: string[];
    constraints: string[];
  }
  
  // Fetch filtered questions based on company and difficulty
  useEffect(() => {
    async function fetchFilteredQuestions() {
      if (!selectedCompany || !selectedDifficulty) return;
      
      try {
        setIsLoading(true);
        console.log(`Fetching questions for ${selectedCompany} with ${selectedDifficulty} difficulty...`);
        
        const response = await fetch(`/api/questions/filter?company=${selectedCompany}&difficulty=${selectedDifficulty}`);
        
        if (!response.ok) {
          console.error('API response not OK:', response.status, response.statusText);
          throw new Error('Failed to fetch filtered questions');
        }

        const loadedQuestions = await response.json();
        console.log('Filtered questions loaded:', loadedQuestions.length);
        
        if (loadedQuestions.length > 0) {
          // Sort questions by qid to ensure consistent order
          loadedQuestions.sort((a, b) => a.qid - b.qid);
          setQuestions(loadedQuestions);

          // Set the first question as current
          console.log('Setting current question to:', loadedQuestions[0].title);
          setCurrentQuestion(loadedQuestions[0]);
          setCurrentQuestionIndex(0);
        } else {
          console.warn('No questions found with the selected filters');
          alert('No questions found with the selected filters. Please try different criteria.');
          router.push('/dsa-interview/onboarding');
        }
      } catch (error) {
        console.error('Error loading filtered questions:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchFilteredQuestions();
  }, [selectedCompany, selectedDifficulty, router]);

  // Handle question navigation
  const handleQuestionChange = (question: LeetCodeQuestion) => {
    setCurrentQuestion(question);
    setCurrentQuestionIndex(questions.findIndex(q => q.qid === question.qid));
  };
  
  // Function to fetch a question by qid from the API
  const fetchQuestionByQid = async (qid: number): Promise<LeetCodeQuestion | null> => {
    try {
      console.log(`Fetching question with qid: ${qid}`);
      const response = await fetch(`/api/questions/${qid}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`Question with qid ${qid} not found`);
          return null;
        }
        throw new Error(`Failed to fetch question: ${response.statusText}`);
      }
      
      const question = await response.json();
      console.log('Question fetched:', question); // Log the fetched question to check if it's being correctly parse
      console.log(`Successfully fetched question: ${question.title}`);
      
      // Add the question to our local questions array if it's not already there
      if (!questions.some(q => q.qid === question.qid)) {
        setQuestions(prevQuestions => {
          const updatedQuestions = [...prevQuestions, question].sort((a, b) => a.qid - b.qid);
          return updatedQuestions;
        });
      }
      
      return question;
    } catch (error) {
      console.error('Error fetching question:', error);
      return null;
    }
  };
  
  // Function to navigate to next question
  const handleNextQuestion = async () => {
    if (!currentQuestion) return;
    
    try {
      setIsSubmitting(true); // Show loading state
      
      const nextQid = currentQuestion.qid + 1;
      console.log('Fetching next question with QID:', nextQid);
      
      let nextQuestion = null;
      try {
        nextQuestion = await fetchQuestionByQid(nextQid);
        console.log('Fetch result:', nextQuestion ? 'Question found' : 'Question not found');
      } catch (fetchError) {
        console.error('Error fetching next question:', fetchError);
        alert(`Failed to fetch question ${nextQid}: ${fetchError.message}`);
        return;
      }
      
      if (nextQuestion) {
        console.log('Successfully loaded next question:', nextQuestion.title);
        setCurrentQuestion(nextQuestion);
        
        // Add to questions array if not already present
        setQuestions(prevQuestions => {
          if (!prevQuestions.some(q => q.qid === nextQuestion.qid)) {
            return [...prevQuestions, nextQuestion].sort((a, b) => a.qid - b.qid);
          }
          return prevQuestions;
        });
        
        // Update current index
        const newIndex = questions.findIndex(q => q.qid === nextQuestion.qid);
        setCurrentQuestionIndex(newIndex >= 0 ? newIndex : currentQuestionIndex + 1);
        
        // Update code editor with a template
        setCode(`// Write your solution for ${nextQuestion.title} here\n`);
      } else {
        console.log('No more questions available with ID:', nextQid);
        alert('No more questions available');
      }
    } catch (error) {
      console.error('Error loading next question:', error);
    } finally {
      setIsSubmitting(false); // Hide loading state
    }
  };
  
  // Remove the duplicate Next button definitions - keep only one
  // The button itself will be rendered in the JSX return statement

  
  // Function to navigate to previous question
  const handlePreviousQuestion = async () => {
    if (!currentQuestion || currentQuestion.qid <= 1) return;
    
    try {
      // If we have the previous question in our local array
      if (currentQuestionIndex > 0) {
        const prevQuestion = questions[currentQuestionIndex - 1];
        setCurrentQuestion(prevQuestion);
        setCurrentQuestionIndex(currentQuestionIndex - 1);
        // Update code editor with a template for the previous question
        setCode(`// Write your solution for ${prevQuestion.title} here\n`);
      } 
      // Otherwise fetch it dynamically
      else if (currentQuestion.qid > 1) {
        const prevQid = currentQuestion.qid - 1;
        const prevQuestion = await fetchQuestionByQid(prevQid);
        
        if (prevQuestion) {
          setCurrentQuestion(prevQuestion);
          setCurrentQuestionIndex(questions.findIndex(q => q.qid === prevQuestion.qid));
          // Update code editor with a template for the previous question
          setCode(`// Write your solution for ${prevQuestion.title} here\n`);
        }
      }
    } catch (error) {
      console.error('Error navigating to previous question:', error);
    }
  };

  const [code, setCode] = useState(`#include <vector>
#include <iostream>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
        vector<int> ans;
        for(int i = 0; i< nums.size(); i++) {
            for(int j = i+1; j < nums.size(); j++) {
                if(nums[i] + nums[j] == target) {
                    ans.push_back(i);
                    ans.push_back(j);
                }
            }
        }
        return ans;
    };
`);

  // Generate test cases from question examples
  const testCases = React.useMemo(() => {
    if (!currentQuestion?.examples) return [];
    
    // Debug logging
    console.log('Processing examples:', currentQuestion.examples);
    
    // Case 1: If examples is already an array of objects with input/output
    if (Array.isArray(currentQuestion.examples) && 
        currentQuestion.examples.length > 0 && 
        typeof currentQuestion.examples[0] === 'object' && 
        !Array.isArray(currentQuestion.examples[0]) &&
        currentQuestion.examples[0] !== null) {
      
      return currentQuestion.examples.map(example => ({
        input: example.input || '',
        expected: example.output || ''
      }));
    }
    
    // Case 2: If examples is an array of strings
    if (Array.isArray(currentQuestion.examples) && 
        currentQuestion.examples.length > 0 && 
        typeof currentQuestion.examples[0] === 'string') {
      
      return currentQuestion.examples.map(example => {
        const lines = example.split('\n');
        return {
          input: lines.find(l => l.trim().startsWith('Input:'))?.replace(/Input:?/i, '').trim() || '',
          expected: lines.find(l => l.trim().startsWith('Output:'))?.replace(/Output:?/i, '').trim() || ''
        };
      });
    }
    
    // Case 3: If examples is a single string
    if (typeof currentQuestion.examples === 'string') {
      // First try to parse it as JSON
      if (currentQuestion.examples.trim().startsWith('[') || currentQuestion.examples.trim().startsWith('{')) {
        try {
          const parsedExamples = JSON.parse(currentQuestion.examples);
          if (Array.isArray(parsedExamples)) {
            return parsedExamples.map(example => ({
              input: example.input || '',
              expected: example.output || ''
            }));
          }
        } catch (e) {
          console.warn('Failed to parse examples as JSON:', e);
        }
      }
      
      // If not JSON or parsing failed, try to parse as formatted text
      const exampleBlocks = currentQuestion.examples.split(/\n\s*\n/);
      
      if (exampleBlocks.length > 1) {
        return exampleBlocks.map(block => {
          const lines = block.split('\n');
          return {
            input: lines.find(l => l.trim().startsWith('Input:'))?.replace(/Input:?/i, '').trim() || '',
            expected: lines.find(l => l.trim().startsWith('Output:'))?.replace(/Output:?/i, '').trim() || ''
          };
        });
      } else {
        const lines = currentQuestion.examples.split('\n');
        return [{
          input: lines.find(l => l.trim().startsWith('Input:'))?.replace(/Input:?/i, '').trim() || '',
          expected: lines.find(l => l.trim().startsWith('Output:'))?.replace(/Output:?/i, '').trim() || ''
        }];
      }
    }
    
    return [];
  }, [currentQuestion?.examples]);


  // State for test results
  const [testResults, setTestResults] = useState<{
    passed: boolean;
    testCases: Array<{
      input: string;
      expected: string;
      output: string;
      passed: boolean;
    }>;
  }>({
    passed: false,
    testCases: [],
  });
  
  // State for dialog visibility
  const [showResultsDialog, setShowResultsDialog] = useState(false);
  // State for loading status
  const [isSubmitting, setIsSubmitting] = useState(false);
  // State for tracking which test case is currently running
  const [currentTestCase, setCurrentTestCase] = useState(0);
  // State for single test result
  const [singleTestResult, setSingleTestResult] = useState(null);


  // Function to process a single test case result
  const processTestResult = (response, test) => {
    // Handle error responses
    if (response.error) {
      return {
        input: test.input,
        expected: test.expected,
        output: response.message || "API Error",
        passed: false,
      };
    }
    
    // Handle compilation errors
    if (response.status?.id === 6) { // Compilation Error
      return {
        input: test.input,
        expected: test.expected,
        output: response.compile_output || "Compilation Error",
        passed: false,
      };
    }
    
    // Handle runtime errors
    if (response.stderr) {
      return {
        input: test.input,
        expected: test.expected,
        output: response.stderr || "Runtime Error",
        passed: false,
      };
    }
    
    // Normal output
    return {
      input: test.input,
      expected: test.expected,
      output: response.stdout?.trim() || "No output",
      passed: response.stdout?.trim() === test.expected,
    };
  };

  // Run code function that runs only the currently selected test case
  const runCode = async () => {
    setIsSubmitting(true);
    const languageId = languageMap[selectedLanguage] || 52; // Default to C++
    const test = testCases[currentTestCase];

    try {
      console.log(`Running test case ${currentTestCase + 1}:`, test.input);
      const response = await makeSubmission({
        code: code, // Monaco Editor code
        language: languageId,
        stdin: test.input, // Selected test input
      });

      console.log(`Test case ${currentTestCase + 1} response:`, response);
      
      const result = processTestResult(response, test);
      
      // Update test results with just this single test case
      setTestResults({
        passed: result.passed,
        testCases: [result],
      });
      
      // Show the results dialog
      setShowResultsDialog(true);
    } catch (error) {
      console.error(`Error in test case ${currentTestCase + 1}:`, error);
      setTestResults({
        passed: false,
        testCases: [{
          input: test.input,
          expected: test.expected,
          output: error.toString() || "Error",
          passed: false,
        }],
      });
      setShowResultsDialog(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit code function that runs all test cases and displays results in a popup
  const submitCode = async () => {
    setIsSubmitting(true);
    const languageId = languageMap[selectedLanguage] || 52; // Default to C++

    try {
      const results = await Promise.all(
        testCases.map(async (test, index) => {
          console.log(`Running test case ${index + 1}:`, test.input);
          try {
            const response = await makeSubmission({
              code: code, // Monaco Editor code
              language: languageId,
              stdin: test.input, // Predefined test input
            });
            
            console.log(`Test case ${index + 1} response:`, response);
            return processTestResult(response, test);
          } catch (error) {
            console.error(`Error in test case ${index + 1}:`, error);
            return {
              input: test.input,
              expected: test.expected,
              output: error.toString() || "Error",
              passed: false,
            };
          }
        })
      );

      setTestResults({
        passed: results.every((r) => r.passed),
        testCases: results,
      });
      
      // Show the results dialog
      setShowResultsDialog(true);
    } catch (error) {
      console.error("Error running test cases:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle configuration change
  const handleConfigChange = () => {
    router.push('/dsa-interview/onboarding');
  };

  return (
    <div className="flex flex-col h-screen bg-background dark text-gray-200">
      <header className="border-b border-border h-14 flex items-center px-4">
        <h1 className="text-xl font-bold text-foreground">InterviewX</h1>
        <div className="ml-auto flex items-center gap-2">
          {selectedCompany && selectedDifficulty && (
            <div className="flex items-center gap-2 mr-4">
              <Badge variant="outline" className="capitalize">
                {selectedCompany}
              </Badge>
              <Badge 
                variant="outline" 
                className={`bg-${selectedDifficulty.toLowerCase()}-900/20 text-${selectedDifficulty.toLowerCase()}-500 hover:bg-${selectedDifficulty.toLowerCase()}-900/20 capitalize`}
              >
                {selectedDifficulty}
              </Badge>
            </div>
          )}
          {currentQuestion && (
            <Badge 
              variant="outline" 
              className={`bg-${currentQuestion.difficulty.toLowerCase()}-900/20 text-${currentQuestion.difficulty.toLowerCase()}-500 hover:bg-${currentQuestion.difficulty.toLowerCase()}-900/20`}
            >
              {currentQuestion.difficulty}
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={handleConfigChange}>
            <Settings className="h-4 w-4 mr-1" />
            Configure
          </Button>
        </div>
      </header>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <p className="text-muted-foreground">Loading questions...</p>
          </div>
        </div>
      ) : (
        <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={40} minSize={30}>
          {currentQuestion ? (
            <>
              {console.log('Question passed to display:', currentQuestion)} {/* Debugging: Check question passed */}
              <QuestionDisplay question={currentQuestion} />
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">Loading question...</p>
            </div>
          )}
          
          {/* Add QuestionSelector at the bottom of the question panel */}
          <QuestionSelector 
            currentQuestion={currentQuestion}
            onQuestionChange={handleQuestionChange}
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            onFetchQuestion={fetchQuestionByQid}
          />

            <div className="p-4 border-t border-border relative">
              <Button
                variant="outline"
                size="icon"
                className="absolute bottom-4 left-4 rounded-full bg-primary hover:bg-primary/90"
              >
                <Bot className="h-5 w-5" />
              </Button>
            </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={60}>
          <div className="h-full flex flex-col">
            <div className="border-b border-border p-2">
              <div className="flex justify-between items-center">
                <Tabs onValueChange={(value) => setSelectedLanguage(value)} defaultValue="cpp">
                  <TabsList>
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                    <TabsTrigger value="java">Java</TabsTrigger>
                    <TabsTrigger value="cpp">C++</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handlePreviousQuestion}
                    disabled={!currentQuestion || currentQuestion.qid <= 1}
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleNextQuestion}
                    disabled={isSubmitting || !currentQuestion}
                  >
                    {isSubmitting ? 'Loading...' : 'Next'}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <MonacoEditor
                language={selectedLanguage}
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  lineNumbers: "on",
                  theme: "vs-dark",
                }}
              />
            </div>

            <div className="border-t border-border p-3 flex justify-between items-center">
              <div>
                <Button variant="outline" size="sm" className="mr-2">
                  Reset
                </Button>
                <Button variant="outline" size="sm">
                  Format
                </Button>
              </div>
              <div className="flex items-center">
                <div className="mr-2">
                  <select 
                    className="bg-background border border-border rounded px-2 py-1 text-sm"
                    value={currentTestCase}
                    onChange={(e) => setCurrentTestCase(parseInt(e.target.value))}
                    disabled={isSubmitting}
                  >
                    {testCases.map((_, index) => (
                      <option key={index} value={index}>Test Case {index + 1}</option>
                    ))}
                  </select>
                </div>
                <Button variant="outline" size="sm" className="mr-2" onClick={runCode} disabled={isSubmitting}>
                  <Play className="h-4 w-4 mr-1" />
                  Run
                </Button>
                <Button variant="default" size="sm" onClick={submitCode} disabled={isSubmitting}>
                  <Send className="h-4 w-4 mr-1" />
                  Submit
                </Button>
              </div>
            </div>

            {/* Results Dialog button is now in the bottom toolbar */}
            
            {/* Results Dialog */}
            <Dialog open={showResultsDialog} onOpenChange={setShowResultsDialog}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>{testResults.testCases.length > 1 ? 'All Test Results' : 'Test Result'}</span>
                    {testResults.passed ? (
                      <Badge className="bg-green-900/20 text-green-500 hover:bg-green-900/20">
                        {testResults.testCases.length > 1 ? 'All Tests Passed' : 'Test Passed'}
                      </Badge>
                    ) : (
                      <Badge className="bg-red-900/20 text-red-500 hover:bg-red-900/20">
                        {testResults.testCases.length > 1 ? 'Some Tests Failed' : 'Test Failed'}
                      </Badge>
                    )}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="py-2 px-4 bg-muted/50 rounded-md mt-2">
                  <p className="text-sm">
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <span className="mr-2 h-4 w-4 rounded-full bg-blue-500 animate-pulse"></span>
                        Processing your code...
                      </span>
                    ) : (
                      <span>
                        {testResults.testCases.length > 1 
                          ? `Ran ${testResults.testCases.length} test cases with ${testResults.testCases.filter(t => t.passed).length} passing`
                          : testResults.passed 
                            ? 'Your code passed this test case!'
                            : 'Your code failed this test case. Check the output below.'}
                      </span>
                    )}
                  </p>
                </div>
                
                <ScrollArea className="flex-1 mt-4">
                  <div className="space-y-4 p-1">
                    {testResults.testCases.map((test, index) => (
                      <div key={index} className={`border ${test.passed ? 'border-green-500/30' : 'border-red-500/30'} rounded-md p-3`}>
                        <div className="flex items-center mb-2">
                          <h3 className="font-medium flex-1">
                            {testResults.testCases.length > 1 ? `Test Case ${index + 1}` : 'Test Case'}
                          </h3>
                          {test.passed ? (
                            <div className="flex items-center text-green-500">
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Passed
                            </div>
                          ) : (
                            <div className="flex items-center text-red-500">
                              <XCircle className="h-4 w-4 mr-1" />
                              Failed
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground mb-1">Input:</p>
                            <pre className="bg-muted p-1.5 rounded-md overflow-auto max-h-32">{test.input}</pre>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Expected:</p>
                            <pre className="bg-muted p-1.5 rounded-md overflow-auto max-h-32">{test.expected}</pre>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Output:</p>
                            <pre className={`p-1.5 rounded-md overflow-auto max-h-32 ${test.passed ? "bg-green-900/20" : "bg-red-900/20"}`}>
                              {test.output}
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <DialogFooter className="mt-4">
                  <Button onClick={() => setShowResultsDialog(false)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      )}
    </div>
  )
}
