
import React from 'react';
import { ChallengeProvider } from '@/contexts/ChallengeContext';
import { useChallenge } from '@/contexts/ChallengeContext';
import ChallengeIntro from '@/components/ChallengeIntro';
import Terminal from '@/components/Terminal';
import ProgressTracker from '@/components/ProgressTracker';
import InfoPanel from '@/components/InfoPanel';
import { cn } from '@/lib/utils';
import { challengeSteps } from '@/data/challengeData';
import { Button } from '@/components/ui/button';
import { RefreshCw, Info, Server, Trophy } from 'lucide-react';

const ChallengePage: React.FC = () => {
  const { isIntroCompleted, isCompleted, currentStep, resetChallenge } = useChallenge();

  if (!isIntroCompleted) {
    return <ChallengeIntro />;
  }

  // Find current step data
  const currentStepGroup = challengeSteps.find(group => group.id === Math.floor(currentStep));
  const stepData = currentStepGroup?.steps.find(step => step.id === currentStep);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-background/80 z-[-1]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0aDEydjFIMzZ6TTM2IDMxaDEydjFIMzZ6TTM1IDI4aDEzdjFIMzV6TTM1IDI1aDEzdjFIMzV6TTM1IDIyaDEzdjFIMzV6TTM1IDE5aDEzdjFIMzV6Ii8+PHBhdGggZD0iTTU0LjU2IDQ2aC0xNy4wN2MtMS4zIDAtLjktLjUtLjM3LS41czEuMy0uNiAyLjE1LTEuNjJjLjg1LTEuMDMgNi42My00LjkyIDYuNjMtNC45MmwzLjk2LTEuNiA2LjA4LTEuOTdjLjYtLjYgMS4zLTMuNyAxLjMtNS4yN3MtMS40LTIuMTgtMy0yLjE4aC0yLjE2cS0uNDIgMC0uNDItLjNjMC0uMi0uMzctLjU0IDAtLjgzLjQtLjMgMS43Ni0xLjQ1IDIuNDUtMS40NXMzLjgzLTEuMSA0Ljc0LTEuMWMuOSAwIDIuMjMuOTYgMi4yMyAxLjUgMCAuNTUtLjQgMS4zNS0uNCAxLjk0di43M2MwIC4zMi40LjQuOC40aDIuMzJjMC0uMjUuOC0uMSAxLjA0IDAgLjI0LjA4IDAgLjQzIDAgLjQzIDAgLjQ2IDEuMiAxLjEyIDEuMiAxLjZWNDJjMCAuNS0uNTggNC0xIDRoLTguNDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Server className="h-6 w-6 mr-2 text-primary" />
            <h1 className="text-2xl font-bold">Provocare de Configurare Server SFTP</h1>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetChallenge}
            className="flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Resetează Provocarea
          </Button>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left sidebar - Progress tracker */}
          <div className="lg:col-span-3">
            <div className="glass-panel rounded-lg p-4 shadow-md">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Info className="h-5 w-5 mr-2 text-primary" />
                Progresul Provocării
              </h2>
              <ProgressTracker />
            </div>
          </div>
          
          {/* Main content - Terminal */}
          <div className="lg:col-span-6">
            {isCompleted ? (
              <div className="glass-panel rounded-lg p-8 text-center h-full flex flex-col items-center justify-center">
                <Trophy className="h-16 w-16 text-terminal-success mb-4" />
                <h2 className="text-2xl font-bold mb-4">Provocare Completă!</h2>
                <p className="text-lg mb-6">Felicitări! Ați configurat cu succes un server SFTP securizat.</p>
                <div className="code-block text-lg mb-8 px-6 py-4">
                  FLAG{'{secure_sftp_configured}'}
                </div>
                <Button onClick={resetChallenge}>
                  Încearcă din nou
                </Button>
              </div>
            ) : (
              <div className="glass-panel rounded-lg overflow-hidden shadow-md h-[600px]">
                <Terminal />
              </div>
            )}
          </div>
          
          {/* Right sidebar - Info panel */}
          <div className="lg:col-span-3">
            <div className="glass-panel rounded-lg overflow-hidden shadow-md">
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">
                  {currentStepGroup ? currentStepGroup.title : 'Instrucțiuni'}
                </h2>
                
                {stepData && (
                  <div className="animate-slide-up">
                    <p className="text-sm mb-4">{stepData.description}</p>
                    
                    <InfoPanel />
                    
                    {stepData.explanation && (
                      <div className="mt-4 text-sm text-muted-foreground">
                        <h3 className="font-medium mb-1">Explicație:</h3>
                        <p>{stepData.explanation}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <ChallengeProvider>
      <ChallengePage />
    </ChallengeProvider>
  );
};

export default Index;
