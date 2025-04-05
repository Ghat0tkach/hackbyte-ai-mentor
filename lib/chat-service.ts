import { useOnboardingStore, Message } from '@/store/onboardingStore';

export async function sendMessage(message: string, type: 'mentorship' | 'system-design' | 'dsa') {
  const store = useOnboardingStore.getState();
  
  // Add user message to the appropriate history
  store.addMessage({
    text: message,
    sender: 'user',
  }, type);
  
  try {
    // Send message to API
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        type,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Process AI responses
    if (data.messages && Array.isArray(data.messages)) {
      data.messages.forEach((msg: any) => {
        store.addMessage({
          text: msg.text,
          sender: 'ai',
          animation: msg.animation,
          facialExpression: msg.facialExpression,
          mermaid: msg.mermaid,
          toolUse: msg.toolUse,
          lipsync: msg.lipsync,
        }, type);
      });
    }
    
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    
    // Add error message
    store.addMessage({
      text: "Sorry, I couldn't process your request. Please try again.",
      sender: 'ai',
      animation: 'SadIdle',
      facialExpression: 'sad',
    }, type);
    
    throw error;
  }
}

export function getChatHistory(type: 'mentorship' | 'system-design' | 'dsa'): Message[] {
  const store = useOnboardingStore.getState();
  
  switch (type) {
    case 'mentorship':
      return store.messagesHistory;
    case 'system-design':
      return store.systemDesignMessagesHistory;
    case 'dsa':
      return store.dsaMessagesHistory;
    default:
      return [];
  }
}