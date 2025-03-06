
import React, { useEffect, useRef } from 'react';
import TerminalInput from './TerminalInput';
import TerminalOutput from './TerminalOutput';
import { useChallenge } from '@/contexts/ChallengeContext';
import { cn } from '@/lib/utils';

const Terminal: React.FC = () => {
  const { terminalHistory, executeCommand } = useChallenge();
  const terminalBodyRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when terminal history updates
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  return (
    <div className="terminal-window w-full h-full flex flex-col rounded-md overflow-hidden shadow-lg">
      <div className="terminal-header">
        <div className="terminal-button terminal-button-close"></div>
        <div className="terminal-button terminal-button-minimize"></div>
        <div className="terminal-button terminal-button-maximize"></div>
        <div className="terminal-title font-mono">ubuntu@sftp-challenge:~</div>
      </div>
      
      <div 
        ref={terminalBodyRef} 
        className="terminal-body flex-grow font-mono text-sm overflow-y-auto"
      >
        <div className={cn("pb-2", terminalHistory.length === 0 && "typing-effect")}>
          Welcome to Ubuntu 20.04.3 LTS (GNU/Linux 5.4.0-86-generic x86_64)
          <br />
          <br />
          * Documentation:  https://help.ubuntu.com
          <br />
          * Management:     https://landscape.canonical.com
          <br />
          * Support:        https://ubuntu.com/advantage
          <br />
          <br />
          SFTP Server Challenge - Configure secure file sharing
          <br />
          Follow the instructions to complete each step of the challenge.
          <br />
          <br />
        </div>
        
        {terminalHistory.map((entry, index) => (
          <div key={index} className="mb-2">
            {entry.type === 'input' ? (
              <div className="flex">
                <span className="text-terminal-prompt mr-2">ubuntu@sftp-challenge:~$</span>
                <span className="text-terminal-command">{entry.content}</span>
              </div>
            ) : (
              <TerminalOutput content={entry.content} type={entry.type} />
            )}
          </div>
        ))}
        
        <TerminalInput onSubmit={executeCommand} />
      </div>
    </div>
  );
};

export default Terminal;
