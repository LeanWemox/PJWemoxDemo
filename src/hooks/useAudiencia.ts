import { useQuery } from '@tanstack/react-query'
import { audienciaDataRepository } from '../data/dataRepositories'
import type { Audiencia } from '../data/types/audiencia'
import { useAppStore } from '../state/appStore'

export function useAudiencia(
  providedAudiencia: Audiencia | null | undefined,
): {
  audiencia: Audiencia | null
  loading: boolean
  error: string | null
} {
  const selectedAudienciaId = useAppStore((state) => state.selectedAudienciaId)
  const id = providedAudiencia?.IdAudiencia ?? selectedAudienciaId
  const query = useQuery({
    queryKey: ['audiencia', id],
    queryFn: () => audienciaDataRepository.getById(id as number),
    enabled: providedAudiencia === undefined && id !== null,
  })

  return {
    audiencia: providedAudiencia ?? (id === null ? null : query.data ?? null),
    loading: providedAudiencia === undefined && id !== null && query.isLoading,
    error: providedAudiencia === undefined && id !== null
      ? query.error instanceof Error ? query.error.message : null
      : null,
  }
}
