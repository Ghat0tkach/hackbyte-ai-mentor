"use client"

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SessionLoadingProps {
  stage: 'company' | 'session';
  companyName?: string;
}

export default function SessionLoading({ stage, companyName }: SessionLoadingProps) {
  const [loadingMessage, setLoadingMessage] = useState("");
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    let messages: string[] = [];
    
    if (stage === 'company') {
      messages = [
        `Loading information about ${companyName}...`,
        `Gathering knowledge about ${companyName}...`,
        `Researching ${companyName}'s products and services...`,
        `Analyzing ${companyName}'s industry position...`,
        `Preparing ${companyName} mentor profile...`
      ];
    } else {
      messages = [
        "Initializing your mentorship session...",
        "Analyzing your learning preferences...",
        "Preparing personalized curriculum...",
        "Setting up your mentor profile...",
        "Almost ready..."
      ];
    }
    
    // Set initial message
    setLoadingMessage(messages[0]);
    
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      setLoadingMessage(messages[messageIndex]);
      
      // Update progress based on message index
      setProgress((messageIndex / (messages.length - 1)) * 100);
    }, 3000);
    
    // Simulate progress increasing between message changes
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const target = ((messageIndex + 1) / messages.length) * 100;
        const increment = (target - prev) * 0.1;
        return Math.min(prev + increment, 95); // Cap at 95% until complete
      });
    }, 200);
    
    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [stage, companyName]);
  
  // Animated background circles
  const circles = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    size: Math.random() * 200 + 50,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10
  }));
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden filter blur-3xl opacity-20">
        {circles.map(circle => (
          <motion.div
            key={circle.id}
            className="absolute rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600"
            style={{
              width: circle.size,
              height: circle.size,
              left: `${circle.x}%`,
              top: `${circle.y}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: circle.duration,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Content with glassmorphism */}
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center p-8 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Spinner */}
        <div className="relative w-24 h-24 mb-8">
          <motion.div 
            className="absolute inset-0 border-4 border-violet-600/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute inset-0 border-t-4 border-violet-600 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="w-16 h-16 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full opacity-80"
              animate={{ scale: [0.8, 1.1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
        
        {/* Loading message */}
        <motion.h2 
          className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400"
          key={loadingMessage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {loadingMessage}
        </motion.h2>
        
        {/* Progress bar */}
        <div className="w-full max-w-md h-3 bg-zinc-800/50 rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div 
            className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        {/* Progress percentage */}
        <motion.p 
          className="mt-2 text-sm text-violet-300"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {Math.round(progress)}% complete
        </motion.p>
      </motion.div>
    </div>
  );
}