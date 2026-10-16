"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TrendPoint } from "@/lib/types";

export function EmergencyChart({ data }: { data: TrendPoint[] }) {
  return (
    <div className="h-64 w-full px-2 py-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="sosFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(125,176,255,0.12)" vertical={false} />
          <XAxis dataKey="label" stroke="#8ba0bd" tick={{ fill: "#8ba0bd", fontSize: 11 }} />
          <YAxis stroke="#8ba0bd" tick={{ fill: "#8ba0bd", fontSize: 11 }} width={32} />
          <Tooltip
            contentStyle={{
              background: "#0b1628",
              border: "1px solid rgba(125,176,255,0.16)",
              borderRadius: 8,
              color: "#e8eef7",
            }}
          />
          <Area
            type="monotone"
            dataKey="emergencies"
            name="Emergencies"
            stroke="#22d3ee"
            fill="url(#sosFill)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
