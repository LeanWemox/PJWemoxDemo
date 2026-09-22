import { getJson } from '../httpClient'
import { getClient } from '@microsoft/power-apps/data'
import type { NativeDataSourcesInfo } from '../sql/realRepositories'

export interface VideoRepository {
  getUrlByAudienciaId(audienciaId: number): Promise<string | null>
}

interface VideoResponse {
  url: string | null
}

export function createHttpVideoRepository(baseUrl: string): VideoRepository {
  return {
    async getUrlByAudienciaId(audienciaId) {
      const response = await getJson<VideoResponse>(
        baseUrl,
        `sharepoint/audiencias/${audienciaId}/video`,
      )
      return response.url
    },
  }
}

export function createNativeVideoRepository(
    dataSourcesInfo: NativeDataSourcesInfo,
  ): VideoRepository {
    const client = getClient(dataSourcesInfo)

    return {
      async getUrlByAudienciaId(audienciaId) {
        const result = await client.retrieveMultipleRecordsAsync<{
          IdAudiencia?: number
          VideoUrl?: string | null
          Link?: string | null
          Path?: string | null
        }>('Documentos', {
          filter: `IdAudiencia eq ${audienciaId}`,
        })
        if (!result.success) {
          throw result.error ?? new Error('SharePoint video lookup failed')
        }
        const document = result.data[0] as {
          VideoUrl?: string | null
          Link?: string | null
          Path?: string | null
        } | undefined
        return document?.VideoUrl ?? document?.Link ?? document?.Path ?? null
      },
    }
  }

export const mockVideoRepository: VideoRepository = {
  async getUrlByAudienciaId() {
    return null
  },
}
