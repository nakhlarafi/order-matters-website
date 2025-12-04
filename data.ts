import { ChartDataPoint, SegmentationDataPoint, StrategyDataPoint } from './types';

// Data extracted from Figure 4a (Defects4J - gpt-4o-mini)
export const orderBiasData: ChartDataPoint[] = [
  { name: 'Perfect (τ=1.0)', tau: 1.0, top1: 57.4, top3: 70.9, top5: 78.0, top10: 86.0 },
  { name: 'Mod. Perfect (τ=0.5)', tau: 0.5, top1: 26.1, top3: 38.6, top5: 42.9, top10: 50.3 },
  { name: 'Random (τ=0.0)', tau: 0.0, top1: 21.2, top3: 33.0, top5: 39.9, top10: 50.2 },
  { name: 'Mod. Inverted (τ=-0.5)', tau: -0.5, top1: 20.5, top3: 32.6, top5: 42.2, top10: 51.0 },
  { name: 'Worst (τ=-1.0)', tau: -1.0, top1: 19.4, top3: 26.3, top5: 30.5, top10: 35.2 },
];

// Data extracted from Table 2 (Defects4J)
// Shows how gap decreases as segment size decreases
export const segmentationData: SegmentationDataPoint[] = [
  { segmentSize: 10, perfectOrderTop1: 43.3, worstOrderTop1: 42.1 },
  { segmentSize: 20, perfectOrderTop1: 49.3, worstOrderTop1: 37.1 },
  { segmentSize: 30, perfectOrderTop1: 52.1, worstOrderTop1: 34.9 },
  { segmentSize: 40, perfectOrderTop1: 53.9, worstOrderTop1: 34.1 },
  { segmentSize: 50, perfectOrderTop1: 55.5, worstOrderTop1: 33.9 },
];

// Data extracted from Table 4 (Defects4J)
export const strategyData: StrategyDataPoint[] = [
  { technique: 'DepGraph', top1: 48.3, category: 'Learning-based' },
  { technique: 'CallGraphBFS', top1: 34.9, category: 'Structure-based' },
  { technique: 'CallGraphDFS', top1: 34.5, category: 'Structure-based' },
  { technique: 'Ochiai', top1: 32.7, category: 'Statistical-based' },
  { technique: 'LOC', top1: 32.5, category: 'Metric-based' },
];

export const paperSummary = `
**Abstract Highlights:**
- **Problem:** LLMs show input order bias in Fault Localization (FL).
- **Metric:** Investigated using Kendall Tau distances.
- **Key Finding 1:** Top-1 Accuracy in Java projects drops from **57%** (Perfect order) to **20%** (Worst order).
- **Key Finding 2:** Breaking inputs into smaller contexts (segmentation) reduces this bias significantly (gap reduces to 1% at segment size 10).
- **Key Finding 3:** Bias is **not** due to data leakage (confirmed by renaming methods).
- **Key Finding 4:** Advanced ordering (DepGraph) achieves 48% Top-1 accuracy, beating simpler static methods.

**Core Conclusion:**
The order in which code elements are presented to an LLM significantly impacts its ability to locate faults. Strategies like context segmentation and intelligent ordering (e.g., using DepGraph) are crucial for reliable LLM-based software engineering tools.
`;
