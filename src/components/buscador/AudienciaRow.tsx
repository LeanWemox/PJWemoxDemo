import type { KeyboardEvent, ReactElement } from 'react'
import type { Audiencia } from '../../data/types/audiencia'
import type { Causa } from '../../data/types/causa'
import { useAppStore } from '../../state/appStore'

interface AudienciaRowProps {
  audiencia: Audiencia
  causa?: Causa
  onNavigate?: (audiencia: Audiencia) => void
}

function formatDate(value: string | null): string {
  if (value === null || value.trim() === '') {
    return 'Sin fecha'
  }

  const datePart = value.slice(0, 10)
  const date = new Date(`${datePart}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('es-AR').format(date)
}

export function AudienciaRow({
  audiencia,
  causa,
  onNavigate,
}: AudienciaRowProps): ReactElement {
  const selectAudiencia = useAppStore((state) => state.selectAudiencia)

  const handleSelect = (): void => {
    selectAudiencia(audiencia.IdAudiencia)

    if (onNavigate !== undefined) {
      onNavigate(audiencia)
      return
    }

    window.history.pushState(
      { audienciaId: audiencia.IdAudiencia },
      '',
      `/reproductor/${audiencia.IdAudiencia}`,
    )
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleSelect()
    }
  }

  return (
    <article
      aria-label={`Audiencia ${audiencia.CodBarras ?? audiencia.IdAudiencia}`}
      className="audiencia-row"
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="audiencia-row__summary">
        <strong className="audiencia-row__title">
          {audiencia.TituloAudiencia ?? 'Audiencia judicial'}
        </strong>
        <span className="audiencia-row__type">
          {audiencia.TipoAudiencia ?? 'Audiencia'}
        </span>
        <span className="audiencia-row__code">
          {audiencia.CodBarras ?? `Expediente ${audiencia.IdAudiencia}`}
        </span>
      </div>
      <div className="audiencia-row__court">
        <strong>{causa?.NombreOrganismo ?? 'Poder Judicial de Corrientes'}</strong>
        <span>
          {causa?.LocalidadJuzgado ??
            causa?.Caratula ??
            (audiencia.IdCausa === null
              ? 'Causa sin organismo asociado'
              : `Causa #${audiencia.IdCausa}`)}
        </span>
      </div>
      <time className="audiencia-row__date" dateTime={audiencia.Fecha ?? undefined}>
        {formatDate(audiencia.Fecha)}
      </time>
      <span className="audiencia-row__open" aria-hidden="true">›</span>
      <div className="audiencia-row__status" aria-label={`Estado: ${audiencia.Estado ?? 'No informado'}`}>
        <span className="audiencia-row__status-dot" />
        {audiencia.Estado ?? 'Consulta disponible'}
      </div>
    </article>
  )
}
