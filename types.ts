export interface ChartDataPoint {
  name: string;
  top1: number;
  top3: number;
  top5: number;
  top10: number;
  tau?: number;
}

export interface StrategyDataPoint {
  technique: string;
  top1: number;
  category: 'Learning-based' | 'Structure-based' | 'Statistical-based' | 'Metric-based';
}

export interface SegmentationDataPoint {
  segmentSize: number;
  perfectOrderTop1: number;
  worstOrderTop1: number;
}

export enum Tab {
  OVERVIEW = 'Overview',
  VISUALIZER = 'Kendall Tau Visualizer',
  RESULTS = 'Experimental Results',
  CHAT = 'Paper Q&A'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}