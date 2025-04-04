import { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Check } from "lucide-react";

interface SelectionCardProps {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  isSelected: boolean;
  layout?: "vertical" | "horizontal";
}

export default function SelectionCard({ 
  id, 
  name, 
  description, 
  icon, 
  isSelected,
  layout = "vertical" 
}: SelectionCardProps) {
  const isVertical = layout === "vertical";
  
  return (
    <div className="relative">
      <RadioGroupItem 
        value={id} 
        id={id} 
        className="peer sr-only" 
      />
      <Label 
        htmlFor={id}
        className={`flex ${isVertical ? "flex-col items-center" : "items-center gap-4"} 
          ${isVertical ? "gap-2" : ""} rounded-lg border border-zinc-800 bg-zinc-900 p-4 
          hover:bg-zinc-800/50 hover:border-zinc-700 
          peer-data-[state=checked]:border-violet-500 
          peer-data-[state=checked]:bg-violet-500/10 
          transition-all cursor-pointer relative
          ${isVertical ? "h-full" : ""}`}
      >
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
            <Check className="h-3 w-3 text-white" />
          </div>
        )}
        
        <div className={`${isVertical ? "w-12 h-12" : "w-10 h-10"} 
          rounded-full 
          ${isSelected 
            ? "bg-gradient-to-br from-violet-500 to-fuchsia-500 ring-2 ring-violet-400 ring-offset-2 ring-offset-zinc-900" 
            : "bg-gradient-to-br from-violet-600/80 to-fuchsia-600/80"} 
          flex items-center justify-center flex-shrink-0 transition-all duration-200`}
        >
          {icon}
        </div>
        <div className={isVertical ? "text-center" : ""}>
          <div className={`font-medium ${isSelected ? "text-white" : "text-zinc-300"}`}>{name}</div>
          <div className={`text-sm ${isSelected ? "text-zinc-300" : "text-zinc-400"} ${isVertical ? "text-center" : ""}`}>
            {description}
          </div>
        </div>
      </Label>
    </div>
  );
}