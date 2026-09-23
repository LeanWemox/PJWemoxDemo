import { useQuery } from '@tanstack/react-query'
import { videoDataRepository } from '../data/dataRepositories'
import { useAppStore } from '../state/appStore'

export function useVideoUrl(providedUrl: string): {
  url: string
  loading: boolean
  error: string | null
} {
  const audienciaId = useAppStore((state) => state.selectedAudienciaId)
  const query = useQuery({
    queryKey: ['video-url', audienciaId],
    queryFn: () => videoDataRepository.getUrlByAudienciaId(audienciaId as number),
    enabled: providedUrl === '' && audienciaId !== null,
  })

  return {
    url: providedUrl || query.data || '',
    loading: providedUrl === '' && query.isLoading,
    error: providedUrl !== ''
      ? null
      : query.error instanceof Error
        ? `No se pudo cargar el video desde SQL Server: ${query.error.message}`
        : query.data === null
          ? 'No se encontró un video para esta audiencia.'
          : null,
  }
}
