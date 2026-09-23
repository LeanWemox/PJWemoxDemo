import { useQuery } from '@tanstack/react-query'
import { hitoDataRepository } from '../data/dataRepositories'
import type { Hito } from '../data/types/hito'
import { useAppStore } from '../state/appStore'

export function useHitos(): { hitos: Hito[]; loading: boolean; error: string | null } {
  const audienciaId = useAppStore((state) => state.selectedAudienciaId)
  const query = useQuery({
    queryKey: ['hitos', audienciaId],
    queryFn: () => hitoDataRepository.getByAudienciaId(audienciaId as number),
    enabled: audienciaId !== null,
  })

  return {
    hitos: audienciaId === null ? [] : query.data ?? [],
    loading: audienciaId !== null && query.isLoading,
    error: audienciaId === null
      ? null
      : query.error instanceof Error
        ? `No se pudieron cargar los hitos desde SQL Server: ${query.error.message}`
        : null,
  }
}
