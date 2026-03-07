import { useCallback, useState } from 'react';

// Generic async hook to keep loading/error state close to API actions.
export default function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Ejecutar una llamada async estandarizando loading y error
  const execute = useCallback(async (apiFn, ...args) => {
    setLoading(true);
    setError(null);
    try {
      return await apiFn(...args);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, setError, execute };
}