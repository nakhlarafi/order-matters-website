
import React, { useState } from 'react';
import KendallVisualizer from '../KendallVisualizer';
import { orderBiasData } from '../../data';

const RQ1Tab: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Chart Dimensions
  const chartHeight = 350;
  const chartWidth = 800;
  const padding = { top: 40, right: 120, bottom: 60, left: 60 };
  const graphWidth = chartWidth - padding.left - padding.right;
  const graphHeight = chartHeight - padding.top - padding.bottom;
  
  // Scales
  const getX = (index: number) => padding.left + (index * (graphWidth / (orderBiasData.length - 1)));
  const getY = (value: number) => padding.top + graphHeight - ((value / 100) * graphHeight);
  
  // Interaction hit area width (full span between points)
  const hitAreaWidth = graphWidth / (orderBiasData.length - 1);

  const series = [
    { key: 'top10', color: '#8b5cf6', label: 'Top-10 Accuracy' },
    { key: 'top5', color: '#f59e0b', label: 'Top-5 Accuracy' },
    { key: 'top3', color: '#10b981', label: 'Top-3 Accuracy' },
    { key: 'top1', color: '#2563eb', label: 'Top-1 Accuracy' },
  ] as const;

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Section 1: Experimental Setup Visualization */}
      <section>
        <div className="flex items-center gap-3 mb-6">
           <span className="bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 rounded-full">Step 1: The Setup</span>
           <h2 className="text-2xl font-bold text-slate-900">Understanding "Input Order Bias"</h2>
        </div>
        <p className="text-slate-600 mb-6 text-lg max-w-4xl">
           The core hypothesis is that <strong>LLMs pay more attention to the beginning of the prompt</strong>. 
           To test this, the researchers permuted the list of code methods fed into the LLM. 
           Use the simulator below to understand how they measured "Order Disorder" using Kendall Tau (τ).
        </p>
        
        <KendallVisualizer />
      </section>

      {/* Section 2: Results */}
      <section className="pt-8 border-t border-slate-200">
        <div className="flex items-center gap-3 mb-6">
           <span className="bg-indigo-100 text-indigo-800 text-sm font-bold px-3 py-1 rounded-full">Step 2: The Results</span>
           <h2 className="text-2xl font-bold text-slate-900">Impact of Ordering on Accuracy</h2>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Performance Degradation Curve</h3>
              <p className="text-slate-500 text-sm mt-1 max-w-lg">
                As the "Buggy Method" moves further down the list (lower Kendall Tau), the model's ability to find it crashes. Hover over the chart points for exact numbers.
              </p>
            </div>
          </div>
          
          <div className="w-full flex flex-col items-center">
              <div className="w-full max-w-[800px] relative">
                  <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto font-sans select-none drop-shadow-sm">
                    {/* Background Grid */}
                    <rect x={padding.left} y={padding.top} width={graphWidth} height={graphHeight} fill="#f8fafc" opacity="0.5" />

                    {/* Y Axis Grid Lines */}
                    {[0, 20, 40, 60, 80, 100].map(tick => {
                      const y = getY(tick);
                      return (
                        <g key={tick}>
                          <line x1={padding.left} y1={y} x2={chartWidth - padding.right} stroke="#e2e8f0" strokeWidth="1" />
                          <text x={padding.left - 12} y={y + 4} textAnchor="end" fontSize="11" fill="#64748b" fontWeight="500">{tick}%</text>
                        </g>
                      );
                    })}

                    {/* X Axis Labels */}
                    {orderBiasData.map((d, i) => {
                      const x = getX(i);
                      return (
                        <g key={i}>
                          <text x={x} y={chartHeight - 35} textAnchor="middle" fontSize="11" fill="#334155" fontWeight="700">
                            {d.name.split(' (')[0]}
                          </text>
                          <text x={x} y={chartHeight - 20} textAnchor="middle" fontSize="10" fill="#94a3b8">
                            (τ={d.tau})
                          </text>
                          {/* Small vertical tick on x-axis */}
                          <line x1={x} y1={padding.top + graphHeight} x2={x} y2={padding.top + graphHeight + 6} stroke="#cbd5e1" strokeWidth="1" />
                        </g>
                      )
                    })}

                    {/* Lines */}
                    {series.map(s => {
                      const points = orderBiasData.map((d, i) => `${getX(i)},${getY(d[s.key as keyof typeof d] as number)}`).join(' ');
                      return (
                        <polyline 
                          key={s.key} 
                          points={points} 
                          fill="none" 
                          stroke={s.color} 
                          strokeWidth="3" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className="drop-shadow-sm"
                        />
                      );
                    })}

                    {/* Hover Areas & Points (Rendered last for z-index) */}
                    {orderBiasData.map((d, i) => {
                      const x = getX(i);
                      const isHovered = hoveredIndex === i;
                      
                      return (
                        <g 
                          key={i} 
                          onMouseEnter={() => setHoveredIndex(i)} 
                          onMouseLeave={() => setHoveredIndex(null)}
                          className="cursor-pointer"
                        >
                          {/* Invisible Rect for wider hit area */}
                          <rect 
                            x={x - (hitAreaWidth / 2)} 
                            y={padding.top} 
                            width={hitAreaWidth} 
                            height={graphHeight} 
                            fill="transparent" 
                          />
                          
                          {/* Vertical Guide Line */}
                          <line 
                            x1={x} 
                            y1={padding.top} 
                            x2={x} 
                            y2={padding.top + graphHeight} 
                            stroke="#94a3b8" 
                            strokeWidth="1" 
                            strokeDasharray="4 4"
                            className={`pointer-events-none transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                          />

                          {/* Data Points */}
                          {series.map(s => {
                             return (
                              <circle 
                                key={s.key} 
                                cx={x} 
                                cy={getY(d[s.key as keyof typeof d] as number)} 
                                r={isHovered ? 6 : 4} 
                                fill="white" 
                                stroke={s.color} 
                                strokeWidth={isHovered ? 3 : 2} 
                                className="pointer-events-none transition-all duration-200"
                              />
                             )
                          })}
                        </g>
                      );
                    })}
                    
                    {/* Legend */}
                    <g transform={`translate(${chartWidth - 100}, ${padding.top + 10})`}>
                       {series.slice().reverse().map((s, i) => (
                          <g key={s.key} transform={`translate(0, ${i * 20})`}>
                            <circle r="4" fill={s.color} />
                            <text x="12" y="4" fontSize="11" fill="#475569" fontWeight="600">{s.label}</text>
                          </g>
                       ))}
                    </g>
                  </svg>
              </div>

              {/* Detail Panel */}
              <div className={`mt-2 p-4 w-full max-w-[600px] bg-slate-50 border border-slate-200 rounded-lg text-sm flex justify-between items-center transition-all duration-300 shadow-sm ${hoveredIndex !== null ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                <div className="flex flex-col border-r border-slate-200 pr-4 mr-4">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Scenario</span>
                  <span className="font-bold text-slate-800 text-lg whitespace-nowrap">
                    {hoveredIndex !== null ? orderBiasData[hoveredIndex].name : '-'}
                  </span>
                </div>
                <div className="flex gap-4 sm:gap-8 flex-wrap">
                  {hoveredIndex !== null && series.slice().reverse().map(s => (
                    <div key={s.key} className="flex flex-col items-center">
                      <span style={{color: s.color}} className="font-bold text-[10px] uppercase tracking-wider">{s.label.replace(' Accuracy', '')}</span>
                      <span className="font-mono font-bold text-slate-700 text-lg">
                        {orderBiasData[hoveredIndex][s.key as keyof typeof orderBiasData[0]]}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-slate-800 text-sm flex gap-3">
           <span className="text-2xl">💡</span>
           <div>
               <strong>Engineering Implication:</strong> The sharp drop-off (from 57% to 20%) shows that if your RAG pipeline appends retrieved documents randomly (or in reverse relevance order), the LLM will likely fail to "see" the most important code, even if it is present in the context.
           </div>
        </div>
      </section>
    </div>
  );
};

export default RQ1Tab;
