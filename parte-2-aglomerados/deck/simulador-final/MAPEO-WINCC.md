# Mapeo de tags reales de WinCC → simulador de trazabilidad L1

**Fuentes:** tres servidores WinCC distintos, fotografiados el **2026-07-21**, todos
en vista de tabla (`Tag Type` · `Access Name` · `Alarm Group` · `Comment`):

| # | Servidor | Items | Alcance | Cobertura del inventario |
|---|---|---|---|---|
| **A** | `HMI-METSO` (monitor AOC) | 700 | formación · pre-prensa · prensa · calidad | completa: `<none>` → `variation` |
| **B** | `HMI` (monitor OMNI) | 420 | encolado · cocina de cola · EVOjet · **dosificación** | completa: `<none>` → `winch_overload_m05` |
| **C** | HMI de preparación (monitor AOC) | 586 | **silos húmedos · bunker · secadero · quemador · molino Hombak · clasificación** | leído 12/16 fotos — faltan 4 del bloque `071_*` (regulación del secadero) |

Todos con `Filter: <none>`. Todos los mapeos salen del campo `Comment` del propio
HMI, no de parecido de nombres.

> ⚠️ **Colisión de nombres entre servidores.** `H_PressSpeed_PV` y `H_SL_FlakeDens_SP`
> existen en **los dos**, con `Access Name` distinto (`Forming` en A, `Form` en B) y
> comentario distinto ("Press speed" vs "Press **Conveyor** Speed"). Si IT vuelca
> ambos servidores a un solo `hmi.csv`, hay que decidir cuál gana o prefijar el
> origen. Hoy el simulador se quedaría con el último que aparezca en el archivo.

---

## 1. Servidor A: siete conexiones, no una

La columna `Access Name` revela que el servidor concentra varios PLC:

| Access Name | Qué contiene |
|---|---|
| `Forming` | formación, esparcidores SL1/CC/SL2, pre-prensa, báscula de manta |
| `Gluing` | encolado, receta, cocina de cola, bombas |
| `SPRAY` | sistema de spray (caudal, presiones, temperatura de tanque) |
| `PLC_L` | prensa continua (CBV), transductores, hidráulica, recetas de prensa |
| `Press` | velocidad de línea y espesor de tablero |
| `POF` | tablero terminado (cantidad, largo, ancho, espesor final) |
| `PLC170` | presostato `17032M01` |
| *(vacío)* | `Memory Real` / `Memory Integer` — variables locales del HMI, **no vienen de ningún PLC** |

Esto importa para IT: no es un solo origen. Y las `Memory *` no se pueden leer
desde SQL del PLC — o las publica el HMI, o no existen para nosotros.

## 1b. Servidor B: encolado, cocina de cola y dosificación

`Access Name`: `Gluing` (mayoría) y **`PLC_GE`** = sistema EVOjet de encolado
(boquillas de resina, winch de limpieza, swivel).
`Alarm Group` útiles: **`CL_DosBin`** / **`SL_DosBin`** (las tolvas dosificadoras
que alimentan Sección 2), `CL_Blender` / `SL_Blender`, `GlueKitchen`, `PumpAlarms`.

Los comentarios de este servidor traen además **direcciones de bloque de datos
del PLC** (`DB402.DBX2.0`, `DB413.DBX1.3`, `"F_CL_GI_HMI_DB".Swivel_in_time`) y
números de equipo (`07660M12` bomba de resina, `06670M02`, `07610M01`, `07620M01`).
Eso es exactamente lo que IT necesita para el volcado — no hay que adivinar nada.

Los únicos `Nivel_*` del servidor B son **tanques de resina y parafina**
(`Nivel_CL` = "Nivel tanque diario resina CL", `Nivel_SL`, `Nivel_Parafina`), no
silos de material. El upstream vive en el servidor C.

---

## 1c. Servidor C: el upstream (silos húmedos, secadero, quemador)

Es el HMI que faltaba. `Access Name` = una conexión por área de proceso:

| Access Name | Área |
|---|---|
| **`WETS`** | silos húmedos — extracción (`Wet-silos-ext…`) |
| **`WETB`** | bunker dosificador húmedo (`Wet-dosing-…`) |
| **`DRYR`** | secadero (`Dryer`, `General_DRYR`) |
| **`BRNR`** | quemador (`Burner`) |
| **`SCRN`** / `SCRN_AB` | clasificación · windsifter WS3 |
| **`PLCU112`** | molino Hombak U112 (alimentador, cuchillas, rotor) |
| `PLC_015` / `PLC_041` / `Prensa` / `Forming` | generadores CAT, medidores de energía, cruces con Sección 2 |

