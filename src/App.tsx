import type { ReactElement } from 'react'
import './App.css'
import { BuscadorPage } from './components/buscador/BuscadorPage'
import { ReproductorPage } from './components/reproductor/ReproductorPage'
import { useAppStore } from './state/appStore'
import buildingBackground from './assets/fondo-poder-judicial-corrientes.png'
import judicialLogo from './assets/logo-poder-judicial-corrientes.png'

const emptyVideoUrl = ''

function InstitutionalFooter(): ReactElement {
  return (
    <footer className="institutional-footer">
      <div className="institutional-footer__inner">
        <div className="institutional-footer__brand">
          <img
            src={judicialLogo}
            alt="Provincia de Corrientes - Poder Judicial"
          />
        </div>
        <nav className="institutional-footer__links" aria-label="Organismos">
          <a href="#consejo">CONSEJO DE LA MAGISTRATURA</a>
          <a href="#jurado">JURADO DE ENJUICIAMIENTO</a>
          <a href="#ministerio">MINISTERIO PÚBLICO</a>
          <a href="#junta">JUNTA ELECTORAL</a>
          <a href="#organismos">ORGANISMOS</a>
        </nav>
        <div className="institutional-footer__qr" aria-label="Código QR institucional">
          <span>QR</span>
        </div>
      </div>
    </footer>
  )
}

function App(): ReactElement {
  const selectedAudienciaId = useAppStore(
    (state) => state.selectedAudienciaId,
  )

  return (
    <div className="app-shell">
      <img
        className="app-background-image"
        src={buildingBackground}
        alt=""
        aria-hidden="true"
      />
      {selectedAudienciaId === null ? (
        <BuscadorPage />
      ) : (
        <ReproductorPage videoUrl={emptyVideoUrl} />
      )}
      <InstitutionalFooter />
    </div>
  )
}

export default App
