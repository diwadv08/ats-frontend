/**
 * ─────────────────────────────────────────────────────────────
 * RD ATS Admin — Hiring Funnel Chart
 * Bar chart showing the hiring pipeline stages.
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ChartDataPoint } from "@/types";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

interface ChartFunnelProps {
  data: ChartDataPoint[];
}

export function ChartFunnel({ data }: ChartFunnelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Hiring Funnel</h3>
        <p className="text-sm text-muted-foreground">
          Pipeline stages from application to hire
        </p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
            separator=""
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "12px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            }}
            labelStyle={{
              color: "hsl(var(--foreground))", // Stage Name (Applied, Screening...),
              fontWeight: 600,
            }}
            itemStyle={{
              color: "hsl(var(--primary)", // Value (1247, 534...)
              textTransform:'capitalize',
              fontWeight: 500,
            }}
            formatter={(value: number) => [value.toLocaleString(), ""]}

            cursor={{ fill: "hsl(var(--muted))", opacity: 0.1 }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
