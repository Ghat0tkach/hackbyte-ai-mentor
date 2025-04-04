"use client"
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import StepIndicator from "./components/StepIndicator";
import MentorTypeStep from "./steps/MentorTypeStep";
import SkillLevelStep from "./steps/SkillLevelStep";
import CurrentKnowledgeStep from "./steps/CurrentKnowledgeStep";
import LearningGoalsStep from "./steps/LearningGoalsStep";
import AdditionalInfoStep from "./steps/AdditionalInfoStep";
import OnboardingHeader from "./components/OnboardingHeader";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const { 
    step, 
    selections, 
    nextStep, 
    prevStep, 
    updateSelection, 
  } = useOnboardingStore();
  
  const router = useRouter();
  
  // Calculate total steps (always 5 steps now)
  const totalSteps = 5;

  const handleSubmit = () => {
    console.log("Form submitted:", selections);
    
    // If custom mentor is selected, navigate to loading page first
    if (selections.mentorType === "custom" && selections.customMentorCompany) {
      router.push("/mentorship/session?loading=true");
    } else {
      // For non-custom mentors, just navigate to session page
      router.push("/mentorship/session");
    }
  };

  // Determine if the next button should be disabled
  const isNextDisabled = () => {
    switch (step) {
      case 1: 
        // If custom mentor is selected, require company name
        return !selections.mentorType || 
               (selections.mentorType === "custom" && !selections.customMentorCompany);
      case 2: return !selections.skillLevel;
      case 3: return !selections.currentLevel;
      case 4: return !selections.expectations;
      default: return false;
    }
  };

  // Render the current step content
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <MentorTypeStep 
                 selection={selections.mentorType} 
                 customCompany={selections.customMentorCompany || ""}
                 onSelect={(value) => updateSelection("mentorType", value)} 
                 onCustomCompanyChange={(value) => updateSelection("customMentorCompany", value)}
               />;
      case 2:
        return <SkillLevelStep 
                 selection={selections.skillLevel} 
                 onSelect={(value) => updateSelection("skillLevel", value)} 
               />;
      case 3:
        return <CurrentKnowledgeStep 
                 selection={selections.currentLevel} 
                 onSelect={(value) => updateSelection("currentLevel", value)} 
               />;
      case 4:
        return <LearningGoalsStep 
                 selection={selections.expectations} 
                 onSelect={(value) => updateSelection("expectations", value)} 
               />;
      case 5:
        return <AdditionalInfoStep 
                 value={selections.additionalInfo || ""} 
                 onChange={(value) => updateSelection("additionalInfo", value)} 
               />;
      default:
        return null;
    }
  };

  return (
    <section className="w-full min-h-screen py-12 sm:py-16 md:py-24 lg:py-32 relative overflow-hidden bg-zinc-950">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-600/30 via-violet-900/10 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-fuchsia-600/20 via-fuchsia-900/10 to-transparent"></div>
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-10"></div>
      
      {/* Enhanced floating elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 rounded-full bg-violet-600/15 blur-xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-10 w-40 h-40 rounded-full bg-fuchsia-600/15 blur-xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      <div className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full bg-violet-600/15 blur-xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      <div className="absolute bottom-1/3 left-1/4 w-20 h-20 rounded-full bg-fuchsia-600/15 blur-xl animate-pulse" style={{ animationDelay: "1.5s" }}></div>
      
      {/* Animated light streaks */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500/20 to-transparent animate-slide-right" style={{ animationDuration: "8s" }}></div>
      <div className="absolute bottom-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-fuchsia-500/20 to-transparent animate-slide-down" style={{ animationDuration: "10s" }}></div>
      
      <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8 relative">
        <OnboardingHeader />
        <StepIndicator currentStep={step} totalSteps={totalSteps} />

        <div className="group relative">
          <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-violet-600/40 to-fuchsia-600/40 opacity-50 blur-xl"></div>
          <Card className="relative bg-zinc-950 border-zinc-800 shadow-xl overflow-hidden">
            <CardContent className="p-8">
              {renderStepContent()}

              <div className="flex justify-between mt-8">
                {step > 1 ? (
                  <Button 
                    variant="outline" 
                    onClick={prevStep}
                    className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white"
                  >
                    Back
                  </Button>
                ) : (
                  <div></div>
                )}
                
                {step < totalSteps ? (
                  <Button 
                    onClick={nextStep}
                    className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white border-0"
                    disabled={isNextDisabled()}
                  >
                    Continue <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white border-0"
                  >
                    Start Learning <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
