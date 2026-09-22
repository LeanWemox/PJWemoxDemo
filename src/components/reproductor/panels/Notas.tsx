import type { ReactElement } from 'react'
import type { Audiencia } from '../../../data/types/audiencia'
import { useAppStore } from '../../../state/appStore'

interface NotasProps {
  audiencias: readonly Audiencia[]
  isLoading?: boolean
  error?: string | null
}

export function Notas({
  audiencias,
  isLoading = false,
  error = null,
}: NotasProps): ReactElement {
  const selectedAudienciaId = useAppStore((state) => state.selectedAudienciaId)

  if (isLoading) return <p className="status-message" role="status">Cargando notas...</p>
  if (error !== null) return <p className="status-message" role="alert">No se pudieron cargar las notas: {error}</p>

  const audiencia = audiencias.find(
    (item) => item.IdAudiencia === selectedAudienciaId,
  )

  if (audiencia === undefined) {
    return <p className="status-message" role="status">No se encontraron notas.</p>
  }

  return (
    <section aria-label="Notas" className="content-panel">
      <h2>Notas</h2>
      <p>{audiencia.Notas ?? 'Sin notas u observaciones.'}</p>
    </section>
  )
}
