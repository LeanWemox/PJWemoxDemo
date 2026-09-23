import type { ReactElement } from 'react'
import type { Hito } from '../../../data/types/hito'
import { useAppStore } from '../../../state/appStore'
import { getHitoStartTime } from '../../../utils/powerFxParity'

interface HitosProps {
  hitos: readonly Hito[]
  isLoading?: boolean
  error?: string | null
}

export function Hitos({
  hitos,
  isLoading = false,
  error = null,
}: HitosProps): ReactElement {
  const selectedAudienciaId = useAppStore((state) => state.selectedAudienciaId)
  const inicioVideoSegundos = useAppStore(
    (state) => state.inicioVideoSegundos,
  )
  const selectHito = useAppStore((state) => state.selectHito)

  if (isLoading) return <p className="status-message" role="status">Cargando hitos...</p>
  if (error !== null) return <p className="status-message" role="alert">No se pudieron cargar los hitos: {error}</p>
  if (selectedAudienciaId === null) {
    return <p className="status-message" role="status">No hay una audiencia seleccionada.</p>
  }

  if (hitos.length === 0) {
    return <p className="status-message" role="status">No se encontraron hitos.</p>
  }

  return (
    <section aria-label="Hitos" className="content-panel">
      <h2>Hitos</h2>
      <ul className="content-list">
        {hitos.map((hito) => {
          const titulo = hito.Titulo ?? ''
          let startTime: number | null = null
          let timeError = false

          if (titulo !== '') {
            try {
              startTime = getHitoStartTime(titulo, inicioVideoSegundos)
            } catch {
              timeError = true
            }
          } else {
            timeError = true
          }

          return (
            <li key={hito.idHito}>
              <button
                className="content-list__button"
                disabled={timeError}
                onClick={() => selectHito(titulo)}
                type="button"
              >
                <span>{titulo || 'Hito sin título'}</span>
                <span>
                  {timeError
                    ? 'Tiempo inválido'
                    : `${startTime ?? 0} s`}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
