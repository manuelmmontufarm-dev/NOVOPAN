# INFORME DE CAMBIOS — MISIÓN DOCUMENTACIÓN ISO

**Código:** INF-ISO-001  
**Fecha:** 19 de junio de 2026  
**Elaborado por:** Manuel Montúfar (agente Cursor — misión ISO)

---

## 1. Resumen ejecutivo

Se ejecutó la misión de documentación ISO para recepción de madera (Balanza 2) sin modificar los entregables finales en `docs-finales/`. Se creó la carpeta `documentos-finales/` con borradores alineados a ISO 7.5, consolidación operativa (IJP-REC-002) y matrices de control. La madurez estimada del paquete documental SGC para recepción es **~48%** (ver sección 3).

---

## 2. Creado vs solo referenciado

### 2.1 Archivos CREADOS (nuevos)

| Archivo | Tipo |
|---------|------|
| `documentos-finales/IJP-REC-002_Recepcion_Madera_DRAFT.md` | IJP borrador |
| `documentos-finales/MATRIZ_DOCUMENTOS_SGC.md` | Matriz ISO |
| `documentos-finales/MATRIZ_REGISTROS_ISO.md` | Matriz registros |
| `documentos-finales/REGISTROS_POR_PASO_IJP.md` | Trazabilidad paso-registro |
| `documentos-finales/PROCEDIMIENTO_NO_CONFORMIDAD_DRAFT.md` | Procedimiento NC |
| `documentos-finales/CHECKLIST_AUDITORIA_INTERNA_7.5.md` | Auditoría 7.5 |
| `documentos-finales/PENDIENTES_DOCUMENTOS_SGC.md` | Gaps SGC |
| `documentos-finales/obsoletos/README.md` | Archivo obsoletos |
| `_archive/outputs/ARCHIVO/README.md` | Archivo outputs |
| `00_Index.md` | Índice + matriz |
| `TODAY.md` | Estado del día |

### 2.2 Solo REFERENCIADOS (no modificados)

| Recurso | Ubicación | Uso |
|---------|-----------|-----|
| IJP-REC-001 / IJP_FINAL | `docs-finales/*.docx` | Documento final usuario |
| RECEPCION guía v2 | `docs-finales/*.docx` | Detalle ANI por proveedor |
| PDF / HTML final | `docs-finales/` | Entregables usuario |
| IJP_Recepcion_v2_MEJORADO_clean | `_archive/outputs/` | Fuente secundaria |
| Transcripts 17-jun | `transcripts/2026-06-17_batch/` | Evidencia operativa |
| gaps / pendientes | `decisions-and-open-items/` | Gaps formalizados |
| ADENDA 2026-06-19 | `notes/ADENDA_*.md` | Contenido pendiente pegar en docx |
| NOVOPAN-SLIDES | GitHub | Finales en `instructivos/finales/`; sin plantilla SGC |

---

## 3. Madurez ISO estimada

| Área | % | Justificación |
|------|---|---------------|
| Procedimiento operativo recepción (contenido) | **72%** | Pasos 1–11 + excepciones en IJP-REC-002; validación planta pendiente |
| Control documental 7.5.2 (identificación) | **55%** | Códigos y versiones en borradores; falta plantilla y PROC-CD oficial |
| Control registros 7.5.3 | **40%** | Matriz creada; retención y anulaciones sin política formal |
| Trazabilidad cadena completa | **45%** | Recepción fuerte; Factory/consumo parcial |
| NC y auditoría | **35%** | Borradores CHK + PROC-NC; sin formato NC planta |
| **Global recepción + SGC docs** | **~48%** | Promedio ponderado operativo |

---

## 4. Ítems [POR VALIDAR] consolidados

| ID | Tema | Responsable |
|----|------|-------------|
| PV-01 | Paso 7: verificar datos ingreso (reemplaza precios) — validación formal | Gabriel, Daniel |
| PV-02 | Patios internos = 5,6,7,8,21 | Gabriel |
| PV-03 | Etiquetado humedad (balanza envía vs manual Patio 5) | Gabriel, Franklin |
| PV-04 | Vuelo forestal — campos y flujos ANI | Andrés, Daniel |
| PV-05 | Recirculación — códigos precio cero | Daniel, Andrés |
| PV-06 | Factory Track ITMADE/PREMADE nomenclatura + cuentas por equipo | Daniel, Iván |
| PV-07 | Reporte 0.001 — ¿solo señal o afecta stock/contabilidad? | Daniel, Iván |
| PV-08 | Anulaciones ANI — procedimiento paso a paso | Daniel |
| PV-09 | Priorización descarga FIFO vs excepciones | Gabriel, Iván |
| PV-10 | Archivo y retención registros (años, custodia) | Daniel |
| PV-12 | Documentos obligatorios por tipo proveedor (completo) | Andrés, Daniel |
| PV-13 | Plantilla, Rev9, PROC-CD, matriz maestra SGC | Daniel |

---

## 5. Contradicciones detectadas

| # | Tema | Fuente A | Fuente B | Resolución propuesta |
|---|------|----------|----------|----------------------|
| C1 | **Paso 7** | IJP-REC-001 / MEJORADO_clean: verificar precios LEF-01 | Gabriel 17-jun: operador no verifica precios; verificar categoría/material/datos | IJP-REC-002 aplica cambio Gabriel; **[POR VALIDAR formal]** |
| C2 | **Patio interno** | Glosario/archive: "Itulcachi" genérico | IJP_FINAL / PAGE_PLAN: patios **5,6,7,8,21** | Usar definición numérica (IJP-REC-002); obsoleto texto Itulcachi solo |
| C3 | **Etiquetado** | MEJORADO_clean: Patio 5 manual | Gabriel + ADENDA: balanza envía etiqueta rolliza propia | ADENDA/IJP_FINAL prevalece para propios; terceros **[POR VALIDAR]** |
| C4 | **Tiempo muestra rolliza** | MEJORADO_clean: 20–40 min | Gabriel / IJP_FINAL: **25–40 min** | 25–40 en IJP-REC-002 |
| C5 | **Altura ruma** | Versiones viejas 4–5 m | IJP_FINAL 2026-06-19: 5 m máx (6 excepcional) | Final prevalece; no repetido en REC-002 (ver guía) |
| C6 | **Evidencia descarga** | Factory 0.001 como señal | WhatsApp foto aún usado como control | Coexistencia hasta política única **[POR VALIDAR]** |
| C7 | **Terceros — guía remisión** | MEJORADO: solo guía forestal rolliza | Andrés/gaps: casos con remisión/factura | **[POR VALIDAR]** por subproducto |

---

## 6. Próximos pasos recomendados

1. Reunión corta **Daniel + Gabriel**: validar PV-01, PV-02, PV-08.
2. Solicitar a **Daniel** plantilla, Rev9, PROC-CD (PV-13).
3. Sesión **Andrés**: capturas vuelo forestal (PV-04).
4. Tras validación, promover IJP-REC-002 → versión 1.0 e incorporar a matriz SGC oficial.
5. Sincronizar `documentos-finales/` con NOVOPAN-SLIDES.

---

## 7. Control de versión

| Versión | Fecha | Autor |
|---------|-------|-------|
| 0.1+GABRIEL | 19-jun-2026 16:07 (-05 ECT) | Manuel Montúfar / Codex — retirado pendiente no aprobado de humedad; Factory Track alineado a cuenta/equipo; QR forestal separado de código de barras terceros |
| 0.1 | 19-jun-2026 | Manuel Montúfar / Cursor agent |
