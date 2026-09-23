import { useQuery } from '@tanstack/react-query'
import { audienciaDataRepository } from '../data/dataRepositories'
import type { Audiencia } from '../data/types/audiencia'
import { useAppStore } from '../state/appStore'

export function useNotas(): { audiencias: Audiencia[]; loading: boolean; error: string | null } {
  const audienciaId = useAppStore((state) => state.selectedAudienciaId)
  const query = useQuery({
    queryKey: ['audiencia-notas', audienciaId],
    queryFn: async () => {
      const audiencia = await audienciaDataRepository.getById(audienciaId as number)
      return audiencia === null ? [] : [audiencia]
    },
    enabled: audienciaId !== null,
  })
  return {
    audiencias: audienciaId === null ? [] : query.data ?? [],
    loading: audienciaId !== null && query.isLoading,
    error: audienciaId === null ? null : query.error instanceof Error ? query.error.message : null,
  }
}
