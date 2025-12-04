import React, { useState } from 'react';
import { Tab } from './types';
import Overview from './components/Overview';
import KendallVisualizer from './components/KendallVisualizer';
import ResultsCharts from './components/ResultsCharts';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.OVERVIEW);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.OVERVIEW: return <Overview />;
      case Tab.VISUALIZER: return <KendallVisualizer />;
      case Tab.RESULTS: return <ResultsCharts />;
      case Tab.CHAT: return <ChatInterface />;
      default: return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Order Matters! <span className="font-light text-slate-400">|</span> <span className="text-primary">Research Viz</span>
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">
            An Empirical Study on Large Language Models’ Input Order Bias in Software Fault Localization
          </p>
          <div className="text-xs text-slate-400 mt-1">
            ICSE '26 • Rafi, Kim, Chen, Wang • <a href="#" className="hover:text-primary underline">arXiv:2412.18750v4</a>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="max-w-6xl mx-auto px-4 mt-4 flex overflow-x-auto gap-1 no-scrollbar">
          {Object.values(Tab).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
