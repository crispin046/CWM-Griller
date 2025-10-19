import React, { useState } from 'react';
import { SparklesIcon } from './icons';
import ReactMarkdown from 'react-markdown';

interface ControlPanelProps {
  summary: string;
  isLoading: boolean;
  error: string | null;
  onQuerySubmit: (query: string) => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center space-x-2">
        <div className="w-4 h-4 rounded-full animate-pulse bg-cyan-400"></div>
        <div className="w-4 h-4 rounded-full animate-pulse bg-cyan-400 delay-200"></div>
        <div className="w-4 h-4 rounded-full animate-pulse bg-cyan-400 delay-400"></div>
        <span className="text-gray-400">Grilling context...</span>
    </div>
);

const InitialState: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-4">
        <SparklesIcon className="w-12 h-12 mb-4" />
        <p className="font-semibold">AI Summary will appear here.</p>
        <p className="text-sm">Load a repository to get an instant analysis of recent activity.</p>
    </div>
);

export const ControlPanel: React.FC<ControlPanelProps> = ({ summary, isLoading, error, onQuerySubmit }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onQuerySubmit(query);
      setQuery('');
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
            <LoadingSpinner />
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-red-400 bg-red-900/50 p-4 rounded-md m-4 border border-red-700">
          <p className="font-bold text-red-300">An error occurred</p>
          <p className="text-sm">{error}</p>
        </div>
      );
    }
    if (!summary) {
        return <InitialState />;
    }
    return <ReactMarkdown className="p-4">{summary}</ReactMarkdown>;
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-bold">AI Assistant</h2>
        <p className="text-sm text-gray-400">Ask about your project context.</p>
      </div>
      
      <div className="flex-grow overflow-y-auto prose prose-invert prose-sm max-w-none 
          prose-p:text-gray-300 
          prose-headings:text-cyan-400 
          prose-strong:text-white 
          prose-ul:list-disc prose-ul:pl-6 
          prose-a:text-blue-400 hover:prose-a:text-blue-300">
        {renderContent()}
      </div>

      <div className="p-4 border-t border-gray-700 bg-gray-800/50">
        <form onSubmit={handleSubmit}>
          <label htmlFor="query" className="sr-only">Ask a question</label>
          <div className="flex gap-2">
            <input
              id="query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., What was dev-one working on?"
              className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              disabled={isLoading || !summary}
            />
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md flex items-center gap-2 transition-colors"
              disabled={isLoading || !query.trim() || !summary}
            >
              <SparklesIcon className="w-5 h-5" />
              <span>Ask</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};