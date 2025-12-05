
import React, { useState } from 'react';
import { segmentationData } from '../../data';

const RQ2Tab: React.FC = () => {
  // Visualizer State
  const [segmentSize, setSegmentSize] = useState<number>(10);
  const totalItems = 20;
  const items = Array.from({ length: totalItems }, (_, i) => i + 1);
  
  // Calculate segments based on size
  const segments = [];
  for (let i = 0; i < totalItems; i += segmentSize) {
    segments.push(items.slice(i, i + segmentSize));
  }

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Section 1: Visualizer */}
      <section>
        <div className="flex items-center gap-3 mb-6">
           <span className="bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 rounded-full">Step 1: The Setup</span>
           <h2 className="text-2xl font-bold text-slate-900">Simulating Context Segmentation</h2>
        </div>
        <p className="text-slate-600 mb-6 text-lg max-w-4xl">
           To mitigate order bias, the authors proposed splitting the input method list into smaller "segments". 
           The LLM processes each segment independently. Adjust the slider to see how the context window changes.
        </p>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <div className="mb-8">
             <label className="block text-sm font-medium text-slate-700 mb-2">
                Segment Size: <span className="font-bold text-primary text-lg">{segmentSize}</span> items per prompt
             </label>
             <input 
               type="range" 
               min="2" 
               max="20" 
               step="1"
               value={segmentSize} 
               onChange={(e) => setSegmentSize(Number(e.target.value))}
               className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
             />
             <div className="flex justify-between text-xs text-slate-400 mt-1">
               <span>Granular (More Prompts)</span>
               <span>All-in-One (One Prompt)</span>
             </div>
           </div>

           <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Visual Representation of LLM Inputs</h4>
              <div className="flex flex-wrap gap-4">
                {segments.map((seg, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-300 rounded-lg p-3 min-w-[120px] flex-1">
                     <div className="text-xs font-bold text-slate-400 mb-2 uppercase">Prompt #{idx + 1}</div>
                     <div className="flex flex-wrap gap-1">
                        {seg.map(item => (
                           <div key={item} className={`w-8 h-8 flex items-center justify-center text-sm font-mono rounded ${item === 5 ? 'bg-red-500 text-white font-bold' : 'bg-white border border-slate-200 text-slate-600'}`}>
                             {item === 5 ? 'Bug' : item}
                           </div>
                        ))}
                     </div>
                  </div>
                ))}
              </div>
           </div>
           <p className="mt-4 text-sm text-slate-500 italic">
             * Item "Bug" is the faulty method. In smaller segments, it is isolated from distractor methods.
           </p>
        </div>
      </section>

      {/* Section 2: Results */}
      <section className="pt-8 border-t border-slate-200">
        <div className="flex items-center gap-3 mb-6">
           <span className="bg-indigo-100 text-indigo-800 text-sm font-bold px-3 py-1 rounded-full">Step 2: The Results</span>
           <h2 className="text-2xl font-bold text-slate-900">Smaller Segments = Less Bias</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 w-full">
              <div className="h-[300px] flex items-end justify-between border-b border-l border-slate-200 pb-2 pl-2">
                {segmentationData.map((d) => (
                    <div key={d.segmentSize} className="flex-1 px-1 md:px-4 flex gap-1 h-full items-end justify-center group relative">
                    {/* Perfect Bar */}
                    <div 
                        className="w-full bg-green-500 rounded-t-sm transition-all relative group-hover:opacity-90"
                        style={{ height: `${(d.perfectOrderTop1 / 60) * 100}%` }}
                    >
                        <span className="absolute -top-5 w-full text-center text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100">{d.perfectOrderTop1}%</span>
                    </div>
                    {/* Worst Bar */}
                    <div 
                        className="w-full bg-red-500 rounded-t-sm transition-all relative group-hover:opacity-90"
                        style={{ height: `${(d.worstOrderTop1 / 60) * 100}%` }}
                    >
                        <span className="absolute -top-5 w-full text-center text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100">{d.worstOrderTop1}%</span>
                    </div>
                    </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-slate-500 pt-3 font-medium px-2">
                {segmentationData.map(d => (
                    <span key={d.segmentSize}>Size {d.segmentSize}</span>
                ))}
              </div>
              <div className="text-center mt-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Segment Size Config</div>
            </div>

            <div className="md:w-64 flex flex-col gap-4">
               <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-2">Key Finding</h4>
                  <p className="text-sm text-slate-600">
                    At <strong>Segment Size 50</strong>, there is a huge gap (22%) between Perfect and Worst ordering.
                  </p>
                  <div className="my-2 border-t border-slate-200"></div>
                  <p className="text-sm text-slate-600">
                    At <strong>Segment Size 10</strong>, the gap vanishes (1%). The model performs consistently regardless of order.
                  </p>
               </div>
               
               <div className="flex flex-col gap-2 text-sm">
                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-sm"></div> <span>Perfect Order</span></div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-sm"></div> <span>Worst Order</span></div>
               </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default RQ2Tab;
