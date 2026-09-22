import { useEffect, useState } from 'react'
import { documentosDataRepository } from '../data/sharepoint/realRepository'
import type { SharePointDocumentSummary } from '../data/sharepoint/documentosRepository'

export function useDocumentos(): {
  documentos: readonly SharePointDocumentSummary[]
  loading: boolean
  error: string | null
} {
  const [documentos, setDocumentos] = useState<readonly SharePointDocumentSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void Promise.resolve()
      .then(() => documentosDataRepository.listSummaries())
      .then((result) => {
        if (!cancelled) {
          setDocumentos(result)
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
    return () => {
      cancelled = true
    }
  }, [])

  return { documentos, loading, error }
}
