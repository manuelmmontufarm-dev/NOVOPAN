# Mapeo de tags reales de WinCC → simulador de trazabilidad L1

**Fuente:** pantalla `Select Tag` del HMI Metso (`HMI-METSO`), **700 items**, fotografiada
el **2026-07-21** en dos pasadas: vista de lista (nombres) y vista de tabla
(`Tag Type` · `Access Name` · `Alarm Group` · `Comment`).
**Cobertura:** completa de A a Z — de `<none>` / `Caudal_entrada_agua_spray` hasta
`variation`, con `Filter: <none>`. Todos los mapeos de abajo salen del campo
`Comment` del propio HMI, no de parecido de nombres.

---

## 1. Este HMI son SIETE conexiones, no una

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

**Sigue confirmado:** cero tags de silos verdes, bunker, secadero, tamices,
zarandas, ciclón o silos 4/5/6/8. Los 31 parámetros upstream siguen sin fuente.

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

| Parámetro del simulador | Tag WinCC | Comment del HMI | Access |
|---|---|---|---|
| `V_PRENSA_M_MIN` | `H_PressSpeed_PV` | "Press speed (m/min)" | Forming |
| `PESO_MANTA_KGM2` | `H_Act_MatWeight_SP` | "Mat weight after forming (kg/m2)" | Forming |
| `F_CL_KGMIN` | `H_CL_Total_Flakes` | "CL total flakes kg/min" | Forming |
| `PCT_SL1` | `H_Act_SL1_SP` | "SL1 % Set value (%)" | Forming |

Están en `WINCC_ALIAS` (`js/hmi-csv.js`). El CSV puede traer el nombre de WinCC
o el canónico, indistintamente.

---

## 4. Los que NO se pueden mapear 1:1 (y por qué)

Aquí es donde las descripciones ahorraron trabajo equivocado:

| Parámetro | Lo que supuse | Lo que dice el HMI | Veredicto |
|---|---|---|---|
| `F_SL_KGMIN` | un tag | `H_SL1_Total_Flakes` "SL1 total flakes kg/min" + `H_SL2_Total_Flakes` "SL2 total flakes kg/min" | **suma de dos tags** — necesita tag derivado |
| `M_ESP1_KG` | `H_SL1_Filling_PV` en kg | "SL1 **Filling degree (%)**" | es %, no kg — falta capacidad de tolva |
| `M_ESP2_KG` | `H_CC_Filling_PV` en kg | "CC **Filling degree (%)**" | idem |
| `M_ESP3_KG` | `H_SL2_Filling_PV` en kg | "SL2 **Filling degree (%)**" | idem |
| `INCL_CL_V_MMIN` | banda inclinada | `H_CC_Speed_SP` = "CC **Metering belt** speed Set value" | es la banda dosificadora, otra máquina |
| `INCL_SL_V_MMIN` | banda inclinada | `H_SL_Speed_SP` = "SL Speed SP", **Memory Real** | ni es la banda inclinada ni viene del PLC |
| `PCT_SL2` | tag propio | no existe | derivar: `100 − PCT_SL1`, o `SL2/(SL1+SL2)` |
| `DOSING_*_F_KGMIN` | — | candidatos: `H_CL_RequestAmoutGluing` / `H_SL_RequestAmoutGluing` "Flake request amount from gluing kg/min" | verificar si es demanda o flujo real |

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

1. **Segundo HMI** para silos/secadero/clasificación — 31 parámetros dependen de eso.
2. **Tags derivados** — decidir si el simulador suma `H_SL1_Total_Flakes + H_SL2_Total_Flakes`
   para `F_SL_KGMIN`, o si IT entrega la suma ya hecha.
3. **Capacidad de las tolvas** de SL1 / CC / SL2 (kg) — para convertir el
   "Filling degree (%)" a los kg que el modelo necesita. Sale de los planos.
4. **Polaridad de `OK_BOMBAS_GLUING_*`** — ¿1 = OK o 1 = falla?
5. **Unidad de `H_MatWeight_PID_RV`** ("Mat weight PID regulator real value") — si
   está en kg/m² es mejor fuente que el `_SP` para el peso de manta medido.
