/**
 * ─────────────────────────────────────────────────────────────
 * RD ATS Admin — Line Chart (Applications Over Time)
 * Dual-axis line chart with area fill.
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartDataPoint } from "@/types";

interface ChartLineProps {
  data: ChartDataPoint[];
}

export function ChartLine({ data }: ChartLineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Applications Over Time</h3>
        <p className="text-sm text-muted-foreground">
          Monthly applications vs. hires
        </p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorSecondary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis
            dataKey="name"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "12px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
          />
          <Area
            type="monotone"
            dataKey="value"
            name="Applications"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            fill="url(#colorValue)"
          />
          <Area
            type="monotone"
            dataKey="secondary"
            name="Hires"
            stroke="hsl(var(--chart-2))"
            strokeWidth={2}
            fill="url(#colorSecondary)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
