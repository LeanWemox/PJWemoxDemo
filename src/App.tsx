import type { ReactElement } from 'react'
import './App.css'
import { BuscadorPage } from './components/buscador/BuscadorPage'
import { ReproductorPage } from './components/reproductor/ReproductorPage'
import { useAppStore } from './state/appStore'

const emptyVideoUrl = ''

function App(): ReactElement {
  const selectedAudienciaId = useAppStore(
    (state) => state.selectedAudienciaId,
  )

  return (
    <div className="app-shell">
      {selectedAudienciaId === null ? (
        <BuscadorPage />
      ) : (
        <ReproductorPage videoUrl={emptyVideoUrl} />
      )}
    </div>
  )
}

export default App
