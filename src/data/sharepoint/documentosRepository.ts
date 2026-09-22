import type { Documento } from '../types/documento'
import { getJson } from '../httpClient'

export interface SharePointDocumentSummary {
  name: string
  link: string | null
  path: string | null
}

export interface DocumentosRepository {
  list(): Promise<readonly Documento[]>
  listSummaries(): Promise<readonly SharePointDocumentSummary[]>
}

export interface SharePointDocumentClient {
  listDocuments(): Promise<readonly SharePointDocumentSummary[]>
  getVideoUrl(audienciaId: number): Promise<string | null>
}

const staticText =
  '📁 Archivos de la reunión\n\n' +
  'Informe_Seguimiento_Enero_2026,pdf\n' +
  'Informe mensual con indicadores y métricas clave,\n\n' +
  'Presentacion_Operativa_Reunion,pptx\n' +
  'Diapositivas utilizadas durante la reunión,\n\n' +
  'Plan_Acciones_Q1,xlsx\n' +
  'Detalle de acciones; responsables y fechas objetivo,\n\n' +
  'Transcripcion_Reunion_2026-01-18,txt\n' +
  'Transcripción automática generada por Microsoft Stream,\n\n' +
  'Notas_Reunion_Operativa,docx\n' +
  'Resumen ejecutivo y decisiones acordadas,'

const staticDocuments: readonly Documento[] = [
  {
    ID: 0,
    Modified: null,
    'Editor#Claims': null,
    Editor: null,
    ComplianceAssetId: null,
    OData__ColorTag: null,
    Created: null,
    'Author#Claims': null,
    Author: null,
    'CheckoutUser#Claims': null,
    CheckoutUser: null,
    OData__DisplayName: null,
    '{Identifier}': null,
    '{IsFolder}': false,
    '{Thumbnail}': null,
    '{Link}': null,
    '{Name}': staticText,
    '{FilenameWithExtension}': null,
    '{Path}': null,
    '{FullPath}': null,
    '{ModerationStatus}': null,
    '{ModerationComment}': null,
    '{ContentType}#Id': null,
    '{IsCheckedOut}': false,
    '{DriveId}': null,
    '{DriveItemId}': null,
    '{SensitivityLabelId}': null,
    '{SensitivityLabelName}': null,
    '{VersionNumber}': null,
    '{TriggerWindowStartToken}': null,
    '{TriggerWindowEndToken}': null,
    Title: 'Archivos de la reunión',
    OData__ExtendedDescription: null,
    '{ContentType}': null,
  },
]

export function createDocumentosRepository(
  useSharePoint = false,
  client?: SharePointDocumentClient,
): DocumentosRepository {
  return {
    async list() {
      if (!useSharePoint) return [...staticDocuments]
      if (client === undefined) {
        throw new Error('SharePoint client is required when V2 is enabled')
      }
      return client.listDocuments().then((documents) =>
        documents.map((document, index) => ({
          ID: index,
          Modified: null,
          'Editor#Claims': null,
          Editor: null,
          ComplianceAssetId: null,
          OData__ColorTag: null,
          Created: null,
          'Author#Claims': null,
          Author: null,
          'CheckoutUser#Claims': null,
          CheckoutUser: null,
          OData__DisplayName: null,
          '{Identifier}': null,
          '{IsFolder}': false,
          '{Thumbnail}': null,
          '{Link}': document.link,
          '{Name}': document.name,
          '{FilenameWithExtension}': document.name,
          '{Path}': document.path,
          '{FullPath}': document.path,
          '{ModerationStatus}': null,
          '{ModerationComment}': null,
          '{ContentType}#Id': null,
          '{IsCheckedOut}': false,
          '{DriveId}': null,
          '{DriveItemId}': null,
          '{SensitivityLabelId}': null,
          '{SensitivityLabelName}': null,
          '{VersionNumber}': null,
          '{TriggerWindowStartToken}': null,
          '{TriggerWindowEndToken}': null,
          Title: document.name,
          OData__ExtendedDescription: null,
          '{ContentType}': null,
        })),
      )
    },
    async listSummaries() {
      if (!useSharePoint) {
        return [{ name: staticText, link: null, path: null }]
      }
      if (client === undefined) {
        throw new Error('SharePoint client is required when V2 is enabled')
      }
      return client.listDocuments()
    },
  }
}

export const documentosRepository = createDocumentosRepository()

export function createHttpDocumentosRepository(
  baseUrl: string,
): DocumentosRepository {
  const client: SharePointDocumentClient = {
    listDocuments: () =>
      getJson<SharePointDocumentSummary[]>(
        baseUrl,
        'sharepoint/documentos?fields=Name,Link,Path',
      ),
    getVideoUrl: (audienciaId) =>
      getJson<{ url: string | null }>(
        baseUrl,
        `sharepoint/audiencias/${audienciaId}/video`,
      ).then((response) => response.url),
  }

  return createDocumentosRepository(true, client)
}
