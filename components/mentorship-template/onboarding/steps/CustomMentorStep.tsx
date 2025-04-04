import { Building } from "lucide-react";
import { Input } from "@/components/ui/input";
import StepHeader from "../components/StepHeader";

interface CustomMentorStepProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CustomMentorStep({ value, onChange }: CustomMentorStepProps) {
  return (
    <div className="space-y-6">
      <StepHeader 
        title="Custom Mentor Details" 
        description="Tell us which company or technology stack you want to learn about" 
      />
      
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center flex-shrink-0">
            <Building className="h-5 w-5 text-white" />
          </div>
          <div className="font-medium text-white">Company or Technology Stack</div>
        </div>
        
        <Input 
          placeholder="E.g., Amazon, Netflix, React, Kubernetes, etc."
          className="bg-zinc-900 border-zinc-800 text-zinc-300 placeholder:text-zinc-500 focus:border-violet-500"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <p className="text-sm text-zinc-400 mt-2">
          We'll create a custom AI mentor specialized in this company's technologies and practices.
        </p>
      </div>
    </div>
  );
}