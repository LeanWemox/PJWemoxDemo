import { useEffect, type ReactElement } from 'react'
import type { Audiencia } from '../../data/types/audiencia'
import { useAudiencia } from '../../hooks/useAudiencia'
import { useAsistentes } from '../../hooks/useAsistentes'
import { useCausas } from '../../hooks/useCausas'
import { useHitos } from '../../hooks/useHitos'
import { useNotas } from '../../hooks/useNotas'
import { useVideoUrl } from '../../hooks/useVideoUrl'
import { useAppStore } from '../../state/appStore'
import { Asistentes } from './panels/Asistentes'
import { Archivos } from './panels/Archivos'
import { Hitos } from './panels/Hitos'
import { Notas } from './panels/Notas'
import { Transcripcion } from './panels/Transcripcion'
import { ReproductorTabs } from './ReproductorTabs'
import { VideoPlayer } from './VideoPlayer'

interface ReproductorPageProps {
  audiencia?: Audiencia | null
  videoUrl: string
}

export function ReproductorPage({
  audiencia,
  videoUrl,
}: ReproductorPageProps): ReactElement {
  const selectedAudienciaId = useAppStore(
    (state) => state.selectedAudienciaId,
  )
  const activeTab = useAppStore((state) => state.activeTab)
  const selectAudiencia = useAppStore((state) => state.selectAudiencia)
  const initializePlayer = useAppStore((state) => state.initializePlayer)
  const startTime = useAppStore((state) => state.startTime)
  const hitos = useHitos()
  const notas = useNotas()
  const asistentes = useAsistentes()
  const { audiencia: activeAudiencia, loading: audienciaLoading, error: audienciaError } =
    useAudiencia(audiencia)
  const { causas } = useCausas()
  const video = useVideoUrl(videoUrl)

  useEffect(() => {
    initializePlayer()
  }, [initializePlayer])

  const audienciaId = activeAudiencia?.IdAudiencia ?? selectedAudienciaId
  const causa = activeAudiencia?.IdCausa === null
    ? undefined
    : causas.find((item) => item.IdCausa === activeAudiencia?.IdCausa)
  const audienciaLabel =
    activeAudiencia?.TituloAudiencia ??
    (audienciaId === null || audienciaId === undefined
      ? 'Sin audiencia seleccionada'
      : `Audiencia #${audienciaId}`)

  return (
    <main className="page-shell player-page">
      <header className="page-header player-header">
        <button type="button" onClick={() => selectAudiencia(null)}>
          ← Volver al buscador
        </button>
        <div>
          <h1>{audienciaLabel}</h1>
          <p>
            {audienciaLoading && 'Cargando audiencia...'}
            {audienciaError && `Error: ${audienciaError}`}
          </p>
        </div>
        <dl className="audiencia-details">
          <div><dt>Audiencia</dt><dd>{audienciaId ?? 'No disponible'}</dd></div>
          <div><dt>Causa</dt><dd>{causa?.Caratula ?? (activeAudiencia?.IdCausa ?? 'Sin causa')}</dd></div>
          <div><dt>Código</dt><dd>{activeAudiencia?.CodBarras ?? 'Sin código'}</dd></div>
          <div><dt>Fecha</dt><dd>{activeAudiencia?.Fecha ?? 'Sin fecha'}</dd></div>
        </dl>
      </header>
      <div className="player-layout">
        {video.loading && (
          <p className="status-message" role="status">
            Cargando video desde SharePoint...
          </p>
        )}
        {video.error !== null && (
          <p className="status-message" role="alert">{video.error}</p>
        )}
        {!video.loading && <VideoPlayer startTime={startTime} url={video.url} />}
        <aside className="player-sidebar">
          <ReproductorTabs />
          <section
            aria-label={`Panel ${activeTab}`}
            aria-live="polite"
            className="player-panel"
          >
        {activeTab === 'transcripcion' && <Transcripcion />}
        {activeTab === 'hitos' && (
          <Hitos hitos={hitos.hitos} error={hitos.error} isLoading={hitos.loading} />
        )}
        {activeTab === 'notas' && (
          <Notas
            audiencias={notas.audiencias}
            error={notas.error}
            isLoading={notas.loading}
          />
        )}
        {activeTab === 'asistencia' && (
          <Asistentes
            asistentes={asistentes.asistentes}
            error={asistentes.error}
            isLoading={asistentes.loading}
          />
        )}
            {activeTab === 'archivos' && <Archivos />}
          </section>
        </aside>
      </div>
    </main>
  )
}
