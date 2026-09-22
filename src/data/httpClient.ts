export class DataSourceError extends Error {
  readonly status: number | undefined

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'DataSourceError'
    this.status = status
  }
}

export async function getJson<T>(
  baseUrl: string,
  path: string,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`, {
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!response.ok) {
    throw new DataSourceError(
      `Data source request failed (${response.status} ${response.statusText})`,
      response.status,
    )
  }

  return response.json() as Promise<T>
}
