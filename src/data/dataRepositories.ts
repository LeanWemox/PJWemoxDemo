import { mockAudienciaRepository } from './sql/audienciaRepository'
import { asistenteRepository } from './sql/asistenteRepository'
import { hitoRepository } from './sql/hitoRepository'
import {
  createHttpSqlRepositories,
  createNativePowerAppsRepositories,
} from './sql/realRepositories'
import {
  createHttpVideoRepository,
  createNativeVideoRepository,
  mockVideoRepository,
} from './sharepoint/videoRepository'
import type { PowerAppsDataSourcesInfo } from './powerAppsRuntime'
import { dataSourcesInfo } from '../../.power/schemas/appschemas/dataSourcesInfo'

const baseUrl = import.meta.env.VITE_BFF_BASE_URL as string | undefined
const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true'
const useHttpData = !useMockData && baseUrl !== undefined
const useNativeData = !useMockData && import.meta.env.PROD && baseUrl === undefined

const sqlRepositories = useHttpData
    ? createHttpSqlRepositories(baseUrl)
    : useNativeData
      ? createNativePowerAppsRepositories(dataSourcesInfo)
    : {
        audiencia: mockAudienciaRepository,
        hito: hitoRepository,
        asistente: asistenteRepository,
      }

export const audienciaDataRepository = sqlRepositories.audiencia
export const hitoDataRepository = sqlRepositories.hito
export const asistenteDataRepository = sqlRepositories.asistente
export const videoDataRepository =
  useHttpData
    ? createHttpVideoRepository(baseUrl)
    : useNativeData
      ? createNativeVideoRepository(dataSourcesInfo)
    : mockVideoRepository

export function createNativeRepositories(dataSourcesInfo: PowerAppsDataSourcesInfo) {
  const sqlRepositories = createNativePowerAppsRepositories(dataSourcesInfo)
  return {
    audiencia: sqlRepositories.audiencia,
    hito: sqlRepositories.hito,
    asistente: sqlRepositories.asistente,
    video: createNativeVideoRepository(dataSourcesInfo),
  }
}
