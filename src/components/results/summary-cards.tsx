"use client";

import { TrendingUp, Target, DollarSign, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScanSummary } from "@/types/bwb";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface SummaryCardsProps {
  summary: ScanSummary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      title: "Strategies Found",
      value: summary.total_found.toString(),
      icon: Target,
      color: "text-emerald-500",
    },
    {
      title: "Best Score",
      value: formatNumber(summary.best_score, 1),
      icon: TrendingUp,
      color: "text-blue-500",
    },
    {
      title: "Avg Credit",
      value: formatCurrency(summary.avg_credit),
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      title: "Scan Time",
      value: `${summary.scan_time_ms}ms`,
      icon: Clock,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                {card.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-100">{card.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}