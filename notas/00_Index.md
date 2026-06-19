# NOVOPAN Knowledge Base Index

**Last Updated:** 17 de junio de 2026  
**Internship:** Recepción de madera, operación de patios, reportería y procesos  
**Key Contacts:** Carlos (Gerente de planta), Iván (Jefe de producción - apoyo clave)

---

## Quick Navigation

### 📋 Core Processes
- **[Recepción de Madera (IJP-Recepción)](processes/IJP_Recepcion_v1.md)** — Procedimiento paso a paso para ingreso, balanza, documentación
- **[Descarga de Madera en Patios](processes/descarga_y_patios.md)** — Operación interna, asignación de rumas, ubicación
- **[Inventario y Reporte](processes/inventario_reporteria.md)** — Sistemas ANI, INFOR, códigos de ubicación, tracking

### 📚 Reference Documents
- **[Glosario de Términos](glossary/terminos_novopan.md)** — Máquinas, sistemas, especies, materiales
- **[Personas y Roles](reference/personas_y_roles.md)** — Gerentes, jefes de área, responsabilidades
- **[Matriz de Sistemas](reference/sistemas_it.md)** — ANI, INFOR, códigos, dispositivos, integraciones

### 🎤 Raw Materials
- **[Transcripciones de Audio](transcripts/)** — 9 audios procesados del 15 de junio
  - Formatos: .txt (transcripción), .json (metadata)
  - Archivos WAV originales en `work/wav/`
- **[Audios procesados 17 de junio](transcripts/2026-06-17_batch/00_batch_index.md)** — 10 audios nuevos con transcript y nota técnica por audio
  - Incluye: ANI, IJP, humedad, patios, rumas, Factory Track, consumo, rotación y anulaciones
  - Audios respaldados en `audios/2026-06-17_batch/`
- **[Notas Coherentes Sintetizadas](outputs/notas_coherentes_novopan.md)** — Resumen organizado de todos los audios

### ❓ Pendientes y Preguntas Abiertas
- **[Items por Confirmar](decisions-and-open-items/pendientes_confirmacion.md)** — Nombres de equipos, rangos exactos de tiempos, capacidades
- **[Mejoras Sugeridas](decisions-and-open-items/mejoras_propuestas.md)** — Alertas de descarga, métricas de tiempo, priorización
- **[Gaps de Información](decisions-and-open-items/gaps_informacion.md)** — Qué falta investigar o validar con planta
- **[Research aplicado a audios 17 de junio](technical-research/research_audio_gaps_2026-06-17.md)** — Fuentes oficiales/técnicas usadas para completar gaps

### 📊 Deliverables
- **[Presentación de Pasantía](outputs/presentacion_pasantia_novopan.pptx)** — Resumen ejecutivo
- **[Instructivos Descarga](outputs/instructivo_descargas.md)** — Guía de descargas sin balanza
- **[Instructivos Balanza](outputs/instructivo_descargas_balanza.md)** — Guía de descargas con balanza

---

## Quick Facts

### Personas Clave
| Nombre | Rol | Expertise |
|--------|-----|-----------|
| Carlos | Gerente de planta | Visión general, decisiones estratégicas |
| Iván | Segundo jefe de producción | Patios, descargas, consumo, logística interna |
| Gabriel | Jefe de patios | Ubicación de rumas, rotación |
| Franklin | Jefe de control de calidad | Humedad, densidad, especificaciones |
| Jorge | Jefe de producción | Recetas, velocidades, producto final |
| Angelo | Gerente de línea chica | Operación línea pequeña |

### Especies Principales
**No tropical:** Pino, Eucalipto (de Sierra)  
**Tropical:** Teca, Caucho, Melina, E. globulus, E. urograndis, otras de Costa

### Flujo Simplificado
```
Recepción (Balanza 2) 
  → Registro en ANI 
  → Patio asignado (ruma) 
  → Consumo desde patio 
  → Salida (Balanza 1)
```

