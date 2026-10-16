"use client";

import { useCallback, useEffect, useState } from "react";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  key: string;
}

export function useAsyncData<T>(loader: () => Promise<T>, refreshKey = "default") {
  const [reloadToken, setReloadToken] = useState(0);
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
    key: refreshKey,
  });

  if (state.key !== refreshKey) {
    setState({
      data: null,
      loading: true,
      error: null,
      key: refreshKey,
    });
  }

  useEffect(() => {
    let cancelled = false;
    const timeoutId = window.setTimeout(() => {
      if (!cancelled) {
        setState({
          data: null,
          loading: false,
          error: "Timed out waiting for the admin API. Confirm Express is running.",
          key: refreshKey,
        });
      }
    }, 15_000);

    loader()
      .then((result) => {
        if (!cancelled) {
          setState({
            data: result,
            loading: false,
            error: null,
            key: refreshKey,
          });
        }
      })
      .catch((cause: unknown) => {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: cause instanceof Error ? cause.message : "Unable to load data",
            key: refreshKey,
          });
        }
      })
      .finally(() => {
        window.clearTimeout(timeoutId);
      });

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
    // refreshKey and reloadToken control refetch; loader is created per page module or keyed id.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey, reloadToken]);

  const retry = useCallback(() => {
    setState((current) => ({ ...current, loading: true, error: null }));
    setReloadToken((value) => value + 1);
  }, []);

  return { data: state.data, loading: state.loading, error: state.error, retry };
}
