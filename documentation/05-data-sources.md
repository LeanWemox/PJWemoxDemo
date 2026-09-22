# 05 — Fuentes de datos

## Alcance y metadatos

Este inventario se obtuvo de `input/extracted/msapp_content`, principalmente de `References/DataSources.json`, `Src/*.pa.yaml` y las definiciones JSON de `Controls`. La aplicación declara `DocVersion 1.349`, `MSAppStructureVersion 2.4.0` y última fecha guardada UTC `03/18/2026 13:21:12` (ver `Header.json`).

> **Permisos:** “Lectura/escritura” describe la capacidad declarada por el esquema del conector. “Lectura observada” describe el uso real encontrado en las fórmulas. No se encontraron operaciones Power Fx de escritura.

## SQL Server

Conexión declarada: `srv-demo-pj.database.windows.net,DB-DEMO-PJ` mediante `/providers/microsoft.powerapps/apis/shared_sql`. Los orígenes SQL están marcados como escribibles en el esquema.

| Tabla | Pantallas/controles donde se usa | Campos leídos por fórmulas | Escrituras observadas |
|---|---|---|---|
| `[dbo].[Asistente]` | `Reproductor` — `GalleryAsistentes.Items` | `IdAudiencia`, `Presente`; los controles de la plantilla muestran principalmente `Nombre` | Ninguna |
| `[dbo].[Audiencia]` | `Buscador` — `Gallery1.Items`; `Reproductor`; `Controls/30.json` — `GalleryNotas.Items` | `CodBarras`, `Fecha`, `IdAudiencia` (y registro de audiencia para contenido) | Ninguna |
| `[dbo].[Causa]` | `Buscador` — información de la causa asociada | La fórmula extraída la usa junto con `Audiencia`; no hay lista de campos proyectados explícita | Ninguna |
| `[dbo].[Hito]` | `Auxiliar` — `Gallery3.Items`; `Reproductor`; `Controls/68.json` — `Gallery3` | `Titulo` (la plantilla también recibe los campos del registro) | Ninguna |
| `[dbo].[AtajoHito]` | No se encontró uso en fórmulas extraídas | Ninguno | Ninguna |
| `[dbo].[Tramite]` | No se encontró uso directo | Ninguno | Ninguna |
| `[dbo].[Notificacion]` | No se encontró uso directo | Ninguno | Ninguna |
| `[dbo].[Video]` | No se encontró consulta explícita en los controles solicitados | Ninguno | Ninguna |

### Esquemas SQL

- **`[dbo].[Asistente]`**: `IdAsistente` (solo lectura); `Nombre`, `DNI`, `CUIT`, `Genero`, `Email`, `DomicilioElectronico`, `Rol`, `Caracter`, `EsAbogado`, `IdAudiencia`, `ValidacionRenaper`, `ImagenValidacion`, `Presente`, `TipoAcceso`, `Origen` (lectura/escritura); `VersionColumnName` (solo lectura).
- **`[dbo].[AtajoHito]`**: `idAtajoHito`, `descripcion` (lectura/escritura).
- **`[dbo].[Audiencia]`**: `IdAudiencia` (solo lectura); `Fecha`, `HoraInicio`, `HoraFin`, `TituloAudiencia`, `IdCausa`, `CodBarras`, `OrganizadorUser`, `ObjectIdOrganizador`, `Estado`, `Privada`, `Menores`, `RequiereValidacion`, `Notas`, `IdAudienciaTeams`, `ThreadIdTeams`, `Archivos`, `Acta`, `TipoAudiencia`, `EventIdTeams`, `MeetingIdTeams`, `IdAudienciaAugusta`, `postAudienciaApp` (lectura/escritura).
- **`[dbo].[Causa]`**: `IdCausa` (solo lectura); `IdCausaAugusta`, `IdOrg`, `NombreOrganismo`, `Prefijo`, `Numero`, `Sufijo`, `Caratula`, `Estado`, `LocalidadJuzgado`, `IdUnicoCausa` (lectura/escritura).
- **`[dbo].[Hito]`**: `idHito` (solo lectura); `IdAudiencia`, `Titulo`, `FechaAlta` (lectura/escritura).
- **`[dbo].[Tramite]`**: `idTramiteBD` (solo lectura); `Fecha`, `idAudiencia`, `idTramite`, `IdUnicoTramite`, `IdTipoTramite`, `IdTramitePosible` (lectura/escritura).
- **`[dbo].[Notificacion]`**: `idNotificacion`, `IdTramiteBD` (lectura/escritura).
- **`[dbo].[Video]`**: `idVideo` (solo lectura); `idAudiencia`, `Titulo`, `transcripcion`, `URL` (lectura/escritura).

## SharePoint

Lista/biblioteca: **`Documentos`**. Conector `/providers/microsoft.powerapps/apis/shared_sharepointonline`, sitio `https://cediconsulting.sharepoint.com/sites/PJDemo`, dataset `95c6fad1-12c2-47dc-ab55-a6eea527ac95`. El esquema está marcado como escribible, pero no se encontró uso de la lista en las fórmulas inspeccionadas ni operaciones de escritura.

| Campo | Permiso declarado |
|---|---|
| `ID`, `Modified`, `Editor#Claims`, `Editor`, `ComplianceAssetId`, `OData__ColorTag`, `Created`, `Author#Claims`, `Author`, `CheckoutUser#Claims`, `CheckoutUser`, `OData__DisplayName`, `{Identifier}`, `{IsFolder}`, `{Thumbnail}`, `{Link}`, `{Name}`, `{FilenameWithExtension}`, `{Path}`, `{FullPath}`, `{ModerationStatus}`, `{ModerationComment}`, `{ContentType}#Id`, `{IsCheckedOut}`, `{DriveId}`, `{DriveItemId}`, `{SensitivityLabelId}`, `{SensitivityLabelName}`, `{VersionNumber}`, `{TriggerWindowStartToken}`, `{TriggerWindowEndToken}` | Solo lectura |
| `Title`, `OData__ExtendedDescription`, `{ContentType}` | Lectura/escritura |

## Conclusiones de acceso

- Las galerías consultan directamente SQL Server; no hay colecciones intermedias para estas fuentes.
- No aparecen `Patch`, `Update`, `Collect`, `Remove` ni `SubmitForm`; por ello no se puede documentar una escritura efectiva aunque el conector permita escribir.
- El texto de archivos de `Button1_4` es estático y no constituye una lectura de SharePoint `Documentos`.
