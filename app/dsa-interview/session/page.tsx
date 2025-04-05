"use client"
import * as React from "react";

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Bot, Play, Send, CheckCircle2, XCircle, X, Settings, Clock, Pause, RotateCcw } from "lucide-react";

import dynamic from "next/dynamic"


import { LeetCodeQuestion } from "@/utils/csv-loader";
import { QuestionSelector } from "@/components/dsa-template/question-selector";
import { QuestionDisplay } from "@/components/dsa-template/question-display";
import { makeSubmission } from "@/utils/services";

// Improve the stripHtml function to better handle HTML tags
const stripHtml = (str: string): string => {
  // More thorough HTML tag removal
  return str.replace(/<\/?[^>]+(>|$)/g, '').trim();
}


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

// Timer component to display elapsed time
const Timer = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(prevTime => prevTime + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Format time as MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      <Clock className="h-4 w-4" />
      <span>{formatTime(elapsedTime)}</span>
    </div>
  );
};

export default function LeetCodeUI() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [questions, setQuestions] = useState<LeetCodeQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<LeetCodeQuestion | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Add state to reset timer
  const [resetTimer, setResetTimer] = useState(false);
  
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
          
          // Reset timer when first question is loaded
          setResetTimer(prev => !prev);
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
    // Reset timer when question changes
    setResetTimer(prev => !prev);
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
        
        // Reset timer when navigating to next question
        setResetTimer(prev => !prev);
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
        
        // Reset timer when navigating to previous question
        setResetTimer(prev => !prev);
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
          
          // Reset timer when navigating to previous question
          setResetTimer(prev => !prev);
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
        input: stripHtml(example.input || ''),
        expected: stripHtml(example.output || '')
      }));
    }
    
    // Case 2: If examples is an array of strings
    if (Array.isArray(currentQuestion.examples) && 
        currentQuestion.examples.length > 0 && 
        typeof currentQuestion.examples[0] === 'string') {
      
      return currentQuestion.examples.map(example => {
        const lines = example.split('\n');
        return {
          input: stripHtml(lines.find(l => l.trim().startsWith('Input:'))?.replace(/Input:?/i, '') || ''),
          expected: stripHtml(lines.find(l => l.trim().startsWith('Output:'))?.replace(/Output:?/i, '') || '')
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
              input: stripHtml(example.input || ''),
              expected: stripHtml(example.output || '')
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
            input: stripHtml(lines.find(l => l.trim().startsWith('Input:'))?.replace(/Input:?/i, '').trim() || ''),
            expected: stripHtml(lines.find(l => l.trim().startsWith('Output:'))?.replace(/Output:?/i, '').trim() || '')
          };
        });
      } else {
        const lines = currentQuestion.examples.split('\n');
        return [{
          input: stripHtml(lines.find(l => l.trim().startsWith('Input:'))?.replace(/Input:?/i, '').trim() || ''),
          expected: stripHtml(lines.find(l => l.trim().startsWith('Output:'))?.replace(/Output:?/i, '').trim() || '')
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
        questionTitle: currentQuestion?.title // Pass the question title to identify specific problems
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
              questionTitle: currentQuestion?.title // Pass the question title to identify specific problems
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

  // Timer component with reset functionality
  const TimerWithReset = () => {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isRunning, setIsRunning] = useState(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    
    useEffect(() => {
      if (isRunning) {
        intervalRef.current = setInterval(() => {
          setElapsedTime(prev => prev + 1);
        }, 1000);
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }, [isRunning]);
    
    useEffect(() => {
      setElapsedTime(0);
      setIsRunning(true);
    }, [resetTimer]);
    
    const handlePause = () => setIsRunning(false);
    const handleStart = () => setIsRunning(true);
    const handleReset = () => {
      setElapsedTime(0);
      setIsRunning(true);
    };
    
    // Format time as MM:SS
    const formatTime = (timeInSeconds: number) => {
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds % 60;
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    
    return (
      <div className="flex items-center gap-2 bg-background/80 border border-border rounded-md px-2 py-1 shadow-sm">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span>{formatTime(elapsedTime)}</span>
        <div className="flex gap-1">
          {isRunning ? (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={handlePause}
            >
              <Pause className="h-3 w-3" />
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={handleStart}
            >
              <Play className="h-3 w-3" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={handleReset}
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  };

  // Update the root div styling
  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100">
      {/* Enhanced header with gradient border and glass effect */}
      <header className="border-b border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm h-14 flex items-center px-6 sticky top-0 z-50">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
          InterviewX
        </h1>
        {/* ... rest of header content ... */}
      </header>
  
      {/* Update loading state UI */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center bg-zinc-950">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
            <p className="text-zinc-400 animate-pulse">Loading questions...</p>
          </div>
        </div>
      ) : (
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={40} minSize={30} className="bg-zinc-900">
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-hidden">
                <Tabs defaultValue="question" className="h-full flex flex-col">
                  <div className="px-4 py-2 border-b border-zinc-800">
                    <TabsList className="bg-zinc-800/50 backdrop-blur-sm">
                      <TabsTrigger value="question">Question</TabsTrigger>
                      <TabsTrigger value="submissions">List</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="question" className="flex-1 overflow-auto p-4">
                    {currentQuestion ? (
                      <div className="space-y-4">
                        <QuestionDisplay question={currentQuestion} />
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-muted-foreground">No question loaded</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="submissions" className="flex-1 overflow-auto">
                    {questions.length > 0 ? (
                      <div className="p-4">
                        <div className="space-y-2">
                          {questions.map((q) => (
                            <div 
                              key={q.qid} 
                              className={`border ${currentQuestion?.qid === q.qid ? 'border-purple-500' : 'border-zinc-800'} rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md`}
                            >
                              <button
                                className={`w-full text-left p-4 ${currentQuestion?.qid === q.qid ? 'bg-purple-500/10' : 'hover:bg-zinc-800/50'}`}
                                onClick={() => handleQuestionChange(q)}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-base">{q.title}</span>
                                  <Badge 
                                    variant="outline" 
                                    className={`ml-2 ${q.difficulty === 'Easy' ? 'bg-green-500/20 text-green-500' : q.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'}`}
                                  >
                                    {q.difficulty}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm text-zinc-400">
                                  <span>Question #{q.qid}</span>
                                  {currentQuestion?.qid === q.qid && (
                                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">Current</Badge>
                                  )}
                                </div>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-zinc-400">No questions loaded</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              <QuestionSelector 
                currentQuestion={currentQuestion}
                onQuestionChange={handleQuestionChange}
                questions={questions}
                currentQuestionIndex={currentQuestionIndex}
                onFetchQuestion={fetchQuestionByQid}
              />

              <div className="p-4 border-t border-zinc-800">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20"
                >
                  <Bot className="h-5 w-5 text-purple-400" />
                </Button>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-zinc-800 hover:bg-purple-500/20 transition-colors" />
          
          {/* Code editor panel */}
          <ResizablePanel defaultSize={60} className="bg-zinc-900">
            <div className="h-full flex flex-col">
              {/* Enhanced tabs styling */}
              <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-3">
                <div className="flex justify-between items-center">
                  <Tabs 
                    onValueChange={(value) => setSelectedLanguage(value)} 
                    defaultValue="cpp"
                    className="w-[400px]"
                  >
                    <TabsList className="bg-zinc-800/50 backdrop-blur-sm">
                      <TabsTrigger value="javascript" className="data-[state=active]:bg-purple-500/20">
                        JavaScript
                      </TabsTrigger>
                      <TabsTrigger value="python">Python</TabsTrigger>
                      <TabsTrigger value="java">Java</TabsTrigger>
                      <TabsTrigger value="cpp">C++</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  {/* Enhanced timer styling */}
                  <div className="flex gap-2">
                    <TimerWithReset />
                  </div>
                </div>
              </div>
  
              {/* Update Monaco Editor theme */}
              <div className="flex-1 bg-zinc-950">
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
                    backgroundColor: "#09090b",
                  }}
                />
              </div>
  
              {/* Enhanced bottom toolbar */}
              <div className="border-t border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-4 flex justify-between items-center">
                {/* ... toolbar content with updated button styles ... */}
                <Button variant="outline" size="sm" className="bg-zinc-800 hover:bg-zinc-700 border-zinc-700">
                  Format
                </Button>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
  
      {/* Update Dialog styling */}
      <Dialog open={showResultsDialog} onOpenChange={setShowResultsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col bg-zinc-900 border-zinc-800">
          {/* ... dialog content with updated styling ... */}
        </DialogContent>
      </Dialog>
    </div>
  );
}