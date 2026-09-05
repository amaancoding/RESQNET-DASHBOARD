import { Badge } from "@/components/common/Badge";

export function DemoBanner() {
  return (
    <div className="border-b border-line bg-cyan/10 px-4 py-2 text-center text-xs text-cyan sm:text-left">
      Authenticated admin session · emergency data from MongoDB via Express.
      Mesh, responder, and ResQ AI telemetry is not stored yet.
      <span className="ml-2 hidden sm:inline">
        <Badge tone="info">No fabricated live telemetry</Badge>
      </span>
    </div>
  );
}
