import { getCitas } from '../api/citasApi';
import useApi from './useApi';

export default function useCitas() {
  return useApi(getCitas);
}