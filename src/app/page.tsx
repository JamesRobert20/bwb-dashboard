"use client";

import { useState } from "react";
import { TrendingUp, Zap, Shield, BarChart3 } from "lucide-react";
import { ScannerForm } from "@/components/scanner/scanner-form";
import { BWBTable } from "@/components/results/bwb-table";
import { SummaryCards } from "@/components/results/summary-cards";
import { FiltersSidebar } from "@/components/results/filters-sidebar";
import { useBWBScan } from "@/hooks/use-bwb-scan";
import { ScanFormData } from "@/lib/validations";
import { ScanRequest } from "@/types/bwb";

export default function Home() {
  const [scanRequest, setScanRequest] = useState<ScanRequest | null>(null);

  const { data, isLoading, error } = useBWBScan(scanRequest);

  const handleScan = (formData: ScanFormData) => {
    setScanRequest({
      ticker: formData.ticker,
      expiry: formData.expiry || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
              <Zap className="h-4 w-4" />
              Real-time Options Analysis
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-100 tracking-tight">
              Broken Wing Butterfly
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                Scanner Dashboard
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg text-zinc-400">
              Discover profitable BWB strategies with advanced filtering, real-time analysis, 
              and interactive payoff diagrams. Built for professional options traders.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              {[
                { icon: TrendingUp, text: "Live Market Data" },
                { icon: Shield, text: "Risk Analysis" },
                { icon: BarChart3, text: "Visual Payoffs" },
              ].map((feature) => (
                <div
                  key={feature.text}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900/50 border border-zinc-800 text-zinc-300 text-sm"
                >
                  <feature.icon className="h-4 w-4 text-emerald-500" />
                  {feature.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Scanner Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 lg:p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-zinc-100 mb-2">
              Start Scanning
            </h2>
            <p className="text-zinc-400">
              Enter a ticker symbol to discover optimal BWB strategies
            </p>
          </div>
          
          <ScannerForm onScan={handleScan} isLoading={isLoading} />
        </div>
      </section>

      {/* Results Section */}
      {data && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-8">
            {/* Summary Cards */}
            <SummaryCards summary={data.summary} />

            {/* Results Table with Filters */}
            <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-zinc-100">
                    Strategies Found
                  </h2>
                  <span className="text-sm text-zinc-400">
                    {data.results.length} results
                  </span>
                </div>
                <BWBTable strategies={data.results} />
              </div>

              <div className="mt-6 lg:mt-0">
                <FiltersSidebar
                  ticker={scanRequest?.ticker || null}
                  expiry={scanRequest?.expiry}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Error State */}
      {error && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
            <p className="text-red-400">
              {error instanceof Error ? error.message : "Failed to scan strategies"}
            </p>
          </div>
        </section>
      )}

      {/* Empty State */}
      {!data && !isLoading && !error && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800">
              <BarChart3 className="h-8 w-8 text-zinc-600" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-400">
              Ready to scan
            </h3>
            <p className="text-zinc-500">
              Enter a ticker symbol above to get started
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
