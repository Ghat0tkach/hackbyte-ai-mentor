"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Clock, BarChart, Lightbulb, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSystemDesignStore } from "@/store/system-design-store"

import { cn } from "@/lib/utils"
import { SystemDesignQuestion } from "./types"

interface QuestionPanelProps {
  questions: SystemDesignQuestion[]
selectedQuestionId: string
  onSelectQuestion: (id: string) => void
  selectedQuestion: SystemDesignQuestion
}

export function QuestionPanel({
  questions,
  selectedQuestionId,
  onSelectQuestion,
  selectedQuestion,
}: QuestionPanelProps) {
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const { setCurrentQuestionText } = useSystemDesignStore()
  
  // Show only 2 questions per page
  const questionsPerPage = 1
  const totalPages = Math.ceil(questions.length / questionsPerPage)
  const paginatedQuestions = questions.slice(
    currentPage * questionsPerPage, 
    (currentPage + 1) * questionsPerPage
  )
  
  // Update selected question when page changes if needed
  useEffect(() => {
    // Check if the currently selected question is in the current page
    const isSelectedQuestionInCurrentPage = paginatedQuestions.some(
      question => question.id === selectedQuestionId
    )
    
    // If not, select the first question on the current page
    if (!isSelectedQuestionInCurrentPage && paginatedQuestions.length > 0) {
      onSelectQuestion(paginatedQuestions[0].id)
    }
  }, [currentPage, paginatedQuestions, selectedQuestionId, onSelectQuestion])
  
  // Find the page that contains the selected question
  useEffect(() => {
    const selectedQuestionIndex = questions.findIndex(q => q.id === selectedQuestionId)
    if (selectedQuestionIndex !== -1) {
      const pageForSelectedQuestion = Math.floor(selectedQuestionIndex / questionsPerPage)
      setCurrentPage(pageForSelectedQuestion)
    }
  }, [selectedQuestionId, questions, questionsPerPage])
  
  // Update the global store with the current question text when selected question changes
  useEffect(() => {
    if (selectedQuestion) {
      // Format the complete question text
      const questionText = [
        selectedQuestion.title,
        ...selectedQuestion.description,
        ...(selectedQuestion.requirements ? ['Requirements:', ...selectedQuestion.requirements.map(req => `- ${req}`)] : []),
        ...(selectedQuestion.constraints ? ['Constraints:', ...selectedQuestion.constraints.map(con => `- ${con}`)] : [])
      ].join('\n\n');
      
      // Store in global state
      setCurrentQuestionText(questionText);
    }
  }, [selectedQuestion, setCurrentQuestionText]);
  
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
  }
  
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0))
  }

  return (
    <div
      className={cn(
        "flex flex-col border-r border-border bg-background transition-all duration-300 ease-in-out",
        isPanelCollapsed ? "w-16" : "w-full md:w-[400px] lg:w-[500px]",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className={cn("font-semibold transition-opacity", isPanelCollapsed ? "opacity-0" : "opacity-100")}>
          System Design Questions
        </h2>
        <Button variant="ghost" size="icon" onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}>
          {isPanelCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </div>

      {!isPanelCollapsed && (
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-none p-4 border-b border-border">
            <div className="flex flex-wrap gap-2 mb-2">
              {paginatedQuestions.map((question) => (
                <Button
                  key={question.id}
                  variant={selectedQuestionId === question.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSelectQuestion(question.id)}
                  className="text-xs"
                >
                  {question.shortTitle}
                </Button>
              ))}
            </div>
            
            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className="text-xs flex items-center gap-1"
                >
                  <ChevronLeft className="h-3 w-3" />
                  Prev
                </Button>
                
                <span className="text-xs text-muted-foreground">
                  {currentPage + 1} / {totalPages}
                </span>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages - 1}
                  className="text-xs flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            <Tabs defaultValue="question" className="w-full">
              <div className="px-4 pt-4">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="question">Question</TabsTrigger>
                  <TabsTrigger value="hints">Hints</TabsTrigger>
                  <TabsTrigger value="solution">Solution</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="question" className="p-4 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold">{selectedQuestion.title}</h3>
                  <span
                    className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      selectedQuestion.difficulty === "Easy"
                        ? "bg-green-500/20 text-green-500"
                        : selectedQuestion.difficulty === "Medium"
                          ? "bg-yellow-500/20 text-yellow-500"
                          : "bg-red-500/20 text-red-500",
                    )}
                  >
                    {selectedQuestion.difficulty}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{selectedQuestion.timeEstimate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart className="h-4 w-4" />
                    <span>{selectedQuestion.complexity}</span>
                  </div>
                </div>

                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {selectedQuestion.description.map((paragraph, i) => (
                    <p key={i} className="mb-4">
                      {paragraph}
                    </p>
                  ))}

                  {/* Rest of the content remains the same */}
                  {selectedQuestion.requirements && (
                    <>
                      <h4 className="text-base font-medium mt-6 mb-3">Requirements</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        {selectedQuestion.requirements.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {selectedQuestion.constraints && (
                    <>
                      <h4 className="text-base font-medium mt-6 mb-3">Constraints</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        {selectedQuestion.constraints.map((constraint, i) => (
                          <li key={i}>{constraint}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </TabsContent>

              {/* Hints and Solution tabs remain unchanged */}
              <TabsContent value="hints" className="p-4">
                <div className="space-y-4">
                  {selectedQuestion.hints?.map((hint, i) => (
                    <div key={i} className="p-4 rounded-lg border border-border bg-muted/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                        <h4 className="font-medium">Hint {i + 1}</h4>
                      </div>
                      <p className="text-sm">{hint}</p>
                    </div>
                  ))}

                  {!selectedQuestion.hints?.length && (
                    <div className="p-4 text-center text-muted-foreground">No hints available for this question.</div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="solution" className="p-4">
                {selectedQuestion.solution ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <h3 className="text-lg font-semibold">Solution Approach</h3>
                    </div>

                    {selectedQuestion.solution.approach.map((paragraph, i) => (
                      <p key={i} className="mb-4">
                        {paragraph}
                      </p>
                    ))}

                    <h4 className="text-base font-medium mt-6 mb-3">Key Components</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      {selectedQuestion.solution.components.map((component, i) => (
                        <li key={i}>{component}</li>
                      ))}
                    </ul>

                    {selectedQuestion.solution.considerations && (
                      <>
                        <h4 className="text-base font-medium mt-6 mb-3">Additional Considerations</h4>
                        <ul className="list-disc pl-5 space-y-2">
                          {selectedQuestion.solution.considerations.map((consideration, i) => (
                            <li key={i}>{consideration}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No solution available for this question yet.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}


      {isPanelCollapsed && (
        <div className="flex flex-col items-center pt-4 gap-4">
          {/* Show all questions in collapsed view for quick access */}
          {questions.map((question) => (
            <Button
              key={question.id}
              variant={selectedQuestionId === question.id ? "default" : "ghost"}
              size="icon"
              onClick={() => onSelectQuestion(question.id)}
              className="w-10 h-10 rounded-full"
              title={question.title}
            >
              {question.shortTitle.charAt(0)}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}

