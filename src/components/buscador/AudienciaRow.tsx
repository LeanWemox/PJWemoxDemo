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
      <time className="audiencia-row__date" dateTime={audiencia.Fecha ?? undefined}>
        {formatDate(audiencia.Fecha)}
      </time>
      <strong className="audiencia-row__code">{audiencia.CodBarras ?? 'Sin código de barras'}</strong>
      <span className="audiencia-row__title">{audiencia.TituloAudiencia ?? 'Sin título'}</span>
      <span className="audiencia-row__cause">
        Causa:{' '}
        {causa?.Caratula ??
          (audiencia.IdCausa === null
            ? 'Sin causa asociada'
            : `#${audiencia.IdCausa}`)}
      </span>
    </article>
  )
}
