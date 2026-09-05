"use client";

import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { PageHeader } from "@/components/common/PageHeader";
import { UnavailableState } from "@/components/common/UnavailableState";
import { getResponders } from "@/lib/api";
import { useAsyncData } from "@/lib/hooks/use-async-data";

export default function RespondersPage() {
  const { data, loading, error, retry } = useAsyncData(getResponders);

  if (loading) return <LoadingState label="Checking responder data" />;
  if (error || !data) return <ErrorState message={error ?? "Responders unavailable"} onRetry={retry} />;

  return (
    <div>
      <PageHeader
        eyebrow="Dispatch desk"
        title="Responders"
        description="The backend does not currently store a responder roster, locations, or availability."
      />
      <UnavailableState
        title="Responder data is not available yet."
        detail={
          data.message ||
          "Names, locations, response times, and duty status will appear here only after a responder collection is persisted."
        }
      />
    </div>
  );
}
