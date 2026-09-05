"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { TypeDistributionPoint } from "@/lib/types";

const COLORS = ["#e11d48", "#f97316", "#eab308", "#22d3ee", "#38bdf8", "#64748b"];

export function EmergencyTypeChart({ data }: { data: TypeDistributionPoint[] }) {
  return (
    <div className="w-full px-2 py-4">
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="type"
              innerRadius={52}
              outerRadius={80}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell key={entry.type} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#0b1628",
                border: "1px solid rgba(125,176,255,0.16)",
                borderRadius: 8,
                color: "#e8eef7",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-1 px-5 pb-2 text-xs text-muted">
        {data.map((item, index) => (
          <li key={item.type} className="flex items-center gap-2">
            <span
              className="size-2 rounded-full"
              style={{ background: COLORS[index % COLORS.length] }}
            />
            {item.type}
            <span className="ml-auto font-mono text-ink">{item.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
