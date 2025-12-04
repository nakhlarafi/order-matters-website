import React, { useState } from 'react';
import { orderBiasData, segmentationData, strategyData } from '../data';

const ResultsCharts: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Chart Configuration
  const chartHeight = 300;
  const chartWidth = 600;
  const padding = { top: 40, right: 60, bottom: 40, left: 40 };
  const graphWidth = chartWidth - padding.left - padding.right;
  const graphHeight = chartHeight - padding.top - padding.bottom;

  // Scales
  const getX = (index: number) => padding.left + (index * (graphWidth / (orderBiasData.length - 1)));
  const getY = (value: number) => padding.top + graphHeight - ((value / 100) * graphHeight);

  // Series Configuration matches paper colors roughly
  const series = [
    { key: 'top10', color: '#8b5cf6', label: 'Top-10' }, // Purple
    { key: 'top5', color: '#f59e0b', label: 'Top-5' },   // Orange
    { key: 'top3', color: '#10b981', label: 'Top-3' },   // Green
    { key: 'top1', color: '#2563eb', label: 'Top-1' },   // Blue
  ] as const;

  return (
    <div className="space-y-12 animate-fade-in">
      
      {/* Chart 1: Order Bias (Line Chart) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold mb-2">RQ1: Impact of Input Order on Accuracy</h3>
        <p className="text-slate-600 mb-6 text-sm">
          Accuracy significantly decreases as the order quality degrades (Kendall Tau decreases). 
          The "Perfect" order (left) performs best, while "Worst" (right) performs poorest.
          <br/>
          <span className="text-xs text-slate-400">Hover over points for details.</span>
        </p>
        
        <div className="w-full overflow-x-auto flex flex-col items-center">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full max-w-[800px] h-auto font-sans select-none">
              {/* Grid Lines (Y-Axis) */}
              {[0, 20, 40, 60, 80, 100].map(tick => {
                const y = getY(tick);
                return (
                  <g key={tick}>
                    <line x1={padding.left} y1={y} x2={chartWidth - padding.right} stroke="#e2e8f0" strokeDasharray="4 4" />
                    <text x={padding.left - 10} y={y + 3} textAnchor="end" fontSize="10" fill="#64748b">{tick}%</text>
                  </g>
                );
              })}

              {/* X Axis Labels */}
              {orderBiasData.map((d, i) => {
                const x = getX(i);
                return (
                  <g key={i}>
                    <text x={x} y={chartHeight - 20} textAnchor="middle" fontSize="10" fill="#475569" fontWeight="500">
                      {d.name.split(' (')[0]}
                    </text>
                    <text x={x} y={chartHeight - 8} textAnchor="middle" fontSize="9" fill="#94a3b8">
                      (τ={d.tau})
                    </text>
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
                    className="opacity-80 hover:opacity-100 transition-opacity"
                  />
                );
              })}

              {/* Interactive Data Points */}
              {orderBiasData.map((d, i) => (
                <g 
                  key={i} 
                  onMouseEnter={() => setHoveredIndex(i)} 
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer"
                >
                  {/* Invisible hit area column */}
                  <rect x={getX(i) - 20} y={padding.top} width={40} height={graphHeight} fill="transparent" />
                  
                  {/* Dots */}
                  {series.map(s => {
                     const isHovered = hoveredIndex === i;
                     return (
                      <circle 
                        key={s.key} 
                        cx={getX(i)} 
                        cy={getY(d[s.key as keyof typeof d] as number)} 
                        r={isHovered ? 6 : 4} 
                        fill="white" 
                        stroke={s.color} 
                        strokeWidth={isHovered ? 3 : 2} 
                        className="transition-all duration-200"
                      />
                     )
                  })}
                </g>
              ))}
              
              {/* Legend */}
              <g transform={`translate(${chartWidth - 50}, ${padding.top})`}>
                 {series.slice().reverse().map((s, i) => (
                    <g key={s.key} transform={`translate(0, ${i * 15})`}>
                      <circle r="4" fill={s.color} />
                      <text x="10" y="4" fontSize="10" fill="#475569" fontWeight="500">{s.label}</text>
                    </g>
                 ))}
              </g>
            </svg>

            {/* Tooltip / Details Panel */}
            <div className={`mt-2 p-3 w-full max-w-[600px] bg-slate-50 border border-slate-200 rounded-lg text-sm flex justify-between items-center transition-opacity duration-200 ${hoveredIndex !== null ? 'opacity-100' : 'opacity-0'}`}>
              <span className="font-bold text-slate-800">
                {hoveredIndex !== null ? orderBiasData[hoveredIndex].name : '-'}
              </span>
              <div className="flex gap-4">
                {hoveredIndex !== null && series.slice().reverse().map(s => (
                  <div key={s.key} className="flex flex-col items-center">
                    <span style={{color: s.color}} className="font-bold text-xs">{s.label}</span>
                    <span className="font-mono font-medium text-slate-700">
                      {orderBiasData[hoveredIndex][s.key as keyof typeof orderBiasData[0]]}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </div>

      {/* Chart 2: Segmentation */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold mb-2">RQ2: Effect of Context Segmentation</h3>
        <p className="text-slate-600 mb-6 text-sm">Smaller segment sizes reduce the bias gap between Perfect and Worst ordering.</p>
        
        <div className="h-80 w-full relative pt-6">
          <div className="absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between text-xs text-slate-400">
            <span>60%</span>
            <span>40%</span>
            <span>20%</span>
            <span>0%</span>
          </div>
          
          <div className="ml-10 h-full flex justify-between items-end pb-8 border-l border-b border-slate-200">
            {segmentationData.map((d) => (
              <div key={d.segmentSize} className="flex-1 px-2 flex gap-1 h-full items-end justify-center">
                 {/* Perfect Bar */}
                <div 
                  className="w-4 md:w-8 bg-green-500 rounded-t-sm relative group"
                  style={{ height: `${(d.perfectOrderTop1 / 60) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] p-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 pointer-events-none">
                    Perfect: {d.perfectOrderTop1}%
                  </div>
                </div>
                {/* Worst Bar */}
                <div 
                  className="w-4 md:w-8 bg-red-500 rounded-t-sm relative group"
                  style={{ height: `${(d.worstOrderTop1 / 60) * 100}%` }}
                >
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] p-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 pointer-events-none">
                    Worst: {d.worstOrderTop1}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="ml-10 flex justify-between text-xs text-slate-600 pt-2">
            {segmentationData.map(d => (
              <div key={d.segmentSize} className="flex-1 text-center">Size {d.segmentSize}</div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500"></div> Perfect Order</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500"></div> Worst Order</div>
        </div>
      </div>

      {/* Chart 3: Strategies */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold mb-2">RQ4: Comparison of Ordering Strategies</h3>
        <p className="text-slate-600 mb-6 text-sm">DepGraph (Learning-based) significantly outperforms basic statistical or metric-based ordering.</p>
        
        <div className="space-y-4">
          {strategyData.sort((a,b) => b.top1 - a.top1).map((d) => (
            <div key={d.technique} className="relative">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-slate-700">{d.technique} <span className="font-normal text-slate-400 text-xs ml-2">({d.category})</span></span>
                <span className="font-bold text-slate-900">{d.top1}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${d.technique === 'DepGraph' ? 'bg-indigo-600' : 'bg-slate-400'}`}
                  style={{ width: `${d.top1}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ResultsCharts;