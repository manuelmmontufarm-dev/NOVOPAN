# Pendientes por Confirmar — NOVOPAN

**Fecha compilación:** 17 de junio de 2026  
**Fuente:** Gaps identificados en transcripciones y notas del 15 de junio  
**Prioridad:** Media-Alta para operación correcta

---

## SISTEMAS INFORMÁTICOS — Nombres Exactos

### Criticidad: **ALTA** (Para flujo operacional)

| Sistema | Sonó como | Uso | Necesario para |
|---------|-----------|-----|-----------------|
| **ANI** | "Anime" o "Anime-algo" | Recepción, peso, asignación patio | Captura F4, escaneo QR, registro datos |
| **IFO** | "IFO" o "Ifo" | Reporte móvil con código barras | Traslado consumo, ubicaciones |
| **ITMAD / IDMAD** | Almacén logística patio | Ubicación código | Inventario ANI |
| **PERMAL / PREMAL** | Almacén consumo | Ubicación código | Registro consumo desde patio |

**Acción:** Preguntar a operador balanza o Daniel Sotalin (Sist. Gestión)

---

## EQUIPOS Y MAQUINARIA — Nombres y Especificaciones

### Criticidad: **MEDIA** (Para mantenimiento y documentación)

| Equipo | Sonó como | Descripción | Por confirmar |
|--------|-----------|-------------|-------------|
| **Chipeadora** | "Mayer" o "Mayola" | Reduce rollizo → chip | Marca exacta, modelo, capacidad (ton/hora) |
| **Trituradora/Molino** | "Hombak" o "Combak" | Segunda reducción de material | Nombre exacto, marca, especificaciones |
| **Inyector vapor** | "Dynesty" o "Dinasty" | Para humedad final producto (?) | Función exacta, marca, ubicación línea |
| **Clasificador aire** | "Wind System" | Limpia impurezas por densidad | Nombre comercial exacto, fabricante |
| **Descortezadora** | No confirmada | Retira corteza eucalipto | Marca, modelo, ubicación línea |

**Acción:** Revisar plano planta o manual equipos con Jorge/Iván

---

## RANGOS DE TIEMPOS — Reportería de Descargas

### Criticidad: **ALTA** (Afecta alertas y bonos)

| Color | Rango actual | Necesario confirmar |
|-------|-------------|-------------------|
| **Verde** | "hasta ~1 hora" | ¿Exactamente 1:00? ¿O 0:45? |
| **Amarillo** | "~1 a 1.5 horas" | ¿1:00-1:30? ¿O 1:15-1:45? |
| **Rojo** | "~2.5 horas +" | ¿Exactamente 2:30? ¿O 2:00+? |
| **Extremo** | "> 5 horas" | ¿Siempre afecta bono? ¿% descuento? |

**Impacto:** Alertas automáticas, bonificación operadores

**Acción:** Revisar sistema ANI/reportería actual con supervisor de turno

---

## ESPECIFICACIONES DE PRODUCTO — Consumo y Recetas

### Criticidad: **MEDIA** (Para producción, predictivos)

| Especificación | Mención | Necesario confirmar |
|----------------|---------|-------------------|
| **Producto MDP** | "Tablero aglomerado" | Densidad target, consumo especie promedio |
| **Producto RH** | "RH 19mm consume más tropical" | Especificación exacta, consumo relativo por especie |
| **Receta variable** | "Cambia por humedad, densidad" | Rango exacto de variación % por cada parámetro |
| **Factor de apilamiento** | Mencionado "varía" | Valores por especie (Pino, Eucalipto, Tropical, etc.) |

**Acción:** Solicitar tablas receta a Jorge, validar con Franklin (QC)

---

## CAPACIDADES Y VOLÚMENES

### Criticidad: **MEDIA** (Para planificación)

| Métrica | Mención | Necesario confirmar |
|---------|---------|-------------------|
| **Ruma típica** | "~250 toneladas secas" | ¿Varía por especie? ¿Rango 150-300? |
| **Secadora 30** | Existe, capacidad "30" | ¿30 ton/hora? ¿30 m³? Unidad exacta |
| **Ingreso diario** | "~120 camiones en día pico" | ¿Promedio? ¿Máximo observado? |
| **Humedad típica ingreso** | No especificada | Rango por especie (Pino, Eucalipto, Tropical) |

