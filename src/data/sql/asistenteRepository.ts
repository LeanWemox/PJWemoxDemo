import type { Asistente } from '../types/asistente'
import { getClient } from '@microsoft/power-apps/data'
import type { PowerAppsDataSourcesInfo } from '../powerAppsRuntime'

export interface AsistenteRepository {
  getPresentesByAudienciaId(audienciaId: number): Promise<Asistente[]>
}

export const asistenteRepository: AsistenteRepository = {
  async getPresentesByAudienciaId(audienciaId) {
    return [
      {
        IdAsistente: 1,
        Nombre: 'Laura Gómez',
        DNI: null,
        CUIT: null,
        Genero: null,
        Email: null,
        DomicilioElectronico: null,
        Rol: 'Organizadora',
        Caracter: null,
        EsAbogado: null,
        IdAudiencia: audienciaId,
        ValidacionRenaper: null,
        ImagenValidacion: null,
        Presente: true,
        TipoAcceso: null,
        Origen: null,
        VersionColumnName: null,
      },
    ]
  },
}

export function createNativeAsistenteRepository(
  dataSourcesInfo: PowerAppsDataSourcesInfo,
): AsistenteRepository {
  const client = getClient(dataSourcesInfo)

  return {
    async getPresentesByAudienciaId(audienciaId) {
      const result = await client.retrieveMultipleRecordsAsync<Asistente>('asistente', {
        select: [
          'IdAsistente',
          'Nombre',
          'DNI',
          'CUIT',
          'Genero',
          'Email',
          'DomicilioElectronico',
          'Rol',
          'Caracter',
          'EsAbogado',
          'IdAudiencia',
          'ValidacionRenaper',
          'ImagenValidacion',
          'Presente',
          'TipoAcceso',
          'VersionColumnName',
        ],
        filter: `IdAudiencia eq ${audienciaId} and Presente eq true`,
      })

      if (!result.success) {
        throw result.error ?? new Error('Error al consultar la tabla Asistente en SQL')
      }

      return result.data ?? []
    },
  }
}