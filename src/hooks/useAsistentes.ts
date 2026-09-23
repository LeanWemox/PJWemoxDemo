import { useQuery } from '@tanstack/react-query'
import { asistenteDataRepository } from '../data/dataRepositories'
import type { Asistente } from '../data/types/asistente'
import { useAppStore } from '../state/appStore'

export function useAsistentes(): { asistentes: Asistente[]; loading: boolean; error: string | null } {
  const audienciaId = useAppStore((state) => state.selectedAudienciaId)
  const query = useQuery({
    queryKey: ['asistentes', { audienciaId, presente: true }],
    queryFn: () => asistenteDataRepository.getPresentesByAudienciaId(audienciaId as number),
    enabled: audienciaId !== null,
  })
  return {
    asistentes: audienciaId === null ? [] : query.data ?? [],
    loading: audienciaId !== null && query.isLoading,
    error: audienciaId === null ? null : query.error instanceof Error ? query.error.message : null,
  }
}
