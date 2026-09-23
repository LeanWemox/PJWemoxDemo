import { useQuery } from '@tanstack/react-query'
import { audienciaDataRepository } from '../data/dataRepositories'
import type { Causa } from '../data/types/causa'

export function useCausas(): {
  causas: Causa[]
  loading: boolean
  error: string | null
} {
  const query = useQuery({
    queryKey: ['causas'],
    queryFn: () => audienciaDataRepository.getCausas(),
  })

  return {
    causas: query.data ?? [],
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  }
}
