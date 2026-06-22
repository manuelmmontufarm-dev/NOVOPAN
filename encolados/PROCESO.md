# Área — Encolados (Línea 1)

> Fuentes: resúmenes 2026-06-22 + transcripciones completas (new_recording_35, new_recording_36, reunion_angeloncipales) + research externo.
> **Última actualización:** 2026-06-22

---

## Entrada del área

**Silos** cargados desde preparación con dos calidades de partícula:

| Calidad | Destino |
|---------|---------|
| Fina | Capas externas (top + bottom) |
| Media (biruta + polvo) | Capa central (core) |

---

## Etapas

### 1. Silos

Almacenan partícula fina y media por separado. Material descarga hacia los dosimbuncas mediante **tornillos de descarga** (2 tornillos por silo).

**Cómo funciona la descarga:**
- Cada tornillo gira → mueve material hacia abajo.
- El cálculo teórico es: 1 revolución = cantidad fija de descarga.
- En la práctica el llenado del tornillo varía (punto bajo / punto alto) → la descarga real oscila.

**Sensores en silos:**

| Sensor | Tipo | Función |
|--------|------|---------|
| Ultrasónico | Continuo | Nivel (0–100); calibración: señal vacío = 0, señal lleno = 100, interpolación lineal |
| Paletas on/off | Discreto | Mínimo y máximo como redundancia de seguridad |
| Inductivos | Pulsos | Cuentan rotaciones del tornillo de descarga (metal pasa frente al sensor) |

> _Pendiente:_ capacidad y cantidad exacta de silos por calidad; lógica de selección de silo activo.

---

### 2. Dosimbuncas (bunkers dosificadores)

**Nombre en planta:** "dosimbuncas" (audio: "dosimil", "dosibunker"). Un bunker por tipo de capa (interna fina, externa fina, media).

Reciben la partícula de los silos y calculan la descarga con exactitud antes de pasar al encolador.

**Cálculo de descarga:**
```
Descarga (kg/min) = peso en celda de carga × velocidad de rotación del motor
```
- Sensor de volumen (nivel) → mantiene llenado constante.
- Celda de carga → mide cuántos kg hay en el bin.
- Encoder / inductivo → cuenta rotaciones del motor de descarga.
- Combinando los tres se obtiene el flujo másico en kg/min.

> _Pendiente:_ nombre exacto en HMI/PLC (tag), capacidad de cada bunker, setpoints de llenado.

---

### 3. Clasificación (camas de rodillos moleteados)

Entre los dosimbuncas y el encolador, el material pasa por **camas de rodillos moleteados** que clasifican la partícula por tamaño.

- **2 camas de rodillos:** una para capa externa (fina), otra para capa media.
- Los rodillos tienen perfiles moleteados con profundidades entre **0.3 y 1.3 mm**; el tamaño del moleteado determina qué partícula pasa.
- Material que cae por debajo de la cama → partícula clasificada correcta.
- Proceso mecánico, sin control PID.

> _Pendiente:_ número de rodillos, tipo de accionamiento, criterio para ajustar profundidad.

---

### 4. Encolador

Dos líneas paralelas (una por tipo de capa) mezclan la partícula con **resina + parafina (+ agua)**.

**Sistema de enfriamiento del encolador:**
- Agua circula en la parte inferior del encolador.
- Evita que la resina reaccione prematuramente con el calor ambiente antes de llegar a la prensa.

**Control PID de bombas (resina y parafina):**

| Variable | Descripción |
|---|---|
| SP | Setpoint de flujo (L/min) |
| PV | Medición del flujómetro |
| LMN | Señal de salida → velocidad de bomba |

Azul (PV) debe estar sobre roja (SP). Si el controlador trabaja al 100% sostenido: problema. Punto de trabajo sano: **40–50 %** nominal.

**Estado observado (2026-06-22):** PV oscila continuamente (sube, corrige, baja, corrige) — mala sintonía PID + retardos de señal.

**Instrumentación de dosificación:**

| Instrumento | Tipo | Función |
|---|---|---|
| Flujómetros electromagnéticos | Continuo | L/min de resina/parafina (requiere fluido conductivo) |
| Coriolis ("pitómetro") | Continuo | Flujo másico directo; también entrega densidad y temperatura |
| Sensores de presión con membrana | Continuo | Protegidos de medios agresivos; se ensucian con resina/parafina — limpiar en mantenimiento |
| Actuadores neumáticos + electroválvulas | Acción on/off | Abren/cierran válvulas de resina automáticamente desde el control room |

