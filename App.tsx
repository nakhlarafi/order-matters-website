
import React, { useState } from 'react';
import { Tab } from './types';
import Overview from './components/Overview';
import ChatInterface from './components/ChatInterface';
import RQ1Tab from './components/tabs/RQ1Tab';
import RQ2Tab from './components/tabs/RQ2Tab';
import RQ3Tab from './components/tabs/RQ3Tab';
import RQ4Tab from './components/tabs/RQ4Tab';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.OVERVIEW);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.OVERVIEW: return <Overview />;
      case Tab.RQ1: return <RQ1Tab />;
      case Tab.RQ2: return <RQ2Tab />;
      case Tab.RQ3: return <RQ3Tab />;
      case Tab.RQ4: return <RQ4Tab />;
      case Tab.CHAT: return <ChatInterface />;
      default: return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
             <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  LLM Context Engineering <span className="font-light text-slate-400">|</span> <span className="text-primary">Research Viz</span>
                </h1>
                <p className="text-slate-500 mt-2 text-sm font-medium max-w-2xl">
                  Interactive analysis of "Order Matters!": Optimizing RAG pipelines and Fault Localization through input ordering strategies.
                </p>
             </div>
             <div className="text-right hidden md:block">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Source Paper</div>
                <div className="text-sm font-medium text-slate-700">ICSE '26 • Rafi et al.</div>
                <div className="text-xs text-primary hover:underline cursor-pointer">arXiv:2412.18750v4</div>
             </div>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="max-w-6xl mx-auto px-4 mt-6 flex overflow-x-auto gap-1 no-scrollbar">
          {Object.values(Tab).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                activeTab === tab
                  ? 'border-primary text-primary bg-blue-50/50'
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
