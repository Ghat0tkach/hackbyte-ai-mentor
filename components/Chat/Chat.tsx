import React, { useState, useEffect, useRef } from 'react';
import { useSpeech } from '../../hooks/use-speech';
import { FlowChart } from './flow-chart';
import { ChatInterface } from '@/components/avatar/chat-interface';

export const Chat = ({type}) => {
  const { messageHistory, loading } = useSpeech();
  const [streamingMessages, setStreamingMessages] = useState([]);

  const messagesEndRef = useRef(null);
  
  // Track the last message to detect new messages
  const lastMessageRef = useRef(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [streamingMessages]);
  
  // Debug messageHistory changes
  useEffect(() => {
    console.log('MessageHistory updated:', messageHistory);
  }, [messageHistory]);
  
  // Handle streaming effect for new AI messages
  useEffect(() => {
    if (!messageHistory || messageHistory.length === 0) {
      setStreamingMessages([]);
      return;
    }
    
    const currentLastMessage = messageHistory[messageHistory.length - 1];
    
    // If this is a new message and it's from AI
    if (currentLastMessage !== lastMessageRef.current && 
        currentLastMessage.role === 'ai') {
      
      // Add all previous messages as they are
      const previousMessages = messageHistory.slice(0, -1);
      const newAiMessage = {...currentLastMessage, text: ''};
      
      setStreamingMessages([...previousMessages, newAiMessage]);
      
      // Stream the text character by character
      const fullText = currentLastMessage.text;
      let charIndex = 0;
      
      const streamInterval = setInterval(() => {
        if (charIndex < fullText.length) {
          setStreamingMessages(prev => {
            const updatedMessages = [...prev];
            const lastMsg = {...updatedMessages[updatedMessages.length - 1]};
            lastMsg.text = fullText.substring(0, charIndex + 1);
            updatedMessages[updatedMessages.length - 1] = lastMsg;
            return updatedMessages;
          });
          charIndex++;
        } else {
          clearInterval(streamInterval);
        }
      }, 30); // Adjust speed as needed
      
      return () => clearInterval(streamInterval);
    } else if (currentLastMessage !== lastMessageRef.current) {
      // If it's a user message, just add it immediately
      setStreamingMessages([...messageHistory]);
    }
    
    lastMessageRef.current = currentLastMessage;
  }, [messageHistory]);

  // Add a default welcome message if there are no messages
  useEffect(() => {
    if (!messageHistory || messageHistory.length === 0) {
      console.log('No messages found, you might want to add a welcome message');
    }
  }, []);

  return (
    <div className="h-full w-full flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50 border border-indigo-100/50 shadow-xl">
      <div className="p-4 border-b border-indigo-100/50 bg-white/80 backdrop-blur-sm">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm0-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          AI Mentor Chat
        </h2>
      </div>
      
      <div className="p-4 overflow-y-auto flex-1 bg-white/40 backdrop-blur-sm">
      {/* <FlowChart /> */}
        {streamingMessages && streamingMessages.length > 0 ? (
          streamingMessages.map((msg, index) => (
            <div key={index} 
                className={`flex items-start space-x-3 mb-5 ${
                  msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                } animate-fadeIn`}>
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-violet-500 to-indigo-600' 
                    : 'bg-gradient-to-br from-indigo-400 to-purple-600'
                }`}>
                  <span className="text-white text-sm font-medium">
                    {msg.role === 'user' ? 'You' : 'AI'}
                  </span>
                </div>
              </div>
              <div className={`flex-1 max-w-[85%] ${msg.role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
                <div className={`rounded-2xl p-4 shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-violet-50 to-indigo-50 rounded-tr-none border-l border-t border-violet-200/50' 
                    : 'bg-gradient-to-br from-white to-purple-50 rounded-tl-none border-r border-t border-purple-200/50'
                }`}>
                  <p className="text-slate-700 leading-relaxed">{msg.text}</p>
                  
                  
                  {/* Display tools like mermaid diagrams if available */}
                  {msg.role === 'ai' && msg.tools && msg.tools.map((tool, toolIndex) => (
                    <div key={toolIndex} className="mt-4 pt-3 border-t border-purple-100/50">
                      {tool.type === 'mermaid' && (
                        <div className="bg-white/80 p-4 rounded-lg shadow-sm border border-indigo-100/30">
                          {/* <FlowChart code={tool.content} /> */}
                        </div>
                      )}
                      {tool.type === 'code' && (
                        <div className="bg-slate-800 text-slate-100 p-4 rounded-lg shadow-sm overflow-x-auto font-mono text-sm mt-2">
                          <div className="flex items-center justify-between mb-2 text-xs text-slate-400">
                            <span>{tool.language || 'code'}</span>
                            <button className="hover:text-white transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                              </svg>
                            </button>
                          </div>
                          <pre className="text-sm">{tool.content}</pre>
                        </div>
                      )}
                      {tool.type === 'image' && (
                        <div className="mt-2 bg-white/80 p-2 rounded-lg shadow-sm border border-indigo-100/30">
                          <img src={tool.content} alt="AI generated" className="rounded max-w-full h-auto" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {msg.role === 'ai' && index === streamingMessages.length - 1 && 
                  msg.text.length < (messageHistory?.[messageHistory.length - 1]?.text?.length || 0) && (
                    <span className="inline-block w-2 h-5 ml-1 bg-indigo-500 rounded-sm animate-pulse"></span>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-1 px-2">
                  {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8 rounded-xl bg-white/70 backdrop-blur-sm shadow-sm border border-indigo-100/30 max-w-md">
              <div className="text-indigo-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-slate-800 mb-2">Your AI Mentor is Ready</h3>
              <p className="text-slate-600 mb-4">Ask me anything about programming concepts, algorithms, or coding challenges!</p>
              <div className="bg-indigo-50 p-3 rounded-lg text-sm text-slate-700 text-left">
                <p className="font-medium mb-1">Try asking:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Explain how arrays work in JavaScript</li>
                  <li>What's the difference between var, let, and const?</li>
                  <li>Help me understand recursion</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
        
        {loading && (
          <div className="flex justify-center my-5">
            <div className="px-5 py-3 bg-white/90 rounded-full shadow-sm border border-indigo-100/50">
              <div className="flex space-x-2 items-center">
                <div className="text-xs text-slate-500 mr-2">AI is thinking</div>
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" />
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-indigo-100/50 bg-white/80 backdrop-blur-sm">
        <ChatInterface hidden={false} showHeader={false} containerClassName="w-full" type={type} />
      </div>
    </div>
  );
};