> _Pendiente:_ tipo de resina (UF / MUF / PMDI), dosificación g/kg de partícula, qué líneas usan magnético vs Coriolis.

---

### 5. Tres esparcidores (forming heads)

Depositan el material encolado sobre la banda formadora armando el colchón (mat):

```
     Esparcidor 3 →  ▒▒▒▒▒▒  capa fina superior (TOP)    — 53% del externo
     Esparcidor 2 →  ████████  capa media (CORE)           — 70% del total
     Esparcidor 1 →  ▒▒▒▒▒▒  capa fina inferior (SL1)    — 43% del externo
                      ──────   banda formadora
```

**Setpoint de proporciones:**

| Capa | % del peso total | Reparto interno |
|------|-----------------|-----------------|
| Externas (top + bottom) | **30 %** | Top: **53 %** del externo / Bottom: **43 %** del externo ⚠ verificar (53+43=96) |
| Core (capa media) | **70 %** | — |

**Por qué top ≠ bottom:** el desequilibrio intencional controla el **pandeo** del tablero. Más material arriba → el tablero curva hacia arriba. El ajuste 53/43 busca que salga recto de la prensa.

**Prueba de papel (testigos):**
- Se coloca papel entre esparcidoras para separar capas físicamente.
- Se pesa cada capa → se calcula % real.
- Resultado 2026-06-22: se pide 30 % externas → sale **33 %** → problema de pesaje dinámico.

**Instrumentación de esparcidoras:**

| Instrumento | Dónde | Función |
|---|---|---|
| Celdas de carga (×2 por esparcidora) | Izq / Der sobre rodillo | Fuerza del material sobre la banda |
| Celdas de carga (×4) | Báscula central | Peso total del colchón → **variable maestra** |
| Perfilómetro ("tomatito") | Post-esparcidores | Escanea densidad a lo largo del tablero — detecta anomalías de distribución |

**Parámetro TAU (τ):**
```
τ = Σ(descarga de esparcidoras) − lo que mide / pide la báscula central
Setpoint: τ = 0  |  Estado actual: τ = +5 constante  (problema sin resolver ~6 meses)
```
Si τ > 0: esparcidoras mandan más de lo pedido.
Si τ < 0: esparcidoras mandan menos.

**Calibración de celdas — problema activo:**
- Con pesos patrón en parada: marca bien.
- En producción (banda moviéndose): falla.
- Causa probable: el punto de referencia (mV con peso muerto) queda mal ajustado → escalamiento incorrecto.
- Linealización típica: **3 mV → 0 kg / 20 mV → 20 kg**. El offset con peso muerto es difícil de encontrar.
- Proceso de tara: la esparcidora arranca vacía → marca referencias a lo largo de toda la banda → promedio = cero dinámico.

**Cuando la báscula central detecta caída:**
1. Controlador acelera bandas para compensar.
2. Sobreoscilación: caída brusca → subida brusca.
3. Perfilómetro muestra la anomalía resultante.

> _Pendiente:_ velocidad de banda, gramaje objetivo (kg/m²), ajuste de compuertas mecánicas de cada esparcidor.

---

### 6. Preprensa hidráulica

Entre esparcidores y prensa principal.

- **Presión:** ~**153 bar** hidráulico.
- **Función:** sube y baja sobre el colchón → compacta ligeramente → expulsa el exceso de aire → deja el colchón uniforme en altura antes de entrar a la prensa caliente.
- Sin preprensa, el aire atrapado genera defectos al calentarse.

> _Pendiente:_ longitud, marca/modelo, ¿tiene calefacción propia o solo compacta en frío?

---

### 7. Prensa caliente continua (máster de la línea)

**La prensa determina el ritmo de toda la línea.** Su velocidad afecta el lazo completo aguas arriba.

**Parámetros observados (2026-06-22):**

| Variable | Valor |
|---|---|
| Temperatura de platos | **220 – 220 – 220 – 215 °C** |
| Aceite térmico | ~**285 °C** |
| Perfil de presión | Mayor a la entrada, menor a la salida |

