// 1. Hook de dominio para citas (lista + CRUD)
import { useCallback, useEffect, useState } from 'react';
import { citasApi } from '../api/citasApi.js';
import useApi from './useApi';

export default function useCitas({ autoload = true } = {}) {
  const [citas, setCitas] = useState([]);
  const { loading, error, setError, execute } = useApi();

  // 2. Cargar listado principal
  const loadCitas = useCallback(async () => {
    const data = await execute(citasApi.getAll);
    setCitas(Array.isArray(data) ? data : []);
    return data;
  }, [execute]);

  // 3. Operaciones CRUD sincronizadas con recarga
  const createCita = useCallback(
    async (payload) => {
      await execute(citasApi.create, payload);
      return loadCitas();
    },
    [execute, loadCitas]
  );

  const updateCita = useCallback(
    async (id, payload) => {
      await execute(citasApi.update, id, payload);
      return loadCitas();
    },
    [execute, loadCitas]
  );

  const removeCita = useCallback(
    async (id) => {
      await execute(citasApi.remove, id);
      return loadCitas();
    },
    [execute, loadCitas]
  );

  useEffect(() => {
    if (autoload) {
      loadCitas().catch(() => {});
    }
  }, [autoload, loadCitas]);

  return {
    citas,
    loading,
    error,
    setError,
    loadCitas,
    createCita,
    updateCita,
    removeCita,
  };
}