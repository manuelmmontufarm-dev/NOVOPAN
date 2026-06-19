# Mejoras Propuestas — NOVOPAN

**Fecha:** Basado en conversación 15 de junio de 2026  
**Prioridad:** Clasificado por impacto operacional e implementación  
**Status:** Ideas; requieren validación con Carlos/Iván antes ejecutar

---

## MEJORA 1: Sistema de Alertas Automáticas para Descargas

### Problema Identificado
- Camiones permanecen 5+ horas en planta; impacta bonificación operadores
- Sistema actual solo captura entrada/salida; no distingue espera vs. descarga real
- Sin alertas, supervisores no saben que descarga está atrasada hasta cierre

### Propuesta
Crear alertas automáticas basadas en tiempo transcurrido desde entrada a Balanza 2:

**Flujo:**
1. Camión entra Balanza 2 → sistema registra hora + detalles (placa, especie, patio asignado)
2. Timer automático inicia
3. Alertas progresivas:
   - ⏱️ **30 min:** Info notificación supervisor (rojo suave)
   - ⏱️ **1 hora:** Alerta amarilla + supervisor + Gabriel
   - ⏱️ **1.5 horas:** Alerta roja + mensaje directo supervisor
   - ⏱️ **2+ horas:** Escalación a Iván/Carlos

**Contenido alerta:**
- Placa vehículo
- Especie/cantidad
- Patio asignado
- Operador grúa asignada
- Tiempo transcurrido
- Acción recomendada (ej: "Revisar si grúa está en producción")

### Beneficios
- Supervisor actúa antes de demora crítica
- Recolección automática de data sobre causas (grúa ocupada, patio congestionado, etc.)
- Transparencia operadores sobre tiempo
- Reducción variabilidad tiempos descarga

### Implementación
- **Sistema:** Extensión ANI o integración IFO
- **Esfuerzo:** Bajo-medio (algoritmo simple, notificaciones)
- **Costo:** Mínimo (desarrollo interno o proveedor ANI)
- **Tiempo:** 2-4 semanas (desarrollo + testing)

### Responsable
- Proponer a **Daniel Sotalin** (Sist. Gestión)
- Validar con **Iván** (entiende tiempos reales)
- Autorizar **Carlos**

---

## MEJORA 2: Medición Desglosada de Tiempos de Descarga

### Problema Identificado
- Métrica actual: entrada - salida (solo dos puntos)
- No captura: espera antes descarga, tiempo traslado patio, demoras dentro proceso
- Imposible identificar dónde ocurren demoras

### Propuesta
Desglosar descarga en 4 etapas; capturar tiempo cada una:

**Etapas:**
1. **Espera (Entrada → Asignación patio):** Tiempo desde balanza hasta que grúa se asigna
2. **Traslado (Asignación → Inicio descarga):** Tiempo para desplazar camión al patio
3. **Descarga efectiva (Inicio → Fin):** Tiempo con grúa activamente descargando
4. **Salida (Fin descarga → Balanza 1):** Tiempo regreso a balanza

**Captura data:**
- Sensor / evento manual en cada punto
- Registro automático en ANI + log separado
- Analítica: promedio por hora, por especie, por operador grúa

**Medición rápida (MVP):**
- Tablet/reloj operador grúa: botones inicio/fin descarga
- Log manual primero (una semana)
- Luego automatizar si hay oportunidad

### Beneficios
- Identifica cuello de botella exacto (ej: "Espera ocupa 70% del tiempo")
- Data para ajustar priorización, número grúas, o comunicación
- Equidad operadores: si demora no es culpa grúa, no afecta su bono

### Implementación
- **Fase 1 (MVP):** Manual con tablet, 1 semana; análisis data
- **Fase 2:** Automatización si datos justifican inversión
- **Esfuerzo:** Bajo inicial (manual); medio si automatizar
- **Costo:** <$500 (tablet reutilizable)

### Responsable
- Coordinar con **Gabriel** (supervisa grúas)
- Validar con **Iván** (datos históricos)
- Reportar a **Carlos**

---

## MEJORA 3: Panel de Control en Tiempo Real — Patios

### Problema Identificado
- Supervisor no ve estado patio en tiempo real (qué especie, cuánto inventario, rumas dónde)
- Comunicación verbal error-prone entre Gabriel, Iván, operadores
- Decisiones descarga se toman sin visibilidad stock patio

### Propuesta
Dashboard visual con:
- Plano patios (Itulcachi + patios externos)
- Ubicación rumas (color por especie)
- Inventario por ruma (toneladas, humedad, edad ingreso)
- Camiones en espera (nombre, especie, hora entrada)
- Grúas disponibles (ubicación, operador, estado)

