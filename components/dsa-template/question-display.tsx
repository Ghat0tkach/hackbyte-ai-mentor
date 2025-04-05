'use client';

import * as React from 'react';
// Import ScrollArea component correctly
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { LeetCodeQuestion } from '../utils/csv-loader';

interface QuestionDisplayProps {
  question: {
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
    examples: Array<{ input: string; output: string; explanation: string }> | string | string[];
    constraints: string | string[];
    Companies?: string; // Added Companies field to match LeetCodeQuestion interface
  };
}

export function QuestionDisplay({ question }: QuestionDisplayProps) {
  // Debug: Log the question object to verify its structure
  console.log('QuestionDisplay received question:', question);
  
  // Handle examples data - ensure it's always an array of objects with input, output, and explanation fields
  const formattedExamples = React.useMemo(() => {
    // Debug logging to help diagnose the issue
    console.log('Examples data type:', typeof question.examples);
    console.log('Examples content:', question.examples);
    
    // If examples is undefined or null, return empty array
    if (!question.examples) return [];
    
    // Case 1: If examples is already an array of objects with the correct structure
    if (Array.isArray(question.examples) && 
        question.examples.length > 0 && 
        typeof question.examples[0] === 'object' && 
        !Array.isArray(question.examples[0]) &&
        question.examples[0] !== null) {
      
      // Check if the first item has the expected properties
      const firstItem = question.examples[0];
      if ('input' in firstItem || 'output' in firstItem) {
        return question.examples.map(example => ({
          input: example.input || '',
          output: example.output || '',
          explanation: example.explanation || ''
        }));
      }
    }
    
    // Case 2: If examples is an array of strings
    if (Array.isArray(question.examples) && 
        question.examples.length > 0 && 
        typeof question.examples[0] === 'string') {
      
      return question.examples.map(example => {
        const lines = example.split('\n');
        return {
          input: lines.find(l => l.trim().startsWith('Input:'))?.replace(/Input:?/i, '').trim() || '',
          output: lines.find(l => l.trim().startsWith('Output:'))?.replace(/Output:?/i, '').trim() || '',
          explanation: lines.find(l => l.trim().startsWith('Explanation:'))?.replace(/Explanation:?/i, '').trim() || ''
        };
      });
    }
    
    // Case 3: If examples is a single string
    if (typeof question.examples === 'string') {
      // First try to parse it as JSON if it looks like JSON
      if (question.examples.trim().startsWith('[') || question.examples.trim().startsWith('{')) {
        try {
          const parsedExamples = JSON.parse(question.examples);
          if (Array.isArray(parsedExamples)) {
            return parsedExamples.map(example => ({
              input: example.input || '',
              output: example.output || '',
              explanation: example.explanation || ''
            }));
          }
        } catch (e) {
          console.warn('Failed to parse examples as JSON:', e);
        }
      }
      
      // If not JSON or parsing failed, try to parse as formatted text
      // First try splitting by double newlines (common format for examples)
      const exampleBlocks = question.examples.split(/\n\s*\n/);
      
      if (exampleBlocks.length > 1) {
        return exampleBlocks.map(block => {
          const lines = block.split('\n');
          return {
            input: lines.find(l => l.trim().startsWith('Input:'))?.replace(/Input:?/i, '').trim() || '',
            output: lines.find(l => l.trim().startsWith('Output:'))?.replace(/Output:?/i, '').trim() || '',
            explanation: lines.find(l => l.trim().startsWith('Explanation:'))?.replace(/Explanation:?/i, '').trim() || ''
          };
        });
      } else {
        // If there's just one block, try to parse it line by line
        const lines = question.examples.split('\n');
        return [{
          input: lines.find(l => l.trim().startsWith('Input:'))?.replace(/Input:?/i, '').trim() || '',
          output: lines.find(l => l.trim().startsWith('Output:'))?.replace(/Output:?/i, '').trim() || '',
          explanation: lines.find(l => l.trim().startsWith('Explanation:'))?.replace(/Explanation:?/i, '').trim() || ''
        }];
      }
    }
    
    return [];
  }, [question.examples]);

  // Handle constraints
  const constraintsArray = Array.isArray(question.constraints)
    ? question.constraints
    : [question.constraints];

  // Function to get difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-500 hover:bg-green-600';
      case 'medium':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'hard':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  // Format company tags if they exist
  const companyTags = question.Companies ? 
    question.Companies.split(',').map(company => company.trim()).filter(company => company.length > 0) : 
    [];

  return (
    <div className="h-full">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          {/* Question metadata section */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge className={`${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty}
            </Badge>
            
            {/* Acceptance rate if available */}
            {question.acceptance_rate && (
              <Badge variant="outline" className="text-xs">
                Acceptance: {question.acceptance_rate}%
              </Badge>
            )}
            
            {/* Paid only indicator */}
            {question.paid_only && (
              <Badge variant="secondary" className="text-xs">
                Premium
              </Badge>
            )}
          </div>
          
          {/* Company tags if available */}
          {companyTags.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-muted-foreground mb-1">Companies:</p>
              <div className="flex flex-wrap gap-1">
                {companyTags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <h2 className="text-2xl font-bold">{question.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: question.question_body }} />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Examples:</h3>
            {formattedExamples.length > 0 ? (
              formattedExamples.map((example, index) => (
                <div key={index} className="bg-muted p-3 rounded-md space-y-2">
                  <div>
                    <strong>Input:</strong> <pre className="inline bg-muted-foreground/10 p-1 rounded" dangerouslySetInnerHTML={{ __html: example.input }} />
                  </div>
                  <div>
                    <strong>Output:</strong> <pre className="inline bg-muted-foreground/10 p-1 rounded" dangerouslySetInnerHTML={{ __html: example.output }} />
                  </div>
                  {example.explanation && (
                    <div>
                      <strong>Explanation:</strong> <pre className="inline bg-muted-foreground/10 p-1 rounded" dangerouslySetInnerHTML={{ __html: example.explanation }} />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-muted-foreground">No examples available</div>
            )}
            
            {/* Rest of the component remains the same */}
          {constraintsArray.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Constraints:</h3>
              <ul className="list-disc pl-5">
                {constraintsArray.map((constraint, index) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: constraint }} />
                ))}
              </ul>
            </div>
          )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}