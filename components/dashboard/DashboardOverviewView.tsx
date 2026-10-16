"use client";

import { Activity, CheckCircle2, Smartphone, Siren, TriangleAlert, CalendarDays } from "lucide-react";
import { Card, CardHeader } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { EmergencyChart } from "@/components/dashboard/EmergencyChart";
import { EmergencyTypeChart } from "@/components/dashboard/EmergencyTypeChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { RecentEmergencies } from "@/components/dashboard/RecentEmergencies";
import { StatCard } from "@/components/dashboard/StatCard";
import { SystemStatus } from "@/components/dashboard/SystemStatus";
import type { DashboardOverview } from "@/lib/types";

export function DashboardOverviewView({ data }: { data: DashboardOverview }) {
  return (
    <div>
      <PageHeader
        eyebrow="Operations overview"
        title="Command dashboard"
        description="Statistics calculated from MongoDB emergency documents. Mesh hop counts and responder telemetry are not stored by the backend."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard
          label="Total Emergencies"
          value={data.stats.totalEmergencies}
          detail="Persisted SOS records"
          icon={Siren}
          tone="neutral"
        />
        <StatCard
          label="Emergencies Today"
          value={data.stats.emergenciesToday}
          detail="UTC calendar day"
          icon={CalendarDays}
          tone="info"
        />
        <StatCard
          label="Active Emergencies"
          value={data.stats.activeEmergencies}
          detail="Active, pending, or acknowledged"
          icon={Activity}
          tone="info"
        />
        <StatCard
          label="Critical Emergencies"
          value={data.stats.criticalEmergencies}
          detail="Severity = critical"
          icon={TriangleAlert}
          tone="critical"
        />
        <StatCard
          label="Resolved Emergencies"
          value={data.stats.resolvedEmergencies}
          detail="Closed in MongoDB"
          icon={CheckCircle2}
          tone="success"
        />
        <StatCard
          label="Observed Devices"
          value={data.stats.observedDevices}
          detail="Distinct sourceNodeId values"
          icon={Smartphone}
        />
      </div>
      <p className="mt-3 text-xs text-muted">
        {data.unavailable.registeredNodes}. {data.unavailable.messagesForwarded}.
      </p>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Emergency trend"
            subtitle="Daily SOS volume from persisted timestamps (last 14 UTC days)"
          />
          <EmergencyChart data={data.trend} />
        </Card>
        <Card>
          <CardHeader title="Emergency type distribution" subtitle="Counts of stored type values" />
          {data.byType.length === 0 ? (
            <EmptyState title="No emergency types yet" detail="Types appear after the Android app posts SOS records." />
          ) : (
            <EmergencyTypeChart data={data.byType} />
          )}
        </Card>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Recent emergencies" subtitle="Latest documents from MongoDB" />
          {data.recentEmergencies.length === 0 ? (
            <EmptyState
              title="No emergencies stored yet"
              detail="Records appear here after POST /api/emergency from the Android app."
            />
          ) : (
            <RecentEmergencies rows={data.recentEmergencies} />
          )}
        </Card>
        <div className="space-y-4">
          <Card>
            <CardHeader title="System status" subtitle="Only components the backend can actually report" />
            <SystemStatus items={data.systemStatus} />
          </Card>
          <Card>
            <CardHeader title="Recent activity" subtitle="Derived from stored emergencies" />
            {data.recentActivity.length === 0 ? (
              <EmptyState title="No recent activity" detail="Activity is generated from emergency documents." />
            ) : (
              <RecentActivity items={data.recentActivity} />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