### Key Systems
- **ANI:** Sistema de recepción/ingreso de madera (presionar F4 para peso, escanear QR)
- **INFOR:** Sistema de inventario (integración con ANI)
- **IFO:** Aplicativo de reporte con lector de código de barras
- **Factory Track:** Aplicativo/dispositivo móvil para reportar descargas y consumos por ubicación/ruma
- **Balanza 2 (BPS2):** Ingreso
- **Balanza 1 (PS1):** Salida

### Mediciones Críticas
- Humedad de ingreso
- Humedad de consumo
- Factor de apilamiento
- Volumen estereo vs. volumen neto
- Densidad (toneladas secas)
- Conversión húmedo → seco

### Retos Identificados
1. **Tiempo de descarga:** Camiones con hasta 5h en planta; necesario medir espera vs. descarga real
2. **Humedad:** Varía por posición en ruma y lluvia; afecta velocidad de línea
3. **Comunicación:** Supervisor, operador, balanza; priorización de descargas
4. **Ubicación de rumas:** Rotación alta debe estar cerca de producción

---

## Folder Structure

```
NOVOPAN/
├── 00_Index.md                          (este archivo)
├── processes/                            (procedimientos e instructivos)
│   ├── IJP_Recepcion_v1.md
│   ├── descarga_y_patios.md
│   └── inventario_reporteria.md
├── glossary/                             (glosario y referencias técnicas)
│   └── terminos_novopan.md
├── reference/                            (información de contexto)
│   ├── personas_y_roles.md
│   └── sistemas_it.md
├── decisions-and-open-items/             (pendientes, mejoras, gaps)
│   ├── pendientes_confirmacion.md
│   ├── mejoras_propuestas.md
│   └── gaps_informacion.md
├── transcripts/                          (transcripciones y audios)
│   ├── raw/                              (transcripción bruta por audio)
│   └── synthesized.md                    (síntesis coherente)
│   └── 2026-06-17_batch/                 (lote nuevo: raw + notes + índice)
├── technical-research/                   (fuentes usadas para completar gaps)
├── outputs/                              (documentos finales)
│   ├── notas_coherentes_novopan.md
│   ├── presentacion_pasantia_novopan.pptx
│   ├── IJP_Recepcion_v1.md
│   ├── IJP_Recepcion_v2.md
│   ├── instructivo_descargas.md
│   ├── instructivo_descargas_balanza.md
│   └── novopan_notes/
├── audios/                               (archivos m4a originales)
│   └── Andres revision de forestal.m4a
├── work/                                 (archivos de trabajo)
│   ├── audio/
│   ├── transcripts/                      (JSON + TXT sin procesar)
│   └── wav/                              (conversiones WAV)
└── transcripts_audio_forestal/           (transcripción anterior)
```

---

## How to Use This Knowledge Base

1. **New to the project?** Start with Quick Facts and this index, then read Personas y Roles.
2. **Need a process?** Check the `processes/` folder. Processes are step-by-step with roles and systems.
3. **Stuck on terminology?** See `glossary/terminos_novopan.md`.
4. **Want to know what's unconfirmed?** Check `decisions-and-open-items/pendientes_confirmacion.md`.
5. **Raw transcripts?** In `transcripts/` folder, also in `work/transcripts/` (JSON + TXT).

---

## Next Steps

**Immediate (before next site visit):**
- [ ] Confirm system names: ANIME/ANI, IFO, ITMAD/PERMAL
- [ ] Verify exact color ranges and times (verde, amarillo, rojo thresholds)
- [ ] Confirm equipment brands (Mayer chipeadora, Dynesty, etc.)
- [ ] Measure actual descarga vs. espera times with supervisors

**Short-term:**
- [ ] Build alert/notification system for descarga tracking
- [ ] Establish baseline metrics: descarga time, stock levels, humedad trends
- [ ] Validate receta formulas and consumo rates by especie

**Medium-term:**
- [ ] Integrate ANI + INFOR + balanza data for real-time dashboard
- [ ] Document operating procedures (IJP) for each role
- [ ] Create training materials for new operators
