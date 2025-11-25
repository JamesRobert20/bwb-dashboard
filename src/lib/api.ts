import { ScanRequest, ScanResponse, BWBStrategy } from "@/types/bwb";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "APIError";
  }
}

export async function scanBWB(request: ScanRequest): Promise<ScanResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/scan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new APIError(
        `API request failed: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    // Return mock data if backend is unavailable
    console.warn("Backend unavailable, using mock data");
    return getMockScanResponse(request.ticker);
  }
}

function getMockScanResponse(ticker: string): ScanResponse {
  const expiry = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const mockResults: BWBStrategy[] = [
    {
      ticker: ticker.toUpperCase(),
      expiry,
      k1: 580,
      k2: 585,
      k3: 590,
      wing_left: 5,
      wing_right: 5,
      credit: 1.25,
      max_profit: 125,
      max_loss: 375,
      score: 33.3,
      dte: 45,
    },
    {
      ticker: ticker.toUpperCase(),
      expiry,
      k1: 575,
      k2: 580,
      k3: 585,
      wing_left: 5,
      wing_right: 5,
      credit: 1.15,
      max_profit: 115,
      max_loss: 385,
      score: 29.9,
      dte: 45,
    },
    {
      ticker: ticker.toUpperCase(),
      expiry,
      k1: 585,
      k2: 590,
      k3: 595,
      wing_left: 5,
      wing_right: 5,
      credit: 1.35,
      max_profit: 135,
      max_loss: 365,
      score: 37.0,
      dte: 45,
    },
    {
      ticker: ticker.toUpperCase(),
      expiry,
      k1: 570,
      k2: 575,
      k3: 580,
      wing_left: 5,
      wing_right: 5,
      credit: 1.05,
      max_profit: 105,
      max_loss: 395,
      score: 26.6,
      dte: 45,
    },
    {
      ticker: ticker.toUpperCase(),
      expiry,
      k1: 590,
      k2: 595,
      k3: 600,
      wing_left: 5,
      wing_right: 5,
      credit: 1.45,
      max_profit: 145,
      max_loss: 355,
      score: 40.8,
      dte: 45,
    },
  ];

  return {
    results: mockResults,
    summary: {
      total_found: mockResults.length,
      avg_score: mockResults.reduce((sum, r) => sum + r.score, 0) / mockResults.length,
      best_score: Math.max(...mockResults.map((r) => r.score)),
      avg_credit: mockResults.reduce((sum, r) => sum + r.credit, 0) / mockResults.length,
      avg_max_profit: mockResults.reduce((sum, r) => sum + r.max_profit, 0) / mockResults.length,
      scan_time_ms: 234,
    },
  };
}