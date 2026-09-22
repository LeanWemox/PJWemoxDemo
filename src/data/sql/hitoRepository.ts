import type { Hito } from '../types/hito'

export interface HitoRepository {
  getByAudienciaId(audienciaId: number): Promise<Hito[]>
}

export const hitoRepository: HitoRepository = {
  async getByAudienciaId(audienciaId) {
    return [
      {
        idHito: 1,
        IdAudiencia: audienciaId,
        Titulo: 'Hito       15:20:30 Inicio de la reunión',
        FechaAlta: '2026-01-18T15:20:30',
      },
    ]
  },
}
