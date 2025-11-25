export interface BWBStrategy {
  k1: number;
  k2: number;
  k3: number;
  wing_left: number;
  wing_right: number;
  credit: number;
  max_profit: number;
  max_loss: number;
  score: number;
  dte: number;
}

export interface ScanSummary {
  total_found: number;
  avg_score: number;
  best_score: number;
  avg_credit: number;
  avg_max_profit: number;
  scan_time_ms: number;
}

export interface ScanResponse {
  results: BWBStrategy[];
  summary: ScanSummary;
  _originalResults?: BWBStrategy[];
}

export interface ScanRequest {
  ticker: string;
  expiry?: string;
}

export interface FilterState {
  minDTE: number;
  maxDTE: number;
  minCredit: number;
  minScore: number;
}