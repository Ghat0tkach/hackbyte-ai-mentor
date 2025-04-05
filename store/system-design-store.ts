import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ExperienceLevel = 'junior' | 'mid' | 'senior' | 'architect'
export type TargetCompany = 'faang' | 'unicorns' | 'fintech' | 'enterprise' | 'gaming' | 'ecommerce' | 'healthcare' | 'other'

interface SystemDesignState {
  // User preferences
  experienceLevel: ExperienceLevel | null
  targetCompanies: TargetCompany[]
  
  // Current session data
  currentQuestionId: string | null
  currentQuestionText: string | null // Added for storing the full question text
  currentCode: string
  diagramData: any // This will store the whiteboard diagram data
  sessionStartTime: number | null
  sessionDuration: number
  
  // Analytics data
  completedQuestions: string[]
  averageTimePerQuestion: number
  feedbackRatings: Record<string, number> // questionId -> rating
  aiSuggestions: Array<{
    id: string
    questionId: string
    suggestion: string
    accepted: boolean
    timestamp: number
  }>
  
  // Actions
  setExperienceLevel: (level: ExperienceLevel) => void
  setTargetCompanies: (companies: TargetCompany[]) => void
  setCurrentQuestionId: (id: string | null) => void
  setCurrentQuestionText: (text: string | null) => void // Added for setting question text
  setCurrentCode: (code: string) => void
  setDiagramData: (data: any) => void
  startSession: () => void
  endSession: () => void
  completeQuestion: (questionId: string) => void
  addFeedbackRating: (questionId: string, rating: number) => void
  addAiSuggestion: (questionId: string, suggestion: string) => void
  acceptAiSuggestion: (suggestionId: string) => void
  rejectAiSuggestion: (suggestionId: string) => void
  resetStore: () => void
}

const initialState = {
  experienceLevel: null,
  targetCompanies: [],
  currentQuestionId: null,
  currentQuestionText: null, // Added to initial state
  currentCode: '',
  diagramData: null,
  sessionStartTime: null,
  sessionDuration: 0,
  completedQuestions: [],
  averageTimePerQuestion: 0,
  feedbackRatings: {},
  aiSuggestions: [],
}

export const useSystemDesignStore = create<SystemDesignState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setExperienceLevel: (level) => set({ experienceLevel: level }),
      
      setTargetCompanies: (companies) => {
        // Use a callback to ensure we're not depending on the previous state in a way that causes loops
        set(() => ({ targetCompanies: companies }))
      },
      
      setCurrentQuestionId: (id) => set({ currentQuestionId: id }),
      
      // New function to set the current question text
      setCurrentQuestionText: (text) => set({ currentQuestionText: text }),
      
      setCurrentCode: (code) => set({ currentCode: code }),
      
      setDiagramData: (data) => set({ diagramData: data }),
      
      startSession: () => set({ sessionStartTime: Date.now() }),
      
      endSession: () => {
        const { sessionStartTime } = get()
        if (sessionStartTime) {
          const duration = Date.now() - sessionStartTime
          set({ 
            sessionDuration: duration,
            sessionStartTime: null
          })
        }
      },
      
      completeQuestion: (questionId) => {
        const { completedQuestions, sessionStartTime } = get()
        if (!completedQuestions.includes(questionId)) {
          const newCompletedQuestions = [...completedQuestions, questionId]
          
          // Calculate new average time
          let newAverage = get().averageTimePerQuestion
          if (sessionStartTime) {
            const questionTime = Date.now() - sessionStartTime
            const totalTime = newAverage * completedQuestions.length + questionTime
            newAverage = totalTime / newCompletedQuestions.length
          }
          
          set({ 
            completedQuestions: newCompletedQuestions,
            averageTimePerQuestion: newAverage,
            sessionStartTime: null
          })
        }
      },
      
      addFeedbackRating: (questionId, rating) => {
        set({
          feedbackRatings: {
            ...get().feedbackRatings,
            [questionId]: rating
          }
        })
      },
      
      addAiSuggestion: (questionId, suggestion) => {
        const newSuggestion = {
          id: `suggestion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          questionId,
          suggestion,
          accepted: false,
          timestamp: Date.now()
        }
        
        set({
          aiSuggestions: [...get().aiSuggestions, newSuggestion]
        })
        
        return newSuggestion.id
      },
      
      acceptAiSuggestion: (suggestionId) => {
        set({
          aiSuggestions: get().aiSuggestions.map(suggestion => 
            suggestion.id === suggestionId 
              ? { ...suggestion, accepted: true } 
              : suggestion
          )
        })
      },
      
      rejectAiSuggestion: (suggestionId) => {
        set({
          aiSuggestions: get().aiSuggestions.filter(
            suggestion => suggestion.id !== suggestionId
          )
        })
      },
      
      resetStore: () => set(initialState)
    }),
    {
      name: 'system-design-storage',
      partialize: (state) => ({
        experienceLevel: state.experienceLevel,
        targetCompanies: state.targetCompanies,
        completedQuestions: state.completedQuestions,
        averageTimePerQuestion: state.averageTimePerQuestion,
        feedbackRatings: state.feedbackRatings,
        // Include currentQuestionText in persisted state
        currentQuestionText: state.currentQuestionText,
      }),
    }
  )
)