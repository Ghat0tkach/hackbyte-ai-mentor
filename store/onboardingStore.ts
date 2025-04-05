import { create } from 'zustand';

export type OnboardingSelections = {
  mentorType: string;
  skillLevel: string;
  currentLevel: string;
  expectations: string;
  additionalInfo: string;
  customMentorCompany?: string;
}

export type CompanyInfo = {
  companyName: string;
  companyData: any;
}

export type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
  animation?: string;
  facialExpression?: string;
  mermaid?: string;
  toolUse?: {
    type: string;
    action: string;
    parameters: Record<string, any>;
  };
  lipsync?: { mouthCues: any[] };
}

type OnboardingState = {
  step: number;
  selections: OnboardingSelections;
  companyInfo: CompanyInfo | null;
  // Message histories for different interaction types
  messagesHistory: Message[];
  systemDesignMessagesHistory: Message[];
  dsaMessagesHistory: Message[];
  // Active chat bubble state
  activeChatBubble: string | null;
  // Methods
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateSelection: <K extends keyof OnboardingSelections>(field: K, value: OnboardingSelections[K]) => void;
  resetSelections: () => void;
  setCompanyInfo: (info: CompanyInfo) => void;
  // Message management methods
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>, type: 'mentorship' | 'system-design' | 'dsa') => void;
  clearMessages: (type: 'mentorship' | 'system-design' | 'dsa') => void;
  // Chat bubble methods
  setActiveChatBubble: (id: string | null) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  step: 1,
  selections: {
    mentorType: "",
    skillLevel: "",
    currentLevel: "",
    expectations: "",
    additionalInfo: "",
    customMentorCompany: "",
  },
  companyInfo: null,
  // Initialize empty message histories
  messagesHistory: [],
  systemDesignMessagesHistory: [],
  dsaMessagesHistory: [],
  activeChatBubble: null,
  
  // Existing methods
  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step - 1 })),
  updateSelection: (field, value) => set((state) => ({
    selections: {
      ...state.selections,
      [field]: value,
    }
  })),
  resetSelections: () => set({
    selections: {
      mentorType: "",
      skillLevel: "",
      currentLevel: "",
      expectations: "",
      additionalInfo: "",
      customMentorCompany: "",
    }
  }),
  setCompanyInfo: (info) => set({ companyInfo: info }),
  
  // New methods for message management
  addMessage: (message, type) => set((state) => {
    const newMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    
    switch (type) {
      case 'mentorship':
        return {
          messagesHistory: [...state.messagesHistory, newMessage]
        };
      case 'system-design':
        return {
          systemDesignMessagesHistory: [...state.systemDesignMessagesHistory, newMessage]
        };
      case 'dsa':
        return {
          dsaMessagesHistory: [...state.dsaMessagesHistory, newMessage]
        };
      default:
        return {}; // No changes if invalid type
    }
  }),
  
  clearMessages: (type) => set((state) => {
    switch (type) {
      case 'mentorship':
        return { messagesHistory: [] };
      case 'system-design':
        return { systemDesignMessagesHistory: [] };
      case 'dsa':
        return { dsaMessagesHistory: [] };
      default:
        return {}; // No changes if invalid type
    }
  }),
  
  // Chat bubble management
  setActiveChatBubble: (id) => set({ activeChatBubble: id }),
}));