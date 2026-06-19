# IJP-REC-002 — RECEPCIÓN DE MADERA Y SUBPRODUCTOS (Balanza 2)

## Procedimiento operacional — BORRADOR consolidado

---

### CONTROL DOCUMENTAL (ISO 7.5)

| Campo | Valor |
|-------|-------|
| **Código** | IJP-REC-002 |
| **Título** | Recepción de madera y subproductos — Balanza 2 (BPS2) |
| **Versión** | 0.1-DRAFT |
| **Fecha** | 19 de junio de 2026 |
| **Estado** | Borrador — pendiente validación planta |
| **Reemplaza (parcial)** | Sección recepción de IJP Rev9; complementa **IJP-REC-001** |
| **Documento relacionado** | **IJP-REC-001** — Guía detallada ANI (`RECEPCION_DE_MADERA_guia_v2`, `IJP_FINAL`) |
| **Responsable elaboración** | Manuel Montúfar (pasantía) |
| **Responsable SGC** | Daniel Sotalin |
| **Aprobación** | Pendiente |
| **Próxima revisión** | Tras validación formal con Gabriel / Daniel |

**ISO 7.5.2 — Creación:** Identificado por código IJP-REC-002; formato Markdown editable; revisión operativa con transcripts 17-jun-2026.  
**ISO 7.5.3 — Control:** Copia maestra en `documentos-finales/`; no sobrescribir IJP-REC-001 (docx/pdf finales). Distribución: repositorio NOVOPAN + NOVOPAN-SLIDES cuando se sincronice.

---

## 1. PROPÓSITO Y ALCANCE

Establece los pasos 1–11 de recepción en **Balanza 2 (BPS2)** para madera rolliza, subproductos y casos especiales, con trazabilidad ISO y cumplimiento MAATE.

| Límite | Descripción |
|--------|-------------|
| **Inicia** | Llegada del camión a Balanza 2 |
| **Termina** | Liberación hacia patio asignado con número de ingreso (RJP-01) |
| **Fuera de alcance** | Descarga en patio, consumo, salida Balanza 1 — ver IJP Descargas / Inventario |

**Guía detallada ANI:** Para capturas de pantalla, flujos por tipo de proveedor (propios, terceros, vuelo forestal) y campos verdes de ANI, consultar **IJP-REC-001** (`RECEPCION_DE_MADERA_guia_v2`).

---

## 2. GLOSARIO (extracto)

| Término | Definición |
|---------|------------|
| **Balanza 2 (BPS2)** | Balanza de ingreso |
| **Balanza 1 (PS1)** | Balanza de salida |
| **ANI** | Sistema de registro de ingreso, peso y datos de embarque |
| **QR forestal** | Código del proveedor; prellena bosque, transporte, cosechador, categoría, especie |
| **RJP-01** | Comprobante de peso impreso por ANI |
| **Patio interno** | Patios **5, 6, 7, 8 y 21** — sin pase de control |
| **Patio externo** | Cualquier otro patio de los 21 — requiere pase de control y retención de cédula |
| **Vuelo forestal** | Ingreso con flujo específico (QR o manual) — ver Excepción 3 |
| **Recirculación** | Material interno de planta devuelto a materia prima — ver Excepción 4 |

> **[POR VALIDAR — definición patios internos/externos — responsable: Gabriel / Daniel]** Confirmar que la lista 5,6,7,8,21 sigue vigente en RJP-03.

---

## 3. ROLES

| Rol | Responsabilidad en recepción |
|-----|------------------------------|
| Operador de balanza | Ejecuta pasos 1–11 |
| Ayudante de balanza | Apoyo en pico y muestreo |
| Supervisor de preparación | Excepciones, fuerza mayor |
| Jefe de Patios (Gabriel) | Criterios asignación patio (paso 10) |
| Daniel Sotalin | Mantenimiento IJP y trazabilidad ISO |
| Departamento Forestal | LEF-01, precios autorizados (no verificación operativa en balanza) |

---

## 4. FLUJO RESUMIDO

```
Llegada → Tipo carga → F4 peso → Documentos → Conductor
  → Datos ANI (QR/manual) → Validación guía → Verificar datos ingreso
  → Humedad (si aplica) → Diámetro → Patio → F12/F5 → RJP-01 → Liberar
```

---

## 5. PROCEDIMIENTO PASO A PASO

### PASO 1 — Llegada del camión

**Responsable:** Operador de balanza | **Tiempo:** ~2 min