**Datos origen:**
- ANI (entrada, asignación patio)
- INFOR (inventario actualizado)
- Entrada manual supervisores (si no hay integración)

**Localización:**
- Oficina balanza (visible operador)
- Teléfono Gabriel/supervisor (notificaciones)

### Beneficios
- Gabriel asigna patio con datos reales (no "creo que hay espacio")
- Supervisor ve prioridad descarga óptima (especie con menor stock)
- Reduce comunicación verbal → menos errores

### Implementación
- **Opción A (Rápido):** Hoja cálculo con actualización manual 2×/día
- **Opción B (Robusto):** Dashboard web integrado ANI
- **Esfuerzo:** Bajo (A), Medio (B)
- **Costo:** $0 (A), $1000-2000 (B desarrollo)

### Responsable
- **Daniel Sotalin** (si opta por B)
- **Gabriel** (gestión manual A)
- Validar con **Iván**

---

## MEJORA 4: Matriz de Rotación por Especie

### Problema Identificado
- Ubicación ruma depende de rotación (alta rotación = cerca producción)
- Pero no hay documento claro: "¿Pino es 3 días o 5 días de stock?"
- Decisión se toma empírico/verbal → inconsistente

### Propuesta
Crear tabla: Especie × Días Rotación Típica

**Ejemplo:**
| Especie | Rotación (días) | Ubicación recomendada | Prioridad descarga |
|---------|-----------------|----------------------|------------------|
| Pino | 3-4 | Patios cercanos línea | 1 (máxima) |
| Eucalipto | 4-5 | Patios medio | 2 |
| Tropical mix | 7-10 | Patios lejanos | 3 |
| Teca | Variable | Según requerimiento | Bajo (alto valor) |

**Cálculo:**
- Consumo diario (ton/día) ÷ Capacidad línea → días stock óptimo
- Validar con datos históricos ANI/INFOR

### Beneficios
- Gabriel no adivina; decisión objetiva
- Entrenamiento nuevos supervisores
- Predicción descarga (sé qué especie se agota primero)

### Implementación
- **Esfuerzo:** Bajo (análisis data histórica 2-3 días)
- **Costo:** $0
- **Tiempo:** 1 semana (recolección data + validación con Jorge)

### Responsable
- **Iván** (datos históricos consumo)
- **Jorge** (validar consumo línea)
- **Gabriel** (usar matriz resultante)

---

## MEJORA 5: Protocolo de Comunicación Supervisor-Balanza-Patio

### Problema Identificado
- "Falta comunicación supervisor-operador-balanza"
- Camión llega a balanza, pero patio no sabe; hay espera antes descarga
- Grúas desviadas sin aviso a operador descarga

### Propuesta

**Antes de cambio:** Solo llamadas verbal, radios (error-prone)

**Después:**
1. Camión entra Balanza 2 → ANI genera "orden de descarga" automática
2. Notificación a Gabriel (móvil/radio): "Camión OYR-123, Pino, Patio 7"
3. Gabriel comunica operador grúa: confirma tiempo llegada
4. Operador grúa envía ETA (ej: "5 minutos, grúa disponible")
5. Supervisor vela que grúa no se desvíe sin autorización
6. Fin descarga → confirmación a balanza → cierre en ANI

**Formato simple (hasta que sea digital):**
- **Entrada balanza:** Supervisor llamada/radio a Gabriel
- **Asignación patio:** Gabriel radio a operador grúa
- **Inicio descarga:** Operador grúa confirma radio
- **Fin descarga:** Operador grúa radio + ANI registra

### Beneficios
- Reducción espera (grúa lista cuando llega camión)
- Transparencia demoras (sé si es balanza, patio, o grúa)
- Menos recortes de bono (comunicación clara → menos sorpresas)

### Implementación
- **Opción A (Ahora):** Procedimiento verbal estandarizado (charla 30 min)
- **Opción B (Después):** Sistema de notificaciones ANI integrado
- **Costo:** $0 (A), $500-1000 (B)
- **Tiempo:** 1 día (A), 2-3 semanas (B)

### Responsable
- **Gabriel** (supervisa flujo)
- **Iván** (valida con supervisor)
- Documentar en IJP (Daniel Sotalin)

---

## MEJORA 6: Registro de Causa de Demoras

### Problema Identificado
- Cuando descarga toma >2h, no hay registro de por qué
- "Mala organización" es muy vago
- Imposible atacar problema real sin data categorizada

