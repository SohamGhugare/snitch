"use client";

interface Step {
  label: string;
  done: boolean;
  active: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
}

export default function StepIndicator({ steps }: StepIndicatorProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto space-y-4">
      {steps.map((step, idx) => (
        <div 
          key={idx} 
          className={`
            w-full flex items-center justify-center p-4 
            border ${step.done ? 'border-[#00ff9d]' : step.active ? 'border-white' : 'border-gray-700'}
            rounded-lg backdrop-blur-sm
            transition-all duration-300 ease-in-out
            ${step.active ? 'bg-black/30' : 'bg-black/10'}
          `}
        >
          <div className="flex items-center w-full">
            {/* Status indicator */}
            <div className="relative flex-shrink-0">
              {step.active ? (
                // Spinning animation for active step
                <div className="w-6 h-6 relative">
                  <div className="w-6 h-6 border-2 border-t-white border-r-white border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                // Circle indicator for done/pending
                <div 
                  className={`
                    w-6 h-6 rounded-full 
                    transition-colors duration-300
                    flex items-center justify-center
                    ${step.done ? 'bg-[#00ff9d]' : 'bg-gray-700'}
                  `}
                >
                  {step.done && (
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </div>
              )}
            </div>

            {/* Step label */}
            <span 
              className={`
                ml-4 font-mono text-lg
                transition-colors duration-300
                ${step.done ? 'text-[#00ff9d]' : step.active ? 'text-white' : 'text-gray-500'}
              `}
            >
              {step.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
} 