"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/common/Card";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { PageHeader } from "@/components/common/PageHeader";
import { UnavailableState } from "@/components/common/UnavailableState";
import { AnalyticsChart } from "@/components/analytics/AnalyticsChart";
import { getAnalytics } from "@/lib/api";
import { useAsyncData } from "@/lib/hooks/use-async-data";

const tooltipStyle = {
  background: "#0b1628",
  border: "1px solid rgba(125,176,255,0.16)",
  borderRadius: 8,
  color: "#e8eef7",
};

export default function AnalyticsPage() {
  const { data, loading, error, retry } = useAsyncData(getAnalytics);

  if (loading) return <LoadingState label="Loading analytics workspace" />;
  if (error || !data) return <ErrorState message={error ?? "Analytics unavailable"} onRetry={retry} />;

  return (
    <div>
      <PageHeader
        eyebrow="Derived from MongoDB"
        title="Analytics"
        description="Only metrics that can be calculated from persisted emergencies are shown. Mesh, responder, and AI scores are not invented."
      />
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <Card className="p-4">
          <p className="text-xs text-muted uppercase">Total emergencies</p>
          <p className="mt-1 font-mono text-2xl">{data.metrics.totalEmergencies}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted uppercase">Average emergencies / day (30d)</p>
          <p className="mt-1 font-mono text-2xl">{data.metrics.averagePerDay}</p>
        </Card>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <AnalyticsChart title="Emergency count over time" subtitle="Last 30 UTC days">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.metrics.countOverTime}>
              <CartesianGrid stroke="rgba(125,176,255,0.12)" vertical={false} />
              <XAxis dataKey="label" stroke="#8ba0bd" tick={{ fill: "#8ba0bd", fontSize: 11 }} />
              <YAxis stroke="#8ba0bd" tick={{ fill: "#8ba0bd", fontSize: 11 }} width={28} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area dataKey="emergencies" name="Emergencies" stroke="#22d3ee" fill="#22d3ee33" />
              <Area dataKey="resolved" name="Resolved" stroke="#22c55e" fill="#22c55e22" />
            </AreaChart>
          </ResponsiveContainer>
        </AnalyticsChart>
        <AnalyticsChart title="Type distribution" subtitle="Stored emergency.type values">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.metrics.typeDistribution}>
              <CartesianGrid stroke="rgba(125,176,255,0.12)" vertical={false} />
              <XAxis dataKey="type" stroke="#8ba0bd" tick={{ fill: "#8ba0bd", fontSize: 11 }} />
              <YAxis stroke="#8ba0bd" tick={{ fill: "#8ba0bd", fontSize: 11 }} width={28} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#e11d48" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AnalyticsChart>
        <AnalyticsChart title="Status distribution" subtitle="active / pending / acknowledged / resolved">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.metrics.statusDistribution}>
              <CartesianGrid stroke="rgba(125,176,255,0.12)" vertical={false} />
              <XAxis dataKey="status" stroke="#8ba0bd" tick={{ fill: "#8ba0bd", fontSize: 11 }} />
              <YAxis stroke="#8ba0bd" tick={{ fill: "#8ba0bd", fontSize: 11 }} width={28} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#22d3ee" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AnalyticsChart>
        <AnalyticsChart title="Severity distribution" subtitle="Stored emergency.severity values">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.metrics.severityDistribution}>
              <CartesianGrid stroke="rgba(125,176,255,0.12)" vertical={false} />
              <XAxis dataKey="severity" stroke="#8ba0bd" tick={{ fill: "#8ba0bd", fontSize: 11 }} />
              <YAxis stroke="#8ba0bd" tick={{ fill: "#8ba0bd", fontSize: 11 }} width={28} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AnalyticsChart>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {data.unavailable.map((item) => (
          <UnavailableState key={item.key} title={item.key} detail={item.message} />
        ))}
      </div>
    </div>
  );
}
