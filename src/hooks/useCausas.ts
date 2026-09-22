import { useEffect, useState } from 'react'
import { audienciaDataRepository } from '../data/dataRepositories'
import type { Causa } from '../data/types/causa'

export function useCausas(): {
  causas: Causa[]
  loading: boolean
  error: string | null
} {
  const [causas, setCausas] = useState<Causa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void Promise.resolve()
      .then(() => audienciaDataRepository.getCausas())
      .then((result) => {
        if (!cancelled) {
          setCausas(result)
          setError(null)
          setLoading(false)
        }
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setError(
            reason instanceof Error ? reason.message : 'Error desconocido',
          )
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { causas, loading, error }
}
