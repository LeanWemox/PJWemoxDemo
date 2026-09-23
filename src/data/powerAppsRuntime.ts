import { getClient } from '@microsoft/power-apps/data'
import type { DataClient, IOperationResult } from '@microsoft/power-apps/data'

export interface PowerAppsDataSourcesInfo {
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

export function createPowerAppsDataClient(
  dataSourcesInfo: PowerAppsDataSourcesInfo,
): DataClient {
  return getClient(dataSourcesInfo)
}

export function unwrapPowerAppsResult<T>(
  result: IOperationResult<T>,
  operation: string,
): T {
  if (result.success) {
    return result.data
  }

  const detail = result.error instanceof Error ? result.error.message : undefined
  throw new Error(
    detail === undefined
      ? `Power Apps operation failed: ${operation}`
      : `Power Apps operation failed: ${operation}: ${detail}`,
  )
}
