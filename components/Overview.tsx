import React from 'react';

const Overview: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Paper Abstract</h2>
        <p className="text-slate-700 leading-relaxed text-lg">
          Large Language Models (LLMs) show great promise in software engineering tasks like Fault Localization (FL). 
          However, this study reveals a critical weakness: <span className="font-bold text-primary">Input Order Bias</span>.
        </p>
        <p className="text-slate-700 leading-relaxed text-lg mt-4">
          The researchers found that simply changing the order of methods in the prompt can drop Top-1 accuracy from 
          <span className="font-bold text-green-600"> 57%</span> (when the buggy method is first) to 
          <span className="font-bold text-red-600"> 20%</span> (when it is last). This suggests LLMs struggle to 
          reason holistically over long contexts and prioritize earlier information.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center">
            <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">RQ1</span>
            Order Bias
          </h3>
          <p className="text-slate-600">
            Does the order of code elements impact performance? <br/>
            <strong>Yes.</strong> Significant performance degradation occurs as the ground truth moves down the list (measured by Kendall Tau distance).
          </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center">
            <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">RQ2</span>
            Context Segmentation
          </h3>
          <p className="text-slate-600">
            Does limiting context window help? <br/>
            <strong>Yes.</strong> Breaking input into smaller segments (e.g., size 10) significantly reduces bias, narrowing the performance gap between best and worst orderings to just 1%.
          </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center">
            <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">RQ3</span>
            Data Leakage
          </h3>
          <p className="text-slate-600">
            Is the effect due to memorization? <br/>
            <strong>No.</strong> Renaming methods to generic names resulted in the same bias trends, confirming the issue is structural prompt ordering, not training data leakage.
          </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center">
            <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">RQ4</span>
            Ordering Strategies
          </h3>
          <p className="text-slate-600">
            Can we fix it with better ordering? <br/>
            <strong>Yes.</strong> Ordering methods using <em>DepGraph</em> (dependency analysis) yielded 48% Top-1 accuracy, outperforming simple call-graph or statistical orderings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Overview;
