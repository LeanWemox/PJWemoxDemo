import type { ReactElement } from 'react'
import { useAppStore, type PlayerTab } from '../../state/appStore'

interface TabDefinition {
  id: PlayerTab
  label: string
}

const tabs: readonly TabDefinition[] = [
  { id: 'transcripcion', label: 'Transcripción' },
  { id: 'hitos', label: 'Hitos' },
  { id: 'notas', label: 'Notas' },
  { id: 'asistencia', label: 'Asistencia' },
  { id: 'archivos', label: 'Archivos' },
]

export function ReproductorTabs(): ReactElement {
  const activeTab = useAppStore((state) => state.activeTab)
  const selectTab = useAppStore((state) => state.selectTab)

  return (
    <nav aria-label="Secciones del reproductor" className="player-tabs">
      {tabs.map((tab) => (
        <button
          aria-selected={activeTab === tab.id}
          className={activeTab === tab.id ? 'active' : undefined}
          key={tab.id}
          onClick={() => selectTab(tab.id)}
          role="tab"
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