1. Ubicar camión completamente en BPS2.
2. Identificar tipo de carga:

| Tipo | Ejemplos | Flujo |
|------|----------|-------|
| Rollizo | Tronco sin procesar | Normal → paso 2 |
| Subproducto | Chip, aserrín, viruta, lámina, jampa, retazo | Normal → paso 2 |
| Combustible | DSL, GLP, resina | → Excepción 6 |
| Reciclado | Madera externa, retazos tablero | Normal (marcar reciclado) |
| Residuo | Camión EMASEO | → Excepción 7 |

---

### PASO 2 — Captura peso de entrada

**Sistema:** ANI | **Tecla:** `F4`

1. Balanza en cero; camión totalmente sobre plataforma.
2. Presionar `F4`; verificar coincidencia con balanza física (tolerancia >100 kg → supervisor).
3. Checklist: cero ✓ | plataforma completa ✓ | peso razonable ✓

---

### PASO 3 — Recepción de documentos

Solicitar según tipo de proveedor:

| Proveedor | Documentos |
|-----------|------------|
| **Propio — rolliza** | Guía circulación forestal + guía de madera + guía de remisión |
| **Tercero — rolliza** | Guía circulación forestal |
| **Subproductos terceros** | Según normativa + factura (Contabilidad) |

**Adicional:** Foto geolocalizada del punto más lejano de carga (archivar en oficina balanza).

> **[POR VALIDAR — documentos por vuelo forestal y recirculación — responsable: Andrés / Daniel]**

---

### PASO 4 — Identificación del conductor

1. Verificar cédula o licencia vigente; anotar placa.
2. **Si patio externo** (≠ 5,6,7,8,21): retener cédula, entregar pase de control.
3. **Si patio interno:** verificar cédula sin retener.

---

### PASO 5 — Ingreso de datos en ANI

**Referencia detallada:** IJP-REC-001 — secciones por proveedor y con/sin QR.

#### Opción A — Con QR forestal
1. Escanear QR con lector.
2. Revisar campos prellenados (bosque, transporte, cosechador, categoría, especie).
3. Completar campos verdes faltantes.
4. → Paso 6.

#### Opción B — Sin QR (común en terceros)
Llenar manualmente: placa, proveedor, transportista, servicio explotación, especie, categoría, ubicación tentativa.

#### Anulaciones previas al cierre
Si el QR está vinculado a **cuenta contrato incorrecta**, los campos pueden quedar bloqueados. **No continuar:** anular ingreso y rehacer manualmente.

> **[POR VALIDAR — procedimiento formal anulación ANI — responsable: Daniel Sotalin]**

---

### PASO 6 — Validación de guía (automática ANI)

ANI verifica que la guía **no esté duplicada**.

| Resultado | Acción |
|-----------|--------|
| Guía nueva | Continuar → paso 7 |
| Guía duplicada | Informar conductor; camión sale de balanza; proveedor emite nueva guía; **no descargar** |

Ver **Excepción 5 — Guía duplicada**.

---

### PASO 7 — Verificación de datos de ingreso *(sustituye "verificar precios")*

> **Nota de cambio (19-jun-2026):** Gabriel indicó que el operador de balanza **no debe verificar precios ni forma de pago** (definidos por Forestal/Gerencia en LEF-01). Este paso verifica **consistencia de datos del ingreso** antes de validar.  
> **Pendiente validación formal** con Daniel Sotalin y aprobación para reemplazar texto en IJP-REC-001.

**Responsable:** Operador de balanza | **Tiempo:** ~2 min

Verificar **antes de digitar humedad o cerrar ingreso:**

| Campo / dato | Verificación |
|--------------|--------------|
| Categoría | Coincide con carga física y documentos |
| Material / especie | Correcto para el embarque |
| Proveedor y cuenta contrato | Coherentes con QR o ingreso manual |
| QR forestal | Vinculado al contrato correcto; si no, anular y reingresar manual |
| Placa, transportista | Coinciden con documentos |
| Ubicación / patio tentativo | Coherente con asignación del día |

**Si hay discrepancia:** no digitar humedad; corregir o anular y reingresar; escalar a supervisor.

**Precios y LEF-01:** responsabilidad de Departamento Forestal / Gerencia — no del operador de balanza en tiempo real.

---

### PASO 8 — Muestreo de humedad

**Tiempo rolliza:** 25–40 min (transcript Gabriel, 17-jun-2026).

#### 8.1 Frecuencia

