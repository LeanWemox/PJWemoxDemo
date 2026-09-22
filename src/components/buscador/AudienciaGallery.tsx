import type { Audiencia } from '../../data/types/audiencia'
import type { Causa } from '../../data/types/causa'
import type { ReactElement } from 'react'
import { useSearchStore } from '../../state/searchStore'
import { AudienciaRow } from './AudienciaRow'

interface AudienciaGalleryProps {
  audiencias: readonly Audiencia[]
  causas?: readonly Causa[]
  isLoading?: boolean
  error?: string | null
  onNavigate?: (audiencia: Audiencia) => void
}

function dateKey(value: string | null): string | null {
  if (value === null || value.trim() === '') {
    return null
  }

  return value.slice(0, 10)
}

export function AudienciaGallery({
  audiencias,
  causas = [],
  isLoading = false,
  error = null,
  onNavigate,
}: AudienciaGalleryProps): ReactElement {
  const text = useSearchStore((state) => state.text)
  const fromDate = useSearchStore((state) => state.fromDate)
  const toDate = useSearchStore((state) => state.toDate)

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
  const normalizedText = text.trim()
  const filteredAudiencias = audiencias
    .filter((audiencia) => {
      const codigo = audiencia.CodBarras === null ? '' : audiencia.CodBarras
      const causa = audiencia.IdCausa === null
        ? ''
        : causasById.get(audiencia.IdCausa)?.Caratula ?? ''
      const audienciaDate = dateKey(audiencia.Fecha)

      return (
        (normalizedText === '' ||
          codigo.toLocaleLowerCase().includes(normalizedText.toLocaleLowerCase()) ||
          causa.toLocaleLowerCase().includes(normalizedText.toLocaleLowerCase())) &&
        (fromDate === null ||
          (audienciaDate !== null && audienciaDate >= fromDate)) &&
        (toDate === null ||
          (audienciaDate !== null && audienciaDate <= toDate))
      )
    })
    .sort((left, right) => {
      const leftDate = dateKey(left.Fecha)
      const rightDate = dateKey(right.Fecha)

      if (leftDate === rightDate) {
        return 0
      }

      if (leftDate === null) {
        return 1
      }

      if (rightDate === null) {
        return -1
      }

      return rightDate.localeCompare(leftDate)
    })

  if (filteredAudiencias.length === 0) {
    return <p className="status-message" role="status">No se encontraron audiencias.</p>
  }

  return (
    <section aria-label="Resultados de audiencias" className="audiencia-gallery">
      {filteredAudiencias.map((audiencia) => (
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
