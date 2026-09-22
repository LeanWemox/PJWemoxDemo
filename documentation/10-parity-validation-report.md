# 10 — Informe de validación de paridad

## Alcance

La Fase 6 valida las reglas críticas trasladadas desde Power Fx a React:

- Cálculo de posición de video de los hitos.
- Filtrado y orden de `Audiencia`.
- Estado exclusivo de las pestañas del reproductor.
- Naturaleza de solo lectura de la aplicación.
- Paridad V1 de la lista estática de archivos.

## Casos automatizados

### `getHitoStartTime`

- Extrae `hh:mm:ss` desde la posición 12 del título, igual que `Mid(..., 12, 8)`.
- Convierte horas, minutos y segundos a segundos.
- Resta `inicioVideoSegundos = 54975`.
- Verifica una marca igual al inicio del video.
- Rechaza títulos sin timestamp, con formato incompleto o con minutos inválidos.

### Repositorio de audiencias

- Busca por contención en `CodBarras`, no solo por prefijo.
- Aplica límites de fecha inclusivos.
- Ordena por `Fecha` descendente.
- Devuelve todos los registros con texto vacío y fechas nulas.

### Pestañas

- Comprueba que solo exista una pestaña activa.
- Verifica el mapeo:
  - `Button1` → `transcripcion`
  - `Button1_1` → `hitos`
  - `Button1_2` → `notas`
  - `Button1_3` → `asistencia`
  - `Button1_4` → `archivos`

## Acceso de datos y escritura

La paridad actual es de solo lectura. No se implementaron ni se encontraron operaciones equivalentes a:

- `Patch`
- `SubmitForm`
- `Collect`
- `Update`
- `Remove`

Los repositorios exponen consultas y los mocks no modifican datos.

## SharePoint y Archivos

La validación V1 conserva la lista estática asignada por `varTextoMostrado` en `Button1_4.OnSelect`. No se presenta como una lectura de SharePoint `Documentos`.

El repositorio incluye un contrato V2 para consultar `{Name}`, `{Link}` y `{Path}` mediante un cliente SharePoint explícito, pero la flag permanece desactivada.

## Ejecución

Comando previsto:

```bash
npm test
```

El resultado esperado es que todas las suites de paridad finalicen correctamente antes de avanzar a una integración real con SQL Server o SharePoint.
