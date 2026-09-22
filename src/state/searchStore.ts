import { create } from 'zustand'

interface SearchState {
  text: string
  fromDate: string | null
  toDate: string | null
  setText: (text: string) => void
  setFromDate: (date: string | null) => void
  setToDate: (date: string | null) => void
  resetFilters: () => void
}

const initialSearchState = {
  text: '',
  fromDate: null,
  toDate: null,
}

export const useSearchStore = create<SearchState>((set) => ({
  ...initialSearchState,
  setText: (text) => set({ text }),
  setFromDate: (fromDate) => set({ fromDate }),
  setToDate: (toDate) => set({ toDate }),
  resetFilters: () => set(initialSearchState),
}))
