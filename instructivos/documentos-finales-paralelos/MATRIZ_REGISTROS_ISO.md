# MATRIZ DE REGISTROS ISO — NOVOPAN (Recepción y trazabilidad)

---

### CONTROL DOCUMENTAL (ISO 7.5)

| Campo | Valor |
|-------|-------|
| **Código** | MAT-REG-001 |
| **Título** | Matriz de registros — evidencia objetiva ISO |
| **Versión** | 0.1-DRAFT |
| **Fecha** | 19 de junio de 2026 |
| **Estado** | Borrador |
| **Responsable** | Daniel Sotalin |
| **Elaboración** | Manuel Montúfar |

**ISO 7.5.2:** Identifica cada registro (código, descripción, origen, medio).  
**ISO 7.5.3:** Define retención, protección, acceso y disposición — campos marcados [POR VALIDAR] hasta confirmación con SGC.

---

## 1. Matriz principal

| Código registro | Nombre | Proceso | Generado en | Medio | Responsable custodia | Retención | Estado matriz |
|-----------------|--------|---------|-------------|-------|---------------------|-----------|---------------|
| **RJP-01** | Comprobante peso ingreso ANI | Recepción B2 | Paso 11 IJP | Impreso + digital ANI | Operador balanza / archivo | [POR VALIDAR — Daniel] | Definido operativamente |
| **RJP-03** | Esquema patios del día | Asignación patio | Jefe Patios | Físico / digital | Gabriel | [POR VALIDAR] | Referenciado |
| **RJP-05** | Inventario mensual | Inventario | Mensual | INFOR / reportes | Inventario | [POR VALIDAR] | Mencionado en IJP |
| **LEF-01** | Lista precios autorizados | Comercial/Forestal | Forestal | Documento controlado | Dpto. Forestal | [POR VALIDAR] | No en repo |
| **REG-HUM-001** | "14 % HUMEDADES DE INGRESO-REVXX" | Muestreo humedad | Paso 8 | OneDrive Secadero 2 | Operador / QC | [POR VALIDAR] | Ruta conocida |
| **REG-FOTO-GEO** | Foto geolocalizada carga | Recepción doc. | Paso 3 | Archivo oficina balanza | Operador balanza | [POR VALIDAR] | Operativo |
| **REG-ETQ-HUM** | Etiqueta muestra humedad | Muestreo | Paso 8 | Impreso ANI / manual | Balanza / Patio 5 | [POR VALIDAR — Gabriel] | Flujo en transición |
| **REG-FOTO-HUM** | Foto resultado analítica + etiqueta | Trazabilidad humedad | Paso 8 | Digital por ingreso | Operador balanza | [POR VALIDAR] | Transcript Gabriel |
| **REG-WA-DESC** | Foto WhatsApp descarga terminada | Descarga patio | Post-descarga | WhatsApp grupo | Operador máquina | [POR VALIDAR] | Transcript NR29 |
| **REG-FT-001** | Movimiento Factory Track 0.001 | Descarga digital | Factory Track | Sistema | Operador patio | [POR VALIDAR] | Ver NR29 |
| **REG-ANI-ING** | Registro ingreso ANI (nº ingreso) | Recepción | Paso 11 | ANI / INFOR | Sistemas | Permanente sistema | Operativo |
| **REG-EMASEO** | Hoja residuos EMASEO | Excepción residuo | Manual | Google Sheet | Daniel Sotalin | [POR VALIDAR] | Excepción 7 |
| **REG-PASE-CTL** | Pase control patio externo | Seguridad | Paso 4 | Físico | Control seguridad | Jornada | [POR VALIDAR] |
| **REG-ANUL** | Log anulaciones ANI | Corrección errores | ANI | Sistema / manual | Supervisor / Daniel | [POR VALIDAR — Daniel] | **FALTANTE** procedimiento |

---

## 2. Trazabilidad mínima (ISO 38200 / operación NOVOPAN)

Cadena que debe poder reconstruirse:

```
Guía/licencia → Proveedor → Placa → Peso (RJP-01) → Patio/ruma → Factory/INFOR → Consumo
```

| Eslabón | Registros que lo soportan |
|---------|---------------------------|
| Legal forestal | Guía circulación, guía madera, guía remisión |
| Peso ingreso | RJP-01, ANI |
| Calidad ingreso | REG-HUM-001, REG-ETQ-HUM, REG-FOTO-HUM |
| Ubicación | RJP-03, ANI ubicación, Factory ITMADE→PREMADE |
| Descarga | REG-WA-DESC, REG-FT-001 |
| Salida | PS1 peso salida, humedad en ANI |

---

## 3. Factory Track — registros pendientes de nomenclatura oficial

| Término en audio | Uso | Estado |
|------------------|-----|--------|
| ITMADE / IDMADE | Origen stock (patio/ruma) | [POR VALIDAR — Daniel] |
| PREMADE / PERMADE / PRIMADE | Destino post-descarga | [POR VALIDAR — Daniel] |
| Reporte **0.001** | Señal descarga sin mover stock | [POR VALIDAR — impacto contable] |

---

## 4. ISO 7.5.3 — Requisitos por registro (plantilla)

Para cada registro aprobado, completar con Daniel:

| Requisito 7.5.3 | Pregunta |
|-----------------|----------|
| Disponibilidad | ¿Quién necesita acceso y cómo lo obtiene? |
| Protección | ¿Integridad, confidencialidad, respaldo? |
| Distribución | ¿Copias controladas o solo sistema? |
| Almacenamiento | ¿Físico, ANI, OneDrive, archivo años? |
| Retención | ¿Años mínimos legales / ISO? |
| Disposición | ¿Quién autoriza destrucción? |

---

## 5. Historial

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 0.1-DRAFT | 19-jun-2026 | Matriz inicial desde IJP-REC-002 y transcripts |
