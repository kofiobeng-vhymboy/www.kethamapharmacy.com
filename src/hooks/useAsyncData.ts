import { useCallback, useEffect, useState, useRef, type DependencyList } from 'react';

export function useAsyncData<T>(loader: () => Promise<T>, dependencies: DependencyList) {
  const requestId = useRef(0);
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    const current = ++requestId.current;
    setIsLoading(true);
    setError(null);
    try {
      const result = await loader();
      if (current === requestId.current) setData(result);
    } catch (cause) {
      if (current === requestId.current) setError(cause instanceof Error ? cause.message : 'Unable to load this information.');
    } finally {
      if (current === requestId.current) setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  useEffect(() => { void reload(); return () => { requestId.current++; }; }, [reload]);
  return { data, isLoading, error, reload };
}
