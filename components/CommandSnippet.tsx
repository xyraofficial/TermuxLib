
import React, { useState } from 'react';
import { CopyIcon } from './Icons';

interface CommandSnippetProps {
  command: string;
}

const CommandSnippet: React.FC<CommandSnippetProps> = ({ command }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group flex items-center bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden my-2 w-full max-w-full">
      <div className="flex-1 overflow-x-auto no-scrollbar px-3 py-2.5 md:px-4 md:py-3">
        <code className="mono text-emerald-400 text-xs md:text-sm whitespace-nowrap">
          <span className="text-zinc-500 mr-2">$</span>
          {command}
        </code>
      </div>
      <button
        onClick={handleCopy}
        className={`shrink-0 px-3 py-2.5 md:px-4 md:py-3 border-l border-zinc-800 transition-colors flex items-center justify-center hover:bg-zinc-900 ${copied ? 'text-emerald-500' : 'text-zinc-400'}`}
        title="Copy to clipboard"
      >
        {copied ? (
          <span className="text-[10px] md:text-xs font-semibold">Done!</span>
        ) : (
          <CopyIcon />
        )}
      </button>
    </div>
  );
};

export default CommandSnippet;
