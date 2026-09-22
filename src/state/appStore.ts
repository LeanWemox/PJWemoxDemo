import { create } from 'zustand'
import { getHitoStartTime } from '../utils/powerFxParity'

export type PlayerTab =
  | 'transcripcion'
  | 'hitos'
  | 'notas'
  | 'asistencia'
  | 'archivos'

export type ActiveButton = 1 | 2 | 3 | 4 | 5

interface AppState {
  activeTab: PlayerTab
  filterVisible: boolean
  selectedAudienciaId: number | null
  activeButton: ActiveButton
  startTime: number
  inicioVideoSegundos: number
  textoMostrado: string
  showFilters: () => void
  hideFilters: () => void
  selectAudiencia: (id: number | null) => void
  selectTab: (tab: PlayerTab) => void
  initializePlayer: () => void
  selectHito: (titulo: string) => void
  setStartTime: (seconds: number) => void
  setTextoMostrado: (text: string) => void
}

const tabButton: Record<PlayerTab, ActiveButton> = {
  transcripcion: 1,
  hitos: 2,
  notas: 3,
  asistencia: 4,
  archivos: 5,
}

const initialPlayerState = {
  activeTab: 'transcripcion' as PlayerTab,
  activeButton: 1 as ActiveButton,
  startTime: 0,
  inicioVideoSegundos: 15 * 3600 + 16 * 60 + 15,
  textoMostrado: '',
}

export const useAppStore = create<AppState>((set) => ({
  ...initialPlayerState,
  filterVisible: false,
  selectedAudienciaId: null,
  showFilters: () => set({ filterVisible: true }),
  hideFilters: () => set({ filterVisible: false }),
  selectAudiencia: (id) => set({ selectedAudienciaId: id }),
  selectTab: (tab) =>
    set({
      activeTab: tab,
      activeButton: tabButton[tab],
      textoMostrado: '',
    }),
  initializePlayer: () => set(initialPlayerState),
  selectHito: (titulo) =>
    set((state) => ({
      startTime: getHitoStartTime(titulo, state.inicioVideoSegundos),
    })),
  setStartTime: (seconds) => set({ startTime: seconds }),
  setTextoMostrado: (text) => set({ textoMostrado: text }),
}))
