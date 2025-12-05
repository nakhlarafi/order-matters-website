
import React, { useState } from 'react';
import { strategyData } from '../../data';

const RQ4Tab: React.FC = () => {
  // Simulator State
  type SortMethod = 'unsorted' | 'loc' | 'callgraph' | 'depgraph';
  const [sortMethod, setSortMethod] = useState<SortMethod>('unsorted');

  const methods = [
    { name: 'authMiddleware (Bug)', loc: 25, dist: 1, depScore: 0.95, isBug: true },
    { name: 'inputValidator', loc: 120, dist: 2, depScore: 0.60, isBug: false },
    { name: 'userProfile', loc: 450, dist: 4, depScore: 0.15, isBug: false },
    { name: 'dbConnection', loc: 300, dist: 3, depScore: 0.30, isBug: false },
  ];

  const sortedMethods = [...methods].sort((a, b) => {
      if (sortMethod === 'loc') return b.loc - a.loc; // Longest first
      if (sortMethod === 'callgraph') return a.dist - b.dist; // Closest first
      if (sortMethod === 'depgraph') return b.depScore - a.depScore; // Highest score first
      return 0; // Unsorted
  });

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Section 1: Visualizer */}
      <section>
        <div className="flex items-center gap-3 mb-6">
           <span className="bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 rounded-full">Step 1: The Setup</span>
           <h2 className="text-2xl font-bold text-slate-900">Comparing Ranking Strategies</h2>
        </div>
        <p className="text-slate-600 mb-6 text-lg max-w-4xl">
           Since input order matters (RQ1), we need a strategy to put the most likely buggy methods at the top. 
           Compare how different algorithms rank the list below.
           <br/>
           <span className="text-sm italic text-slate-500">Goal: Get the red "Bug" method to position #1.</span>
        </p>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-8">
            <div className="w-48 flex flex-col gap-2">
               <span className="text-xs font-bold text-slate-400 uppercase mb-2">Apply Strategy</span>
               <button onClick={() => setSortMethod('loc')} className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${sortMethod === 'loc' ? 'bg-primary text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
                  Lines of Code (LOC)
                  <span className="block text-[10px] opacity-70 font-normal">Rank by complexity</span>
               </button>
               <button onClick={() => setSortMethod('callgraph')} className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${sortMethod === 'callgraph' ? 'bg-primary text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
                  Call Graph (BFS)
                  <span className="block text-[10px] opacity-70 font-normal">Rank by proximity to failure</span>
               </button>
               <button onClick={() => setSortMethod('depgraph')} className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${sortMethod === 'depgraph' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
                  DepGraph (AI)
                  <span className="block text-[10px] opacity-70 font-normal">Rank by learned dependency</span>
               </button>
               <button onClick={() => setSortMethod('unsorted')} className="mt-4 text-xs text-slate-400 hover:text-slate-600 underline">
                  Reset List
               </button>
            </div>

            <div className="flex-1 bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="grid grid-cols-12 gap-2 text-xs font-bold text-slate-400 uppercase mb-3 px-3">
                   <div className="col-span-1">Rank</div>
                   <div className="col-span-5">Method Name</div>
                   <div className="col-span-2 text-right">LOC</div>
                   <div className="col-span-2 text-right">Distance</div>
                   <div className="col-span-2 text-right">Score</div>
                </div>
                <div className="space-y-2">
                    {sortedMethods.map((m, idx) => (
                        <div key={m.name} className={`grid grid-cols-12 gap-2 items-center p-3 rounded border transition-all duration-500 ${m.isBug ? 'bg-red-50 border-red-200 shadow-sm z-10' : 'bg-white border-slate-200'}`}>
                           <div className="col-span-1 font-mono text-slate-400">#{idx + 1}</div>
                           <div className={`col-span-5 font-bold ${m.isBug ? 'text-red-700' : 'text-slate-700'}`}>{m.name}</div>
                           <div className="col-span-2 text-right text-slate-600 text-sm">{m.loc}</div>
                           <div className="col-span-2 text-right text-slate-600 text-sm">{m.dist}</div>
                           <div className="col-span-2 text-right font-mono text-xs">{m.depScore.toFixed(2)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* Section 2: Results */}
      <section className="pt-8 border-t border-slate-200">
        <div className="flex items-center gap-3 mb-6">
           <span className="bg-indigo-100 text-indigo-800 text-sm font-bold px-3 py-1 rounded-full">Step 2: The Results</span>
           <h2 className="text-2xl font-bold text-slate-900">Which Strategy Wins?</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <p className="text-slate-600 mb-6">
             The chart below compares the real-world Top-1 Accuracy of these strategies on the Defects4J benchmark.
           </p>
           
           <div className="space-y-5">
            {strategyData.sort((a,b) => b.top1 - a.top1).map((d) => (
                <div key={d.technique} className="relative group">
                <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-slate-700 flex items-center gap-2">
                    {d.technique} 
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        d.category === 'Learning-based' ? 'bg-indigo-100 text-indigo-700' : 
                        d.category === 'Structure-based' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                        {d.category}
                    </span>
                    </span>
                    <span className="font-bold text-slate-900">{d.top1}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div 
                    className={`h-3 rounded-full transition-all duration-500 ${d.technique.includes('DepGraph') ? 'bg-indigo-600' : 'bg-slate-400 group-hover:bg-slate-500'}`}
                    style={{ width: `${d.top1}%` }}
                    ></div>
                </div>
                </div>
            ))}
           </div>
        </div>
      </section>
    </div>
  );
};

export default RQ4Tab;
