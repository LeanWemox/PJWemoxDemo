import type { ReactElement } from 'react'
import { useVideoTranscription } from '../../../hooks/useVideoTranscription'
import { useAppStore } from '../../../state/appStore'

const TRANSCRIPCION_CANVAS =
  '📝 Transcripción – Reunión de Teams\n\n' +
  'Proyecto: Seguimiento Operativo Mensual\n' +
  'Fecha: 18/01/2026\n' +
  'Duración: 6:34 min\n' +
  'Grabación: Activada\n\n' +
  '[00:00:02] – Laura Gómez:\n' +
  'Buen día a todos. Si les parece, comenzamos. Confirmo que la reunión está siendo grabada.\n\n' +
  '[00:00:10] – Martín Pérez:\n' +
  'Perfecto, Laura. Ya estoy compartiendo la presentación en pantalla.\n\n' +
  '[00:00:16] – Sofía Rinaldi:\n' +
  'La veo correctamente. ¿Estamos usando la versión final del informe?\n\n' +
  '[00:00:22] – Martín Pérez:\n' +
  'Sí, es la actualización que cerramos el viernes pasado.\n\n' +
  '[00:00:35] – Laura Gómez:\n' +
  'Bien. Entonces, repasamos primero los indicadores generales y después vemos los puntos pendientes.\n\n' +
  '[00:01:02] – Diego Fernández:\n' +
  'Buen día, disculpen la demora. ¿Ya empezaron?\n\n' +
  '[00:01:07] – Laura Gómez:\n' +
  'Sí, Diego. Estamos revisando los indicadores iniciales.\n\n' +
  '[00:01:32] – Martín Pérez:\n' +
  'En la diapositiva dos pueden ver el resumen mensual. Hubo una mejora leve respecto al mes anterior.\n\n' +
  '[00:02:12] – Laura Gómez:\n' +
  'Bien. Me interesa que revisemos el punto de tiempos de respuesta, que sigue siendo crítico.\n\n' +
  '[00:02:50] – Diego Fernández:\n' +
  'Sí, estamos trabajando con el equipo para ajustar los flujos esta semana.\n\n' +
  '[00:03:58] – Martín Pérez:\n' +
  'Paso a la siguiente diapositiva, donde se detallan los próximos hitos.\n\n' +
  '[00:04:29] – Diego Fernández:\n' +
  'Yo puedo tomar el seguimiento del primer hito.\n\n' +
  '[00:05:31] – Laura Gómez:\n' +
  'Perfecto. Entonces damos por finalizada la reunión. Gracias a todos por el tiempo.'

export function Transcripcion(): ReactElement {
  const textoMostrado = useAppStore((state) => state.textoMostrado)
  const { transcription, loading, error } = useVideoTranscription()

  return (
    <section aria-label="Transcripción" className="content-panel">
      <h2>Transcripción</h2>
      {loading && <p role="status">Cargando transcripción...</p>}
      {error !== null && <p role="alert">No se pudo cargar la transcripción: {error}</p>}
      {!loading && <pre>{textoMostrado || transcription || TRANSCRIPCION_CANVAS}</pre>}
    </section>
  )
}
