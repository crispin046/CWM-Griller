import React, { useState } from 'react';
import { BrainCircuitIcon } from './icons';

interface HeaderProps {
  repoName?: string;
  onRepoSelect: (repoName: string) => void;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({ repoName, onRepoSelect, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRepoSelect(inputValue);
  };

  return (
    <header className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-800 border-b border-gray-700 shadow-md gap-4">
      <div className="flex items-center gap-3">
        <BrainCircuitIcon className="w-8 h-8 text-cyan-400" />
        <div>
            <h1 className="text-2xl font-bold text-white">CWM Griller</h1>
            <p className="text-sm text-gray-400">Contextual Workflow Memory</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Paste a public GitHub repository URL..."
            className="flex-grow sm:w-72 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-colors"
            disabled={isLoading || !inputValue.trim()}
          >
            {isLoading ? 'Grilling...' : 'Grill'}
          </button>
        </form>
        <div className="text-center sm:text-right border-t sm:border-t-0 sm:border-l border-gray-700 pt-2 sm:pt-0 sm:pl-4 mt-2 sm:mt-0 w-full sm:w-auto">
          <span className="text-sm text-gray-500">Current Repository</span>
          <p className="font-mono text-cyan-400 h-6 truncate max-w-[200px] sm:max-w-xs" title={repoName}>{repoName || 'N/A'}</p>
        </div>
      </div>
    </header>
  );
};