Los prefijos numéricos son **códigos de área**: `051` = silos húmedos + bunker,
`066` = clasificación, `071` = secadero, `072`, `015` = generación.

### Tags upstream encontrados (nombre completo legible)

| Tag | Comment | Sirve para |
|---|---|---|
| `051_D_Bunker_Level` | "Bunker dosificador, **nivel calculado**" | `BUNKER_L_PCT` ⚠️ unidad no declarada |
| `051_D_Bunker_Level_L` | "nivel mínimo llenado" | límites |
| `051_60_A1_3_OUTxEU` | "900A1.3, Bin medidor **peso**" | masa del bunker |
| `051_60_A1_1/A1_2_OUTxEU` | "900A1.1 / 900A1.2, Bin medidor **caudal** 1 y 2" | `BUNKER_FHUM_KGH` |
| `051_60_B1_OUTxEU` | "902T2, Bin medidor **humedad**" | humedad de entrada |
| `051_08_SL7_OUTxEU` | "897T4, Extractor **Silo Flak.2 transmisor nivel**" | nivel de un silo verde |
| `051_08_SP1_OUTxEU` | "897T3, Extractor Silo Flak.2 transmisor presión" | — |
| `D_Bunker_Calc_03 / _04 / _05` | "Bunker dosificador, fact.vel.dos. **silo aserrín / silo flakes 2 / silo hombak**" | identifica los tres silos que alimentan el bunker |
| `051_D_Bunker_Weight` | "Material seco desde secador 2 calculado" | — |
| `Wet_Mat_CALC_T…` (nombre truncado) | "Total wet material **kg/h** to 051.60 dosing bunker" · "Total wet material %" · "Total **dry** material kg/h" | `BUNKER_FHUM_KGH` |
| `071_DRY_Hum_out` | humedad de salida del secadero | validación |
| `071_DRYR_Reg_T_l…` / `_T_…` | "Secador, reg.temp.**ent**. PV/SP" y "reg.temp.**sal**. PV/SP" | perfil del tambor |
| `Delta_T_in`, `Delta_T_out`, `Delta_T_inFlash` | "Delta T entrada – salida Tambor", "Delta T precámara – entrada tambor" | `TAU_TAMBOR_S` indirecto |
| `Rendimiento_sec`, `capacidad_sec`, `capacidad_Sec2` | rendimiento y capacidad del secadero | — |
| `nivel_silo8`, `densidad_silo8`, `humedad_silo8` | "nivel del **silo de polvo 8**" | ⚠️ ¿es nuestro SILO8? |
| `Silo3_DescargaTotal` | "Cálculo consumo silo 3 x día" · `WETS` | consumo de silo 3 |
| `Clap_Silo2B_open` | "Clapeta bajo **silo 2B** abierta" | confirma que existe silo 2B |
| `DB13_REAL52_PLC041` | "041.11M01 **TSF SILO3**" | transporte desde silo 3 |
| `Corriente_WS3`, `Potencia_WS3_M06`, `Temp1/2_M06_WS3`, `Level_ciclon_WS3` | windsifter 3 (clasificación) | `T_WS3_S` indirecto |
| `Grecon_Z2…Z27_chispa/fuego` | detección de chispa y fuego por zona | eventos de línea |
| `Prensa_metal_detector` | **"Metal en material Prensa"** | el detector de metales (37.69 m) que faltaba |

### Los silos SÍ están completos — con la misma estructura del modelo

*(Corrige una conclusión anterior de este documento: sí hay `%` de nivel por
silo. Estaba en el bloque `051_S_*` que faltaba leer.)*

Cada silo húmedo publica exactamente el juego ρ · V · L% · F que usa el modelo:

| Silo del HMI | Capacidad | Densidad | Nivel | Descarga | Humedad |
|---|---|---|---|---|---|
| aserrín | `051_S_Saw_Dust_Cap` | `051_S_Saw_Dust_Dens` | `051_S_Saw_Dust_Level` | `…_D…` "desc. kg/h" | `051_S_Saw_Dust_Hum` |
| flakes 1 | — | — | `051_S_Flakes_1_Level` | — | — |
| flakes 2 | `051_S_Flakes_2_Cap` | `051_S_Flakes_2_Dens` | `051_S_Flakes_2_Level` | `…_De…` "desc. kg/h" | `051_S_Flakes_2_Hum` |
| hombak | `051_S_Hombak_Cap` | `051_S_Hombak_Dens` | `051_S_Hombak_Level` | `…_De…` "desc. kg/h" | `051_S_Hombak_Hum` |

