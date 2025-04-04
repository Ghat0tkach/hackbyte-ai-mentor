import { BookOpen, Layers, Rocket } from "lucide-react";
import { RadioGroup } from "@/components/ui/radio-group";
import StepHeader from "../components/StepHeader";
import SelectionCard from "../components/SelectionCard";

interface SkillLevelStepProps {
  selection: string;
  onSelect: (value: string) => void;
}

export default function SkillLevelStep({ selection, onSelect }: SkillLevelStepProps) {
  const skillLevels = [
    {
      id: "beginner",
      name: "Beginner",
      description: "New to the field with little to no experience",
      icon: <BookOpen className="h-6 w-6 text-white" />,
    },
    {
      id: "intermediate",
      name: "Intermediate",
      description: "Some experience but looking to improve skills",
      icon: <Layers className="h-6 w-6 text-white" />,
    },
    {
      id: "advanced",
      name: "Advanced",
      description: "Experienced professional seeking expert guidance",
      icon: <Rocket className="h-6 w-6 text-white" />,
    },
  ];

  return (
    <div className="space-y-6">
      <StepHeader 
        title="Select Your Skill Level" 
        description="This helps us tailor the content to your expertise" 
      />
      
      <RadioGroup 
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        value={selection}
        onValueChange={onSelect}
      >
        {skillLevels.map((level) => (
          <SelectionCard
            key={level.id}
            id={level.id}
            name={level.name}
            description={level.description}
            icon={level.icon}
            isSelected={selection === level.id}
            layout="vertical"
          />
        ))}
      </RadioGroup>
    </div>
  );
}