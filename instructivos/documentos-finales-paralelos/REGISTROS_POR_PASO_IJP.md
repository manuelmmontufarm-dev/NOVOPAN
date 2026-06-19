# REGISTROS POR PASO — IJP Recepción Balanza 2

---

### CONTROL DOCUMENTAL (ISO 7.5)

| Campo | Valor |
|-------|-------|
| **Código** | REG-PASO-001 |
| **Título** | Registros generados por paso — IJP-REC-002 |
| **Versión** | 0.1-DRAFT |
| **Fecha** | 19 de junio de 2026 |
| **Estado** | Borrador |
| **Procedimiento padre** | IJP-REC-002 |
| **Responsable** | Daniel Sotalin |

**ISO 7.5.2:** Vincula actividades del procedimiento con evidencia registrada.  
**ISO 7.5.3:** Base para auditoría — verificar que cada paso crítico deja registro identificable.

---

## Matriz paso → registro

| Paso | Actividad | Registro(s) | Código | Obligatorio | Notas |
|------|-----------|-------------|--------|-------------|-------|
| **1** | Llegada / tipo carga | Observación operador (implícito en ANI) | REG-ANI-ING | Sí | Tipo carga en ANI o excepción |
| **2** | Peso entrada F4 | Peso capturado ANI | REG-ANI-ING | Sí | Coincidir balanza física |
| **3** | Documentos | Guías físicas + foto geo | REG-FOTO-GEO, guías MAATE | Sí rolliza | Archivo oficina |
| **4** | Conductor | Cédula verificada; pase si externo | REG-PASE-CTL | Si patio externo | Retención cédula |
| **5** | Datos ANI | Ingreso QR/manual | REG-ANI-ING | Sí | Anulación si QR/contrato mal |
| **6** | Validación guía | Validación automática ANI | REG-ANI-ING | Sí | Rechazo si duplicada |
| **7** | Verificar datos ingreso | Checklist datos (sin LEF en balanza) | REG-ANI-ING | Sí | Cambio vs IJP-REC-001 Paso 7 precios |
| **8** | Humedad | Etiqueta, foto, archivo % | REG-ETQ-HUM, REG-FOTO-HUM, REG-HUM-001 | Según frecuencia | Último filtro pre-cierre |
| **9** | Diámetro | Valor en ANI | REG-ANI-ING | Según especie | Promedio representativo |
| **10** | Patio | Ubicación ANI + RJP-03 | REG-ANI-ING, RJP-03 | Sí | WhatsApp como apoyo no controlado |
| **11** | Cierre F12/F5 | **RJP-01** + nº ingreso | RJP-01, REG-ANI-ING | Sí | No liberar sin número |

---

## Post-recepción (referencia — no pasos 1–11)

| Evento | Registro | Procedimiento futuro |
|--------|----------|---------------------|
| Descarga en patio | REG-WA-DESC, REG-FT-001 | IJP-DES-001 |
| Salida PS1 | Peso salida ANI, humedad obligatoria externo | IJP-REC-001 / Descargas |
| Consumo línea | Factory consumo | IJP-INV-001 |

---

## Excepciones → registros

| Excepción | Registro alternativo |
|-----------|---------------------|
| Vuelo forestal | Mismos + campos ANI específicos [POR VALIDAR] |
| Recirculación | REG-ANI-ING precio cero [POR VALIDAR] |
| Anulación | REG-ANUL [POR VALIDAR — Daniel] |
| Guía duplicada | Sin RJP-01; rechazo documentado verbalmente |
| EMASEO | REG-EMASEO |
| Combustible | Documento Bodega (fuera ANI) |

---

## Checklist auditor (muestra)

- [ ] ¿Existe RJP-01 para cada ingreso del día auditado?
- [ ] ¿Humedad 100% tiene REG-HUM-001 o equivalente?
- [ ] ¿Patios externos tienen pase y humedad en salida?
- [ ] ¿Anulaciones tienen trazabilidad? [POR VALIDAR]

---

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 0.1-DRAFT | 19-jun-2026 | Creación inicial |
