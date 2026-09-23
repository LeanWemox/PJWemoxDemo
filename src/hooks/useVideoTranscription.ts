import { useQuery } from '@tanstack/react-query'
import { videoDataRepository } from '../data/dataRepositories'
import { useAppStore } from '../state/appStore'

export function useVideoTranscription(): {
  transcription: string | null
  loading: boolean
  error: string | null
} {
  const audienciaId = useAppStore((state) => state.selectedAudienciaId)
  const query = useQuery({
    queryKey: ['video-transcription', audienciaId],
    queryFn: () => videoDataRepository.getTranscriptionByAudienciaId(audienciaId as number),
    enabled: audienciaId !== null,
  })

  return {
    transcription: query.data ?? null,
    loading: audienciaId !== null && query.isLoading,
    error: audienciaId === null
      ? null
      : query.error instanceof Error
        ? query.error.message
        : null,
  }
}
