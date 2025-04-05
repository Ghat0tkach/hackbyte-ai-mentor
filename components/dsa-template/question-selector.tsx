'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { LeetCodeQuestion } from '../utils/csv-loader';

// Extend the LeetCodeQuestion type to include the ino field
interface IndexedLeetCodeQuestion extends LeetCodeQuestion {
  ino?: number;
}

interface QuestionSelectorProps {
  currentQuestion: IndexedLeetCodeQuestion | null;
  onQuestionChange: (question: IndexedLeetCodeQuestion) => void;
  questions?: IndexedLeetCodeQuestion[];
  currentQuestionIndex?: number;
  // Added to support dynamic loading
  onFetchQuestion?: (qid: number) => Promise<IndexedLeetCodeQuestion | null>;
}

export function QuestionSelector({ 
  currentQuestion, 
  onQuestionChange, 
  questions = [], 
  currentQuestionIndex = 0,
  onFetchQuestion
}: QuestionSelectorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localQuestions, setLocalQuestions] = useState<IndexedLeetCodeQuestion[]>([]);
  const [currentIno, setCurrentIno] = useState(1);

  const saveQuestionsToLocalStorage = (questionsToSave: IndexedLeetCodeQuestion[]) => {
    // Only save questions that match our criteria (Google company and Medium difficulty)
    const filteredQuestions = questionsToSave.filter(q => 
      q.Companies?.toLowerCase().includes('google') && 
      q.difficulty === 'Medium'
    );
    
    // Assign new sequential ino values to all filtered questions, overwriting any existing ino
    const indexedQuestions = filteredQuestions.map((q, index) => ({
      ...q,
      ino: index + 1
    }));
    
    console.log('Saving indexed questions to localStorage:', indexedQuestions.map(q => ({ qid: q.qid, title: q.title, ino: q.ino })));
    localStorage.setItem('questions', JSON.stringify(indexedQuestions));
    return indexedQuestions;
  };

  const loadQuestionsFromLocalStorage = () => {
    const storedQuestions = localStorage.getItem('questions');
    const parsedQuestions: IndexedLeetCodeQuestion[] = storedQuestions ? JSON.parse(storedQuestions) : [];
    
    // Verify that loaded questions still match our criteria and have ino
    const validQuestions = parsedQuestions.filter(q => 
      q.Companies?.toLowerCase().includes('google') && 
      q.difficulty === 'Medium'
    );
    
    // Ensure all questions have ino, reassign if missing
    const indexedQuestions = validQuestions.map((q, index) => {
      if (q.ino === undefined) {
        return { ...q, ino: index + 1 };
      }
      return q;
    });
    
    // Sort by ino to ensure sequential order
    indexedQuestions.sort((a, b) => (a.ino || 0) - (b.ino || 0));
    
    console.log('Loaded indexed questions from localStorage:', indexedQuestions.map(q => ({ qid: q.qid, title: q.title, ino: q.ino })));
    return indexedQuestions;
  };

  useEffect(() => {
    // Load questions from localStorage on component mount
    const storedQuestions = loadQuestionsFromLocalStorage();
    
    // If we have stored questions, use them
    if (storedQuestions.length > 0) {
      setLocalQuestions(storedQuestions);
      
      // Find the question with the matching ino based on currentQuestionIndex
      const targetIno = currentQuestionIndex + 1; // Convert index to ino (1-based)
      const initialQuestion = storedQuestions.find(q => q.ino === targetIno) || storedQuestions[0];
      console.log('Setting initial question from localStorage:', initialQuestion);
      
      if (initialQuestion) {
        onQuestionChange(initialQuestion);
        setCurrentIno(initialQuestion.ino || 1);
      }
    }
  }, [currentQuestionIndex]);

  // Save questions whenever they change
  useEffect(() => {
    if (questions.length > 0) {
      // Copy ino values from existing local questions where possible
      const questionsWithIno = questions.map(q => {
        const existingQuestion = localQuestions.find(lq => lq.qid === q.qid);
        if (existingQuestion && existingQuestion.ino !== undefined) {
          return { ...q, ino: existingQuestion.ino };
        }
        return q;
      });
      
      const indexedQuestions = saveQuestionsToLocalStorage(questionsWithIno);
      setLocalQuestions(indexedQuestions);
    }
  }, [questions]);

  // Update currentIno when currentQuestion changes
  useEffect(() => {
    if (currentQuestion && currentQuestion.ino) {
      setCurrentIno(currentQuestion.ino);
    } else if (currentQuestion && localQuestions.length > 0) {
      const foundQuestion = localQuestions.find(q => q.qid === currentQuestion.qid);
      if (foundQuestion && foundQuestion.ino) {
        setCurrentIno(foundQuestion.ino);
      }
    }
  }, [currentQuestion, localQuestions]);

  const handlePrevious = async () => {
    if (!currentQuestion) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // First priority: use questions from localStorage by ino
      if (localQuestions.length > 0 && currentIno > 1) {
        const prevIno = currentIno - 1;
        const prevQuestion = localQuestions.find(q => q.ino === prevIno);
        
        if (prevQuestion) {
          onQuestionChange(prevQuestion);
          setCurrentIno(prevIno);
          return;
        }
      }
      
      // Second priority: use questions from props
      if (questions.length > 0 && currentQuestionIndex > 0) {
        const prevQuestion = questions[currentQuestionIndex - 1];
        onQuestionChange(prevQuestion);
        return;
      }
      
      // Last resort: fetch dynamically
      if (currentQuestion.qid > 1 && onFetchQuestion) {
        const prevQid = currentQuestion.qid - 1;
        const fetchedQuestion = await onFetchQuestion(prevQid);
        
        if (fetchedQuestion) {
          // Add ino attribute if needed
          const prevQuestion: IndexedLeetCodeQuestion = { 
            ...fetchedQuestion,
            ino: currentIno > 1 ? currentIno - 1 : 1
          };
          
          onQuestionChange(prevQuestion);
          
          // Update local storage with this question
          const existingIndex = localQuestions.findIndex(q => q.qid === prevQuestion.qid);
          let updatedQuestions;
          
          if (existingIndex === -1) {
            updatedQuestions = [...localQuestions, prevQuestion];
          } else {
            updatedQuestions = [...localQuestions];
            updatedQuestions[existingIndex] = prevQuestion;
          }
          
          setLocalQuestions(saveQuestionsToLocalStorage(updatedQuestions));
        } else {
          setError(`Question ${prevQid} not found`);
        }
      }
    } catch (err) {
      setError('Failed to load previous question');
      console.error('Error loading previous question:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleNext = async () => {
  //   if (!currentQuestion) return;
    
  //   setIsLoading(true);
  //   setError(null);
    
  //   try {
  //     // First priority: use questions from localStorage by ino
  //     if (localQuestions.length > 0) {
  //       // Find the next question by ino
  //       const nextIno = currentIno + 1;
  //       const nextQuestion = localQuestions.find(q => q.ino === nextIno);
        
  //       if (nextQuestion) {
  //         onQuestionChange(nextQuestion);
  //         setCurrentIno(nextIno);
  //         return;
  //       }
  //     }
      
  //     // If we don't have the next question by ino, fetch dynamically
  //     if (onFetchQuestion) {
  //       const nextQid = currentQuestion.qid + 1;
  //       const fetchedQuestion = await onFetchQuestion(nextQid);
        
  //       if (fetchedQuestion) {
  //         // Only proceed if the question matches our criteria
  //         if (fetchedQuestion.Companies && 
  //             typeof fetchedQuestion.Companies === 'string' && 
  //             fetchedQuestion.Companies.toLowerCase().includes('google') && 
  //             fetchedQuestion.difficulty === 'Medium') {
            
  //           // Add ino attribute - set it to the next sequential number
  //           const nextIno = localQuestions.length > 0 ? Math.max(...localQuestions.map(q => q.ino || 0)) + 1 : 1;
  //           const nextQuestion: IndexedLeetCodeQuestion = {
  //             ...fetchedQuestion,
  //             ino: nextIno
  //           };
            
  //           onQuestionChange(nextQuestion);
  //           setCurrentIno(nextIno);
            
  //           // Add to local storage
  //           const updatedQuestions = [...localQuestions, nextQuestion];
  //           setLocalQuestions(saveQuestionsToLocalStorage(updatedQuestions));
  //         } else {
  //           // If question doesn't match criteria, skip and try the next one
  //           const updatedCurrentQuestion = { ...currentQuestion, qid: nextQid };
  //           onQuestionChange(updatedCurrentQuestion);
  //           handleNext(); // Recursively look for the next matching question
  //         }
  //       } else {
  //         setError(`No more matching questions found`);
  //       }
  //     }
  //   } catch (err) {
  //     setError('Failed to load next question');
  //     console.error('Error loading next question:', err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleNext = async () => {
    if (!currentQuestion) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // First priority: use questions from localStorage by ino
      if (localQuestions.length > 0) {
        const nextIno = currentIno + 1;
        const nextQuestion = localQuestions.find(q => q.ino === nextIno);
        
        if (nextQuestion) {
          onQuestionChange(nextQuestion);
          setCurrentIno(nextIno);
          return;
        }
      }
      
      // Second priority: use questions from props
      if (questions.length > 0 && currentQuestionIndex < questions.length - 1) {
        const nextQuestion = questions[currentQuestionIndex + 1];
        onQuestionChange(nextQuestion);
        return;
      }
      
      // Last resort: fetch dynamically
      if (onFetchQuestion) {
        const nextQid = currentQuestion.qid + 1;
        const fetchedQuestion = await onFetchQuestion(nextQid);
        
        if (fetchedQuestion && 
            fetchedQuestion.Companies?.toLowerCase().includes('google') && 
            fetchedQuestion.difficulty === 'Medium') {
          // Add ino attribute - set it to the next sequential number
          const nextIno = localQuestions.length > 0 ? 
            Math.max(...localQuestions.map(q => q.ino || 0)) + 1 : 1;
          
          const nextQuestion: IndexedLeetCodeQuestion = {
            ...fetchedQuestion,
            ino: nextIno
          };
          
          onQuestionChange(nextQuestion);
          setCurrentIno(nextIno);
          
          // Update local storage with this question
          const updatedQuestions = [...localQuestions, nextQuestion];
          setLocalQuestions(saveQuestionsToLocalStorage(updatedQuestions));
        } else {
          setError('No more matching questions available');
        }
      } else {
        setError('No more questions available');
      }
    } catch (err) {
      setError('Failed to load next question');
      console.error('Error loading next question:', err);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="flex items-center justify-between p-2 border-b border-border">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevious}
        disabled={isLoading || !currentQuestion || currentIno <= 1}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </Button>
      <div className="flex flex-col items-center">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        ) : error ? (
          <span className="text-sm text-red-500">{error}</span>
        ) : (
          <>
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion?.qid || 1} (#{currentIno})
            </span>
            <span className="text-xs text-muted-foreground">
              {currentQuestion?.title}
            </span>
          </>
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={isLoading}
        className="flex items-center justify-center min-w-[80px] ml-2"
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}