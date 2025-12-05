
import { ChartDataPoint, LeakageDataPoint, SegmentationDataPoint, StrategyDataPoint } from './types';

// Data extracted from Figure 4a (Defects4J - gpt-4o-mini)
export const orderBiasData: ChartDataPoint[] = [
  { name: 'Perfect (τ=1.0)', tau: 1.0, top1: 57.4, top3: 70.9, top5: 78.0, top10: 86.0 },
  { name: 'Mod. Perfect (τ=0.5)', tau: 0.5, top1: 26.1, top3: 38.6, top5: 42.9, top10: 50.3 },
  { name: 'Random (τ=0.0)', tau: 0.0, top1: 21.2, top3: 33.0, top5: 39.9, top10: 50.2 },
  { name: 'Mod. Inverted (τ=-0.5)', tau: -0.5, top1: 20.5, top3: 32.6, top5: 42.2, top10: 51.0 },
  { name: 'Worst (τ=-1.0)', tau: -1.0, top1: 19.4, top3: 26.3, top5: 30.5, top10: 35.2 },
];

// Data extracted from Table 2 (Defects4J)
export const segmentationData: SegmentationDataPoint[] = [
  { segmentSize: 10, perfectOrderTop1: 43.3, worstOrderTop1: 42.1 },
  { segmentSize: 20, perfectOrderTop1: 49.3, worstOrderTop1: 37.1 },
  { segmentSize: 30, perfectOrderTop1: 52.1, worstOrderTop1: 34.9 },
  { segmentSize: 40, perfectOrderTop1: 53.9, worstOrderTop1: 34.1 },
  { segmentSize: 50, perfectOrderTop1: 55.5, worstOrderTop1: 33.9 },
];

// Data extracted from Table 4 (Defects4J)
export const strategyData: StrategyDataPoint[] = [
  { technique: 'DepGraph (AI-Graph)', top1: 48.3, category: 'Learning-based' },
  { technique: 'CallGraph (BFS)', top1: 34.9, category: 'Structure-based' },
  { technique: 'CallGraph (DFS)', top1: 34.5, category: 'Structure-based' },
  { technique: 'Statistical (Ochiai)', top1: 32.7, category: 'Statistical-based' },
  { technique: 'Heuristic (LOC)', top1: 32.5, category: 'Metric-based' },
];

// Data extracted from Table 3 (Defects4J) - RQ3 Data Leakage Analysis
export const leakageData: LeakageDataPoint[] = [
  { context: 'High Relevance Context', original: 55.5, renamed: 50.5 },
  { context: 'Low Relevance Context', original: 33.9, renamed: 30.3 },
];

export const paperSummary = `
**Executive Engineering Summary:**
- **Core Insight:** The ordering of retrieved context in RAG pipelines drastically affects LLM reasoning accuracy.
- **Performance Impact:** Optimizing context order (Top-1 Ranking) improves fault localization accuracy from **20%** to **57%**.
- **Optimization Strategy:** 
    1. **Segmentation:** Breaking large context into smaller chunks (e.g., size 10) eliminates ordering bias (volatility drops to <1%).
    2. **Smart Retrieval:** Using Dependency Graphs (DepGraph) for ranking context outperforms standard embedding or statistical retrieval by over **13%**.
- **Reliability:** The observed bias is **structural**, not due to training data memorization (verified via code obfuscation tests).

**Recommendation:** For production RAG systems involving code or logical sequences, prioritize a "Reranking" step to ensure ground-truth relevant chunks appear early in the context window.
`;