Cada uno trae además `desc. kg/h seco`, `consumo x turno / x día / x total`,
`rotor` y `TSF`. Equipos: `760M1` aserrín · `750M1` flakes 2 · `770M1` hombak.

**Y los silos finales 5 y 6 también** — en el área de clasificación (`SCRN`),
con la unidad declarada en el comentario:

| Comment del HMI | Parámetro del modelo |
|---|---|
| "**Nivel silo capa interna %**" | `SILO5_L_PCT` (core / CL) |
| "**Descarga desde silo capa interna kg/h**" | `SILO5_FOUT` |
| "**Nivel silo capa externa %**" | `SILO6_L_PCT` (fina / SL) |
| "**Descarga desde silo capa externa kg/h**" | `SILO6_FOUT` |

Los cuatro son `066_C_Dry_Materia…` (nombre truncado en la foto — pedir el completo).
"Capa interna" = core = silo 5 · "capa externa" = superficie = silo 6.

### Correspondencia silo-material ↔ silo-número

Ya no es corazonada, pero **sigue necesitando un sí de planta**:

| Modelo | HMI | Evidencia |
|---|---|---|
| `SILO1` | Silo aserrín (`051_S_Saw_Dust_*`, 760M1) | único silo de aserrín |
| `SILO2A` | Silo flakes 1 (`051_S_Flakes_1_*`) | son dos silos gemelos de flakes… |
| `SILO2B` | Silo flakes 2 (`051_S_Flakes_2_*`, 750M1) | …y el modelo también tiene 2A/2B gemelos (mismo V y mismo F) |
| `SILO3` | Silo hombak (`051_S_Hombak_*`, 770M1) | el hombak es el molino que alimenta el tercer silo |
| `SILO5` | silo "capa interna" (`066_C_*`) | core = CL = silo 5 |
| `SILO6` | silo "capa externa" (`066_C_*`) | superficie = SL = silo 6 |

⚠️ `nivel_silo8` / `densidad_silo8` es el **silo de polvo que alimenta el
quemador** (`BRNR`). El `SILO8` del modelo es un silo final que dosifica a
Sección 2. Casi seguro **no son el mismo**.

⚠️ Ambigüedad pendiente: `041.11` aparece a la vez como "TSF **SILO3**"
(`DB13_REAL52_PLC041`) y como "OLD_DATA **Sawdust** 041.11" (`041_11_FDBxCURR`).
O el silo 3 transporta aserrín, o el número de área se reusa. Resolver antes de
cablear `SILO3`.

Por eso siguen sin aplicarse alias del servidor C: la estructura ya está clara,
falta la confirmación humana y los nombres completos de los tags truncados.

---

## 2. ⚠️ Corrección de un mapeo previo

En la primera pasada (solo nombres) asigné `H_Act_MatWeight_Real` → `PESO_MANTA_KGM2`.
**Estaba mal.** El comentario del HMI lo aclara:

| Tag | Comment real | Unidad |
|---|---|---|
| `H_Act_MatWeight_Real` | "Mat weight from **Scale (kg)**" | kg |
| `H_Act_MatWeight_SP` | "Mat weight after forming **(kg/m2)**" | kg/m² ✅ |

El modelo necesita kg/m². Corregido en el código. Es exactamente el tipo de error
que un mapeo "por nombre razonable" produce y que solo la descripción detecta.

---

## 3. Mapeo aplicado (confirmado por `Comment`)

| Parámetro del simulador | Tag WinCC | Comment del HMI | Srv · Access |
|---|---|---|---|
| `V_PRENSA_M_MIN` | `H_PressSpeed_PV` | "Press speed (m/min)" | A · Forming |
| `PESO_MANTA_KGM2` | `H_Act_MatWeight_SP` | "Mat weight after forming (kg/m2)" | A · Forming |
| `F_CL_KGMIN` | `H_CL_Total_Flakes` | "CL total flakes kg/min" | A · Forming |
| `PCT_SL1` | `H_Act_SL1_SP` | "SL1 % Set value (%)" | A · Forming |
| `DOSING_CL_M_KG` | `F_CL_DosBin_Weight` | "CL dosing bin weight" | B · Gluing |
| `DOSING_SL_M_KG` | `F_SL_DosBin_Weight` | "SL dosing bin weight" | B · Gluing |
| `F_SL_KGMIN` | `F_SL_FlakeFlow_PV` | "SL flake flow" ⚠️ unidad no declarada | B · Gluing |

