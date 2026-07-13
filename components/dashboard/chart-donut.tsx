/**
 * ─────────────────────────────────────────────────────────────
 * RD ATS Admin — Donut Chart (Position Distribution)
 * Pie chart showing applicant distribution by position.
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { ChartDataPoint } from "@/types";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--primary) / 0.55)",
  "hsl(var(--muted-foreground))",
];

interface ChartDonutProps {
  data: ChartDataPoint[];
  title: string;
  subtitle: string;
}

export function ChartDonut({ data, title, subtitle }: ChartDonutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
            stroke="none"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "12px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            }}
            itemStyle={{
              color: "hsl(var(--primary)", // Value (1247, 534...)
              textTransform:'capitalize',
              fontWeight: 500,
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ fontSize: "11px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
