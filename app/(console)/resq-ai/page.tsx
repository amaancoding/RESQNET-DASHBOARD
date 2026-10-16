"use client";

import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardHeader } from "@/components/common/Card";
import { ResqAiAssistant } from "@/components/resq-ai/ResqAiAssistant";
import { getResqAiSnapshot } from "@/lib/api";
import { useAsyncData } from "@/lib/hooks/use-async-data";

export default function ResqAiPage() {
  const { data, loading, error, retry } = useAsyncData(getResqAiSnapshot);

  if (loading) return <LoadingState label="Loading ResQ AI corpus status" />;
  if (error || !data) return <ErrorState message={error ?? "ResQ AI unavailable"} onRetry={retry} />;

  const dataset = data.available ? data.data?.dataset : null;
  const classifier = data.available ? data.data?.classifier : null;

  return (
    <div>
      <PageHeader
        eyebrow="First-aid retrieval"
        title="ResQ AI"
        description="Ask a first-aid question. Matches come from the cleaned emergency dataset through POST /api/resq-ai/analyze. This is assistance, not a diagnosis."
        demo={false}
      />

      {!data.available ? (
        <p className="mb-4 text-sm text-accent">{data.message}</p>
      ) : (
        <Card className="mb-4">
          <CardHeader
            title="Dataset in use"
            subtitle="Counts are from the cleaned CSV. Query text is not stored."
          />
          <dl className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Source rows</dt>
              <dd className="mt-1 text-lg font-semibold">{dataset?.sourceRows ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Usable Q&amp;A</dt>
              <dd className="mt-1 text-lg font-semibold">{dataset?.usableRows ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Categories</dt>
              <dd className="mt-1 text-lg font-semibold">{dataset?.categoryCount ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Method</dt>
              <dd className="mt-1 text-sm font-semibold">{data.data?.method ?? "—"}</dd>
            </div>
          </dl>
        </Card>
      )}

      {classifier?.available ? (
        <Card className="mb-4">
          <CardHeader
            title="Supervised intent model"
            subtitle="Held-out test metrics from models/evaluation.json. These are not live query accuracy."
          />
          <dl className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Model</dt>
              <dd className="mt-1 text-sm font-semibold">{classifier.model}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Features</dt>
              <dd className="mt-1 text-sm font-semibold">{classifier.featureExtraction}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Train / test</dt>
              <dd className="mt-1 text-sm font-semibold">
                {classifier.trainingSamples} / {classifier.testSamples}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Classes</dt>
              <dd className="mt-1 text-sm font-semibold">{classifier.classes}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Accuracy</dt>
              <dd className="mt-1 text-sm font-semibold">
                {classifier.accuracy != null ? `${(classifier.accuracy * 100).toFixed(1)}%` : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Macro F1</dt>
              <dd className="mt-1 text-sm font-semibold">
                {classifier.f1Macro != null ? `${(classifier.f1Macro * 100).toFixed(1)}%` : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Weighted F1</dt>
              <dd className="mt-1 text-sm font-semibold">
                {classifier.f1Weighted != null ? `${(classifier.f1Weighted * 100).toFixed(1)}%` : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Macro P / R</dt>
              <dd className="mt-1 text-sm font-semibold">
                {classifier.precisionMacro != null && classifier.recallMacro != null
                  ? `${(classifier.precisionMacro * 100).toFixed(1)}% / ${(classifier.recallMacro * 100).toFixed(1)}%`
                  : "—"}
              </dd>
            </div>
          </dl>
        </Card>
      ) : null}

      <ResqAiAssistant />
    </div>
  );
}
