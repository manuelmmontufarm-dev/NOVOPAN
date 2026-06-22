# 2026-06-22 — Resúmenes de reuniones / recorrido de planta

> Tres grabaciones del día con resúmenes auto-generados (transcripciones completas pendientes de subir).
> Contexto: primer día en el área de Encolados, recorrido técnico + discusión de proyecto.

---

## Personas identificadas

| Nombre | Rol |
|--------|-----|
| Marco Villalba | Gerente de mantenimiento |
| Juan Carlos | Gerente de producción |
| Emanuel | Jefe de aglomerado |
| Supervisor de producción | Responsable de la línea y del recorrido técnico |
| Área 1 de calidad | Laboratorio asociado a la línea |

---

## 1) Recorrido técnico de Línea 1 — incidentes y control

### Incidentes recientes (madrugada ~04:00)

**4 taponamientos consecutivos:**
- **Evento 1:** causa raíz aún no determinada.
- **Eventos 2 y 3:** sensor de máximo marcó ~120 (límite operativo ≤85, alarma a 130), pero **la señal no llegó correctamente al controlador** → no se ejecutó la parada esperada.
- **Evento 4:** consecuencia de reinicios sucesivos; acumulación de material en transportador.

**Hipótesis combinada:**
1. Controlador no actuó ante señal de máximo.
2. La sección de encolado envió cantidad incorrecta de material.
3. Lógica de interlocks aguas arriba/aguas abajo amplifica el problema: cuando rodillos arriba se alarman (sin material), se detiene el envío; aguas abajo se demanda más; al destaponarse → sobrealimentación → nuevo taponamiento.

**Mala práctica detectada:** tendencia a **resetear fallas sin análisis** → reenciende la línea sobre condiciones no resueltas.

### Control PID (lazos de dosificación resina/parafina)

**Variables:**
- **SP** (Set Point) — objetivo
- **PV** (Process Value) — medición real
- **LMN** — señal de salida del controlador a la bomba

**Estado observado en pantalla:**
- Línea **roja** = SP. La línea **azul** (PV) debería estar encima de la roja siempre.
- En el lazo crítico, PV nunca se estabiliza: sube, corrige, baja, corrige → oscilación persistente por **retardos de señal y mala sintonía**.

**P / I / D:**
- **P** (proporcional) — corrección gruesa proporcional al error.
- **I** (integral) — reparte la corrección en el tiempo.
- **D** (derivativa) — anticipa error futuro según tendencia.

**Margen de operación de bombas:**
- **Recomendado: 40–50 % de capacidad** nominal.
- Evitar 100 % sostenido (solo picos breves) — fuerza bombas y degrada control.

### Instrumentación de la línea (inventario)

| Tipo | Aplicación |
|------|------------|
| Ultrasónicos | Nivel en silos (insensibles a polvo; calibración por interpolación lineal 0–100) |
| Paletas on/off | Mínimos/máximos como redundancia segura |
| Celdas de carga | Peso de material en banda y tableros (requieren aislamiento estructural) |
| Flujómetros electromagnéticos | L/min de resina/parafina |
| Coriolis ("pitómetro" electromagnético) | Integrado con lazo PID |
| Sensores de presión con membrana | Protegidos de medios agresivos; necesitan limpieza |
| Inductivos | Detección de metales, pulsos de rotación de banda/motores |
| Ópticos | Presencia, altura/espesor, conteo de tableros (radar/emisor–receptor) |
| Finales de carrera mecánicos | Respaldo a inductivos |
| **Sensores de mariposa** | **Detección de taponamientos** (giro trabado) |

### Proceso aguas abajo (lo nuevo respecto al PROCESO.md)

- **Dosing bins** por capa (interna, externa, media). Descarga calculada combinando peso (kg) y velocidad (min).
- **Clasificación** con rodillos moleteados, profundidades **0.3–1.3 mm**.
- **Preprensa hidráulica ~153 bar** — expulsa aire del colchón antes de la prensa principal.
- **Prensa principal:** platos con temperaturas diferenciadas (ej. **220–220–220–215 °C**), presión mayor a la entrada y menor a la salida.
- **Aceite térmico hasta ~285 °C** para calentamiento.
- **Sierras longitudinales:** sincronizan distancia y velocidad con la línea; necesitan calibración de **diagonales (ortoángulo)** para escuadría.
- **Agrupamiento (grouping)** de 3 tableros: sensores ópticos + sistema neumático; conteo por sensor light.

### Variable maestra
**Peso del colchón en banda** = realimentación maestra de dosificación. **No intervenir sin justificación técnica.**

---

## 2) Reunión "Reunion angeloncipales" — control de peso, tau, capas

### Variación cíclica de peso

Cuando la **báscula central** detecta caída de peso → acelera bandas para compensar → **sobreoscilaciones** (caída seguida de subida brusca).

Origen posible: mala distribución mecánica. El **perfilómetro de densidad** evidencia anomalías puntuales (lee densidad a lo largo del tablero).

### Parámetro **tau** ⭐ (clave del área)

- **Definición:** diferencia entre lo que suman las esparcidoras y lo demandado por la báscula central.
- **Objetivo:** **0** (con oscilación pequeña alrededor de 0).
- **Estado actual:** **+5 constante** → desajuste persistente.

### Proporción de capas ⭐

