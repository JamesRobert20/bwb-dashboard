"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BWBTable } from "@/components/results/bwb-table";
import { SummaryCards } from "@/components/results/summary-cards";
import { FiltersSidebar } from "@/components/results/filters-sidebar";
import { Button } from "@/components/ui/button";
import { useBWBScan } from "@/hooks/use-bwb-scan";
import { ScanRequest } from "@/types/bwb";

function ResultsContent() {
  const searchParams = useSearchParams();
  const ticker = searchParams.get("ticker");
  const expiry = searchParams.get("expiry");

  const scanRequest: ScanRequest | null = ticker
    ? { ticker, expiry: expiry || undefined }
    : null;

  const { data, isLoading, error } = useBWBScan(scanRequest);

  if (!ticker) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-zinc-100">No ticker specified</h2>
          <p className="text-zinc-400">Please provide a ticker to view results</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="h-4 w-4" />
              Back to Scanner
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-zinc-100">
                  {ticker} Results
                </h1>
                {expiry && (
                  <p className="text-sm text-zinc-400">Expiry: {expiry}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Loading State */}
      {isLoading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent" />
            <p className="text-zinc-400">Scanning for strategies...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
            <p className="text-red-400">
              {error instanceof Error ? error.message : "Failed to scan strategies"}
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      {data && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                  ticker={ticker}
                  expiry={expiry || undefined}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent" />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}