| Tipo | Frecuencia |
|------|------------|
| Rollizo — proyecto nuevo | 10 muestras consecutivas o mín. 1 semana |
| Rollizo — proyecto antiguo | 5 muestras/semana |
| Rollizo — tercero continuo | 5 muestras/semana |
| Rollizo — tercero ocasional | 1 de cada 5 vehículos (20%) |
| Subproductos / madera en seco | 100% |
| Chip — % corteza | 100% |

#### 8.2 Método (resumen)
- **Rolliza:** 0,6 m del extremo o ¼ longitud; taladro DEWALT D25133-B3, broca ½".
- **Chip/aserrín:** 3 muestras (inicio, mitad, final), homogeneizar.
- **Analítica:** 125 °C; muestra 2,5–3,5 g; desconexión 1/20 mg/s.

#### 8.3 Etiquetado

- **Rolliza propia:** ANI imprime etiqueta desde balanza (ya no manual en Patio 5 para este flujo).
- **Terceros/subproductos en Patio 5:** etiqueta manual o enviada desde balanza según operación actual.

> **[POR VALIDAR — etiquetado humedad flujo definitivo — responsable: Gabriel / Franklin]**

#### 4.10.1 Humedad: último filtro antes del cierre *(ref. IJP-REC-001 §4.10)*

> Texto alineado a **ADENDA 2026-06-19** — insertar en IJP-REC-001 tras tiempo de análisis (25–40 min), antes de 4.11 Etiquetado.

El % de humedad es el **último dato que se digita en ANI antes del cierre del ingreso**. Una vez registrado, corregir el valor puede exigir **anular el ingreso y reingresarlo**, lo cual tiene impacto contable.

Por esto el operador debe:

- Confirmar el valor del equipo **antes** de digitarlo en ANI (lectura directa de la pantalla de la balanza analítica, sin estimaciones).
- Si el QR del proveedor o la cuenta-contrato registrada son erróneos, **no digitar la humedad encima**: primero anular el ingreso y reingresarlo con los datos correctos.
- El punto exacto en ANI donde la humedad bloquea la edición del registro queda **[POR VALIDAR con Daniel Sotalin / supervisor ANI]**.
- El procedimiento detallado de anulación por humedad incorrecta o por QR/cuenta-contrato erróneos queda **[POR VALIDAR — escalar a supervisor]**.

#### 8.5 Si el análisis demora

Registrar salida con humedad pendiente; completar el mismo día por número de ingreso o placa.

#### 4.12.1 Verificación de humedad en salida — Balanza 1 (PS1) *(ref. IJP-REC-001 §4.12)*

> Texto alineado a **ADENDA 2026-06-19** — insertar en IJP-REC-001 justo después del párrafo 4.12.

Antes de cerrar la salida del camión en Balanza 1, el operador debe verificar que el % de humedad esté digitado en ANI.

- Si quedó en blanco (caso del 4.12), búsquelo por número de ingreso o placa, ingrese el valor manualmente, y solo entonces libere el cierre de salida.
- Para **patios externos**, la humedad en salida es **obligatoria**: no se puede cerrar la salida con humedad en blanco. Si el resultado no está, avise al supervisor y registre el valor antes de liberar el cierre.

---

### PASO 9 — Medición de diámetro

Medir 3–5 troncos representativos en zona de 1 m²; promediar; registrar en ANI.

---

### PASO 10 — Asignación de patio

1. Consultar hoja de rumas y grupo WhatsApp patios.
2. Verificar RJP-03 para el material.
3. Indicar patio al conductor; registrar en ANI.
4. **Patio externo:** confirmar pase y cédula retenida.

#### 4.14.1 Orden de descarga: FIFO con excepción justificada *(ref. IJP-REC-001 §4.14)*

> Texto alineado a **ADENDA 2026-06-19** — insertar al final de 4.14 Asignación de patio en IJP-REC-001.

Como regla general la descarga sigue **FIFO** (primero en entrar, primero en descargar).

En la práctica, se puede descargar por **especie** o por **patio** cuando lo justifica el esquema del día (RJP-03) o instrucción del Jefe de Patios. Toda excepción al FIFO debe estar:

- **Justificada** (motivo claro: especie crítica, patio saturado, esquema del día).
- **Comunicada al supervisor** antes de ejecutarse.
- **Registrada** en el medio que defina el supervisor (WhatsApp del grupo de patios o nota en hoja de turno).

> **[POR VALIDAR — priorización descarga — responsable: Gabriel / Iván]**

---

### PASO 11 — Cierre del ingreso y liberación

