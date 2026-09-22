import { getJson } from '../httpClient'
import { getClient } from '@microsoft/power-apps/data'
import type { Audiencia } from '../types/audiencia'
import type { Asistente } from '../types/asistente'
import type { Causa } from '../types/causa'
import type { Hito } from '../types/hito'
import type {
  AsistenteRepository,
} from './asistenteRepository'
import type {
  AudienciaFilters,
  AudienciaRepository,
} from './audienciaRepository'
import type { HitoRepository } from './hitoRepository'

export interface NativeDataSourcesInfo {
  [name: string]: {
    tableId: string
    apis: Record<string, {
      path: string
      method: string
      parameters: Array<{
        name: string
        in: string
        required: boolean
        type: string
        format?: string
      }>
    }>
  }
}

declare global {
  var __POWER_APPS_DATA_SOURCES__: NativeDataSourcesInfo | undefined
}

export function getNativeDataSourcesInfo(): NativeDataSourcesInfo | undefined {
  return globalThis.__POWER_APPS_DATA_SOURCES__
}

function nativeResult<T>(result: {
  success: boolean
  data: T
  error?: unknown
}): T {
  if (!result.success) {
    throw result.error instanceof Error
      ? result.error
      : new Error('Power Apps data operation failed')
  }
  return result.data
}

export function createNativePowerAppsRepositories(
  dataSourcesInfo: NativeDataSourcesInfo,
): {
  audiencia: AudienciaRepository
  hito: HitoRepository
  asistente: AsistenteRepository
} {
  const client = getClient(dataSourcesInfo)

  return {
    audiencia: {
      search: async (filters) => {
        const clauses = [
          filters.text === ''
            ? null
            : `contains(CodBarras,'${filters.text.replaceAll("'", "''")}')`,
          filters.fromDate === null ? null : `Fecha ge '${filters.fromDate}'`,
          filters.toDate === null ? null : `Fecha le '${filters.toDate}'`,
        ].filter((clause): clause is string => clause !== null)
        const result = await client.retrieveMultipleRecordsAsync<Audiencia>(
          '[dbo].[Audiencia]',
          {
            filter: clauses.join(' and ') || undefined,
            orderBy: ['Fecha desc'],
          },
        )
        return nativeResult(result)
      },
      getById: async (id) => {
        const result = await client.retrieveMultipleRecordsAsync<Audiencia>(
          '[dbo].[Audiencia]',
          { filter: `IdAudiencia eq ${id}`, top: 1 },
        )
        return nativeResult<Audiencia[]>(result)[0] ?? null
      },
      getCausas: async () =>
        nativeResult(
          await client.retrieveMultipleRecordsAsync<Causa>('[dbo].[Causa]'),
        ),
    },
    hito: {
      getByAudienciaId: async (audienciaId) =>
        nativeResult(
          await client.retrieveMultipleRecordsAsync<Hito>('[dbo].[Hito]', {
            filter: `IdAudiencia eq ${audienciaId}`,
          }),
        ),
    },
    asistente: {
      getPresentesByAudienciaId: async (audienciaId) =>
        nativeResult(
          await client.retrieveMultipleRecordsAsync<Asistente>(
            '[dbo].[Asistente]',
            {
              filter: `IdAudiencia eq ${audienciaId} and Presente eq true`,
            },
          ),
        ),
    },
  }
}

export function createHttpSqlRepositories(baseUrl: string): {
  audiencia: AudienciaRepository
  hito: HitoRepository
  asistente: AsistenteRepository
} {
  return {
    audiencia: {
      getById: (id: number) =>
        getJson<Audiencia | null>(baseUrl, `sql/audiencias/${id}`),
      async search(filters: AudienciaFilters) {
        const query = new URLSearchParams()
        if (filters.text !== '') query.set('codBarras', filters.text)
        if (filters.fromDate !== null) query.set('fromDate', filters.fromDate)
        if (filters.toDate !== null) query.set('toDate', filters.toDate)
        return getJson<Audiencia[]>(
          baseUrl,
          `sql/audiencias?${query.toString()}`,
        )
      },
      getCausas: () => getJson<Causa[]>(baseUrl, 'sql/causas'),
    },
    hito: {
      getByAudienciaId: (audienciaId: number) =>
        getJson<Hito[]>(baseUrl, `sql/audiencias/${audienciaId}/hitos`),
    },
    asistente: {
      getPresentesByAudienciaId: (audienciaId: number) =>
        getJson<Asistente[]>(
          baseUrl,
          `sql/audiencias/${audienciaId}/asistentes?presente=true`,
        ),
    },
  }
}
