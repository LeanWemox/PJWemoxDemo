import type {
  DataClient,
  IOperationOptions,
} from '@microsoft/power-apps/data'
import type { Audiencia } from '../types/audiencia'
import type { Asistente } from '../types/asistente'
import type { Causa } from '../types/causa'
import type { Hito } from '../types/hito'
import {
  createPowerAppsDataClient,
  type PowerAppsDataSourcesInfo,
  unwrapPowerAppsResult,
} from '../powerAppsRuntime'

const TABLES = {
  audiencia: 'audiencia',
  causa: 'causa',
  hito: 'hito',
  asistente: 'asistente',
} as const

const SELECT = {
  audiencia: [
    'IdAudiencia', 'Fecha', 'HoraInicio', 'HoraFin', 'TituloAudiencia',
    'IdCausa', 'CodBarras', 'OrganizadorUser', 'ObjectIdOrganizador',
    'Estado', 'Privada', 'Menores', 'RequiereValidacion', 'Notas',
    'IdAudienciaTeams', 'ThreadIdTeams', 'Archivos', 'Acta', 'TipoAudiencia',
    'EventIdTeams', 'MeetingIdTeams', 'IdAudienciaAugusta', 'postAudienciaApp',
  ],
  causa: [
    'IdCausa', 'IdCausaAugusta', 'IdOrg', 'NombreOrganismo', 'Prefijo',
    'Numero', 'Sufijo', 'Caratula', 'Estado', 'LocalidadJuzgado',
    'IdUnicoCausa',
  ],
  hito: ['idHito', 'IdAudiencia', 'Titulo', 'FechaAlta'],
  asistente: [
    'IdAsistente', 'Nombre', 'DNI', 'CUIT', 'Genero', 'Email',
    'DomicilioElectronico', 'Rol', 'Caracter', 'EsAbogado', 'IdAudiencia',
    'ValidacionRenaper', 'ImagenValidacion', 'Presente', 'TipoAcceso',
    'Origen', 'VersionColumnName',
  ],
} as const

export interface SqlServerService {
  listAudiencias(): Promise<Audiencia[]>
  getAudiencia(id: number): Promise<Audiencia | null>
  listCausas(): Promise<Causa[]>
  listHitos(audienciaId: number): Promise<Hito[]>
  listAsistentes(audienciaId: number, onlyPresentes?: boolean): Promise<Asistente[]>
  createAudiencia(values: Partial<Omit<Audiencia, 'IdAudiencia'>>): Promise<Audiencia>
  updateAudiencia(id: number, values: Partial<Audiencia>): Promise<Audiencia>
}

function escapeODataString(value: string): string {
  return value.replaceAll("'", "''")
}

function toNumber(value: unknown): number {
  const result = Number(value)
  if (!Number.isFinite(result)) {
    throw new Error(`Expected numeric SQL value, received ${String(value)}`)
  }
  return result
}

function mapAudiencia(value: Audiencia): Audiencia {
  const record = value as unknown as Record<string, unknown>
  return {
    ...value,
    IdAudiencia: toNumber(record.IdAudiencia),
    IdCausa: record.IdCausa === null ? null : toNumber(record.IdCausa),
  }
}

function mapHito(value: Hito): Hito {
  const record = value as unknown as Record<string, unknown>
  return {
    ...value,
    idHito: toNumber(record.idHito),
    IdAudiencia:
      record.IdAudiencia === null ? null : toNumber(record.IdAudiencia),
  }
}

function mapAsistente(value: Asistente): Asistente {
  const record = value as unknown as Record<string, unknown>
  return {
    ...value,
    IdAsistente: toNumber(record.IdAsistente),
    IdAudiencia:
      record.IdAudiencia === null ? null : toNumber(record.IdAudiencia),
  }
}

export function createSqlServerService(
  dataSourcesInfo: PowerAppsDataSourcesInfo,
): SqlServerService {
  const client: DataClient = createPowerAppsDataClient(dataSourcesInfo)

  async function retrieveMany<T>(
    tableName: string,
    operation: string,
    options?: IOperationOptions,
  ): Promise<T[]> {
    const result = await client.retrieveMultipleRecordsAsync<T>(
      tableName,
      options,
    )
    return unwrapPowerAppsResult(result, operation) ?? []
  }

  return {
    listAudiencias: async () =>
      (
        await retrieveMany<Audiencia>(TABLES.audiencia, 'SELECT Audiencia', {
          select: [...SELECT.audiencia],
          orderBy: ['Fecha desc'],
        })
      ).map(mapAudiencia),

    async getAudiencia(id) {
      const records = await retrieveMany<Audiencia>(
        TABLES.audiencia,
        `SELECT Audiencia ${id}`,
        {
          select: [...SELECT.audiencia],
          filter: `IdAudiencia eq ${id}`,
          top: 1,
        },
      )
      return records.map(mapAudiencia)[0] ?? null
    },

    listCausas: () =>
      retrieveMany<Causa>(TABLES.causa, 'SELECT Causa', {
        select: [...SELECT.causa],
      }),

    listHitos: async (audienciaId) =>
      (
        await retrieveMany<Hito>(TABLES.hito, `SELECT Hito ${audienciaId}`, {
          select: [...SELECT.hito],
          filter: `IdAudiencia eq ${audienciaId}`,
        })
      ).map(mapHito),

    listAsistentes: async (audienciaId, onlyPresentes = true) =>
      (
        await retrieveMany<Asistente>(
        TABLES.asistente,
        `SELECT Asistente ${audienciaId}`,
        {
            select: [...SELECT.asistente],
            filter: onlyPresentes
            ? `IdAudiencia eq ${audienciaId} and Presente eq true`
            : `IdAudiencia eq ${audienciaId}`,
        },
        )
      ).map(mapAsistente),

    async createAudiencia(values) {
      const result = await client.createRecordAsync<
        Partial<Omit<Audiencia, 'IdAudiencia'>>,
        Audiencia
      >(TABLES.audiencia, values)
      return unwrapPowerAppsResult(result, 'INSERT Audiencia')
    },

    async updateAudiencia(id, values) {
      const result = await client.updateRecordAsync<
        Partial<Audiencia>,
        Audiencia
      >(TABLES.audiencia, String(id), values)
      return unwrapPowerAppsResult(result, `UPDATE Audiencia ${id}`)
    },
  }
}

export function buildAudienciaFilter(
  text: string,
  fromDate?: string,
  toDate?: string,
): string | undefined {
  const clauses = [
    text.trim() === ''
      ? undefined
      : `contains(CodBarras,'${escapeODataString(text.trim())}')`,
    fromDate === undefined ? undefined : `Fecha ge '${escapeODataString(fromDate)}'`,
    toDate === undefined ? undefined : `Fecha le '${escapeODataString(toDate)}'`,
  ].filter((clause): clause is string => clause !== undefined)

  return clauses.length === 0 ? undefined : clauses.join(' and ')
}
