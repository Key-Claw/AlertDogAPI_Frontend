// 1. Hook de dominio para usuarios (lista + CRUD)
import { useCallback, useEffect, useState } from 'react';
import { usuariosApi } from '../api/usuariosApi.js';
import useApi from './useApi';

export default function useUsuarios({ autoload = true } = {}) {
  const [usuarios, setUsuarios] = useState([]);
  const { loading, error, setError, execute } = useApi();

  // 2. Cargar listado principal
  const loadUsuarios = useCallback(async () => {
    const data = await execute(usuariosApi.getAll);
    setUsuarios(Array.isArray(data) ? data : []);
    return data;
  }, [execute]);

  // 3. Operaciones CRUD sincronizadas con recarga
  const createUsuario = useCallback(
    async (payload) => {
      await execute(usuariosApi.create, payload);
      return loadUsuarios();
    },
    [execute, loadUsuarios]
  );

  const updateUsuario = useCallback(
    async (id, payload) => {
      await execute(usuariosApi.update, id, payload);
      return loadUsuarios();
    },
    [execute, loadUsuarios]
  );

  const removeUsuario = useCallback(
    async (id) => {
      await execute(usuariosApi.remove, id);
      return loadUsuarios();
    },
    [execute, loadUsuarios]
  );

  useEffect(() => {
    if (autoload) {
      loadUsuarios().catch(() => {});
    }
  }, [autoload, loadUsuarios]);

  return {
    usuarios,
    loading,
    error,
    setError,
    loadUsuarios,
    createUsuario,
    updateUsuario,
    removeUsuario,
  };
}