import { create } from 'zustand';

export type OnboardingSelections = {
  mentorType: string;
  skillLevel: string;
  currentLevel: string;
  expectations: string;
  additionalInfo: string;
  customMentorCompany?: string;
}

type OnboardingState = {
  step: number;
  selections: OnboardingSelections;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateSelection: <K extends keyof OnboardingSelections>(field: K, value: OnboardingSelections[K]) => void;
  resetSelections: () => void;
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
}));