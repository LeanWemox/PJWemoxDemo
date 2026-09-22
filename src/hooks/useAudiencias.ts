import { useEffect, useState } from 'react'
import { audienciaDataRepository } from '../data/dataRepositories'
import type { Audiencia } from '../data/types/audiencia'
import { useSearchStore } from '../state/searchStore'

export function useAudiencias(): {
  audiencias: Audiencia[]
  loading: boolean
  error: string | null
} {
  const text = useSearchStore((state) => state.text)
  const fromDate = useSearchStore((state) => state.fromDate)
  const toDate = useSearchStore((state) => state.toDate)
  const [audiencias, setAudiencias] = useState<Audiencia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void Promise.resolve()
      .then(() => audienciaDataRepository.search({ text, fromDate, toDate }))
      .then((result) => {
        if (!cancelled) {
          setAudiencias(result)
          setError(null)
          setLoading(false)
        }
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setError(
            reason instanceof Error
              ? `No se pudieron cargar las audiencias desde SQL Server: ${reason.message}`
              : 'No se pudieron cargar las audiencias desde SQL Server.',
          )
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [fromDate, text, toDate])

  return { audiencias, loading, error }
}
