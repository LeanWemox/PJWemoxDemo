# 06 — Variables y colecciones

## Resumen

La aplicación utiliza variables globales con `Set`. No se encontraron `UpdateContext` ni `ClearCollect`, por lo que no hay variables de contexto ni colecciones declaradas en los archivos extraídos.

## Variables inicializadas en `App.OnStart`

Archivo: `Src/App.pa.yaml` (también reflejado en `Controls/1.json`).

```powerfx
Set(varMostrarFiltro, false);
Set(varTranscripcion, true);
Set(varHitos, false);
Set(varNotas, false);
Set(varAsistencia, false);
Set(varArchivos, false)
```

| Variable | Valor inicial | Propósito observado |
|---|---:|---|
| `varMostrarFiltro` | `false` | Mostrar/ocultar filtros de búsqueda |
| `varTranscripcion` | `true` | Activar vista de transcripción |
| `varHitos` | `false` | Activar vista de hitos |
| `varNotas` | `false` | Activar vista de notas |
| `varAsistencia` | `false` | Activar vista de asistentes |
| `varArchivos` | `false` | Activar vista de archivos |

## Otras asignaciones `Set`

### `Reproductor.OnVisible`

```powerfx
Set(varInicioVideoSegundos, 15 * 3600 + 16 * 60 + 15);
Set(varStartTime, 0)
```

Valores resultantes: `varInicioVideoSegundos = 54975`; `varStartTime = 0`.

### Búsqueda/filtros

- `Icon1.OnSelect`: `Set(varMostrarFiltro, true)`
- `Button2.OnSelect`: `Set(varMostrarFiltro, false)`
- `Button2_1.OnSelect`:

```powerfx
Reset(DatePickerDesde);
Reset(DatePickerHasta);
Set(varMostrarFiltro, false)
```

### Navegación del reproductor

`Button1.OnSelect` activa transcripción, desactiva las demás vistas, fija `varBotonActivo` en `1`, carga el texto estático de la reunión en `varTextoMostrado` y ejecuta `Reset(TextInput2)`.

`Button1_1.OnSelect`:

```powerfx
Set(varTranscripcion, false);
Set(varHitos, true);
Set(varNotas, false);
Set(varAsistencia, false);
Set(varArchivos, false);
Set(varBotonActivo, 2);
Set(varTextoMostrado, "")
```

`Button1_2.OnSelect`:

```powerfx
Set(varTranscripcion, false);
Set(varHitos, false);
Set(varNotas, true);
Set(varAsistencia, false);
Set(varArchivos, false);
Set(varTextoMostrado, "");
Set(varBotonActivo, 3);
Reset(TextInput2)
```

`Button1_3.OnSelect`:

```powerfx
Set(varTranscripcion, false);
Set(varHitos, false);
Set(varNotas, false);
Set(varAsistencia, true);
Set(varArchivos, false);
Set(varBotonActivo, 4);
Set(varTextoMostrado, "")
```

`Button1_4.OnSelect`:

```powerfx
Set(varTranscripcion, false);
Set(varHitos, false);
Set(varNotas, false);
Set(varAsistencia, false);
Set(varArchivos, true);
Set(varBotonActivo, 5);
Set(varTextoMostrado, "📁 Archivos de la reunión

Informe_Seguimiento_Enero_2026,pdf
Informe mensual con indicadores y métricas clave,

Presentacion_Operativa_Reunion,pptx
Diapositivas utilizadas durante la reunión,

Plan_Acciones_Q1,xlsx
Detalle de acciones; responsables y fechas objetivo,

Transcripcion_Reunion_2026-01-18,txt
Transcripción automática generada por Microsoft Stream,

Notas_Reunion_Operativa,docx
Resumen ejecutivo y decisiones acordadas,")
```

### Selección de un hito

`ButtonCanvas1.OnSelect` calcula `varStartTime` a partir de la marca `hh:mm:ss` embebida en `ThisItem.Titulo` y le resta `varInicioVideoSegundos`:

```powerfx
Set(
    varStartTime,
    (
        Value(Left(Mid(ThisItem.Titulo,12,8),2)) * 3600 +
        Value(Mid(Mid(ThisItem.Titulo,12,8),4,2)) * 60 +
        Value(Right(Mid(ThisItem.Titulo,12,8),2))
    ) - varInicioVideoSegundos
)
```

## Ausencias confirmadas

- `UpdateContext(...)`: no encontrado.
- `ClearCollect(...)`: no encontrado.
- Colecciones (`ClearCollect`, `Collect`): ninguna.
- Operaciones de escritura (`Patch`, `Update`, `Remove`, `SubmitForm`): ninguna.

Las variables de estado son globales y permanecen disponibles entre pantallas; la extracción no muestra variables de contexto ni persistencia local.