- **Setpoint:** 30 % capas externas + 70 % capa media.
- **Reparto externo:** 53 % superior / 43 % inferior. _(NOTA: 53+43=96 — verificar si es 53/47 o si hay otro factor — clarificar en transcripción completa.)_
- **Prueba de papel:** separa capas; muestra **~33 % externas cuando se pide 30 %** → problema de pesaje real.

### Celdas de carga

- Esparcidoras: **2 celdas (izquierda/derecha)** acopladas a un rodillo.
- Báscula central: **4 celdas**.
- Calibración **estática OK** (pesos patrón), pero en **dinámico falla**.
- Linealización típica: **3–20 mV → 0–20 kg**. El **offset en mV con peso muerto** condiciona el escalado y es difícil de encontrar.

### Incidente del fin de semana (sábado/domingo madrugada)

- Alarma inicial: encoladora (rodillos de alimentación/purificación) se detiene para limpieza.
- Velocidad de línea cae.
- Sensor de nivel sube a ≈90 por inercia al cortar suministro.
- Al reanudar: descargas elevadas (≈110–120) y variaciones.
- Cronología con discrepancias (≈2:52, 3:00–3:30) — pendiente consolidar.
- Variaciones persistieron 2 días después.

### Riesgo arrastrado
Problemas llevan **~medio año sin resolución integral**. A la espera de **instructivo del fabricante** para calibración mecánica y eléctrica.

### Sistemas relacionados
- **La prensa es el máster de la línea** — su velocidad afecta el lazo completo.
- **Sistema de vapor fuera de servicio.**
- Tres frentes de problema simultáneos:
  1. **Esparcidoras** (distribución)
  2. **Dosificadoras** (consumos)
  3. **Tau** (balance global)

---

## 3) "New Recording 36" — propuestas de proyecto ⭐ (POSIBLE ALCANCE DEL PROYECTO)

### Opción A — Seguimiento de cambios por etapa (trazabilidad en línea) ← **PREFERIDA**

**Problema:** la trazabilidad existe "allá" (otra planta) pero no en la línea local. Aquí no se sabe con precisión cuándo pasa cada cambio (lote) por cada máquina.

**Propuesta:**
- **Un único sensor en la banda principal** para retroalimentar el estado.
- Sensórica sencilla.

**Trabajo requerido:**
- Medir con precisión distancias entre puntos y esparcidoras.
- Cronometrar tiempos de paso por cada sección.
- Configurar tiempos de tránsito entre equipos.

**Beneficio:** mejor control, visibilidad de afectaciones, base para sincronizar fases y reducir desperdicio.

### Opción B — Optimización del arranque de línea (relacionada)

**Problema actual:**
- Arranque desde dos paneles distintos.
- Todo arranca a la vez → sobreoscilación al mandar material de golpe.

**Referencia (otra planta):**
- Arranque con un **botón único** y **descarga secuencial en rampa**: primero capa inferior (**SL1**), luego central, luego superior.

**Propuesta:** definir tiempos, descargas y materiales por etapa; unificar arranque.

### Opción C — Reducción de desperdicio en aperturas y encolado

Al iniciar encolado, hasta cerrar la "nariz", se genera material de desperdicio. Sincronizar dosificación + inventario de esparcidoras + retardos.

### Opción D — Análisis de datos operativos

Existen datos por secciones de máquinas. **Despriorizada** a favor de A.

### Decisión tomada
> **Priorizar Opción A** (seguimiento por etapas con sensor en banda principal).
> Manuel formulará un plan inicial. Posponer análisis de datos hasta avanzar en trazabilidad y secuencia de arranque.

### Quote literal de Manuel
> "Le voy a pensar, porque ahorita recién cachando cómo funciona todo. (…) Pero la primera opción me gustó bastante."

---

## Preguntas abiertas (para próximas visitas)

1. ¿Ubicación exacta del sensor en la banda y método para identificar cada "cambio" (marcas, IDs)?
2. ¿Cómo presentar visualmente el estado por etapa al operador (HMI, SCADA) y cómo registrar históricos?
3. ¿Datos mínimos para diseñar la rampa de arranque (tiempos de cada capa, retardos mecánicos)?
4. ¿Criterios de aceptación? (sobreoscilación admisible, tiempos objetivo de arranque, reducción % de desperdicio)
5. Verificar el split de capas externas: 53/43 = 96 % — ¿es 53/47?
6. Confirmar cronología del incidente del fin de semana (alarmas exactas).

---

## Cosas que actualizar en `PROCESO.md` después de esta visita

- [ ] Agregar dosing bins por capa (interna/externa/media) con cálculo peso × velocidad.
- [ ] Agregar clasificación por rodillos moleteados (0.3–1.3 mm).
- [ ] Agregar preprensa hidráulica (~153 bar) antes de la prensa principal.
- [ ] Documentar temperaturas de platos (220-220-220-215 °C) y aceite térmico (~285 °C).
- [ ] Agregar perfilómetro de densidad como instrumento clave.
- [ ] Agregar parámetro **tau** como KPI de control global.
- [ ] Setpoint de capas: 30/70 con reparto externo (verificar 53/47).
- [ ] Sensores de mariposa para taponamiento.
- [ ] Mencionar que la prensa es el máster de la línea.
- [ ] Sistema de vapor fuera de servicio (estado actual).
