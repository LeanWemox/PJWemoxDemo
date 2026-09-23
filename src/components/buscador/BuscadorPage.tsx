import type { ReactElement } from 'react'
import type { Audiencia } from '../../data/types/audiencia'
import { useAudiencias } from '../../hooks/useAudiencias'
import { useCausas } from '../../hooks/useCausas'
import { useAppStore } from '../../state/appStore'
import { AudienciaGallery } from './AudienciaGallery'
import { SearchFilters } from './SearchFilters'
import judicialLogo from '../../assets/logo-poder-judicial-corrientes.png'

interface BuscadorPageProps {
  onNavigate?: (audiencia: Audiencia) => void
}

export function BuscadorPage({
  onNavigate,
}: BuscadorPageProps): ReactElement {
  const filterVisible = useAppStore((state) => state.filterVisible)
  const showFilters = useAppStore((state) => state.showFilters)
  const hideFilters = useAppStore((state) => state.hideFilters)
  const { audiencias, loading, error } = useAudiencias()
  const { causas, error: causasError } = useCausas()

  return (
    <main className="page-shell">
      <header className="page-header">
        <div className="brand-heading">
          <div className="brand-mark">
            <img
              src={judicialLogo}
              alt="Provincia de Corrientes - Poder Judicial"
            />
          </div>
          <div>
            <p className="eyebrow">Poder Judicial de Corrientes</p>
            <h1>Buscador de audiencias</h1>
            <p className="page-header__subtitle">Consulta de registros y actuaciones</p>
          </div>
        </div>
        <button
          className="button filter-button"
          type="button"
          onClick={filterVisible ? hideFilters : showFilters}
        >
          <span className="filter-button__icon" aria-hidden="true">
            {filterVisible ? '×' : '☷'}
          </span>
          {filterVisible ? 'Ocultar filtros' : 'Mostrar filtros'}
        </button>
      </header>
      {filterVisible && <SearchFilters />}
      <AudienciaGallery
        audiencias={audiencias}
        causas={causas}
        error={error ?? causasError}
        isLoading={loading}
        onNavigate={onNavigate}
      />
    </main>
  )
}
