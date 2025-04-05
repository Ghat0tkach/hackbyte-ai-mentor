"use client"
import { useSystemDesignStore } from "@/store/system-design-store";
import { matchesGlob } from "path";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const backendUrl = "http://localhost:3000/api";

export interface Message {
    text: string;
    animation: string;
    facialExpression: string;
    lipsync: {
      metadata: {
        soundFile: string;
        duration: number
      }
      mouthCues: Array<{
        start: number;
        end: number;
        value: string;
      }>;
    };
    audio: string;
    mermaid?: string; // Add this property to support mermaid diagrams
}
 
  export interface MessageHistory{
    role: "user" | "ai";
    text: string;
    tools?: {
      type: string;
      content: any;
    }[];
  }
  

interface SpeechContextType {
  startRecording: () => void;
  stopRecording: () => void;
  recording: boolean;
  tts: (message: string, type: string) => Promise<void>;
  message: Message | null;
  onMessagePlayed: () => void;
  loading: boolean;
  messageHistory: MessageHistory[];
}

const SpeechContext = createContext<SpeechContextType | undefined>(undefined);

interface SpeechProviderProps {
  children: ReactNode;
}

export const SpeechProvider = ({ children }: SpeechProviderProps) => {
  const [recording, setRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageHistory, setMessageHistory] = useState<MessageHistory[]>([]);
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const systemDesignStore = useSystemDesignStore();

  let chunks: BlobPart[] = [];

  const initiateRecording = () => {
    chunks = [];
  };

  const onDataAvailable = (e) => {
    chunks.push(e.data);
  };

  const sendAudioData = async (audioBlob) => {
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async function () {
      const base64Audio = reader.result.split(",")[1];
      setLoading(true);
      try {
        const data = await fetch(`${backendUrl}/sts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ audio: base64Audio }),
        });
  
        const response = (await data.json());
        console.log(response);
        
        // Add user message to history
        setMessageHistory(prev => [...prev, { role: "user", text: response.transcribedText }]);
        
        // Process the AI response
        const aiMessages = response.messages;
        setMessages((messages) => [...messages, ...aiMessages]);
        
        // Extract tools from response
        const tools = [];
        
        // Check for mermaid diagrams
        if (aiMessages.some(msg => msg.mermaid)) {
          const mermaidMsg = aiMessages.find(msg => msg.mermaid);
          if (mermaidMsg && mermaidMsg.mermaid) {
            // Replace newlines with escaped newlines
            mermaidMsg.mermaid = mermaidMsg.mermaid.replace(/\n/g, '\\n');
            
            tools.push({
              type: 'mermaid',
              content: mermaidMsg.mermaid,
              language: 'mermaid'
            });
          }
        }
        
        // Check for code snippets
        if (aiMessages.some(msg => msg.code)) {
          const codeMsg = aiMessages.find(msg => msg.code);
          tools.push({
            type: 'code',
            content: codeMsg?.code,
            language: codeMsg?.codeLanguage || 'javascript'
          });
        }
        
        // Add the AI response to message history
        setMessageHistory(prev => [...prev, { 
          role: "ai", 
          text: aiMessages.map((msg:Message) => msg.text).join(" "),
          tools: tools.length > 0 ? tools : undefined
        }]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const newMediaRecorder = new MediaRecorder(stream);
          newMediaRecorder.onstart = initiateRecording;
          newMediaRecorder.ondataavailable = onDataAvailable;
          newMediaRecorder.onstop = async () => {
            const audioBlob = new Blob(chunks, { type: "audio/webm" });
            try {
              await sendAudioData(audioBlob);
            } catch (error) {
              console.error(error);
              alert(error.message);
            }
          };
          setMediaRecorder(newMediaRecorder);
        })
        .catch((err) => console.error("Error accessing microphone:", err));
    }
  }, []);

  const startRecording = () => {
    if (mediaRecorder) {
      console.log("startRecording")
      mediaRecorder.start();
      setRecording(true);
    }else{
      console.log("mediaRecorder not found")
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };


  // function to send message to backend and get response from backend
  const tts = async (message:string,type:string) => {

    setMessageHistory(prev => [...prev, { role: "user", text: message }]);
    setLoading(true);

    try {
      // If type is system-design, include the current question from systemDesignStore
      let requestBody = { message, type };
      if (type === 'system-design' && systemDesignStore.currentQuestionText) {
        requestBody = { 
          message: `Current question: ${systemDesignStore.currentQuestionText}\n\n${message}`, 
          type 
        };
      }else if (type === 'analysis') {
        requestBody = {
          message,
          type
        };
      }else if(type==="dsa"){
        const question = localStorage.getItem('currentDSAQuestion');
        requestBody = {
          message: `Current question: ${question}\n\n${message}`, 
          type
        };
      }

      const data = await fetch(`${backendUrl}/tts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      // Log the full response first
      const fullResponse = await data.json();
      console.log("FULL RESPONSE:", fullResponse);
      
      // Then extract the messages
      const response = fullResponse.messages;
      console.log("RESPONSE MESSAGES:", response);
      
      setMessages((messages) => [...messages, ...response]);
      
      // Extract tools from response
      const tools = [];
      
      // Check for tools in the response messages
      response.forEach(msg => {
        if (msg.tools) {
          tools.push({
            type: msg.tools.type,
            content: msg.tools.parameters,
            action: msg.tools.action
          });
        }
        // Keep existing checks for other tool types
        if (msg.mermaid) {
          tools.push({
            type: 'mermaid',
            content: msg.mermaid.replace(/\n/g, '\\n'),
            language: 'mermaid'
          });
        }
        if (msg.code) {
          tools.push({
            type: 'code',
            content: msg.code,
            language: msg.codeLanguage || 'javascript'
          });
        }
        if (msg.image) {
          tools.push({
            type: 'image',
            content: msg.image
          });
        }
        if (msg.diagram) {
          tools.push({
            type: 'diagram',
            content: msg.diagram
          });
        }
      });
      
      setMessageHistory(prev => [...prev, { 
        role: "ai", 
        text: response.map((msg:Message) => msg.text).join(" "),
        tools: tools.length > 0 ? tools : undefined
      }]);
    } catch (error) {
      console.log(error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onMessagePlayed = () => {
    setMessages((messages) => messages.slice(1));
  };

  useEffect(() => {
    if (messages.length > 0) {
      setMessage(messages[0]);
    } else {
      setMessage(null);
    }
  }, [messages]);

  return (
    <SpeechContext.Provider
      value={{
        startRecording,
        stopRecording,
        recording,
        tts,
        message,
        onMessagePlayed,
        loading,
        messageHistory,
      }}
    >
      {children}
    </SpeechContext.Provider>
  );
};

export const useSpeech = (): SpeechContextType => {
  const context = useContext(SpeechContext);
  if (!context) {
    throw new Error("useSpeech must be used within a SpeechProvider");
  }
  return context;
};
