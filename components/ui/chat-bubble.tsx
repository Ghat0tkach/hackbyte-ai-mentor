import React, { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Chat } from '@/components/Chat/Chat';

interface ChatBubbleProps {
  id: string;
  type: 'mentorship' | 'system-design' | 'dsa';
  title: string;
  position?: { x: number; y: number };
  className?: string;
}

export function ChatBubble({
  id,
  type,
  title,
  position = { x: 20, y: 20 },
  className,
}: ChatBubbleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div
      className={cn(
        'fixed z-50 transition-all duration-300',
        className
      )}
      style={{
        bottom: position.y,
        right: position.x,
        width: isExpanded ? '350px' : '60px',
        height: isExpanded ? '500px' : '60px',
      }}
    >
      {isExpanded ? (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">{title}</h3>
            <Button variant="ghost" size="icon" onClick={toggleExpand}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <Chat 
              type={'system-design'}
              containerClassName="h-full flex flex-col" 
              compact={true}
            />
          </div>
        </div>
      ) : (
        <Button
          onClick={toggleExpand}
          className="h-full w-full rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg relative"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}