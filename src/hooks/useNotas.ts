import { useEffect, useState } from 'react'
import { audienciaDataRepository } from '../data/dataRepositories'
import type { Audiencia } from '../data/types/audiencia'
import { useAppStore } from '../state/appStore'

export function useNotas(): { audiencias: Audiencia[]; loading: boolean; error: string | null } {
  const audienciaId = useAppStore((state) => state.selectedAudienciaId)
  const [audiencias, setAudiencias] = useState<Audiencia[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    if (audienciaId === null) return
    let cancelled = false
    void Promise.resolve()
      .then(() => audienciaDataRepository.search({ text: '', fromDate: null, toDate: null }))
      .then((result) => {
        if (!cancelled) {
          setAudiencias(result.filter((item) => item.IdAudiencia === audienciaId))
          setError(null)
          setLoading(false)
        }
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setError(reason instanceof Error ? reason.message : 'Error desconocido')
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [audienciaId])
  return {
    audiencias: audienciaId === null ? [] : audiencias,
    loading: audienciaId !== null && loading,
    error: audienciaId === null ? null : error,
  }
}
