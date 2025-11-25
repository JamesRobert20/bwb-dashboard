"use client";

import { useState, useMemo } from "react";
import { ArrowUpDown, Eye } from "lucide-react";
import { BWBStrategy } from "@/types/bwb";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { PayoffChart } from "./payoff-chart";

type BWBTableProps = {
  strategies: BWBStrategy[];
}

type SortField = "score" | "credit" | "max_profit" | "max_loss" | "dte";
type SortDirection = "asc" | "desc";

type SortButtonProps ={
  field: SortField;
  children: React.ReactNode;
  onClick: (field: SortField) => void;
}

function SortButton({ field, children, onClick }: SortButtonProps) {
  return (
    <button
      onClick={() => onClick(field)}
      className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
    >
      {children}
      <ArrowUpDown className="h-3 w-3" />
    </button>
  );
}

export function BWBTable({ strategies }: BWBTableProps) {
  const [sortField, setSortField] = useState<SortField>("score");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedStrategy, setSelectedStrategy] = useState<BWBStrategy | null>(null);

  const sortedStrategies = useMemo(() => {
    const sorted = [...strategies];

    // Apply sorting
    sorted.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const multiplier = sortDirection === "asc" ? 1 : -1;
      return (aVal - bVal) * multiplier;
    });

    return sorted;
  }, [strategies, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  if (sortedStrategies.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-400">
        No strategies found matching your criteria.
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-zinc-800 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-900/50 border-b border-zinc-800">
              <tr className="text-left text-sm text-zinc-400">
                <th className="px-4 py-3 font-medium">Strikes</th>
                <th className="px-4 py-3 font-medium">Wings</th>
                <th className="px-4 py-3 font-medium">
                  <SortButton field="credit" onClick={handleSort}>Credit</SortButton>
                </th>
                <th className="px-4 py-3 font-medium">
                  <SortButton field="max_profit" onClick={handleSort}>Max Profit</SortButton>
                </th>
                <th className="px-4 py-3 font-medium">
                  <SortButton field="max_loss" onClick={handleSort}>Max Loss</SortButton>
                </th>
                <th className="px-4 py-3 font-medium">
                  <SortButton field="score" onClick={handleSort}>Score</SortButton>
                </th>
                <th className="px-4 py-3 font-medium">
                  <SortButton field="dte" onClick={handleSort}>DTE</SortButton>
                </th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {sortedStrategies.map((strategy, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-zinc-900/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedStrategy(strategy)}
                >
                  <td className="px-4 py-3 font-mono text-sm text-zinc-100">
                    {strategy.k1}/{strategy.k2}/{strategy.k3}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-zinc-100">
                    {strategy.wing_left}/{strategy.wing_right}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-emerald-500">
                    {formatCurrency(strategy.credit)}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-emerald-500">
                    {formatCurrency(strategy.max_profit)}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-red-500">
                    {formatCurrency(strategy.max_loss)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-zinc-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all"
                          style={{ width: `${strategy.score}%` }}
                        />
                      </div>
                      <span className="font-mono text-sm text-zinc-100 min-w-[3ch]">
                        {formatNumber(strategy.score, 0)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-zinc-100">
                    {strategy.dte}d
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStrategy(strategy);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-zinc-800">
          {sortedStrategies.map((strategy, idx) => (
            <div
              key={idx}
              className="p-4 hover:bg-zinc-900/30 transition-colors cursor-pointer"
              onClick={() => setSelectedStrategy(strategy)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-zinc-400 mb-1">Strikes</p>
                  <p className="font-mono text-sm text-zinc-100">
                    {strategy.k1}/{strategy.k2}/{strategy.k3}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-400 mb-1">Score</p>
                  <p className="font-mono text-sm text-zinc-100">
                    {formatNumber(strategy.score, 0)}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-zinc-400">Credit</p>
                  <p className="font-mono text-emerald-500">
                    {formatCurrency(strategy.credit)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Max Profit</p>
                  <p className="font-mono text-emerald-500">
                    {formatCurrency(strategy.max_profit)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Max Loss</p>
                  <p className="font-mono text-red-500">
                    {formatCurrency(strategy.max_loss)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">DTE</p>
                  <p className="font-mono text-zinc-100">{strategy.dte}d</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={!!selectedStrategy}
        onClose={() => setSelectedStrategy(null)}
        title="Strategy Details"
      >
        {selectedStrategy && <PayoffChart strategy={selectedStrategy} />}
      </Modal>
    </>
  );
}