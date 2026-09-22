import { useEffect, useState } from 'react'
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
  const [audiencia, setAudiencia] = useState<Audiencia | null>(
    providedAudiencia ?? null,
  )
  const [loading, setLoading] = useState(providedAudiencia === undefined)
  const [error, setError] = useState<string | null>(null)
  const id = providedAudiencia?.IdAudiencia ?? selectedAudienciaId

  useEffect(() => {
    if (providedAudiencia !== undefined) {
      return
    }

    if (id === null) {
      return
    }

    let cancelled = false
    void Promise.resolve()
      .then(() => audienciaDataRepository.getById(id))
      .then((result) => {
        if (!cancelled) {
          setAudiencia(result)
          setLoading(false)
          setError(null)
        }
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setError(reason instanceof Error ? reason.message : 'Error desconocido')
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [id, providedAudiencia])

  return {
    audiencia: providedAudiencia ?? (id === null ? null : audiencia),
    loading: providedAudiencia === undefined && id !== null && loading,
    error: providedAudiencia === undefined && id !== null ? error : null,
  }
}
