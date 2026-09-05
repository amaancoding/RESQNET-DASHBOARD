import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/common/Button";

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex min-h-[220px] flex-col items-center justify-center gap-2 px-6 text-center"
    >
      <AlertTriangle className="size-8 text-accent" aria-hidden="true" />
      <p className="text-sm font-medium text-ink">Error loading data</p>
      <p className="text-sm text-muted">{message}</p>
      {onRetry ? (
        <Button className="mt-2" variant="secondary" onClick={onRetry}>
          Retry
        </Button>
      ) : null}
    </div>
  );
}
