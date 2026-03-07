import { getUsuarios } from '../api/usuariosApi';
import useApi from './useApi';

export default function useUsuarios() {
  return useApi(getUsuarios);
}