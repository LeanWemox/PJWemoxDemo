import { getJson } from '../httpClient'
import { getClient } from '@microsoft/power-apps/data'
import type { PowerAppsDataSourcesInfo } from '../powerAppsRuntime'

export interface VideoRepository {
  getUrlByAudienciaId(audienciaId: number): Promise<string | null>
  getTranscriptionByAudienciaId(audienciaId: number): Promise<string | null>
}

interface VideoResponse {
  url: string | null
  transcription?: string | null
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
    async getTranscriptionByAudienciaId(audienciaId) {
      const response = await getJson<VideoResponse>(
        baseUrl,
        `sharepoint/audiencias/${audienciaId}/video`,
      )
      return response.transcription ?? null
    },
  }
}

export function createNativeVideoRepository(
    dataSourcesInfo: PowerAppsDataSourcesInfo,
  ): VideoRepository {
    const client = getClient(dataSourcesInfo)

    return {
      async getUrlByAudienciaId(audienciaId) {
        const result = await client.retrieveMultipleRecordsAsync<{
          idAudiencia?: number
          URL?: string | null
        }>('video', {
          select: ['idAudiencia', 'URL'],
          filter: `idAudiencia eq ${audienciaId}`,
          top: 1,
        })
        if (!result.success) {
          throw result.error ?? new Error('SQL video lookup failed')
        }
        return result.data[0]?.URL ?? null
      },
      async getTranscriptionByAudienciaId(audienciaId) {
        const result = await client.retrieveMultipleRecordsAsync<{
          idAudiencia?: number
          transcripcion?: string | null
        }>('video', {
          select: ['idAudiencia', 'transcripcion'],
          filter: `idAudiencia eq ${audienciaId}`,
          top: 1,
        })
        if (!result.success) {
          throw result.error ?? new Error('SQL transcription lookup failed')
        }
        return result.data[0]?.transcripcion ?? null
      },
    }
  }

export const mockVideoRepository: VideoRepository = {
  async getUrlByAudienciaId() {
    return null
  },
  async getTranscriptionByAudienciaId() {
    return null
  },
}
