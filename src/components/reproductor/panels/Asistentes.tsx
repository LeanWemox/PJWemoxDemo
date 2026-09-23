import type { ReactElement } from 'react'
import type { Asistente } from '../../../data/types/asistente'

interface AsistentesProps {
  asistentes: readonly Asistente[]
  isLoading?: boolean
  error?: string | null
}

export function Asistentes({
  asistentes,
  isLoading = false,
  error = null,
}: AsistentesProps): ReactElement {
  if (isLoading) return <p className="status-message" role="status">Cargando asistentes...</p>
  if (error !== null) return <p className="status-message" role="alert">No se pudieron cargar los asistentes: {error}</p>

  if (asistentes.length === 0) {
    return <p className="status-message" role="status">No se encontraron asistentes presentes.</p>
  }

  return (
    <section aria-label="Asistentes presentes" className="content-panel">
      <h2>Asistencia</h2>
      <ul className="content-list">
        {asistentes.map((asistente) => (
          <li key={asistente.IdAsistente}>
            <strong>{asistente.Nombre ?? 'Sin nombre'}</strong>
            <span> — {asistente.Rol ?? 'Sin rol'} — Presente</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
