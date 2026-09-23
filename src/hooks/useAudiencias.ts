import { useQuery } from '@tanstack/react-query'
import { audienciaDataRepository } from '../data/dataRepositories'
import type { Audiencia } from '../data/types/audiencia'
import { useSearchStore } from '../state/searchStore'

export function useAudiencias(): {
  audiencias: Audiencia[]
  loading: boolean
  error: string | null
} {
  const text = useSearchStore((state) => state.text)
  const fromDate = useSearchStore((state) => state.fromDate)
  const toDate = useSearchStore((state) => state.toDate)
  const query = useQuery({
    queryKey: ['audiencias', { text, fromDate, toDate }],
    queryFn: () => audienciaDataRepository.search({ text, fromDate, toDate }),
  })

  return {
    audiencias: query.data ?? [],
    loading: query.isLoading,
    error: query.error instanceof Error
      ? `No se pudieron cargar las audiencias desde SQL Server: ${query.error.message}`
      : query.error === null
        ? null
        : 'No se pudieron cargar las audiencias desde SQL Server.',
  }
}
