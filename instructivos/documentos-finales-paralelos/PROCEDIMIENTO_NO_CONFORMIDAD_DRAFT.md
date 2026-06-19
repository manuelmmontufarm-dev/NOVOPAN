# PROCEDIMIENTO — TRATAMIENTO DE NO CONFORMIDADES (BORRADOR)

---

### CONTROL DOCUMENTAL (ISO 7.5)

| Campo | Valor |
|-------|-------|
| **Código** | PROC-NC-001 |
| **Título** | Tratamiento de no conformidades operacionales — Recepción y trazabilidad |
| **Versión** | 0.1-DRAFT |
| **Fecha** | 19 de junio de 2026 |
| **Estado** | Borrador — requiere alineación con PROC-NC oficial planta |
| **Responsable** | Daniel Sotalin |
| **Norma referencia** | ISO 9001:2015 — 10.2; ISO 7.5 documentación |

**ISO 7.5.2:** Procedimiento identificado, revisado por SGC antes de uso.  
**ISO 7.5.3:** Copia en `documentos-finales/`; versión oficial puede residir en sistema documental planta cuando exista.

---

## 1. Propósito

Definir cómo detectar, registrar, contener, corregir y cerrar **no conformidades (NC)** en recepción de madera (Balanza 2) y trazabilidad asociada, hasta que exista el procedimiento corporativo formal.

---

## 2. Alcance

- Recepción ANI (pasos 1–11, IJP-REC-002)
- Documentación forestal y guías
- Humedad, anulaciones, guías duplicadas
- Desvíos en patios externos y descarga (referencia cruzada)

---

## 3. Definiciones

| Término | Definición |
|---------|------------|
| **NC** | Incumplimiento de requisito del IJP, norma MAATE o requisito del SGC |
| **Contención** | Acción inmediata para evitar que la NC siga o se repita en el mismo lote |
| **Corrección** | Acción para eliminar la NC detectada |
| **Acción correctiva** | Acción para eliminar la **causa** de una NC recurrente |

---

## 4. Tipos de NC identificados (recepción)

| ID | Descripción | Ejemplo | Contención inmediata |
|----|-------------|---------|---------------------|
| NC-01 | Guía forestal duplicada | ANI rechaza guía | No descargar; conductor sale |
| NC-02 | QR / cuenta contrato incorrecta | Campos bloqueados en ANI | No digitar humedad; anular/reingresar |
| NC-03 | Humedad incorrecta digitada | Error post-integración | Anular ingreso; escalar contabilidad |
| NC-04 | Documentación incompleta | Falta guía o foto geo | Retener ingreso o rechazar |
| NC-05 | Peso discrepante | >100 kg vs balanza física | Supervisor antes de F5 |
| NC-06 | Patio externo sin pase/cédula | Control seguridad | No liberar hasta regularizar |
| NC-07 | Descarga sin número ingreso | Camión en patio sin RJP-01 | Detener descarga |
| NC-08 | Registro Factory sin descarga real | 0.001 antes de foto/evidencia | Corregir reporte; supervisar |

> **[POR VALIDAR — catálogo NC oficial planta — Daniel]**

---

## 5. Flujo de tratamiento

```
Detectar NC → Contener → Registrar → Evaluar severidad → Corregir
     → (si recurrente) Acción correctiva → Verificar eficacia → Cerrar
```

### 5.1 Detección
Operador, supervisor, Jefe Patios, auditor interno, o revisión de registros (RJP-01, REG-HUM-001, WhatsApp).

### 5.2 Registro
Hasta tener formato oficial:

| Campo | Contenido |
|-------|-----------|
| Fecha / hora | |
| Detectado por | |
| Proceso / paso IJP | |
| Descripción NC | |
| Evidencia | Nº ingreso, placa, fotos |
| Contención | |
| Responsable corrección | |
| Fecha cierre | |

**Formato:** [POR VALIDAR — plantilla NC NOVOPAN — Daniel]

### 5.3 Severidad (propuesta)

| Nivel | Criterio | Escalamiento |
|-------|----------|--------------|
| **Crítica** | Riesgo legal MAATE, trazabilidad rota, impacto contable | Supervisor + Daniel + Forestal |
| **Mayor** | Requiere anulación ANI, retraso >2h camión | Supervisor |
| **Menor** | Error corregible sin anulación | Operador + registro |

### 5.4 Cierre
NC cerrada cuando: corrección verificada, registros actualizados, causa documentada si aplica.

---

## 6. Vínculo con anulaciones ANI

Las NC NC-02 y NC-03 típicamente requieren **anulación de ingreso**. Procedimiento detallado:

> **[POR VALIDAR — anulaciones ANI — responsable: Daniel Sotalin]**

No digitar humedad sobre un ingreso con datos erróneos (transcript Gabriel).

---

## 7. Registros del procedimiento

| Registro | Uso |
|----------|-----|
| REG-NC-001 | Hoja / sistema de NC (FALTANTE plantilla) |
| REG-ANUL | Log anulaciones ANI |
| Evidencia RJP-01 / fotos | Soporte auditoría |

---

## 8. Responsabilidades

| Rol | Función |
|-----|---------|
| Operador balanza | Detectar y contener; escalar |
| Supervisor | Autorizar anulaciones, desvíos |
| Daniel Sotalin | Mantener procedimiento; análisis tendencias NC |
| Gabriel | NC relacionadas patios/descarga |

---

## 9. Historial

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 0.1-DRAFT | 19-jun-2026 | Borrador desde gaps y transcripts |
