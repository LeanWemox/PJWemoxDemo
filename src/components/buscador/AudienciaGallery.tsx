import type { Audiencia } from '../../data/types/audiencia'
import type { Causa } from '../../data/types/causa'
import type { ReactElement } from 'react'
import { AudienciaRow } from './AudienciaRow'

interface AudienciaGalleryProps {
  audiencias: readonly Audiencia[]
  causas?: readonly Causa[]
  isLoading?: boolean
  error?: string | null
  onNavigate?: (audiencia: Audiencia) => void
}

export function AudienciaGallery({
  audiencias,
  causas = [],
  isLoading = false,
  error = null,
  onNavigate,
}: AudienciaGalleryProps): ReactElement {
  if (isLoading) {
    return <p className="status-message" role="status">Cargando audiencias...</p>
  }

  if (error !== null) {
    return <p className="status-message" role="alert">No se pudieron cargar las audiencias: {error}</p>
  }

  const causasById = new Map(
    causas
      .filter((causa) => causa.IdCausa !== undefined)
      .map((causa) => [causa.IdCausa, causa]),
  )
  if (audiencias.length === 0) {
    return <p className="status-message" role="status">No se encontraron audiencias.</p>
  }

  return (
    <section aria-label="Resultados de audiencias" className="audiencia-gallery">
      {audiencias.map((audiencia) => (
        <AudienciaRow
          audiencia={audiencia}
          causa={
            audiencia.IdCausa === null
              ? undefined
              : causasById.get(audiencia.IdCausa)
          }
          key={audiencia.IdAudiencia}
          onNavigate={onNavigate}
        />
      ))}
    </section>
  )
}
