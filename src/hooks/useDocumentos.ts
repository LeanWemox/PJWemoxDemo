import { useQuery } from '@tanstack/react-query'
import { documentosDataRepository } from '../data/sharepoint/realRepository'
import type { SharePointDocumentSummary } from '../data/sharepoint/documentosRepository'

export function useDocumentos(): {
  documentos: readonly SharePointDocumentSummary[]
  loading: boolean
  error: string | null
} {
  const query = useQuery({
    queryKey: ['documentos'],
    queryFn: () => documentosDataRepository.listSummaries(),
  })
  return {
    documentos: query.data ?? [],
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  }
}
