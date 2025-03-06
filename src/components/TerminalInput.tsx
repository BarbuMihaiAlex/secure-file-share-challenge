
import React, { useState, useRef, useEffect } from 'react';
import { useChallenge } from '@/contexts/ChallengeContext';
import { cn } from '@/lib/utils';

interface TerminalInputProps {
  onSubmit: (command: string) => void;
}

const TerminalInput: React.FC<TerminalInputProps> = ({ onSubmit }) => {
  const [command, setCommand] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { currentStep } = useChallenge();
  
  // Focus input on mount and when currentStep changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentStep]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      onSubmit(command.trim());
      setCommand('');
    }
  };

  // When clicking anywhere on the terminal wrapper, focus the input
  const handleWrapperClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div 
      className="flex items-center w-full"
      onClick={handleWrapperClick}
    >
      <div className="text-terminal-prompt mr-2">ubuntu@sftp-challenge:~$</div>
      <form className="w-full" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          className={cn(
            "w-full bg-transparent border-none outline-none text-terminal-command",
            "focus:ring-0 focus:outline-none"
          )}
          autoFocus
          autoComplete="off"
          spellCheck="false"
        />
      </form>
    </div>
  );
};

export default TerminalInput;
