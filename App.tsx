import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ContextGraph } from './components/ContextGraph';
import { ControlPanel } from './components/ControlPanel';
import type { Repository, GraphNode, GraphLink } from './types';
import { summarizeContext } from './services/geminiService';
import { processRepoDataToGraph } from './utils/graphUtils';
import { fetchRepoData, parseGitHubUrl } from './services/githubService';
import { BrainCircuitIcon } from './components/icons';

const App: React.FC = () => {
  const [repoData, setRepoData] = useState<Repository | null>(null);
  const [graphData, setGraphData] = useState<{ nodes: GraphNode[], links: GraphLink[] }>({ nodes: [], links: [] });
  const [summary, setSummary] = useState<string>('');
  const [isSummaryLoading, setIsSummaryLoading] = useState<boolean>(false);
  const [isRepoLoading, setIsRepoLoading] = useState<boolean>(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [repoError, setRepoError] = useState<string | null>(null);
  const [view, setView] = useState<'initial' | 'loading' | 'error' | 'data'>('initial');

  const getSummary = useCallback(async (data: Repository, query?: string) => {
    setIsSummaryLoading(true);
    setSummaryError(null);
    setSummary('');
    try {
      const result = await summarizeContext(data, query);
      setSummary(result);
    } catch (e: any) {
      console.error(e);
      setSummaryError(e.message || 'An unknown error occurred while generating the summary.');
    } finally {
      setIsSummaryLoading(false);
    }
  }, []);

  const handleRepoSelect = useCallback(async (repoUrl: string) => {
    if (!repoUrl) return;

    const parsed = parseGitHubUrl(repoUrl);
    if (!parsed) {
      setRepoError('Invalid GitHub repository URL. Please use the format: https://github.com/owner/repo');
      setView('error');
      return;
    }

    setView('loading');
    setRepoError(null);
    setRepoData(null);
    setGraphData({ nodes: [], links: [] });
    setSummary('');

    try {
      const data = await fetchRepoData(parsed.owner, parsed.repo);
      
      if (data.commits.length === 0 && data.issues.length === 0 && data.pullRequests.length === 0) {
        setRepoError(`Repository '${data.name}' found, but it has no recent commits, issues, or pull requests to analyze.`);
        setView('error');
        setRepoData(null);
        return;
      }
      
      localStorage.setItem('lastRepoUrl', repoUrl);
      setRepoData(data);
      const { nodes, links } = processRepoDataToGraph(data);
      setGraphData({ nodes, links });
      getSummary(data);
      setView('data');
    } catch (error: any) {
      setRepoError(error.message);
      setView('error');
    }
  }, [getSummary]);

  // Effect to load the last viewed repository from local storage on initial app load.
  useEffect(() => {
    const lastRepoUrl = localStorage.getItem('lastRepoUrl');
    if (lastRepoUrl) {
        handleRepoSelect(lastRepoUrl);
    }
  }, [handleRepoSelect]); // handleRepoSelect is memoized and stable, so this effect runs only once on mount.
  
  const handleQuerySubmit = (query: string) => {
    if (repoData) {
      getSummary(repoData, query);
    }
  };

  const renderContent = () => {
    switch(view) {
      case 'loading':
        return <div className="flex-grow flex items-center justify-center"><p className="text-xl text-gray-400">Fetching live repository data...</p></div>;
      case 'error':
        return <div className="flex-grow flex items-center justify-center p-4"><p className="text-xl text-center text-red-400">{repoError}</p></div>;
      case 'data':
        return (
          <main className="flex-grow flex flex-col lg:flex-row p-4 gap-4">
            <div className="lg:w-2/3 h-[50vh] lg:h-auto bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden flex flex-col">
              <h2 className="text-lg font-bold p-3 bg-gray-700/50 border-b border-gray-600">Context Memory Graph</h2>
              <div className="flex-grow relative">
                 <ContextGraph nodes={graphData.nodes} links={graphData.links} />
              </div>
            </div>
            <div className="lg:w-1/3 flex flex-col">
               <ControlPanel 
                  summary={summary}
                  isLoading={isSummaryLoading}
                  error={summaryError}
                  onQuerySubmit={handleQuerySubmit}
               />
            </div>
          </main>
        );
      case 'initial':
      default:
        return (
          <div className="flex-grow flex items-center justify-center p-8 text-center">
              <div className="max-w-2xl">
                  <BrainCircuitIcon className="w-16 h-16 text-cyan-500 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-white mb-4">Welcome to CWM Griller</h2>
                  
                  <div className="text-left bg-gray-800 p-6 rounded-lg border border-gray-700">
                      <h3 className="font-semibold text-lg text-cyan-400 mb-2">The Problem</h3>
                      <p className="text-gray-300 mb-4">
                          Joining a new project or returning to an old one can be overwhelming. It's hard to quickly understand the current status, recent changes, and key priorities from scattered commits, issues, and pull requests.
                      </p>
                      <h3 className="font-semibold text-lg text-cyan-400 mb-2">The Solution</h3>
                      <p className="text-gray-300">
                          CWM Griller is your AI assistant for project context. Paste any public GitHub repository URL to get an instant, AI-powered summary and an interactive graph of recent activity. Understand complex projects in minutes, not hours.
                      </p>
                  </div>
                   <p className="mt-6 text-gray-400">
                      Enter a repository URL above to get started. For example: <br/> <code className="text-cyan-400 text-sm">https://github.com/google/genkit</code>
                  </p>
              </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col">
      <Header 
        repoName={repoData?.name} 
        onRepoSelect={handleRepoSelect}
        isLoading={view === 'loading'}
      />
      {renderContent()}
    </div>
  );
};

export default App;