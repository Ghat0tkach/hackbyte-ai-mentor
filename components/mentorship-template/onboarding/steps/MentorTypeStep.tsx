import { Building, Code, Cpu, User } from "lucide-react";
import { RadioGroup } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import StepHeader from "../components/StepHeader";
import SelectionCard from "../components/SelectionCard";

interface MentorTypeStepProps {
  selection: string;
  customCompany: string;
  onSelect: (value: string) => void;
  onCustomCompanyChange: (value: string) => void;
}

export default function MentorTypeStep({ 
  selection, 
  customCompany, 
  onSelect, 
  onCustomCompanyChange 
}: MentorTypeStepProps) {
  const mentorTypes = [
    {
      id: "facebook",
      name: "Facebook Mentor",
      description: "Learn React, GraphQL, and Facebook best practices",

      icon: <Code className="h-6 w-6 text-white" />,
    },
    {
      id: "twitter",
      name: "Twitter Mentor",
      description: "Learn React, GraphQL, and Twitter best practices",
      icon: <Cpu className="h-6 w-6 text-white" />,
    },
    {
      id: "custom",
      name: "Custom Mentor",
      description: "Create a mentor for any tech stack",
      icon: <User className="h-6 w-6 text-white" />,
    },
  ];

  const isCustomSelected = selection === "custom";

  return (
    <div className="space-y-6">
      <StepHeader 
        title="Choose Your Mentor Type" 
        description="Select the type of AI mentor that best fits your learning goals" 
      />
      
      <RadioGroup 
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        value={selection}
        onValueChange={onSelect}
      >
        {mentorTypes.map((type) => (
          <SelectionCard
            key={type.id}
            id={type.id}
            name={type.name}
            description={type.description}
            icon={type.icon}
            isSelected={selection === type.id}
            layout="vertical"
          />
        ))}
      </RadioGroup>

      {/* Custom mentor company input */}
      {isCustomSelected && (
        <div className="mt-6 space-y-4 animate-fadeIn">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center flex-shrink-0">
              <Building className="h-5 w-5 text-white" />
            </div>
            <div className="font-medium text-white">Company or Technology Stack</div>
          </div>
          
          <Input 
            placeholder="E.g., Amazon, Netflix, React, Kubernetes, etc."
            className="bg-zinc-900 border-zinc-800 text-zinc-300 placeholder:text-zinc-500 focus:border-violet-500"
            value={customCompany}
            onChange={(e) => onCustomCompanyChange(e.target.value)}
          />
          <p className="text-sm text-zinc-400 mt-2">
            We'll create a custom AI mentor specialized in this company's technologies and practices.
          </p>
        </div>
      )}
    </div>
  );
}