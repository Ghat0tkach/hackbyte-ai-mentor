import { BookOpen, Code, Cpu, Layers } from "lucide-react";
import { RadioGroup } from "@/components/ui/radio-group";
import StepHeader from "../components/StepHeader";
import SelectionCard from "../components/SelectionCard";

interface CurrentKnowledgeStepProps {
  selection: string;
  onSelect: (value: string) => void;
}

export default function CurrentKnowledgeStep({ selection, onSelect }: CurrentKnowledgeStepProps) {
  const currentLevels = [
    {
      id: "theory-only",
      name: "Theory Only",
      description: "I understand the concepts but haven't applied them in practice",
      icon: <BookOpen className="h-5 w-5 text-white" />,
    },
    {
      id: "some-projects",
      name: "Some Projects",
      description: "I've worked on a few personal or academic projects",
      icon: <Code className="h-5 w-5 text-white" />,
    },
    {
      id: "professional",
      name: "Professional Experience",
      description: "I've used these technologies in a professional setting",
      icon: <Layers className="h-5 w-5 text-white" />,
    },
    {
      id: "expert",
      name: "Expert Knowledge",
      description: "I'm very familiar but want to deepen my expertise",
      icon: <Cpu className="h-5 w-5 text-white" />,
    },
  ];

  return (
    <div className="space-y-6">
      <StepHeader 
        title="Your Current Knowledge" 
        description="What best describes your current understanding?" 
      />
      
      <RadioGroup 
        className="grid grid-cols-1 gap-4"
        value={selection}
        onValueChange={onSelect}
      >
        {currentLevels.map((level) => (
          <SelectionCard
            key={level.id}
            id={level.id}
            name={level.name}
            description={level.description}
            icon={level.icon}
            isSelected={selection === level.id}
            layout="horizontal"
          />
        ))}
      </RadioGroup>
    </div>
  );
}