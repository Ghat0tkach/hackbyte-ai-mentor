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
import { Canvas } from "@react-three/fiber"
import { Suspense } from "react" // Add Suspense import
import { Scenario } from "@/components/avatar/scenario"
import { Environment } from "@react-three/drei" // Add Environment import
import { CameraControls } from "@react-three/drei"; // Import CameraControls

export default function SystemDesignSession() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true)
  const router = useRouter()
  
  // Add loading state for Gemini generation
  const [isGenerating, setIsGenerating] = useState(false)
  const { messageHistory, loading } = useSpeech();

  console.log('messageHistory:', messageHistory);
  
  // Get system design message history from the store
  const { 
    addMessage, 
  } = useOnboardingStore()
  
  const { 
    experienceLevel,
    currentQuestionId, 
    setCurrentQuestionId,
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
  
  // New function to generate and stream system design diagram
  const generateSystemDesign = async (questionText?: string) => {
    if (!streamFn) return;
    
    const questionToUse = questionText || (selectedQuestion ? selectedQuestion : null);
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
        animation: 'idle',
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
  
  // Monitor messageHistory for diagram tools
  useEffect(() => {
    const handleDiagramGeneration = async () => {
      if (messageHistory && messageHistory.length > 0) {
        const latestMessage = messageHistory[messageHistory.length - 1];
        console.log("Latest Message:", latestMessage);
        if (latestMessage.tools && 
            latestMessage.tools[0] && 
            latestMessage.tools[0].type === 'diagram') {
          // Generate diagram with the current selected question
          await generateSystemDesign(selectedQuestion?.question);
        }
      }
    };

    handleDiagramGeneration();
  }, [messageHistory, selectedQuestion]);

  // Add state to track Canvas errors
  const [canvasError, setCanvasError] = useState(false);
  
  // Adjusted camera coords for the avatar scene to focus on head/shoulders in circle
  const avatarCameraCoords = {
    CameraPosition: {
      x: 0,
      y: 1.8,  // Slightly higher to focus on head/shoulders
      z: 0.5   // Closer zoom
    },
    CameraTarget: {
      x: 0,
      y: 1.8,  // Focus on face
      z: 0
    }
  };
  
  const cameraControlsRef = useRef(); // Create a ref for CameraControls



  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="flex flex-col h-screen bg-background text-foreground">
        <Header 
          isDarkMode={isDarkMode} 
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
        />
        
        <div className="flex flex-1 overflow-hidden relative">
          <QuestionPanel
            questions={systemDesignQuestions}
            selectedQuestionId={currentQuestionId}
            onSelectQuestion={setCurrentQuestionId}
            selectedQuestion={selectedQuestion}
          />
          
          <div className="flex-1 p-4 overflow-hidden relative">
            <div className="h-full">
              <Whiteboard 
                width="100%" 
                height="100%" 
                onExport={handleExport} 
                onImport={handleImport}
                onStream={handleStream}
                selectedQuestion={selectedQuestion}
              />
              
              {/* Loading overlay */}
              {isGenerating && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-white font-medium">Generating diagram...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Circular avatar container positioned at bottom left */}
          <div className="absolute bottom-8 left-8 w-50 h-50 rounded-full overflow-hidden border-2 border-blue-500 shadow-lg">
            <div className="w-full h-full bg-gradient-to-b from-gray-800 to-gray-900">
              {!canvasError ? (
                <Canvas
                  shadows
                  camera={{ position: [0, 2.0, 0.5], fov: 25 }} // Adjusted y position for a higher view
                  style={{ width: '100%', height: '100%' }}
                  gl={{ 
                    alpha: true,
                    antialias: true,
                    powerPreference: "high-performance",
                    failIfMajorPerformanceCaveat: false
                  }}
                  onCreated={({ gl }) => {
                    if (!gl.getContext()) {
                      console.error("WebGL context not available");
                      setCanvasError(true);
                    }
                  }}
                  onError={() => setCanvasError(true)}
                >
                  <Suspense fallback={null}>
                    <CameraControls ref={cameraControlsRef} />
                    <Scenario 
                      environment={false}
                      scale={1.8}
                      cameraCoords={avatarCameraCoords}
                      hidden={false}
                    />
                    <Environment preset="city" />
                  </Suspense>
                </Canvas>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-xs text-center p-2">
                  Unable to load 3D avatar
                </div>
              )}
            </div>
          </div>
          
          {/* Chat bubble positioned above the avatar */}
          <ChatBubble
            id="system-design-chat"
            type="system-design"
            title="System Design Assistant"
            position={{ x: 16, y: 16 }}
          className="z-50 max-w-xs"
          />
        </div>
      </div>
    </ThemeProvider>
  );
}