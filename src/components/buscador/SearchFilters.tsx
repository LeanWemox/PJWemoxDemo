import type { FormEvent, ReactElement } from 'react'
import { useAppStore } from '../../state/appStore'
import { useSearchStore } from '../../state/searchStore'

export function SearchFilters(): ReactElement {
  const text = useSearchStore((state) => state.text)
  const fromDate = useSearchStore((state) => state.fromDate)
  const toDate = useSearchStore((state) => state.toDate)
  const setText = useSearchStore((state) => state.setText)
  const setFromDate = useSearchStore((state) => state.setFromDate)
  const setToDate = useSearchStore((state) => state.setToDate)
  const resetFilters = useSearchStore((state) => state.resetFilters)
  const hideFilters = useAppStore((state) => state.hideFilters)

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
  }

  const handleReset = (): void => {
    resetFilters()
    hideFilters()
  }

  return (
    <form
      aria-label="Filtros de búsqueda"
      className="search-filters"
      onSubmit={handleSubmit}
    >
      <label>
        Buscar
        <input
          aria-label="Buscar por código de barras o causa"
          type="search"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
      </label>
      <label>
        Desde
        <input
          aria-label="Fecha desde"
          type="date"
          value={fromDate ?? ''}
          onChange={(event) => setFromDate(event.target.value || null)}
        />
      </label>
      <label>
        Hasta
        <input
          aria-label="Fecha hasta"
          type="date"
          value={toDate ?? ''}
          onChange={(event) => setToDate(event.target.value || null)}
        />
      </label>
      <div className="search-filters__actions">
        <button type="button" onClick={hideFilters}>
          Ocultar filtros
        </button>
        <button type="button" onClick={handleReset}>
          Restablecer
        </button>
      </div>
    </form>
  )
}
