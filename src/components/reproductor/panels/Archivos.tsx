import type { ReactElement } from 'react'
import { useDocumentos } from '../../../hooks/useDocumentos'
import { useAppStore } from '../../../state/appStore'

const ARCHIVOS_CANVAS =
  '📁 Archivos de la reunión\n\n' +
  'Informe_Seguimiento_Enero_2026,pdf\n' +
  'Informe mensual con indicadores y métricas clave,\n\n' +
  'Presentacion_Operativa_Reunion,pptx\n' +
  'Diapositivas utilizadas durante la reunión,\n\n' +
  'Plan_Acciones_Q1,xlsx\n' +
  'Detalle de acciones; responsables y fechas objetivo,\n\n' +
  'Transcripcion_Reunion_2026-01-18,txt\n' +
  'Transcripción automática generada por Microsoft Stream,\n\n' +
  'Notas_Reunion_Operativa,docx\n' +
  'Resumen ejecutivo y decisiones acordadas,'

export function Archivos(): ReactElement {
  const textoMostrado = useAppStore((state) => state.textoMostrado)
  const { documentos, loading, error } = useDocumentos()
  const documentosText =
    documentos.length > 0
      ? documentos
          .map((documento) =>
            [documento.name, documento.link, documento.path]
              .filter((value): value is string => value !== null)
              .join(' — '),
          )
          .join('\n')
      : ''

  return (
    <section aria-label="Archivos" className="content-panel">
      <h2>Archivos</h2>
      {loading && <p role="status">Cargando archivos...</p>}
      {error !== null && <p role="alert">No se pudieron cargar los archivos: {error}</p>}
      <pre>{textoMostrado || documentosText || ARCHIVOS_CANVAS}</pre>
    </section>
  )
}