**Cómo funciona:**
- El colchón entra grueso (aire + partícula suelta) y sale al espesor objetivo.
- La presión decrece a lo largo de la prensa en múltiples zonas → compactación progresiva.
- El calor activa la resina → une las partículas permanentemente.
- Producción continua, sin paradas para cargar/descargar.

**⚠ Sistema de vapor:** mencionado como etapa, pero **fuera de servicio** al 2026-06-22. No se sabe si es temporal o instalado pero no habilitado.

> _Pendiente:_ marca/modelo (Siempelkamp / Dieffenbacher / Metso?), longitud, factor de prensado (s/mm), espesor entrada/salida del colchón, número de zonas de presión.

---

### 8. Corte angular en movimiento

A la salida de la prensa, la sierra corta mientras la banda avanza.

- **Corte angular (diagonal):** compensa la velocidad de avance para que el resultado sea perpendicular.
- **Sierras longitudinales:** sincronizan distancia y velocidad con la línea.
- **Control de diagonales (ortoángulo):** verifica que el tablero resultante sea cuadrado (ángulos a 90°). Requiere calibración periódica.

**Post-corte:**
- **Medición de espesor:** sensor ultrasónico u óptico mide el espesor de cada tablero recién cortado.
- **Pesaje individual:** cada tablero se pesa antes del enfriamiento.

> _Pendiente:_ formato estándar de corte (mm), tipo de sierra, mecanismo de sincronización (servo / leva), tolerancia de escuadría.

---

### 9. Enfriadoras tipo estrella (star coolers)

- Brazos rotativos en forma de estrella.
- **3 tableros simultáneos** por estrella.
- Rotación de **180°** por ciclo.
- **Tubos metálicos** retiran calor por contacto.

**Por qué se rotan:** nivela temperatura entre ambas caras → evita alabeo y desbalance de humedad interna.

> _Pendiente:_ número total de estrellas, tiempo de residencia, temperatura entrada/salida.

---

### 10. Estacado (agrupamiento)

Agrupa tableros de **3 en 3** y los apila.

- Sensores ópticos (emisor–receptor): cuentan y detectan presencia de tableros.
- Sistema neumático: ejecuta el apilado físico.
- **Encoders** en el mecanismo de agrupamiento — problemas conocidos: encoders se dañan, agrupamiento falla.

> _Pendiente:_ altura de estaca estándar, tiempo de reposo antes del área siguiente (lijado).

---

## Parámetros clave

| Parámetro | Fórmula / Descripción | Setpoint | Estado actual |
|-----------|----------------------|----------|---------------|
| **Tau (τ)** | Σ esparcidoras − báscula central | 0 (oscilación pequeña ok) | **+5 constante** (~6 meses sin resolver) |
| **Proporción capas** | % externas / % core | 30 % / 70 % | ~33 % / 67 % (pesaje dinámico incorrecto) |
| **Reparto externo** | Top / Bottom del 30 % | 53 % / 43 % ⚠ | A confirmar (suma 96 %) |
| **Bombas resina/parafina** | Punto de trabajo | 40–50 % nominal | Oscilación persistente |
| **Peso colchón** | Báscula central (4 celdas) — variable maestra | Según receta | Variaciones cíclicas |

---

## Instrumentación general

| Tipo | Dónde | Función |
|------|-------|---------|
| Ultrasónicos | Silos | Nivel continuo 0–100 |
| Paletas on/off | Silos | Mín/máx de seguridad |
| Inductivos | Tornillos de descarga, encoders de motores | Pulsos de rotación |
| Celdas de carga (×2) | Cada esparcidora | Peso de material en banda |
| Celdas de carga (×4) | Báscula central | Peso total del colchón |
| Flujómetros electromagnéticos | Líneas resina/parafina | L/min |
| Coriolis | Líneas resina (lazo PID) | Flujo másico + densidad + temperatura |
| Sensores de presión con membrana | Líneas de dosificación | Presión; se ensucian — limpiar en mantenimiento |
| Actuadores neumáticos + electroválvulas | Válvulas de resina/parafina | Control automático de paso |
| Sensores de mariposa (butterfly) | Transportadores | Detección de taponamientos (giro trabado = tapón) |
| Ópticos (emisor–receptor) | Estacado, medición post-corte | Presencia, conteo, espesor |
| Inductivos / finales de carrera mecánicos | Varios | Respaldo; los mecánicos casi nunca pagan pero requieren contacto físico |
| Perfilómetro ("tomatito") | Post-esparcidores | Densidad a lo largo del tablero |
| Sensor espesor (ultrasónico u óptico) | Post-corte | Espesor individual de cada tablero |
| Encoders | Agrupamiento / estacado | Posición y conteo; pueden dañarse |

