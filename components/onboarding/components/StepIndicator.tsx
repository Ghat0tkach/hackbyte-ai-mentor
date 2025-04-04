interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-2">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((i) => (
          <div key={i} className="flex items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= i ? "bg-gradient-to-r from-violet-600 to-fuchsia-600" : "bg-zinc-800"
              }`}
            >
              <span className="text-white text-sm">{i}</span>
            </div>
            {i < totalSteps && (
              <div 
                className={`w-12 h-1 ${
                  currentStep > i ? "bg-gradient-to-r from-violet-600 to-fuchsia-600" : "bg-zinc-800"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}