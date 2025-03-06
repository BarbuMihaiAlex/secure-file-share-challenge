
import React from 'react';
import { introContent } from '@/data/challengeData';
import { Button } from '@/components/ui/button';
import { useChallenge } from '@/contexts/ChallengeContext';
import { cn } from '@/lib/utils';
import { LockKeyhole, Server, ArrowRight, Shield } from 'lucide-react';

const ChallengeIntro: React.FC = () => {
  const { setIsIntroCompleted } = useChallenge();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-3xl mx-auto glass-panel rounded-xl p-8 backdrop-blur-lg animate-fade-in">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <Server size={64} className="text-primary" />
            <Shield size={32} className="text-terminal-success absolute -bottom-2 -right-2" />
            <LockKeyhole size={16} className="text-terminal-background absolute top-6 left-6" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-2">{introContent.title}</h1>
        <h2 className="text-xl mb-6 text-muted-foreground">{introContent.subtitle}</h2>
        
        <div className="space-y-4 mb-8 text-left">
          {introContent.description.split('\n\n').map((paragraph, index) => {
            if (paragraph.trim().startsWith('•')) {
              // Convert bullet points to a list
              const items = paragraph.split('•').filter(Boolean);
              return (
                <ul key={index} className="list-disc pl-5 space-y-1">
                  {items.map((item, i) => (
                    <li key={i} className={cn("text-sm", i % 2 === 0 ? "text-terminal-highlight" : "")}>{item.trim()}</li>
                  ))}
                </ul>
              );
            } else if (paragraph.includes(':')) {
              // Handle section headers
              const [header, content] = paragraph.split(':');
              return (
                <div key={index}>
                  <h3 className="font-semibold text-primary">{header}:</h3>
                  <p className="text-sm mt-1">{content.trim()}</p>
                </div>
              );
            } else {
              // Regular paragraph
              return <p key={index} className="text-sm">{paragraph}</p>;
            }
          })}
        </div>
        
        <div className="info-card mb-6">
          <p className="text-sm font-medium">{introContent.flagDescription}</p>
        </div>
        
        <Button 
          size="lg" 
          onClick={() => setIsIntroCompleted(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
        >
          Start Challenge <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChallengeIntro;
