"use client";

import { useEffect, useRef } from "react";
import { hasValidCoordinates } from "@/lib/api/normalize";
import type { Emergency } from "@/lib/types";

interface LeafletEmergencyMapProps {
  emergencies: Emergency[];
  height?: number;
}

export function LeafletEmergencyMap({
  emergencies,
  height = 520,
}: LeafletEmergencyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const points = emergencies.filter(hasValidCoordinates);
  const pointKey = points.map((item) => `${item.id}:${item.latitude}:${item.longitude}:${item.status}`).join("|");

  useEffect(() => {
    const element = containerRef.current;
    const mapped = emergencies.filter(hasValidCoordinates);
    if (!element || mapped.length === 0) {
      return;
    }

    let cancelled = false;
    let map: import("leaflet").Map | undefined;

    async function mount() {
      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !element) return;

      const first = mapped[0];
      map = L.map(element, {
        zoomControl: true,
        attributionControl: true,
      }).setView([first.latitude, first.longitude], mapped.length === 1 ? 13 : 5);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 18,
      }).addTo(map);

      const bounds = L.latLngBounds([]);
      for (const item of mapped) {
        const color =
          item.status === "resolved"
            ? "#8ba0bd"
            : item.priority === "CRITICAL"
              ? "#e11d48"
              : "#f97316";
        const marker = L.circleMarker([item.latitude, item.longitude], {
          radius: 8,
          color,
          fillColor: color,
          fillOpacity: 0.85,
          weight: 2,
        }).addTo(map);
        marker.bindPopup(
          `<strong>${item.id}</strong><br/>${item.type}<br/>${item.status}<br/>${item.locationLabel}`,
        );
        bounds.extend([item.latitude, item.longitude]);
      }

      if (mapped.length > 1) {
        map.fitBounds(bounds.pad(0.2));
      }
    }

    void mount();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [emergencies, pointKey]);

  if (points.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-line bg-[#07111f] text-sm text-muted"
        style={{ minHeight: height }}
      >
        No emergency locations available.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="overflow-hidden rounded-xl border border-line"
      style={{ minHeight: height, height }}
    />
  );
}
