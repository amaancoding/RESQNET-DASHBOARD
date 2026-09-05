"use client";

import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { PageHeader } from "@/components/common/PageHeader";
import { UnavailableState } from "@/components/common/UnavailableState";
import { getResqAiSnapshot } from "@/lib/api";
import { useAsyncData } from "@/lib/hooks/use-async-data";

export default function ResqAiPage() {
  const { data, loading, error, retry } = useAsyncData(getResqAiSnapshot);

  if (loading) return <LoadingState label="Checking ResQ AI analytics" />;
  if (error || !data) return <ErrorState message={error ?? "ResQ AI analytics unavailable"} onRetry={retry} />;

  return (
    <div>
      <PageHeader
        eyebrow="Offline-first knowledge base"
        title="ResQ AI"
        description="First-aid answers can be served by POST /api/first-aid, but query logs are not persisted."
      />
      <UnavailableState
        title="ResQ AI analytics are not available yet."
        detail={
          data.message ||
          "Raw first-aid questions are not stored, to avoid collecting unnecessary medical text. Usage charts will appear only if a privacy-conscious log is added later."
        }
      />
    </div>
  );
}
