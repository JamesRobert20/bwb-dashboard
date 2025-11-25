"use client";

import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts";
import { BWBStrategy } from "@/types/bwb";
import { formatCurrency } from "@/lib/utils";

type PayoffChartProps = {
  strategy: BWBStrategy;
}

export function PayoffChart({ strategy }: PayoffChartProps) {
  const { k1, k2, k3, wing_left, wing_right, credit } = strategy;

  // Generate payoff data points
  const generatePayoffData = () => {
    const data = [];
    const range = Math.max(k3 - k1, 20);
    const start = k1 - range * 0.5;
    const end = k3 + range * 0.5;
    const step = (end - start) / 100;

    for (let price = start; price <= end; price += step) {
      const payoff = calculatePayoff(price);
      data.push({
        price: Math.round(price * 100) / 100,
        payoff: Math.round(payoff * 100) / 100,
      });
    }

    return data;
  };

  const calculatePayoff = (price: number): number => {
    let payoff = credit * 100; // Initial credit received

    // Long call at k1
    if (price > k1) {
      payoff += wing_left * (price - k1) * 100;
    }

    // Short calls at k2
    if (price > k2) {
      payoff -= (wing_left + wing_right) * (price - k2) * 100;
    }

    // Long call at k3
    if (price > k3) {
      payoff += wing_right * (price - k3) * 100;
    }

    return payoff;
  };

  const data = generatePayoffData();
  const maxProfit = Math.max(...data.map((d) => d.payoff));
  const minProfit = Math.min(...data.map((d) => d.payoff));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-zinc-400">Strikes</p>
          <p className="font-mono text-zinc-100">
            {k1} / {k2} / {k3}
          </p>
        </div>
        <div>
          <p className="text-zinc-400">Wings</p>
          <p className="font-mono text-zinc-100">
            {wing_left} / {wing_right}
          </p>
        </div>
        <div>
          <p className="text-zinc-400">Max Profit</p>
          <p className="font-mono text-emerald-500">
            {formatCurrency(strategy.max_profit)}
          </p>
        </div>
        <div>
          <p className="text-zinc-400">Max Loss</p>
          <p className="font-mono text-red-500">
            {formatCurrency(strategy.max_loss)}
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data}>
          <defs>
            <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey="price"
            stroke="#71717a"
            label={{ value: "Underlying Price", position: "insideBottom", offset: -5 }}
          />
          <YAxis
            stroke="#71717a"
            label={{ value: "Profit/Loss ($)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #27272a",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#a1a1aa" }}
            formatter={(value: number) => [formatCurrency(value), "P/L"]}
          />
          <Legend />
          <ReferenceLine y={0} stroke="#71717a" strokeDasharray="3 3" />
          <ReferenceLine x={k1} stroke="#3b82f6" strokeDasharray="3 3" label="K1" />
          <ReferenceLine x={k2} stroke="#8b5cf6" strokeDasharray="3 3" label="K2" />
          <ReferenceLine x={k3} stroke="#ec4899" strokeDasharray="3 3" label="K3" />
          <Area
            type="monotone"
            dataKey="payoff"
            stroke="none"
            fill="url(#profitGradient)"
            fillOpacity={1}
          />
          <Line
            type="monotone"
            dataKey="payoff"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            name="Payoff"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}