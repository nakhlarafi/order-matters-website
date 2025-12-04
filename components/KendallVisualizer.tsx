import React, { useState, useEffect } from 'react';
import { calculateKendallTau } from '../utils';

interface Method {
  id: number;
  name: string;
  isBug: boolean;
  color: string;
}

const INITIAL_METHODS: Method[] = [
  { id: 0, name: 'methodA (Bug)', isBug: true, color: 'bg-red-500' },
  { id: 1, name: 'methodB', isBug: false, color: 'bg-blue-400' },
  { id: 2, name: 'methodC', isBug: false, color: 'bg-blue-400' },
  { id: 3, name: 'methodD', isBug: false, color: 'bg-blue-400' },
  { id: 4, name: 'methodE', isBug: false, color: 'bg-blue-400' },
];

const KendallVisualizer: React.FC = () => {
  const [items, setItems] = useState<Method[]>(INITIAL_METHODS);
  const [metrics, setMetrics] = useState(calculateKendallTau(INITIAL_METHODS.map(m => m.id)));

  useEffect(() => {
    setMetrics(calculateKendallTau(items.map(m => m.id)));
  }, [items]);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    if (direction === 'up' && index > 0) {
      [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
    } else if (direction === 'down' && index < items.length - 1) {
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    }
    setItems(newItems);
  };

  const resetOrder = (type: 'perfect' | 'worst' | 'random') => {
    let newItems = [...INITIAL_METHODS];
    if (type === 'worst') {
      newItems.reverse();
    } else if (type === 'random') {
      newItems = newItems.sort(() => Math.random() - 0.5);
    }
    setItems(newItems);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold mb-4">Interactive Kendall Tau (τ) Playground</h3>
        <p className="text-slate-600 mb-6">
          The paper uses Kendall Tau distance to measure how "out of order" the input is compared to the 
          ideal execution order (Perfect Order). 
          <br/><br/>
          <strong>Rules:</strong> The "Perfect Order" puts the Bug (Red) first, followed by others in execution order.
          Reorder the list below to see how τ changes.
        </p>

        <div className="flex flex-col md:flex-row gap-8">
          {/* List Controls */}
          <div className="flex-1">
            <div className="flex gap-2 mb-4">
              <button onClick={() => resetOrder('perfect')} className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200">Perfect (τ=1)</button>
              <button onClick={() => resetOrder('random')} className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded hover:bg-slate-200">Random</button>
              <button onClick={() => resetOrder('worst')} className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">Worst (τ=-1)</button>
            </div>

            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={item.name} className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 transition-all">
                  <span className="font-mono text-slate-400 w-6 text-center">{index + 1}</span>
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className={`flex-1 font-medium ${item.isBug ? 'text-red-700' : 'text-slate-700'}`}>
                    {item.name}
                  </span>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:bg-slate-200 rounded disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button 
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === items.length - 1}
                      className="p-1 hover:bg-slate-200 rounded disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metrics Display */}
          <div className="flex-1 bg-slate-900 text-white p-6 rounded-xl flex flex-col justify-center items-center text-center">
            <div className="text-sm text-slate-400 uppercase tracking-wider mb-2">Kendall Tau Distance</div>
            <div className={`text-6xl font-bold mb-2 ${metrics.tau > 0 ? 'text-green-400' : metrics.tau < 0 ? 'text-red-400' : 'text-yellow-400'}`}>
              {metrics.tau}
            </div>
            <div className="grid grid-cols-2 gap-8 mt-6 w-full max-w-[300px]">
              <div>
                <div className="text-2xl font-bold text-green-400">{metrics.concordant}</div>
                <div className="text-xs text-slate-400">Concordant Pairs</div>
                <div className="text-xs text-slate-500 mt-1">(Correct relative order)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">{metrics.discordant}</div>
                <div className="text-xs text-slate-400">Discordant Pairs</div>
                <div className="text-xs text-slate-500 mt-1">(Wrong relative order)</div>
              </div>
            </div>
            
            <div className="mt-8 text-sm text-slate-300 bg-slate-800 p-4 rounded-lg w-full">
              <strong>Interpretation:</strong> <br/>
              A score of 1.0 means the LLM sees the bug first (High Accuracy). <br/>
              A score of -1.0 means the LLM sees the bug last (Low Accuracy).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KendallVisualizer;
