'use client';

import * as React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { LeetCodeQuestion } from '@/utils/csv-loader';  // Fixed import path

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
  // Move companyTags definition before the return statement
  const companyTags = React.useMemo(() => {
    if (!question.Companies) return [];
    return question.Companies.split(',')
      .map(company => company.trim())
      .filter(company => company.length > 0);
  }, [question.Companies]);

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

  // Function to get difficulty badge color - updated with brighter colors
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-400 hover:bg-green-500';
      case 'medium':
        return 'bg-yellow-400 hover:bg-yellow-500';
      case 'hard':
        return 'bg-red-400 hover:bg-red-500';
      default:
        return 'bg-gray-400 hover:bg-gray-500';
    }
  };

  return (
    <div className="h-full">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-6">
          {/* Question metadata section */}
          <div className="flex flex-wrap items-center gap-3">
            <Badge className={`${getDifficultyColor(question.difficulty)} px-3 py-1`}>
              {question.difficulty}
            </Badge>
            
            {/* Acceptance rate if available */}
            {question.acceptance_rate && (
              <Badge variant="outline" className="text-xs border-purple-400/30 text-purple-300 px-3 py-1">
                Acceptance: {question.acceptance_rate}%
              </Badge>
            )}
          </div>

          {/* Company tags section */}
          {companyTags.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="text-sm text-purple-300">Companies:</span>
              <div className="flex flex-wrap gap-2">
                {companyTags.map((company, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs border-purple-400/30 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 px-2 py-1 mr-1 mb-1"
                  >
                    {company}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <h2 className="text-2xl font-bold pt-2">{question.title}</h2>
          <div className="py-2 max-h-[calc(100vh-24rem)] overflow-y-auto pr-2" dangerouslySetInnerHTML={{ __html: question.question_body }} />

          {/* Examples section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-zinc-200">Examples:</h3>
            {formattedExamples.map((example, index) => (
              <div 
                key={index} 
                className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4 space-y-4"
              >
                <div>
                  <span className="text-purple-300 text-sm">Input:</span>
                  <pre className="mt-2 p-3 bg-zinc-900 rounded border border-purple-500/10 font-mono text-sm text-zinc-200">
                    {example.input}
                  </pre>
                </div>
                <div>
                  <span className="text-purple-300 text-sm">Output:</span>
                  <pre className="mt-2 p-3 bg-zinc-900 rounded border border-purple-500/10 font-mono text-sm text-zinc-200">
                    {example.output}
                  </pre>
                </div>
                {example.explanation && (
                  <div>
                    <span className="text-purple-300 text-sm">Explanation:</span>
                    <pre className="mt-2 p-3 bg-zinc-900 rounded border border-purple-500/10 font-mono text-sm text-zinc-200">
                      {example.explanation}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Constraints section */}
          {constraintsArray.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-zinc-200">Constraints:</h3>
              <ul className="list-disc pl-5 text-zinc-300 space-y-2">
                {constraintsArray.map((constraint, index) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: constraint }} />
                ))}
              </ul>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}