// 1. Hook de dominio para perros (lista + CRUD)
import { useCallback, useEffect, useState } from 'react';
import { perrosApi } from '../api/perrosApi.js';
import useApi from './useApi';

export default function usePerros({ autoload = true } = {}) {
  const [perros, setPerros] = useState([]);
  const { loading, error, setError, execute } = useApi();

  // 2. Cargar listado principal
  const loadPerros = useCallback(async () => {
    const data = await execute(perrosApi.getAll);
    setPerros(Array.isArray(data) ? data : []);
    return data;
  }, [execute]);

  // 3. Operaciones CRUD sincronizadas con recarga
  const createPerro = useCallback(
    async (payload) => {
      await execute(perrosApi.create, payload);
      return loadPerros();
    },
    [execute, loadPerros]
  );

  const updatePerro = useCallback(
    async (id, payload) => {
      await execute(perrosApi.update, id, payload);
      return loadPerros();
    },
    [execute, loadPerros]
  );

  const removePerro = useCallback(
    async (id) => {
      await execute(perrosApi.remove, id);
      return loadPerros();
    },
    [execute, loadPerros]
  );

  useEffect(() => {
    if (autoload) {
      loadPerros().catch(() => {});
    }
  }, [autoload, loadPerros]);

  return {
    perros,
    loading,
    error,
    setError,
    loadPerros,
    createPerro,
    updatePerro,
    removePerro,
  };
}