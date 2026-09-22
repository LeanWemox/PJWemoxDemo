import type { DataClient } from '@microsoft/power-apps/data'
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
  audiencia: '[dbo].[Audiencia]',
  causa: '[dbo].[Causa]',
  hito: '[dbo].[Hito]',
  asistente: '[dbo].[Asistente]',
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

export function createSqlServerService(
  dataSourcesInfo: PowerAppsDataSourcesInfo,
): SqlServerService {
  const client: DataClient = createPowerAppsDataClient(dataSourcesInfo)

  async function retrieveMany<T>(
    tableName: string,
    operation: string,
    options?: Parameters<DataClient['retrieveMultipleRecordsAsync']>[1],
  ): Promise<T[]> {
    const result = await client.retrieveMultipleRecordsAsync<T>(
      tableName,
      options,
    )
    return unwrapPowerAppsResult(result, operation)
  }

  return {
    listAudiencias: () =>
      retrieveMany<Audiencia>(TABLES.audiencia, 'SELECT Audiencia', {
        orderBy: ['Fecha desc'],
      }),

    async getAudiencia(id) {
      const records = await retrieveMany<Audiencia>(
        TABLES.audiencia,
        `SELECT Audiencia ${id}`,
        { filter: `IdAudiencia eq ${id}`, top: 1 },
      )
      return records[0] ?? null
    },

    listCausas: () =>
      retrieveMany<Causa>(TABLES.causa, 'SELECT Causa'),

    listHitos: (audienciaId) =>
      retrieveMany<Hito>(TABLES.hito, `SELECT Hito ${audienciaId}`, {
        filter: `IdAudiencia eq ${audienciaId}`,
      }),

    listAsistentes: (audienciaId, onlyPresentes = true) =>
      retrieveMany<Asistente>(
        TABLES.asistente,
        `SELECT Asistente ${audienciaId}`,
        {
          filter: onlyPresentes
            ? `IdAudiencia eq ${audienciaId} and Presente eq true`
            : `IdAudiencia eq ${audienciaId}`,
        },
      ),

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

