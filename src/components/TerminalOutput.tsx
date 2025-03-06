
import React from 'react';
import { cn } from '@/lib/utils';

interface TerminalOutputProps {
  content: string;
  type: 'output' | 'error' | 'success';
}

const TerminalOutput: React.FC<TerminalOutputProps> = ({ content, type }) => {
  return (
    <div
      className={cn(
        "whitespace-pre-wrap break-words",
        type === 'error' && "text-terminal-error",
        type === 'success' && "text-terminal-success"
      )}
    >
      {content}
    </div>
  );
};

export default TerminalOutput;
