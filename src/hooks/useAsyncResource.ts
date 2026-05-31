import { useCallback, useEffect, useRef, useState } from 'react';
import type { DependencyList } from 'react';

export interface AsyncResource<T> {
  data?: T;
  loading: boolean;
  error?: string;
  refresh: () => Promise<void>;
}

export const useAsyncResource = <T,>(
  loader: () => Promise<T>,
  deps: DependencyList,
): AsyncResource<T> => {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const loaderRef = useRef(loader);

  useEffect(() => {
    loaderRef.current = loader;
  }, [loader]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      setData(await loaderRef.current());
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Error inesperado.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    // La lista de dependencias la define cada pantalla que consume el recurso.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, ...deps]);

  return { data, loading, error, refresh };
};