**Acción:** Datos históricos ANI/INFOR últimos 3 meses

---

## PROCEDIMIENTOS OPERACIONALES — Desviaciones Documentadas

### Criticidad: **ALTA** (Para cumplimiento IJP)

| Procedimiento | Observación | Necesario confirmar |
|---------------|-------------|-------------------|
| **Orden descarga** | "Camiones no siempre descargados en orden llegada" | ¿Criterio actual? ¿Por patio, especie, cliente? |
| **Comunicación balanza-patio** | "Falta comunicación supervisor-operador" | ¿Sistema actual? ¿Solo verbal? ¿Radios? |
| **Grúa multifunción** | "Grúas desviadas de descarga a alimentar producción" | ¿Cuántas grúas dedicadas descarga vs. línea? |
| **Toma muestras humedad** | Mencionada pero no en detalle | ¿Frecuencia? ¿Puntos de medición? ¿Equipo? |
| **Registro salida** | "Peso salida Balanza 1" | ¿Siempre se registra? ¿Obligatorio cerrar ingreso? |

**Acción:** Acompañar operación actual, comparar con IJP v1

---

## INFORMACIÓN FALTANTE — Gaps Operacionales

### Criticidad: **MEDIA-ALTA** (Para mejoras propuestas)

| Gap | Impacto | Necesario |
|-----|--------|-----------|
| **Tiempo real espera** | No se mide separadamente; solo entrada-salida | Relojes horómetro en patio, logs |
| **Tiempo traslado patio-línea** | Afecta velocidad línea; no cuantificado | Medición en 5 días típicos |
| **Causa de demoras** | "Mala organización" pero sin detalle | Categorización: grúa, comunicación, priorización, inventario, otro |
| **Humedad de ingreso por proveedor** | Varía; no centralizado | Data por proveedor × especie |
| **Densidad real vs. estimada** | Factor de apilamiento varía; se estima | Validación con pesaje real ÷ volumen |

**Acción:** Proponer sistema de captura data; ver `mejoras_propuestas.md`

---

## DOCUMENTACIÓN FALTANTE

### Criticidad: **MEDIA** (Para trazabilidad, ISO)

| Documento | Mención | Necesario confirmar |
|-----------|---------|-------------------|
| **Guía circulación forestal** | Requerida MAATE | ¿Dónde se archiva copia? ¿Escaneo? |
| **Foto geolocalizada** | Requerida | ¿Archivo digital? ¿Servidor local? |
| **RJP-01** | Comprobante peso ANI | ¿Imprime automático? ¿Retención en balanza? |
| **LEF-01** | Precios autorizados | ¿Actualización frecuencia? ¿Quién gestiona? |

**Acción:** Revisar archivo balanza, preguntar a Daniel Sotalin

---

## NORMATIVA Y CUMPLIMIENTO

### Criticidad: **ALTA** (Legal/Ambiental)

| Normativa | Área | Necesario confirmar |
|-----------|------|-------------------|
| **MAATE** | Circulación forestal | ¿Auditorías recientes? ¿Hallazgos? |
| **ISO trazabilidad** | Sistema de Gestión | ¿Certificado vigente? ¿Próxima auditoría? |
| **Biomasa combustión** | Emisiones | ¿Permisos ambientales corteza, polvo? |
| **Contaminación metálica** | Salud ocupacional | ¿Uso obligatorio de imán? ¿Frecuencia chequeo? |

**Acción:** Preguntar a Carlos, Daniel Sotalin

---

## COMPARATIVA CON DOCUMENTACIÓN ACTUAL

### Criticidad: **MEDIA** (Validar IJP)

| Elemento | IJP Rev9 | IJP v1 (nuevo) | Gap |
|----------|----------|----------------|-----|
| **Recepción balanza** | Documentado | Ampliado con QR | ✓ Alinhado |
| **Descargas/patios** | Mencionado | Pendiente documenta | ❌ Falta |
| **Reportería tiempo** | No detallado | Audios mencionan rangos | ❌ Falta precisión |
| **Sistemas ANI/INFOR** | Nombre vago | Audios aclaran parcialmente | ⚠️ Nombres parciales |

**Acción:** Comparación detallada IJP vs. audios; actualizar con confirmaciones

---

## Plan de Validación — Próxima Visita