Están en `WINCC_ALIAS` (`js/hmi-csv.js`). El CSV puede traer el nombre de WinCC
o el canónico, indistintamente. Verificado: los 7 alias parsean y `hmi.csv`
sigue en 104 tags / 0 warnings.

⚠️ `F_SL_FlakeFlow_PV` es el único alias cuya unidad **no** está declarada en el
comentario. Se asume kg/min por simetría con `H_CL_Total_Flakes` ("CL total
flakes kg/min") y con sus tags hermanos (`F_SL_FillingRequest…` sí dice kg/min).
Confirmar en pantalla antes de dar el modelo por bueno.

---

## 4. Los que NO se pueden mapear 1:1 (y por qué)

Aquí es donde las descripciones ahorraron trabajo equivocado:

| Parámetro | Lo que supuse | Lo que dice el HMI | Veredicto |
|---|---|---|---|
| `F_SL_KGMIN` | un tag del servidor A | en A hay que sumar `H_SL1_Total_Flakes` + `H_SL2_Total_Flakes`; en **B existe `F_SL_FlakeFlow_PV` "SL flake flow"** directo | **resuelto por el servidor B** — ya no hace falta tag derivado |
| `M_ESP1_KG` | `H_SL1_Filling_PV` en kg | "SL1 **Filling degree (%)**" | es %, no kg — falta capacidad de tolva |
| `M_ESP2_KG` | `H_CC_Filling_PV` en kg | "CC **Filling degree (%)**" | idem |
| `M_ESP3_KG` | `H_SL2_Filling_PV` en kg | "SL2 **Filling degree (%)**" | idem |
| `INCL_CL_V_MMIN` | banda inclinada | `H_CC_Speed_SP` = "CC **Metering belt** speed Set value" | es la banda dosificadora, otra máquina |
| `INCL_SL_V_MMIN` | banda inclinada | `H_SL_Speed_SP` = "SL Speed SP", **Memory Real** | ni es la banda inclinada ni viene del PLC |
| `PCT_SL2` | tag propio | no existe | derivar: `100 − PCT_SL1`, o `SL2/(SL1+SL2)` |
| `DOSING_*_F_KGMIN` | — | servidor B: `F_CL_FlakeFlow_PV` "CL flake flow" / `F_SL_FlakeFlow_PV` — es el mismo caudal que `F_*_KGMIN`, no un segundo flujo | revisar si el modelo necesita los dos o son redundantes |

**No hay ningún tag de velocidad de banda inclinada en este HMI.** Esos dos
parámetros se quedan como medida fija (ya están medidos: 68.5 m y 64.57 m).

---

## 5. Hallazgos nuevos que mejoran el modelo

### Encoders físicos — el modelo puede dejar de estimar
| Tag | Comment |
|---|---|
| `L02COMDRV02R-data24` | **"encoder on forming belt actual speed L.18-B313Z"** |
| `L02COMDRV03R-data24` | **"encoder on prepress top actual speed L.18-B311Z"** |
| `L03COM_H_L-R6` | "from forming station forming Belt speed actual [mm…]" |
| `L03COM_H_L-R7` | "from forming station forming Belt speed setpoint" |
| `HT-L18S-B401Y-GEN-PV` / `L18S-B401Y-GEN-PV` | **"CBV infeed mat distance"** |

Hay encoders reales en la banda de formación y en la pre-prensa. Hoy el modelo
asume velocidad de prensa en todo el tramo; con esto puede usar la velocidad medida.

### Velocidades y geometría confirmadas
| Tag | Comment |
|---|---|
| `H_FL_FormConv_Speed_PV` | "Forming conveyor speed (m/min)" |
| `H_FL_FormConv_Speed_PV_AVG` | "Forming conveyor speed Average (m/min)" |
| `H_FL_FormConv_Speed_Mode` | **"1= Speed from press, 0 = manual speed"** — dice si la banda sigue a la prensa o va en manual |
| `H_FL_InfeedConv_Speed_PV` | "Infeed conveyor speed (m/min)" |
| `H_PP_Upper_Speed_PV` | "Prepress upper main drive speed (m/min)" |
| `H_PP_Lower_Speed_PV` | "Prepress lower drive speed (m/min)" |
| `P_Act_LineSpeed_SP` | "Line speed (m/min)" · Access `Press` |
| `P_Act_Thickness_SP` | "Board thickness (mm)" · Access `Press` |
| `H_TrimSaw_Width` | "Trim saw width (mm)" |
| `H_LineDistance_PV` | "Line running after starting forming" — distancia desde el arranque de formación, **no** acumulado absoluto |

### Proceso
| Tag | Comment |
|---|---|
| `H_MaterialFlow_TonsPerHour` | "Forming line material flow tons per hour" — cruce de validación contra F_SL+F_CL |
| `H_Moisure_PV` | **"Humedad PEW758"** — instrumento identificado |
| `H_CL_FlakeDens_SP` / `H_SL_FlakeDens_SP` | "flake density (kg/m3)" |
| `H_SL1_FlakesDens` / `H_SL2_FlakesDens` / `H_CC_FlakesDens` | "flakes density kg/m3" por capa |
| `H_CL_Temp` | "CL temp °C" |
| `H_SL1_Scale_PV` / `H_SL2_Scale_PV` / `H_CC_Scale_PV` | "mat weight scale measured value" |
| `H_Damp1/2_ActualFlow` | "Actual flow (l/min)" — humidificación |
| `H_Act_SprayTop_SP` / `_SprayBottom_SP` | "Water spraying top/bottom (g/m2)" |
| `IMAN_AUTO` | "IMAN EN AUTOMATICO" |
| `OK_BOMBAS_GLUING_CL` / `_SL` | **"FALLA BOMBAS ENCOLADO CL/SL"** — ojo: el nombre dice OK, el comentario dice FALLA. Verificar la polaridad antes de usarlo. |
| `Q_Act_PanelAmount` | "Order amount of boards" · Access `POF` |
| `Q_Act_PanelLength` / `_PanelWidth` / `_FinalThickness` | tablero terminado · Access `POF` |

### Servidor B — dosificación y encolado (todo nuevo)
| Tag | Comment |
|---|---|
| `F_CL_DosBin_Speed` / `F_SL_DosBin_Speed` | "dosing bin, metering belt speed" |
| `F_CL_Filling_PV` / `F_SL_Filling_PV` | "dosing bin filling level" |
| `F_CL_Do_StopFilling` / `F_SL_Do_StopFilling` | **"Stop filling from silo limit"** — el único rastro de los silos finales |
| `F_CL_FillingRequest…` | "Filling request amount when belt is stop **kg/min**" |
| `F_CL_FlakeDens_PV` | densidad de flakes en dosificación |
| `F_CL_FlakeTemp_PV` | "TEMP ENFRIAMIENTO" · grupo `CL_Blender` |
| `F_CL_DropRoll_Speed` | "CL Drop roll speed present value" |
| `GE10S_B441…B448_GEN_PV` | "EVOjet Flujo boquilla de resina 1…8 [l/min]" — 8 boquillas |
| `GE10S_B401_GEN_PV` | "EVOjet Presión distribuidor resina B401" |
| `GE10S_B431_GEN_PV` | "EVOjet Presión aire atomización B431" |
| `Nivel_CL` / `Nivel_SL` / `Nivel_Parafina` | niveles de **tanque de resina/parafina** (no de silo) |
| `AIR_HUMIDITY`, `Humedad_compresor` | humedad de aire |
| `rendimiento_LF` | "Rendimiento %" |
| `F_Alarm105/109/84/88` | alarmas de presión de bombas dosificadoras de resina y parafina |
| `F_Alarm148/175` | "Resin C.E. / Resin CI consumption tank min limit" |

### Equipos identificados (amarran con los planos eléctricos)
`F_CL_Motor_Speed_08115Mxx` / `F_CL_Motor_Current_08115Mxx`:
- `M02` Dividing Conveyor Osc · `M03` Bottom Belt · `M05` Drop Roll · `M06` Oscillation
- `M07…M14` = Roller Unit 1.1 … 1.8
- `M17…M24` = Roller Unit 2.1 … 2.8

Otros: `PRESS_INFEED_NOSE_10135M02`, `SP01_17032M01` ("sensor de presostato"),
`08110SL01` (SL1 overfill), `08111SL01` (SL2 overfill), `L.18-B313Z` y `L.18-B311Z` (encoders).

---

## 6. Erratas del propio HMI (conservar tal cual)

El CSV debe usar los nombres exactamente como están, errores incluidos:
`H_SL1_Heigth`, `H_SL_FillingAmoutBeltStop`, `H_SL_RequestAmoutGluing`,
`H_CL_DirectStartSwichPoint`, `H_Moisure_PV`, `H_cc_density_fromgluin`.

Además hay comentarios mal copiados en el HMI: los `H_CL_Filling_PID_*` están
descritos como "SL filling PID regulator …", y `H_Act_PP_Lower_Offset` repite el
texto de `_Upper_`. Son bugs de la configuración de fábrica, no de nuestra lectura.

---

## 7. Cambios de código aplicados (`js/hmi-csv.js`)

1. **Búsqueda insensible a mayúsculas.** El parser hacía `.toUpperCase()` sobre el
   nombre antes de buscarlo; con nombres reales de WinCC (`H_PressSpeed_PV`)
   ningún tag habría hecho match.
2. **`WINCC_ALIAS`** — 4 alias de solo lectura, cada uno con su `Comment` citado.
3. **Edición consciente del alias** — al editar desde la UI se reescribe la fila
   que está en el archivo, no se agrega una duplicada.

Verificado: `datos/hmi.csv` sigue parseando 104 tags con 0 warnings.

---

## 8. Lo que sigue pendiente

1. ✅ **HMI de preparación / secado / clasificación** — ENCONTRADO (servidor C).
   Falta terminar de leer 8 de sus 16 fotos (bloque `015_*`, `051_DRYR_*`, `066_*`,
   `071_*`) y **confirmar la correspondencia silo-material ↔ silo-número**.
2. **Capacidad de las tolvas** de SL1 / CC / SL2 (kg) — ya NO hace falta de los
   planos: se calibra integrando el caudal durante un vaciado (`H_Empty_ON`)
   mientras `Filling_PV` cae. Ver §9.
3. **Unidad de `F_SL_FlakeFlow_PV`** y `F_CL_FlakeFlow_PV` — el único alias
   aplicado sin unidad declarada.
4. **Polaridad de `OK_BOMBAS_GLUING_*`** — ¿1 = OK o 1 = falla?
5. **Unidad de `H_MatWeight_PID_RV`** ("Mat weight PID regulator real value") — si
   está en kg/m² es mejor fuente que el `_SP` para el peso de manta medido.
6. **Estrategia de volcado con dos servidores** — un solo `hmi.csv` con riesgo de
   colisión, o dos archivos (`hmi-formacion.csv` + `hmi-encolado.csv`) que el
   simulador lea y combine. Recomendado lo segundo: elimina la colisión y cada
   servidor puede escribir a su propio ritmo.

---

## 9. Capacidad de las tolvas de los esparcidores — se calibra, no se busca en planos

El modelo calcula el retardo del esparcidor como `τ = M / F × 60`
([combined-app.js:1780](js/combined-app.js)). `F` ya está; falta `M`, la masa
retenida. Ningún HMI expone masa del esparcidor — solo `Filling degree (%)`.

No hace falta el plano. El servidor A tiene `H_Empty_ON` ("Empty ON -signal from
HMI (Run formers empty)"), la rutina que vacía los esparcidores. Durante un
vaciado:

```
kg por punto de %  =  ∫ caudal dt  /  Δ(Filling_PV)
```

Se integra `F_SL_FlakeFlow_PV` (kg/min) mientras `H_SL1_Filling_PV` cae de X% a
Y%. Una corrida calibra los tres. Ocurre sola en cada cambio de producto y en
cada parada — no hay que provocarla.

Ventaja extra: con la capacidad calibrada, `M` deja de ser constante
(hoy 12.5 / 40 / 15 kg fijos) y pasa a `M = % × Cap`, con `Filling_PV` en vivo.
El retardo del esparcidor se mueve solo según qué tan llena esté la tolva — más
real que cualquier número de plano.

**Por verificar:** si `H_SL1_Heigth` ("SL1, heigth") resulta ser el nivel de la
tolva en mm y no la altura de la capa formada, hay un camino más directo.
