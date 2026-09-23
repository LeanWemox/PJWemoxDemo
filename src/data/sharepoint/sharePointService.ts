import type { DataClient } from '@microsoft/power-apps/data'
import type { Documento } from '../types/documento'
import {
  createPowerAppsDataClient,
  type PowerAppsDataSourcesInfo,
  unwrapPowerAppsResult,
} from '../powerAppsRuntime'

const DOCUMENTOS_TABLE = 'Documentos'
const DOCUMENTOS_SELECT = [
  'ID',
  'Modified',
  '{IsFolder}',
  '{Name}',
  '{Link}',
  '{Path}',
  '{FullPath}',
] as const

export interface SharePointFile {
  id: number
  name: string | null
  link: string | null
  path: string | null
  isFolder: boolean | null
}

export interface SharePointService {
  listItems(): Promise<Documento[]>
  listFiles(): Promise<SharePointFile[]>
}

function toSharePointFile(documento: Documento): SharePointFile {
  return {
    id: documento.ID,
    name: documento['{Name}'],
    link: documento['{Link}'],
    path: documento['{Path}'],
    isFolder: documento['{IsFolder}'],
  }
}

export function createSharePointService(
  dataSourcesInfo: PowerAppsDataSourcesInfo,
): SharePointService {
  const client: DataClient = createPowerAppsDataClient(dataSourcesInfo)

  return {
    async listItems() {
      const result = await client.retrieveMultipleRecordsAsync<Documento>(
        DOCUMENTOS_TABLE,
        {
          select: [...DOCUMENTOS_SELECT],
          orderBy: ['Modified desc'],
        },
      )
      return unwrapPowerAppsResult(result, 'LIST SharePoint Documentos') ?? []
    },

    async listFiles() {
      const result = await client.retrieveMultipleRecordsAsync<Documento>(
        DOCUMENTOS_TABLE,
        {
          select: [...DOCUMENTOS_SELECT],
          filter: "'{IsFolder}' eq false",
          orderBy: ['Modified desc'],
        },
      )
      return (unwrapPowerAppsResult(result, 'LIST SharePoint files') ?? []).map(
        toSharePointFile,
      )
    },
  }
}
