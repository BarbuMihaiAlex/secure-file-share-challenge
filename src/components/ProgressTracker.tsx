
import React from 'react';
import { useChallenge } from '@/contexts/ChallengeContext';
import { challengeSteps } from '@/data/challengeData';
import { cn } from '@/lib/utils';
import { Check, LockKeyhole } from 'lucide-react';

const ProgressTracker: React.FC = () => {
  const { currentStepGroup, currentStep, completedSteps } = useChallenge();
  
  return (
    <div className="progress-tracker w-full">
      {challengeSteps.map((stepGroup) => (
        <div key={stepGroup.id} className="mb-8">
          <div className="flex items-center mb-3">
            <div 
              className={cn(
                "progress-marker mr-3",
                completedSteps.includes(stepGroup.steps[stepGroup.steps.length - 1].id) && "completed",
                Math.floor(currentStep) === stepGroup.id && "active"
              )}
            >
              {completedSteps.includes(stepGroup.steps[stepGroup.steps.length - 1].id) ? (
                <Check className="h-4 w-4" />
              ) : (
                stepGroup.id
              )}
            </div>
            <h3 className={cn(
              "font-semibold",
              Math.floor(currentStep) === stepGroup.id && "text-primary"
            )}>
              {stepGroup.title}
            </h3>
          </div>
          
          <div className="ml-4 pl-4 border-l border-terminal-muted">
            {stepGroup.steps.map((step) => {
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = currentStep === step.id;
              const isAvailable = 
                stepGroup.id < Math.floor(currentStep) || 
                (stepGroup.id === Math.floor(currentStep) && 
                 stepGroup.steps.findIndex(s => s.id === step.id) <= 
                 stepGroup.steps.findIndex(s => s.id === currentStep));
              
              return (
                <div 
                  key={step.id} 
                  className={cn(
                    "flex items-start py-1.5",
                    isCurrent && "bg-terminal-background/10 -mx-2 px-2 rounded-md"
                  )}
                >
                  <div className="flex items-center justify-center w-5 h-5 mt-0.5 mr-3">
                    {isCompleted ? (
                      <Check className="h-4 w-4 text-terminal-success" />
                    ) : isAvailable ? (
                      <div className="w-2 h-2 rounded-full bg-terminal-muted"></div>
                    ) : (
                      <LockKeyhole className="h-4 w-4 text-terminal-muted/50" />
                    )}
                  </div>
                  <div className={cn(
                    "text-sm",
                    !isAvailable && "text-terminal-muted/50",
                    isCurrent && "text-primary font-medium"
                  )}>
                    {step.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressTracker;
