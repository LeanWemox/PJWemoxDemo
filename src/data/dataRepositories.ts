import { mockAudienciaRepository } from './sql/audienciaRepository'
import { asistenteRepository } from './sql/asistenteRepository'
import { hitoRepository } from './sql/hitoRepository'
import {
  createHttpSqlRepositories,
  createNativePowerAppsRepositories,
  getNativeDataSourcesInfo,
} from './sql/realRepositories'
import {
  createHttpVideoRepository,
  createNativeVideoRepository,
  mockVideoRepository,
} from './sharepoint/videoRepository'

const baseUrl = import.meta.env.VITE_BFF_BASE_URL as string | undefined
const useRealData = import.meta.env.VITE_USE_REAL_DATA === 'true'
const nativeDataSourcesInfo = getNativeDataSourcesInfo()

if (useRealData && baseUrl === undefined) {
  throw new Error(
    'VITE_BFF_BASE_URL is required when VITE_USE_REAL_DATA=true',
  )
}

const sqlRepositories = nativeDataSourcesInfo !== undefined
  ? createNativePowerAppsRepositories(nativeDataSourcesInfo)
  : useRealData && baseUrl !== undefined
    ? createHttpSqlRepositories(baseUrl)
    : {
        audiencia: mockAudienciaRepository,
        hito: hitoRepository,
        asistente: asistenteRepository,
      }

export const audienciaDataRepository = sqlRepositories.audiencia
export const hitoDataRepository = sqlRepositories.hito
export const asistenteDataRepository = sqlRepositories.asistente
export const videoDataRepository =
  nativeDataSourcesInfo !== undefined
    ? createNativeVideoRepository(nativeDataSourcesInfo)
    : useRealData && baseUrl !== undefined
    ? createHttpVideoRepository(baseUrl)
    : mockVideoRepository
