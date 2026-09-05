export function LoadingState({ label = "Loading operations data" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[220px] flex-col items-center justify-center gap-3"
    >
      <div className="size-8 animate-spin rounded-full border-2 border-cyan/20 border-t-cyan" />
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}
