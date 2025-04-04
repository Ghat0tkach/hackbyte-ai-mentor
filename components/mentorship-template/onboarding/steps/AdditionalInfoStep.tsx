import { Info } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import StepHeader from "../components/StepHeader";

interface AdditionalInfoStepProps {
  value: string;
  onChange: (value: string) => void;
}

export default function AdditionalInfoStep({ value, onChange }: AdditionalInfoStepProps) {
  return (
    <div className="space-y-6">
      <StepHeader 
        title="Additional Information" 
        description="Share any specific topics, challenges, or goals you'd like your AI mentor to know about" 
      />
      
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center flex-shrink-0">
            <Info className="h-5 w-5 text-white" />
          </div>
          <div className="font-medium text-white">Tell us more (optional)</div>
        </div>
        
        <Textarea 
          placeholder="E.g., I want to learn about cloud architecture for e-commerce applications, or I'm struggling with database optimization..."
          className="min-h-[150px] bg-zinc-900 border-zinc-800 text-zinc-300 placeholder:text-zinc-500 focus:border-violet-500"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}