---

## Estado actual del sistema (2026-06-22)

**3 problemas abiertos (~6 meses):**
1. **Esparcidoras** — distribución incorrecta; tau +5; capas 33 % vs 30 %.
2. **Dosimbuncas / dosificadoras** — consumos con oscilación PID persistente.
3. **Tau / TAM** — balance global fuera de cero. En espera de instructivo del fabricante para calibración mecánica + eléctrica.

**Sistema de vapor:** fuera de servicio.

**Incidente madrugada 2026-06-20/21 (aprox. 2:15–3:20):**
- 2:15 → alarma de rodillos de encoladora (parada para limpieza); velocidad de línea cae; nivel sube por inercia.
- Al reanudar: descargas elevadas (110–120) y variaciones.
- 4 taponamientos consecutivos.
- Variaciones persistieron 2 días.
- Hipótesis: sensor de máximo entregó señal correcta pero no llegó al controlador → no se ejecutó parada → sobrealimentación al destaponarse.
- **Mala práctica:** reset de falla sin análisis → rearrancar sobre condición no resuelta.

---

## Personas en el área

| Rol | Nombre | Tema |
|-----|--------|------|
| Gerente de mantenimiento | Marco Villalba | Instrumentación, interlocks, incidentes |
| Gerente de producción | Juan Carlos | Indicadores, recetas, decisiones |
| Jefe de aglomerado | Emanuel (audio: "Angelo") | Operación diaria |
| Supervisor de producción | _confirmar nombre_ | Recorrido técnico |
| Control de calidad (Área 1) | _confirmar_ | Laboratorio |

---

## Pendientes

### Por confirmar en planta
- [ ] Reparto externo: ¿53/47 o 53/43? (53+43=96, falta el 4%)
- [ ] TAM vs tau: ¿mismo parámetro o distintos?
- [ ] "dosimbuncas" → tag exacto en HMI/PLC
- [ ] SL1: confirmar si es el nombre en HMI para la capa inferior
- [ ] Perfilómetro: marca/modelo (¿GreCon u otro?)
- [ ] Sistema de vapor: ¿temporal o no instalado?
- [ ] Nombre oficial del área ("Encolados", "Aglomerados", "Línea de formación"?)
- [ ] Nombre del supervisor del recorrido técnico

### Datos técnicos por medir
- [ ] Velocidad de línea (m/min)
- [ ] Gramaje objetivo del colchón (kg/m²)
- [ ] Longitud y zonas de presión de la prensa
- [ ] Marca/modelo de la prensa
- [ ] Tiempos de tránsito entre etapas (para Opción A — trazabilidad)
- [ ] Distancias entre sensor banda y cada esparcidora

### Documentos esperados
- [ ] Instructivo del fabricante para calibración de esparcidoras (pendiente de respuesta)
- [ ] Transcripciones completas → `encolados/transcripts/`
- [ ] SOP prueba de papel/testigos (punto, tiempo, pesaje, criterio)

---

## Glosario rápido del área

| Término | Significado |
|---------|------------|
| Tau (τ) / TAM | Diferencia entre descarga de esparcidoras y demanda de báscula central |
| Dosimbuncas | Bunkers dosificadores (dosing bins) — uno por tipo de capa |
| SL1 | Capa inferior (bottom layer) |
| Nariz | Apertura al inicio del encolado; genera desperdicio hasta cerrarse |
| Perfilómetro / tomatito | Sensor que escanea densidad a lo largo del tablero |
| Prueba de papel | Testigos físicos entre capas para medir % real de cada capa |
| LMN | Salida del controlador PID a la bomba (manipulated variable) |
| Pandeo | Alabeo/curvatura del tablero; se controla con reparto asimétrico top/bottom |

---

## Estructura de la carpeta

```
encolados/
├── PROCESO.md              ← este archivo
├── notas/                  ← notas de campo y resúmenes
│   ├── 2026-06-22-resumenes-reuniones.md
│   └── CLAUDE_DESIGN_PROMPT_ENCOLADOS.md
├── transcripts/            ← transcripciones completas (pendiente subir)
└── technical-research/     ← investigación técnica externa (pendiente)
```
