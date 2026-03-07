import { getPerros } from '../api/perrosApi';
import useApi from './useApi';

export default function usePerros() {
  return useApi(getPerros);
}