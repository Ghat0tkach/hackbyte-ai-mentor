import React, { useState } from 'react';
import { ChatBubble } from '@/components/ui/chat-bubble';
import { useSpeech } from '@/hooks/use-speech';

export function ChatBubblesManager() {
  const { tts, startRecording, stopRecording, messageHistory, loading, setInteractionType } = useSpeech();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  
  const handleSendMessage = async (message: string, type: string) => {
    // Set the interaction type in the speech context
    setInteractionType(type as 'mentorship' | 'system-design' | 'dsa');
    
    // Use the tts function from useSpeech hook
    await tts(message, type as 'mentorship' | 'system-design' | 'dsa');
  };
  
  const handleVoiceInput = async (audioData: string, type: string) => {
    // Set the interaction type
    setInteractionType(type as 'mentorship' | 'system-design' | 'dsa');
    
    try {
      // Send audio data to the STS API
      const response = await fetch('/api/sts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio: audioData,
          type: type,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      // Process the response if needed
      // The useSpeech hook will handle updating the message history
    } catch (error) {
      console.error('Error processing voice input:', error);
    }
  };
  
  // Filter messages based on the active chat type
  const getFilteredMessages = (type: string) => {
    return messageHistory.filter(msg => msg.interactionType === type);
  };
  
  const handleChatToggle = (id: string, isExpanded: boolean) => {
    setActiveChat(isExpanded ? id : null);
  };
  
  return (
    <>
      <ChatBubble
        id="mentorship-chat"
        type="mentorship"
        title="Mentorship Chat"
        position={{ x: 20, y: 20 }}
        onSendMessage={handleSendMessage}
        onVoiceInput={handleVoiceInput}
        onToggle={handleChatToggle}
        messages={getFilteredMessages('mentorship')}
        isLoading={loading && activeChat === "mentorship-chat"}
      />
      
      <ChatBubble
        id="system-design-chat"
        type="system-design"
        title="System Design Chat"
        position={{ x: 20, y: 100 }}
        onSendMessage={handleSendMessage}
        onVoiceInput={handleVoiceInput}
        onToggle={handleChatToggle}
        messages={getFilteredMessages('system-design')}
        isLoading={loading && activeChat === "system-design-chat"}
      />
      
      <ChatBubble
        id="dsa-chat"
        type="dsa"
        title="DSA Chat"
        position={{ x: 20, y: 180 }}
        onSendMessage={handleSendMessage}
        onVoiceInput={handleVoiceInput}
        onToggle={handleChatToggle}
        messages={getFilteredMessages('dsa')}
        isLoading={loading && activeChat === "dsa-chat"}
      />
    </>
  );
}