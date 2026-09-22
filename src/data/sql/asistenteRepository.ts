import type { Asistente } from '../types/asistente'

export interface AsistenteRepository {
  getPresentesByAudienciaId(audienciaId: number): Promise<Asistente[]>
}

export const asistenteRepository: AsistenteRepository = {
  async getPresentesByAudienciaId(audienciaId) {
    return [
      {
        IdAsistente: 1,
        Nombre: 'Asistente de demostración',
        DNI: null,
        CUIT: null,
        Genero: null,
        Email: null,
        DomicilioElectronico: null,
        Rol: 'Participante',
        Caracter: null,
        EsAbogado: null,
        IdAudiencia: audienciaId,
        ValidacionRenaper: null,
        ImagenValidacion: null,
        Presente: true,
        TipoAcceso: null,
        Origen: 'mock',
        VersionColumnName: null,
      },
    ]
  },
}