**Teclas:** `F12` → `F5`

1. Revisar datos en pantalla (peso, proveedor, especie, patio, humedad si aplica).
2. `F12` confirmar; `F5` guardar → número de ingreso generado.
3. Imprimir **RJP-01**; entregar al conductor.
4. Liberar camión hacia patio.

**Crítico:** No liberar a descarga sin número de ingreso visible.

---

## 6. EXCEPCIONES

### Excepción 1 — Vuelo forestal

**Con QR:** autollenado de datos superiores; escanear guía forestal y guía de madera (guía forestal debe tener QR).

**Sin QR / manual** (transcript Andrés): tipo proveedor, placa, nº guía remisión, código proveedor, código transporte, código mano de obra, provincia, cantón, material, ubicación, sitio descarga, categoría, operador, peso entrada.

> **[POR VALIDAR — campos exactos ANI vuelo forestal — responsable: Andrés / Daniel]**

Detalle paso a paso: **IJP-REC-001**.

---

### Excepción 2 — Recirculación interna

Material de planta devuelto a materia prima puede registrarse con **código sin rubro / precio cero** para control de cantidad.

> **[POR VALIDAR — códigos y procedimiento recirculación — responsable: Daniel / Contabilidad]**

---

### Excepción 3 — Patios externos

| Momento | Acción |
|---------|--------|
| Entrada | Retener cédula; pase de control |
| Salida (PS1) | Devolver cédula; **humedad obligatoria** antes de cierre |

---

### Excepción 4 — Anulaciones en ANI

Causas documentadas en transcripts: QR/cuenta contrato incorrecta, humedad mal digitada, error de digitación.

| Paso | Acción |
|------|--------|
| Detectar error antes de humedad | Corregir campos editables o anular |
| Error post-humedad / post-integración | Anular ingreso; solicitar autorización supervisor/contabilidad; reingreso manual |

> **[POR VALIDAR — anulaciones ANI paso a paso — responsable: Daniel Sotalin]**

---

### Excepción 5 — Guía duplicada

ANI rechaza guía existente → conductor sale → nueva guía del proveedor → nuevo ingreso.

---

### Excepción 6 — Combustibles

Solo pesaje entrada/salida; Bodega; no flujo completo ANI.

---

### Excepción 7 — Residuos (EMASEO)

Registro en hoja Google Drive; informar a Daniel Sotalin; sin número ANI.

---

### Excepción 8 — Reciclado

Flujo completo ANI; humedad 100%; patio reciclado (coordinar Gabriel).

---

### Excepción 9 — Trasbordo

Dos ingresos ANI si descarga en más de un patio/máquina.

---

### Excepción 10 — Fuerza mayor

**ANI caído:** registro manual secuencial; regularizar con Daniel.  
**PS1 dañada:** peso histórico por placa o capacidad similar documentada.

---

## 7. REGISTROS GENERADOS (resumen)

Ver `REGISTROS_POR_PASO_IJP.md` y `MATRIZ_REGISTROS_ISO.md`.

| Registro | Paso | Retención |
|----------|------|-----------|
| RJP-01 | 11 | **[POR VALIDAR — archivo registros retención — Daniel]** |
| Etiqueta humedad | 8 | OneDrive + foto |
| Foto geolocalizada | 3 | Oficina balanza |
| "14 % HUMEDADES DE INGRESO-REVXX" | 8 | Control Room Secadero 2 |

---

## 8. DOCUMENTOS RELACIONADOS

| Código | Documento |
|--------|-----------|
| IJP-REC-001 | Guía recepción madera ANI (final usuario) |
| RJP-03 | Esquema patios |
| LEF-01 | Precios autorizados (consulta Forestal, no operador) |
| IJP-DES-001 | Descargas y patios (por formalizar) |

---

## 9. HISTORIAL DE CAMBIOS

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 0.1-DRAFT | 19-jun-2026 | Consolidación transcripts + gaps; Paso 7 → verificar datos ingreso; nomenclatura IJP-REC-002 |
| 0.1-DRAFT+ADENDA | 19-jun-2026 | Integrados bloques ADENDA 4.10.1, 4.12.1, 4.14.1 (ref. IJP-REC-001) |

---

**Elaborado por:** Manuel Montúfar  
**Fuentes:** IJP-REC-001 (referencia), `_archive/outputs/IJP_Recepcion_v2_MEJORADO_clean.md`, transcripts 2026-06-17, `gabriel_conversacion_ijp.md`, `andres_revision_de_forestal.md`
