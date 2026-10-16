"use client";

import { Card } from "@/components/common/Card";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { PageHeader } from "@/components/common/PageHeader";
import { UnavailableState } from "@/components/common/UnavailableState";
import { FeedbackTable } from "@/components/feedback/FeedbackTable";
import { getFeedback } from "@/lib/api";
import { useAsyncData } from "@/lib/hooks/use-async-data";

export default function FeedbackPage() {
  const { data, loading, error, retry } = useAsyncData(getFeedback);

  if (loading) return <LoadingState label="Loading feedback" />;
  if (error || !data) return <ErrorState message={error ?? "Feedback unavailable"} onRetry={retry} />;

  if (!data.available) {
    return (
      <div>
        <PageHeader
          eyebrow="Field reports"
          title="Feedback"
          description="The Android app does not currently submit feedback to the backend."
        />
        <UnavailableState
          title="Feedback collection is not connected yet."
          detail="No feedback documents exist in MongoDB. This table will show rating, category, message, date, and status when the phone app starts posting feedback."
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Field reports"
        title="Feedback"
        description={data.message}
      />
      <Card>
        <FeedbackTable rows={data.feedback} />
      </Card>
    </div>
  );
}
