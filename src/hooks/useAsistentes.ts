import { useEffect, useState } from 'react'
import { asistenteDataRepository } from '../data/dataRepositories'
import type { Asistente } from '../data/types/asistente'
import { useAppStore } from '../state/appStore'

export function useAsistentes(): { asistentes: Asistente[]; loading: boolean; error: string | null } {
  const audienciaId = useAppStore((state) => state.selectedAudienciaId)
  const [asistentes, setAsistentes] = useState<Asistente[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    if (audienciaId === null) return
    let cancelled = false
    void Promise.resolve()
      .then(() => asistenteDataRepository.getPresentesByAudienciaId(audienciaId))
      .then((result) => {
        if (!cancelled) {
          setAsistentes(result)
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
    asistentes: audienciaId === null ? [] : asistentes,
    loading: audienciaId !== null && loading,
    error: audienciaId === null ? null : error,
  }
}
