export type BWBStrategy = {
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

export type ScanSummary = {
  total_found: number;
  avg_score: number;
  best_score: number;
  avg_credit: number;
  avg_max_profit: number;
  scan_time_ms: number;
}

export type ScanResponse = {
  results: BWBStrategy[];
  summary: ScanSummary;
  _originalResults?: BWBStrategy[];
}

export type ScanRequest = {
  ticker: string;
  expiry?: string;
}

export type FilterState = {
  minDTE: number;
  maxDTE: number;
  minCredit: number;
  minScore: number;
}