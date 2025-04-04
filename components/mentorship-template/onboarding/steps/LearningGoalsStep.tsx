import { BookOpen, Code, Layers, Rocket } from "lucide-react";
import { RadioGroup } from "@/components/ui/radio-group";
import StepHeader from "../components/StepHeader";
import SelectionCard from "../components/SelectionCard";

interface LearningGoalsStepProps {
  selection: string;
  onSelect: (value: string) => void;
}

export default function LearningGoalsStep({ selection, onSelect }: LearningGoalsStepProps) {
  const expectations = [
    {
      id: "learn-basics",
      name: "Learn the Basics",
      description: "I want to understand fundamental concepts and principles",
      icon: <BookOpen className="h-5 w-5 text-white" />,
    },
    {
      id: "build-projects",
      name: "Build Projects",
      description: "I want to create real-world applications and solutions",
      icon: <Code className="h-5 w-5 text-white" />,
    },
    {
      id: "career-advancement",
      name: "Career Advancement",
      description: "I want to improve my skills for job opportunities",
      icon: <Rocket className="h-5 w-5 text-white" />,
    },
    {
      id: "specific-problems",
      name: "Solve Specific Problems",
      description: "I need help with particular challenges I'm facing",
      icon: <Layers className="h-5 w-5 text-white" />,
    },
  ];

  return (
    <div className="space-y-6">
      <StepHeader 
        title="Your Learning Goals" 
        description="What do you hope to achieve with your AI mentor?" 
      />
      
      <RadioGroup 
        className="grid grid-cols-1 gap-4"
        value={selection}
        onValueChange={onSelect}
      >
        {expectations.map((expectation) => (
          <SelectionCard
            key={expectation.id}
            id={expectation.id}
            name={expectation.name}
            description={expectation.description}
            icon={expectation.icon}
            isSelected={selection === expectation.id}
            layout="horizontal"
          />
        ))}
      </RadioGroup>
    </div>
  );
}