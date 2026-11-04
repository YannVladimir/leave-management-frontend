import { useCallback, useEffect, useState } from "react";

interface UseAsyncState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  reload: () => void;
}

/**
 * Runs an async fetcher on mount (and whenever `deps` changes) and exposes
 * data/error/loading state. Errors from the fetcher are captured and
 * surfaced to the caller rather than being swallowed, so the UI can show a
 * real failure state instead of silently looking "empty" or "successful".
 */
export function useAsync<T>(
  fetcher: () => Promise<T>,
  deps: ReadonlyArray<unknown> = [],
): UseAsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableFetcher = useCallback(fetcher, deps);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    stableFetcher()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [stableFetcher, reloadToken]);

  const reload = useCallback(() => setReloadToken((t) => t + 1), []);

  return { data, error, isLoading, reload };
}
