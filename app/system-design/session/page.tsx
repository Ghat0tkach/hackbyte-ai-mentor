"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ThemeProvider } from "next-themes"
import { systemDesignQuestions } from "@/components/system-design/data"
import { QuestionPanel } from "@/components/system-design/question-panel"
import { Header } from "@/components/system-design/header"
import Whiteboard from "@/components/system-design/whiteboard"
import { useSystemDesignStore } from "@/store/system-design-store"
import { useRouter } from "next/navigation"
import { ChatBubble } from "@/components/ui/chat-bubble"
import { useOnboardingStore } from "@/store/onboardingStore"
import { useSpeech } from "@/hooks/use-speech"

export default function SystemDesignSession() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true)
  const router = useRouter()
  const whiteboardExportRef = useRef<(() => string) | null>(null)
  const whiteboardImportRef = useRef<((data: string) => boolean) | null>(null)
  const whiteboardStreamRef = useRef<((data: string, delay?: number) => boolean) | null>(null)
  
  // Add loading state for Gemini generation
  const [isGenerating, setIsGenerating] = useState(false)
  const { messageHistory, loading } = useSpeech();

  console.log('messageHistory:', messageHistory);
  
  // Get system design message history from the store
  const { 
    systemDesignMessagesHistory, 
    addMessage, 
    setActiveChatBubble 
  } = useOnboardingStore()
  
  const { 
    experienceLevel,
    currentQuestionId, 
    setCurrentQuestionId,
    setCurrentCode,
    setDiagramData,
    startSession,
    endSession
  } = useSystemDesignStore()
  
  // If no experience level is set, redirect to onboarding
  useEffect(() => {
    if (!experienceLevel) {
      router.push("/system-design/onboarding")
    }
  }, [experienceLevel, router])
  
  // Initialize with the first question if none is selected
  useEffect(() => {
    if (!currentQuestionId && systemDesignQuestions.length > 0) {
      setCurrentQuestionId(systemDesignQuestions[0].id)
    }
  }, [currentQuestionId, setCurrentQuestionId])
  
  // Start session timer when a question is selected - FIXED to prevent infinite updates
  useEffect(() => {
    let isActive = true;
    
    if (currentQuestionId && isActive) {
      // Only start the session once
      const timer = setTimeout(() => {
        startSession();
      }, 0);
      
      return () => {
        isActive = false;
        clearTimeout(timer);
        endSession();
      };
    }
  }, [currentQuestionId, startSession, endSession]);
  
  // Find the currently selected question
  const selectedQuestion = systemDesignQuestions.find(q => q.id === currentQuestionId) || systemDesignQuestions[0];
  
  // Example function to demonstrate text streaming
  const handleStreamExample = () => {
    if (typeof window !== 'undefined' && (window as any).streamWhiteboardText) {
      // Stream a sample text at position 100, 100
      (window as any).streamWhiteboardText(
        "This is a streaming text example. Watch it appear character by character!",
        100,
        100
      );
    }
  }
  const [exportFn, setExportFn] = useState<(() => string) | null>(null);
  const [importFn, setImportFn] = useState<((data: string) => boolean) | null>(null);
  const [streamFn, setStreamFn] = useState<((data: string, delay?: number) => boolean) | null>(null);
  
  // Use useCallback to memoize these handler functions
  const handleExport = useCallback((fn: () => string) => {
    setExportFn(() => fn);
  }, []);
  
  const handleImport = useCallback((fn: (data: string) => boolean) => {
    setImportFn(() => fn);
  }, []);
  
  const handleStream = useCallback((fn: (data: string, delay?: number) => boolean) => {
    setStreamFn(() => fn);
  }, []);
  
  const saveWhiteboard = () => {
    if (exportFn) {
      const data = exportFn();
      localStorage.setItem('whiteboard-data', data);
    }
  };
  
  const loadWhiteboard = () => {
    if (importFn) {
      const data = localStorage.getItem('whiteboard-data');
      if (data) {
        importFn(data);
      }
    }
  };
  
  const streamWhiteboard = () => {
    if (streamFn) {
      const data = localStorage.getItem('whiteboard-data');
      if (data) {
        streamFn(data, 300);
      }
    }
  };
  
  // New function to generate and stream system design diagram
  const generateSystemDesign = async (questionText?: string) => {
    if (!streamFn) return;
    
    const questionToUse = questionText || (selectedQuestion ? selectedQuestion.question : null);
    if (!questionToUse) return;
    
    setIsGenerating(true);
    
    try {
      // Call the API with the current question
      const response = await fetch('/api/system-design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          question: questionToUse
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const diagramData = await response.json();
      
      // Save the generated diagram to localStorage
      localStorage.setItem('whiteboard-data', JSON.stringify(diagramData));
      
      // Stream the diagram to the whiteboard
      streamFn(JSON.stringify(diagramData), 300);
      
      // Add a confirmation message to the chat
      addMessage({
        text: "I've generated the diagram based on your request. You can see it on the whiteboard now.",
        sender: 'ai',
        animation: 'TalkingOne',
        facialExpression: 'smile',
      }, 'system-design');
      
    } catch (error) {
      console.error('Error generating system design diagram:', error);
      
      // Add an error message to the chat
      addMessage({
        text: "I'm sorry, I couldn't generate the diagram. Please try again.",
        sender: 'ai',
        animation: 'SadIdle',
        facialExpression: 'sad',
      }, 'system-design');
      
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Handle whiteboard export/import callbacks
  const handleWhiteboardExport = (exportFn: () => string) => {
    whiteboardExportRef.current = exportFn;
  }
  
  const handleWhiteboardImport = (importFn: (data: string) => boolean) => {
    whiteboardImportRef.current = importFn;
  }
  
  const handleWhiteboardStream = (streamFn: (data: string, delay?: number) => boolean) => {
    whiteboardStreamRef.current = streamFn;
  }
  
  // Handle sending a message from the chat bubble
  const handleSendMessage = async (message: string, type: string) => {
    // Add user message to the store
    addMessage({
      text: message,
      sender: 'user',
    }, 'system-design');
    
    try {
      // Send message to API
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          type: 'system-design',
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Process AI responses
      if (data.messages && Array.isArray(data.messages)) {
        for (const msg of data.messages) {
          // Add the AI message to the store
          addMessage({
            text: msg.text,
            sender: 'ai',
            animation: msg.animation,
            facialExpression: msg.facialExpression,
            mermaid: msg.mermaid,
            toolUse: msg.toolUse,
            lipsync: msg.lipsync,
          }, 'system-design');
          
          // Check if this message contains a diagram request
          if (msg.toolUse && msg.toolUse.type === 'diagram') {
            // Generate the diagram based on the tool use parameters
            await generateSystemDesign(msg.toolUse.parameters.prompt);
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      addMessage({
        text: "Sorry, I couldn't process your request. Please try again.",
        sender: 'ai',
        animation: 'SadIdle',
        facialExpression: 'sad',
      }, 'system-design');
    }
  };
  
  // Monitor message history for diagram requests
  useEffect(() => {
    const checkForDiagramRequests = async () => {
      if (systemDesignMessagesHistory.length === 0) return;
      
      // Get the most recent AI message
      const recentMessages = [...systemDesignMessagesHistory].reverse();
      const latestAiMessage = recentMessages.find(msg => msg.sender === 'ai');
      
      if (latestAiMessage && latestAiMessage.toolUse && 
          latestAiMessage.toolUse.type === 'diagram' && 
          !isGenerating) {
        // Generate diagram based on the tool use parameters
        await generateSystemDesign(latestAiMessage.toolUse.parameters.prompt);
      }
    };
    
    checkForDiagramRequests();
  }, [systemDesignMessagesHistory, isGenerating]);
  
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="flex flex-col h-screen bg-background text-foreground">
        <Header 
          isDarkMode={isDarkMode} 
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
        />
        
        <div className="flex flex-1 overflow-hidden">
          <QuestionPanel
            questions={systemDesignQuestions}
            selectedQuestionId={currentQuestionId}
            onSelectQuestion={setCurrentQuestionId}
            selectedQuestion={selectedQuestion}
          />
          
          <div className="flex-1 p-4 overflow-hidden">
            <div className="h-full">
              <Whiteboard 
                width="100%" 
                height="100%" 
                onExport={handleExport} 
                onImport={handleImport}
                onStream={handleStream}
              />
              
              {/* Updated button panel with Generate option */}
              <div className="p-4 bg-white border-t sticky bottom-0 left-0 border-gray-200 flex justify-center space-x-4">
                <button 
                  onClick={saveWhiteboard}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
                <button 
                  onClick={loadWhiteboard}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Load
                </button>
                <button 
                  onClick={streamWhiteboard}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Stream
                </button>
                <button 
                  onClick={() => generateSystemDesign()}
                  disabled={isGenerating}
                  className={`px-4 py-2 rounded-md ${
                    isGenerating 
                      ? "bg-gray-400 cursor-not-allowed" 
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  {isGenerating ? "Generating..." : "Generate Diagram"}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Add the chat bubble */}
        <ChatBubble
          id="system-design-chat"
          type="system-design"
          title="System Design Assistant"
          position={{ x: 20, y: 20 }}
          onSendMessage={handleSendMessage}
          className="z-50"
        />
      </div>
    </ThemeProvider>
  );
}

