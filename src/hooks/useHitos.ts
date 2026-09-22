import { useEffect, useState } from 'react'
import { hitoDataRepository } from '../data/dataRepositories'
import type { Hito } from '../data/types/hito'
import { useAppStore } from '../state/appStore'

export function useHitos(): { hitos: Hito[]; loading: boolean; error: string | null } {
  const audienciaId = useAppStore((state) => state.selectedAudienciaId)
  const [hitos, setHitos] = useState<Hito[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadedAudienciaId, setLoadedAudienciaId] = useState<number | null>(null)

  useEffect(() => {
    if (audienciaId === null) {
      return
    }
    let cancelled = false
    void Promise.resolve()
      .then(() => hitoDataRepository.getByAudienciaId(audienciaId))
      .then((result) => {
        if (!cancelled) {
          setHitos(result)
          setLoadedAudienciaId(audienciaId)
          setError(null)
          setLoading(false)
        }
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setError(
            reason instanceof Error
              ? `No se pudieron cargar los hitos desde SQL Server: ${reason.message}`
              : 'No se pudieron cargar los hitos desde SQL Server.',
          )
          setLoadedAudienciaId(audienciaId)
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [audienciaId])

  return {
    hitos: audienciaId === null ? [] : hitos,
    loading:
      audienciaId !== null &&
      (loading || loadedAudienciaId !== audienciaId),
    error: audienciaId === null ? null : error,
  }
}
