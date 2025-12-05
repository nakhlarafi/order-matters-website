
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

export interface LeakageDataPoint {
  context: string;
  original: number;
  renamed: number;
}

export enum Tab {
  OVERVIEW = 'Executive Summary',
  RQ1 = 'RQ1: Input Sensitivity',
  RQ2 = 'RQ2: Context Optimization',
  RQ3 = 'RQ3: Memorization',
  RQ4 = 'RQ4: Ranking Strategy',
  CHAT = 'AI Assistant'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}
