# 04 — Inventario de Power Fx

## Fuentes inspeccionadas

`Src/App.pa.yaml`, `Src/Auxiliar.pa.yaml`, `Src/Buscador.pa.yaml`, `Src/Reproductor.pa.yaml`, `Controls/1.json`, `Controls/4.json`, `Controls/30.json` y `Controls/68.json`.

## `App.OnStart`

```powerfx
Set(varMostrarFiltro, false);
Set(varTranscripcion, true);
Set(varHitos, false);
Set(varNotas, false);
Set(varAsistencia, false);
Set(varArchivos, false)
```

## Items de galerías

### `Gallery1.Items` — `Controls/4.json`

La fórmula activa es:

```powerfx
SortByColumns(
    Filter(
        Audiencia,
        (
            IsBlank(TextInput1.Text) ||
            TextInput1.Text in Text(CodBarras)
        ) &&
        (
            IsBlank(DatePickerDesde.SelectedDate) ||
            Fecha >= DatePickerDesde.SelectedDate
        ) &&
        (
            IsBlank(DatePickerHasta.SelectedDate) ||
            Fecha <= DatePickerHasta.SelectedDate
        )
    ),
    "Fecha",
    SortOrder.Descending
)
```

Existe además una versión comentada anterior que usa `StartsWith(Text(CodBarras); TextInput1.Text)` y separadores de argumentos `;`.

### `Gallery3.Items` — `Controls/68.json`

```powerfx
Hito
```

### `GalleryAsistentes.Items` — `Controls/30.json`

```powerfx
Filter(
    Asistente,
    IdAudiencia = 1 &&
    Presente = true
)
```

### `GalleryNotas.Items` — `Controls/30.json`

```powerfx
Filter(
    Audiencia,
    IdAudiencia = 1
)
```

## OnSelect y acciones relacionadas

### Galería de búsqueda (`Gallery1`)

`Rectangle4`, `Label5`, `Label5_2`, `Label5_6`, `Label5_1` y `Label5_7`:

```powerfx
Select(Parent)
```

El icono interno navega al reproductor:

```powerfx
Navigate(Reproductor)
```

### Galería de hitos (`Gallery3`)

`Rectangle3` y `Separator2`:

```powerfx
Select(Parent)
```

El botón de la plantilla (`ButtonCanvas1`) posiciona el reproductor:

```powerfx
Set(
    varStartTime,
    (
        Value(Left(Mid(ThisItem.Titulo,12,8),2)) * 3600 +
        Value(Mid(Mid(ThisItem.Titulo,12,8),4,2)) * 60 +
        Value(Right(Mid(ThisItem.Titulo,12,8),2))
    )
    - varInicioVideoSegundos
)
```

### Galería de asistentes (`GalleryAsistentes`)

`Rectangle2.OnSelect` es `false`; no ejecuta una acción. No se encontró otro `OnSelect` funcional a nivel de la galería.

### Galería de notas (`GalleryNotas`)

No se encontró un `OnSelect` funcional propio ni en sus controles relevantes.

### Filtros (`Buscador`)

```powerfx
// Icon1.OnSelect
Set(varMostrarFiltro, true)

// Button2.OnSelect
Set(varMostrarFiltro, false)

// Button2_1.OnSelect
Reset(DatePickerDesde);
Reset(DatePickerHasta);
Set(varMostrarFiltro, false)
```

### `Reproductor.OnVisible`

```powerfx
Set(varInicioVideoSegundos, 15 * 3600 + 16 * 60 + 15);
Set(varStartTime, 0)
```

### Botones de pestañas del reproductor

```powerfx
// Button1_1.OnSelect
Set(varTranscripcion, false);
Set(varHitos, true);
Set(varNotas, false);
Set(varAsistencia, false);
Set(varArchivos, false);
Set(varBotonActivo, 2);
Set(varTextoMostrado, "")

// Button1_2.OnSelect
Set(varTranscripcion, false);
Set(varHitos, false);
Set(varNotas, true);
Set(varAsistencia, false);
Set(varArchivos, false);
Set(varTextoMostrado, "");
Set(varBotonActivo, 3);
Reset(TextInput2)

// Button1_3.OnSelect
Set(varTranscripcion, false);
Set(varHitos, false);
Set(varNotas, false);
Set(varAsistencia, true);
Set(varArchivos, false);
Set(varBotonActivo, 4);
Set(varTextoMostrado, "")

// Button1_4.OnSelect
Set(varTranscripcion, false);
Set(varHitos, false);
Set(varNotas, false);
Set(varAsistencia, false);
Set(varArchivos, true);
Set(varBotonActivo, 5);
Set(varTextoMostrado, "📁 Archivos de la reunión\n\nInforme_Seguimiento_Enero_2026,pdf\nInforme mensual con indicadores y métricas clave,\n\nPresentacion_Operativa_Reunion,pptx\nDiapositivas utilizadas durante la reunión,\n\nPlan_Acciones_Q1,xlsx\nDetalle de acciones; responsables y fechas objetivo,\n\nTranscripcion_Reunion_2026-01-18,txt\nTranscripción automática generada por Microsoft Stream,\n\nNotas_Reunion_Operativa,docx\nResumen ejecutivo y decisiones acordadas,")
```

`Button1.OnSelect` tiene la misma conmutación de estados que `Button1_1`–`Button1_4`, pero activa transcripción (`varTranscripcion=true`, las otras cuatro vistas `false`), fija `varBotonActivo=1`, asigna a `varTextoMostrado` la transcripción estática completa de la reunión (incluye marcas `[00:00:02]` a `[00:05:31]`) y termina con `Reset(TextInput2)`. La literal completa está preservada en `Controls/30.json` y `Src/Reproductor.pa.yaml`.

## Operaciones ausentes

No se encontraron `UpdateContext`, `ClearCollect`, `Collect`, `Patch`, `Update`, `Remove` ni `SubmitForm`. Las fórmulas observadas realizan filtrado, ordenamiento, navegación, reset de controles y asignaciones de variables globales.
