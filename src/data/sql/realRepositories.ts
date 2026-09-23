import { getJson } from '../httpClient'
import { getClient } from '@microsoft/power-apps/data'
import type { PowerAppsDataSourcesInfo } from '../powerAppsRuntime'
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

function numberOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function booleanOrNull(value: unknown): boolean | null {
  if (value === null || value === undefined || value === '') return null
  if (typeof value === 'boolean') return value
  return value === 'true' || value === '1'
}

function mapAudiencia(value: Audiencia): Audiencia {
  const record = value as unknown as Record<string, unknown>
  return {
    ...value,
    IdAudiencia: Number(record.IdAudiencia),
    IdCausa: numberOrNull(record.IdCausa),
    Privada: booleanOrNull(record.Privada),
    Menores: booleanOrNull(record.Menores),
    RequiereValidacion: booleanOrNull(record.RequiereValidacion),
    postAudienciaApp: booleanOrNull(record.postAudienciaApp),
  }
}

function mapHito(value: Hito): Hito {
  const record = value as unknown as Record<string, unknown>
  return {
    ...value,
    idHito: Number(record.idHito),
    IdAudiencia: numberOrNull(record.IdAudiencia),
  }
}

function mapAsistente(value: Asistente): Asistente {
  const record = value as unknown as Record<string, unknown>
  return {
    ...value,
    IdAsistente: Number(record.IdAsistente),
    IdAudiencia: numberOrNull(record.IdAudiencia),
    Presente: booleanOrNull(record.Presente),
    EsAbogado: booleanOrNull(record.EsAbogado),
  }
}

function mapCausa(value: Causa): Causa {
  const record = value as unknown as Record<string, unknown>
  return {
    ...value,
    IdCausa: Number(record.IdCausa),
    IdCausaAugusta: record.IdCausaAugusta === null
      ? null
      : String(record.IdCausaAugusta),
    IdOrg: numberOrNull(record.IdOrg),
  }
}

export function createNativePowerAppsRepositories(
  dataSourcesInfo: PowerAppsDataSourcesInfo,
): {
  audiencia: AudienciaRepository
  hito: HitoRepository
  asistente: AsistenteRepository
} {
  const client = getClient(dataSourcesInfo)

  return {
    audiencia: {
      search: async (filters) => {
        const text = filters.text.trim()
        const causeFilter = text === ''
          ? null
          : nativeResult<Causa[]>(
            await client.retrieveMultipleRecordsAsync<Causa>('causa', {
              select: ['IdCausa', 'Caratula'],
              filter: `contains(Caratula,'${text.replaceAll("'", "''")}')`,
            }),
          ).map((causa) => `IdCausa eq ${causa.IdCausa}`)
        const textFilter = text === ''
          ? null
          : [
            `contains(CodBarras,'${text.replaceAll("'", "''")}')`,
            ...(causeFilter ?? []),
          ].join(' or ')
        const clauses = [
          textFilter,
          filters.fromDate === null ? null : `Fecha ge '${filters.fromDate}'`,
          filters.toDate === null ? null : `Fecha le '${filters.toDate}'`,
        ].filter((clause): clause is string => clause !== null)
        const result = await client.retrieveMultipleRecordsAsync<Audiencia>(
          'audiencia',
          {
            select: ['IdAudiencia', 'Fecha', 'HoraInicio', 'HoraFin',
              'TituloAudiencia', 'IdCausa', 'CodBarras', 'Notas',
              'Estado', 'TipoAudiencia', 'OrganizadorUser'],
            filter: clauses.join(' and ') || undefined,
            orderBy: ['Fecha desc'],
          },
        )
        return (nativeResult<Audiencia[]>(result) ?? []).map(mapAudiencia)
      },
      getById: async (id) => {
        const result = await client.retrieveMultipleRecordsAsync<Audiencia>(
          'audiencia',
          {
            select: ['IdAudiencia', 'Fecha', 'HoraInicio', 'HoraFin',
              'TituloAudiencia', 'IdCausa', 'CodBarras', 'Notas',
              'Estado', 'TipoAudiencia', 'OrganizadorUser'],
            filter: `IdAudiencia eq ${id}`,
            top: 1,
          },
        )
        const audiencias = (nativeResult<Audiencia[]>(result) ?? []).map(mapAudiencia)
        return audiencias[0] ?? null
      },
      getCausas: async () =>
        (nativeResult<Causa[]>(
          await client.retrieveMultipleRecordsAsync<Causa>('causa', {
            select: [
              'IdCausa',
              'Caratula',
              'NombreOrganismo',
              'LocalidadJuzgado',
              'Numero',
              'Sufijo',
            ],
          }),
        ) ?? []).map(mapCausa),
    },
    hito: {
      getByAudienciaId: async () =>
        (nativeResult<Hito[]>(
          await client.retrieveMultipleRecordsAsync<Hito>('hito', {
            select: ['idHito', 'IdAudiencia', 'Titulo', 'FechaAlta'],
          }),
        ) ?? []).map(mapHito),
    },
    asistente: {
      getPresentesByAudienciaId: async (audienciaId) =>
        (nativeResult<Asistente[]>(
          await client.retrieveMultipleRecordsAsync<Asistente>(
            'asistente',
            {
              select: ['IdAsistente', 'Nombre', 'Rol', 'IdAudiencia', 'Presente'],
              filter: `IdAudiencia eq ${audienciaId} and Presente eq true`,
            },
          ),
        ) ?? []).map(mapAsistente),
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