### Día 1: Operación Directa (con Iván + Gabriel)
- [ ] Cronómetro en 5 descargas: ingreso → asignación patio → descarga → salida
- [ ] Observar: orden descargas, comunicación, grúas disponibles
- [ ] Confirmar rangos color reportería (verde/amarillo/rojo)

### Día 2: Sistemas y Documentación (con operador balanza + Daniel)
- [ ] Navegar ANI: ingreso → QR → asignación → cierre
- [ ] Confirmar nombres exactos: ANI, IFO, ITMAD, PERMAL
- [ ] Revisar archivo balanza: guías, fotos, RJP-01

### Día 3: Especialista (con Jorge + Franklin)
- [ ] Recetas exactas: archivo digital o manual
- [ ] Humedad: rangos por especie, equipo medición, frecuencia
- [ ] Densidad: factor apilamiento por especie

### Documentación a Llevar
- [ ] IJP Rev9 (comparación)
- [ ] Audit list: nombres sistemas, rangos, especificaciones
- [ ] Cámara para fotos equipos, displays, etc.
- [ ] Cronómetro, libreta anotaciones

---

## Status de Confirmaciones

| Item | Status | Responsable | Fecha confirmación |
|------|--------|-------------|-------------------|
| Rangos color reportería | 🔴 Pendiente | Iván / supervisor | — |
| Nombres sistemas (ANI, IFO) | 🔴 Pendiente | Daniel Sotalin | — |
| Especificaciones equipo | 🔴 Pendiente | Jorge / Mantenimiento | — |
| Recetas exactas | 🔴 Pendiente | Jorge | — |
| Datos humedad por especie | 🔴 Pendiente | Franklin | — |

---

## Nuevos pendientes — Audios 17 de junio de 2026

### Sistemas y datos

- [ ] Confirmar escritura exacta de `IDMADE` / `ITMADE` y `PREMADE` / `PERMADE` / `PRIMADE`.
- [ ] Confirmar si Factory Track reporta descarga con `0.001` solo como senal o si afecta inventario/contabilidad.
- [ ] Confirmar nombre exacto de `Click` / `CLiK` y donde se consultan los reportes.
- [ ] Confirmar si ANI permite integracion/API para una pantalla frontal mas simple.
- [ ] Capturar pantallas de ANI para ingresos con QR, sin QR, vuelo forestal y anulaciones.
- [ ] Capturar pantallas de Factory Track para transferencia de stock, descarga y consumo.

### Recepcion y documentacion

- [ ] Confirmar documentos obligatorios por tipo de proveedor: propio, tercero, vuelo forestal, subproducto y recirculacion interna.
- [ ] Confirmar si tercero rolliza requiere guia de remision ademas de guia forestal, o solo en casos especificos.
- [ ] Confirmar flujo de anulacion por QR/cuenta contrato incorrecta.
- [ ] Confirmar punto exacto en ANI donde la humedad bloquea edicion o dispara integracion.

### Patios, rumas e inventario

- [ ] Validar altura maxima de rumas por patio/especie y criterio de seguridad.
- [ ] Validar patron recomendado de apilado: dos rumas, espacio/camino, dos rumas.
- [ ] Confirmar factor de apilamiento por especie; pino se menciono cerca de `0.55`, pero debe validarse con datos internos.
- [ ] Definir responsable de inicio/formacion de cada ruma para trazabilidad.
- [ ] Definir metodo oficial para corregir diferencias entre stock fisico y digital sin tomar stock de otra ruma.
- [ ] Revisar stock de pino por fecha/ruma desde 22 de abril de 2026 hasta 17 de junio de 2026 para validar rotacion.

### Reporteria y tiempos

- [ ] Definir si la descarga debe reportarse al inicio o al final. Para medir tiempo real, el audio sugiere final de descarga.
- [ ] Definir si consumo debe reportarse al cargar en patio o al descargar en planta.
- [ ] Implementar control de bateria/cargadores de Factory Track por turno.
- [ ] Definir regla de priorizacion de descarga: orden de llegada, especie/patio, produccion o criterio mixto con excepciones.

---

## Referencias Relacionadas

- **Procesos:** Ver `processes/IJP_Recepcion_v1.md`
- **Glosario:** Ver `glossary/terminos_novopan.md`
- **Mejoras sugeridas:** Ver `mejoras_propuestas.md`
- **Gaps información:** Ver `gaps_informacion.md`
