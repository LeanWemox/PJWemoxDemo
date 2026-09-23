import {
  createDocumentosRepository,
  createHttpDocumentosRepository,
} from './documentosRepository'

const baseUrl = import.meta.env.VITE_BFF_BASE_URL as string | undefined
const useRealData = import.meta.env.VITE_USE_REAL_DATA === 'true'

export const documentosDataRepository =
  useRealData && baseUrl !== undefined
    ? createHttpDocumentosRepository(baseUrl)
    : createDocumentosRepository()
