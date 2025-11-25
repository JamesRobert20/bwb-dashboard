"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FiltersSidebarProps {
  onFilterChange: (filters: {
    minDTE: number;
    maxDTE: number;
    minCredit: number;
    minScore: number;
  }) => void;
}

export function FiltersSidebar({ onFilterChange }: FiltersSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    minDTE: 0,
    maxDTE: 365,
    minCredit: 0,
    minScore: 0,
  });

  const handleFilterChange = (key: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newFilters = { ...filters, [key]: numValue };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      minDTE: 0,
      maxDTE: 365,
      minCredit: 0,
      minScore: 0,
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
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