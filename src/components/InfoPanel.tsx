
import React from 'react';
import { useChallenge } from '@/contexts/ChallengeContext';
import { challengeSteps } from '@/data/challengeData';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';

const InfoPanel: React.FC = () => {
  const { currentStep } = useChallenge();

  // Find the current step data
  const currentStepGroup = challengeSteps.find(group => group.id === Math.floor(currentStep));
  const stepData = currentStepGroup?.steps.find(step => step.id === currentStep);

  if (!stepData) return null;

  return (
    <div className="info-panel glass-panel rounded-lg p-6 animate-fade-in">
      <div className="flex items-center mb-3">
        <Info className="mr-2 h-5 w-5 text-terminal-highlight" />
        <h3 className="font-bold text-terminal-highlight">{stepData.infoPanel.title}</h3>
      </div>
      
      <div className="text-sm whitespace-pre-line">
        {stepData.infoPanel.content}
      </div>
      
      {stepData.hint && (
        <div className="mt-4 pt-4 border-t border-terminal-muted/20">
          <h4 className="font-medium text-sm mb-1">Indiciu:</h4>
          <p className="text-sm text-terminal-muted">{stepData.hint}</p>
        </div>
      )}
      
      {stepData.command && (
        <div className="mt-4 code-block text-xs">
          $ {stepData.command}
        </div>
      )}
    </div>
  );
};

export default InfoPanel;
