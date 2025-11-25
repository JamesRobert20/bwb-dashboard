"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScanResponse, BWBStrategy } from "@/types/bwb";

type FiltersSidebarProps ={
  ticker: string | null;
  expiry?: string;
}

export function FiltersSidebar({ ticker, expiry }: FiltersSidebarProps) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    minDTE: 0,
    maxDTE: 365,
    minCredit: 0,
    minScore: 0,
  });

  const applyFilters = (newFilters: typeof filters) => {
    if (!ticker) return;

    const queryKey = ["bwb-scan", ticker, expiry];
    const cachedData = queryClient.getQueryData<ScanResponse>(queryKey);
    
    if (!cachedData) return;

    const originalResults = cachedData._originalResults || cachedData.results;
    const originalSummary = cachedData._originalSummary || cachedData.summary;
    
    const filtered = originalResults.filter((r: BWBStrategy) =>
      r.dte >= newFilters.minDTE &&
      r.dte <= newFilters.maxDTE &&
      r.credit >= newFilters.minCredit &&
      r.score >= newFilters.minScore
    );

    const newSummary = filtered.length > 0
      ? {
          total_found: filtered.length,
          avg_score: filtered.reduce((sum, r) => sum + r.score, 0) / filtered.length,
          best_score: Math.max(...filtered.map((r) => r.score)),
          avg_credit: filtered.reduce((sum, r) => sum + r.credit, 0) / filtered.length,
          avg_max_profit: filtered.reduce((sum, r) => sum + r.max_profit, 0) / filtered.length,
          scan_time_ms: originalSummary.scan_time_ms,
        }
      : {
          total_found: 0,
          avg_score: 0,
          best_score: 0,
          avg_credit: 0,
          avg_max_profit: 0,
          scan_time_ms: originalSummary.scan_time_ms,
        };

    queryClient.setQueryData<ScanResponse>(queryKey, {
      ...cachedData,
      results: filtered,
      summary: newSummary,
      _originalResults: originalResults,
      _originalSummary: originalSummary,
    });
  };

  const handleFilterChange = (key: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newFilters = { ...filters, [key]: numValue };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      minDTE: 0,
      maxDTE: 365,
      minCredit: 0,
      minScore: 0,
    };
    setFilters(defaultFilters);
    applyFilters(defaultFilters);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden mb-4"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </Button>

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 right-0 z-40 w-80 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}
      >
        <Card className="h-full lg:h-auto">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Filters</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="minDTE">Min DTE</Label>
              <Input
                id="minDTE"
                type="number"
                min="0"
                max="365"
                value={filters.minDTE}
                onChange={(e) => handleFilterChange("minDTE", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxDTE">Max DTE</Label>
              <Input
                id="maxDTE"
                type="number"
                min="0"
                max="365"
                value={filters.maxDTE}
                onChange={(e) => handleFilterChange("maxDTE", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minCredit">Min Credit ($)</Label>
              <Input
                id="minCredit"
                type="number"
                min="0"
                step="0.1"
                value={filters.minCredit}
                onChange={(e) => handleFilterChange("minCredit", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minScore">Min Score</Label>
              <Input
                id="minScore"
                type="number"
                min="0"
                max="100"
                value={filters.minScore}
                onChange={(e) => handleFilterChange("minScore", e.target.value)}
              />
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={resetFilters}
            >
              Reset Filters
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}