### Propuesta
En ANI + reporte diario: campo "Causa demora" con opciones:
- Grúa en producción (sin disponible)
- Espera patio (ruma no lista, inventario)
- Comunicación (no avisaron a tiempo)
- Camión mal acomodado (debe reacomodarse)
- Congestión patio (múltiples descargas simultáneas)
- Otro (especificar)

**Captura:**
- Supervisor o Gabriel al cerrar descarga si toma >1.5h
- Breve nota (no obligatorio, pero incentivado)

**Análisis semanal:**
- Reporte: "Semana 15-21 junio: 40% demoras = grúa, 30% = comunicación, 20% = otro"
- Acción: si >50% una causa → atender raíz

### Beneficios
- Data real sobre cuello de botella
- Decisiones basadas en evidencia (ej: "Comprar grúa 3" si data lo justifica)
- Accountability objetiva

### Implementación
- **Esfuerzo:** Bajo (campo + lista desplegable ANI)
- **Costo:** <$200 (configuración ANI)
- **Tiempo:** 1 semana

### Responsable
- **Daniel Sotalin** (modificar ANI)
- **Gabriel/Iván** (usar campo)
- **Carlos** (revisar reportes semanales)

---

## MEJORA 7: Base de Datos de Proveedores — Humedad y Densidad

### Problema Identificado
- Humedad ingreso varía; no hay historia por proveedor
- "Eucalipto llega a 60% o 40% humedad" — sin patrón
- Imposible predecir velocidad línea sin saber humedad pre-entrada

### Propuesta
Registro sistemático:
- Cada ingreso: capturar especie + proveedor + humedad medida
- Acumular histórico (6 meses)
- Dashboard: Proveedor × Especie → humedad promedio, rango, variabilidad

**Análisis:**
- "Proveedor X con Pino: siempre 35% humedad, variabilidad baja = predecible"
- "Proveedor Y con tropical: 45-65% = impredecible; necesita muestreo extra"

### Beneficios
- Jorge sabe qué esperar del material antes de consumir
- Mejor planificación velocidad línea
- Identificar proveedores con control de calidad superior (negociación)

### Implementación
- **Esfuerzo:** Bajo (recopilación data actual + organización)
- **Costo:** $0
- **Tiempo:** 1-2 semanas (compilación datos históricos)

### Responsable
- **Franklin** (mediciones humedad)
- **Iván** (organizar datos históricos)
- **Jorge** (usar para receta)

---

## Resumen de Mejoras — Matriz Priorización

| Mejora | Impacto | Esfuerzo | Costo | Prioridad | Responsable |
|--------|---------|----------|-------|-----------|-------------|
| **1. Alertas automáticas descarga** | Alto | Medio | Bajo | 🔴 Alta | Daniel (Sistema) |
| **2. Medición desglosada tiempos** | Alto | Bajo | Muy bajo | 🔴 Alta | Gabriel/Iván |
| **3. Panel control patios** | Medio | Bajo-Medio | Bajo | 🟡 Media | Daniel/Gabriel |
| **4. Matriz rotación especie** | Medio | Bajo | Nulo | 🟢 Baja | Iván/Jorge |
| **5. Protocolo comunicación** | Medio | Bajo | Nulo | 🔴 Alta | Gabriel (operativo) |
| **6. Registro causa demoras** | Medio | Bajo | Muy bajo | 🟡 Media | Daniel/Gabriel |
| **7. Base datos proveedor-humedad** | Medio-Bajo | Bajo | Nulo | 🟢 Baja | Franklin/Iván |

**Recomendación secuencia:**
1. **Semana 1:** Mejoras 4 y 7 (análisis datos, sin cambio sistema)
2. **Semana 2-3:** Mejora 5 (comunicación, bajo costo)
3. **Semana 3-4:** Mejora 2 (medición manual desglosada)
4. **Mes 2:** Mejora 1 (alertas automáticas, requiere desarrollo)
5. **Mes 2-3:** Mejora 3 (panel control, depende data previa)

---

## Validación Antes de Implementar

**Para cada mejora, confirmar con:**
- [ ] **Iván:** ¿Resuelve problema operacional identificado?
- [ ] **Gabriel:** ¿Factible en operación diaria?
- [ ] **Carlos:** ¿Alineado con estrategia planta?
- [ ] **Daniel:** ¿Integrable con sistemas actuales?

---

## Referencias Relacionadas

- **Problemas identificados:** Ver `notas_coherentes_novopan.md`
- **Personas a contactar:** Ver `reference/personas_y_roles.md`
- **Pendientes confirmación:** Ver `pendientes_confirmacion.md`
- **Procesos:** Ver `processes/IJP_Recepcion_v1.md`
