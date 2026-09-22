import { useEffect, useState } from 'react'
import { videoDataRepository } from '../data/dataRepositories'
import { useAppStore } from '../state/appStore'

export function useVideoUrl(providedUrl: string): {
  url: string
  loading: boolean
  error: string | null
} {
  const audienciaId = useAppStore((state) => state.selectedAudienciaId)
  const [url, setUrl] = useState(providedUrl)
  const [loading, setLoading] = useState(providedUrl === '' && audienciaId !== null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (providedUrl !== '' || audienciaId === null) {
      return
    }
    let cancelled = false
    void Promise.resolve()
      .then(() => videoDataRepository.getUrlByAudienciaId(audienciaId))
      .then((result) => {
        if (!cancelled) {
          setUrl(result ?? '')
          setLoading(false)
          setError(result === null ? 'No se encontró un video para esta audiencia.' : null)
        }
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setLoading(false)
          setError(
            reason instanceof Error
              ? `No se pudo cargar el video desde SharePoint: ${reason.message}`
              : 'No se pudo cargar el video desde SharePoint.',
          )
        }
      })
    return () => {
      cancelled = true
    }
  }, [audienciaId, providedUrl])

  return {
    url: providedUrl || url,
    loading: providedUrl === '' && loading,
    error: providedUrl === '' ? error : null,
  }
}
