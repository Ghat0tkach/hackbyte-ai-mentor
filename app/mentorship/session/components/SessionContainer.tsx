"use client"

import { useEffect, useState } from 'react';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useRouter } from 'next/navigation';
import SessionLoading from './SessionLoading';
import SessionChat from './SessionChat';

export default function SessionContainer() {
  const { selections, companyInfo, setCompanyInfo } = useOnboardingStore();
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingStage, setLoadingStage] = useState<'company' | 'session'>('company');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initializeSession = async () => {
      try {
        setLoading(true);
        console.log('selections:', selections);
        
        // Check if we have the necessary data
        if (!selections.mentorType) {
          throw new Error('Missing mentor type. Please complete onboarding first.');
        }
        
        // For all mentor types, fetch company data if needed
        setLoadingStage('company');
        
        // Only fetch company data if we don't already have it or if it's different
        const companyName = selections.mentorType;
        if (!companyInfo || companyInfo.companyName !== companyName) {
          console.log('Fetching company information for:', companyName);
          
          // Determine which API endpoint and mode to use
          const apiEndpoint = '/api/company/query';
          
          // Use mentorType to determine mode - if it exists, use 'existing', otherwise 'new'
          const mode = selections.mentorType ? 'existing' : 'new';
          console.log('Selected mode based on mentorType:', mode);
          
          // Fetch company information using the API
          const companyResponse = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              companyName: companyName.trim(),
              query: "What are the main products and services of this company?",
              additionalInfo: selections.additionalInfo || "",
              mode: mode
            }),
          });
          
          if (!companyResponse.ok) {
            const errorData = await companyResponse.json();
            throw new Error(errorData.message || 'Failed to fetch company information');
          }
          
          const companyData = await companyResponse.json();
          console.log('Company information fetched:', companyData);
          
          // Store company information in state
          setCompanyInfo({
            companyName: companyName, // Fixed: use companyName instead of selections.customMentorCompany
            companyData: companyData,
          });
        }
        
        // Now initialize the session
        setLoadingStage('session');
        
        // TEMPORARY: Create a fake response instead of calling the API
        // This will be replaced with the actual API call later
        let data;
        try {
          console.log('Creating fake session response for testing');
          
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Create fake response based on mentor type
          if (selections.mentorType === 'custom') {
            const companyName = selections.customMentorCompany?.replace('New:', '').trim() || 'the company';
            data = {
              response: `Hello! I'm your ${companyName} mentor. Based on your skill level (${selections.skillLevel}) and your goals to learn about ${selections.expectations}, I'll help guide your learning journey. What specific aspect of ${companyName} would you like to explore first?`,
              sessionId: `fake_session_${Date.now()}`
            };
          } else {
            // Standard mentor types
            const mentorTypeDisplay = selections.mentorType.charAt(0).toUpperCase() + selections.mentorType.slice(1);
            data = {
              response: `Welcome to your ${mentorTypeDisplay} mentorship! I see you're at a ${selections.skillLevel} level and want to focus on ${selections.expectations}. Let's start by discussing your current understanding of ${selections.currentLevel}. What specific questions do you have?`,
              sessionId: `fake_session_${Date.now()}`
            };
          }
          
          console.log('Fake session initialized:', data);
        } catch (fakeError) {
          console.error('Error creating fake response:', fakeError);
          throw new Error('Failed to create test session');
        }
        
        /* COMMENTED OUT FOR NOW - WILL BE RESTORED WHEN API IS READY
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: "Initialize session with the following information: " + 
                    `Mentor type: ${selections.mentorType}, ` +
                    `Skill level: ${selections.skillLevel}, ` + 
                    `Current knowledge: ${selections.currentLevel}, ` +
                    `Learning goals: ${selections.expectations}` +
                    (selections.additionalInfo ? `, Additional info: ${selections.additionalInfo}` : "") +
                    (selections.mentorType === 'custom' ? `, Company: ${selections.customMentorCompany}` : ""),
            history: [],
            isInitializing: true,
            mentorType: selections.mentorType,
            skillLevel: selections.skillLevel,
            currentLevel: selections.currentLevel,
            expectations: selections.expectations,
            additionalInfo: selections.additionalInfo,
            customMentorCompany: selections.customMentorCompany,
            companyInfo: companyInfo,
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to initialize session');
        }
        
        const data = await response.json();
        */
        
        console.log('Session initialized:', data);
        
        // Create session data structure from chat response
        setSessionData({
          sessionId: `session_${Date.now()}`,
          initialMessage: data.response || "Hello! I'm your AI mentor. How can I help you today?",
          mentorType: selections.mentorType,
          customMentorCompany: selections.customMentorCompany,
        });
      } catch (err) {
        console.error('Error initializing session:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    initializeSession();
  }, [selections, companyInfo, setCompanyInfo]);
  
  if (loading) {
    return <SessionLoading stage={loadingStage} companyName={selections.customMentorCompany} />;
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-4">
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => router.push('/mentorship/onboarding')}
            className="mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-md transition-colors"
          >
            Return to Onboarding
          </button>
        </div>
      </div>
    );
  }
  
  return <SessionChat sessionData={sessionData} />;
}
