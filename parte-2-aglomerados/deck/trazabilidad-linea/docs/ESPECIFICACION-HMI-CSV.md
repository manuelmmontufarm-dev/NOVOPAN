# Especificación de conexión HMI → Simulador de trazabilidad (Línea 1, Sección 2)

**Para:** equipo de IT / automatización de NOVOPAN
**De:** equipo del simulador
**Objetivo:** que el simulador lea los valores del proceso de la Línea 1 en (casi) tiempo real.

---

## 1. Resumen en una frase

El simulador es un **sitio web estático** (archivos HTML/JS, sin backend). Lee un **archivo CSV** llamado `hmi.csv` que debe aparecer, y actualizarse solo, en la carpeta `datos/` junto al sitio. El simulador lo relee cada **2 segundos**.

```
<carpeta del sitio hosteado>/
├── index.html
├── js/...
└── datos/
    └── hmi.csv   ←  IT escribe/actualiza AQUÍ
```

No se necesita ningún servicio web, API ni endpoint. Basta con que "algo" (un job programado de SQL Server, un script, o el propio WinCC) **escriba/sobrescriba ese archivo** periódicamente.

---

## 2. Formato del archivo `hmi.csv`

- Texto plano. Formato **`VARIABLE:VALOR;`** — clave y valor separados por dos
  puntos `:`, cada registro terminado en punto y coma `;`.
- Puede ir **una variable por línea** (recomendado, más legible) o **varias en la
  misma línea** (`V_PRENSA_M_MIN:14.5;PESO_MANTA_KGM2:11.5;`). Ambas funcionan.
- Decimal: punto `.` o coma `,` (los dos válidos — `14.5` y `14,5` son iguales).
- Codificación: UTF-8 (con o sin BOM — ambas funcionan).
- Líneas que empiezan con `#` o `//` = comentarios (se ignoran).
- **Valor vacío (`VARIABLE:;`) = "pendiente / no medido"** → el simulador lo deja
  como TBD y no lo toca.
- Tags que el simulador no conoce → se ignoran con aviso, **no rompen** el archivo.
- Si un registro está mal formado, se ignora ese registro y los demás siguen funcionando.
- *(Compatibilidad: también acepta el CSV clásico `TAG,valor`, una fila por línea,
  por si algún export viejo lo usa.)*

### Ejemplo
```
V_PRENSA_M_MIN:14.5;
PESO_MANTA_KGM2:11.5;
PCT_SL1:47.1;
SILO6_LEVEL_PCT:;
```
(la última línea con valor vacío = ese dato sigue pendiente / TBD)

---

## 3. Variables que el simulador consume

> ⚠️ **La columna "Tag en el CSV" son nombres provisionales.** IT debe decidir el
> mapeo real: por cada fila, poner el tag real de WinCC / la columna de SQL de
> donde sale ese valor. Lo único que importa es que el **nombre de la izquierda
> en el CSV** coincida con lo que el simulador espera (columna "Tag en el CSV").
> Si prefieren otros nombres, los cambiamos en el simulador en 1 minuto — solo
> avísennos la lista final.

| Prioridad | Qué es | Unidad | Tag en el CSV | Tag real WinCC / origen SQL |
|---|---|---|---|---|
| ⭐ Clave | Velocidad de prensa | m/min | `V_PRENSA_M_MIN` | _(p.ej. `P03SCADAR...SP_speed` → **confirmar**)_ |
| Alta | Peso de manta (báscula central) | kg/m² | `PESO_MANTA_KGM2` | `H03_SCADAR...WEI_*_KGM2` → **confirmar** |
| Alta | Flujo capa fina (SL total) | kg/min | `F_SL_KGMIN` | **confirmar** |
| Alta | Flujo core (CL) | kg/min | `F_CL_KGMIN` | **confirmar** |
| Alta | % receta capa SL1 (bottom) | % | `PCT_SL1` | `...WEI_SLB_PER` → **confirmar** |
| Alta | % receta capa SL2 (top) | % | `PCT_SL2` | `...WEI_SLT_PER` → **confirmar** |
| Alta | Caudal encolador fino (CE) | kg/min | `F_CE_KGMIN` | **confirmar** |
| Alta | Caudal encolador grueso (CI) | kg/min | `F_CI_KGMIN` | **confirmar** |
| Media | Masa dosing fina | kg | `M_DOSING_FINA_KG` | **confirmar** |
| Media | Masa dosing gruesa | kg | `M_DOSING_GRUESA_KG` | **confirmar** |
| Media | Masa esparcidor 1 (SL1) | kg | `M_ESP1_KG` | **confirmar** |
| Media | Masa esparcidor 2 (CL) | kg | `M_ESP2_KG` | **confirmar** |
| Media | Masa esparcidor 3 (SL2) | kg | `M_ESP3_KG` | **confirmar** |
| Media | Velocidad banda inclinada fina | m/min | `V_INCL_FINA_M_MIN` | **confirmar** |
| Media | Velocidad banda inclinada gruesa | m/min | `V_INCL_GRUESA_M_MIN` | **confirmar** |
| Baja | Largo banda inclinada fina | m | `L_INCL_FINA_M` | fijo/medido |
| Baja | Largo banda inclinada gruesa | m | `L_INCL_GRUESA_M` | fijo/medido |
| Baja (hoy TBD) | Silo 6 fino: densidad | kg/m³ | `SILO6_RHO_KGM3` | **confirmar / dejar vacío** |
| Baja (hoy TBD) | Silo 6 fino: capacidad | m³ | `SILO6_VCAP_M3` | **confirmar / dejar vacío** |
| Baja (hoy TBD) | Silo 6 fino: nivel | % | `SILO6_LEVEL_PCT` | **confirmar / dejar vacío** |
| Baja (hoy TBD) | Silo 6 fino: caudal salida | kg/min | `SILO6_FOUT_KGMIN` | **confirmar / dejar vacío** |
| Baja (hoy TBD) | Silo 5 grueso: densidad | kg/m³ | `SILO5_RHO_KGM3` | **confirmar / dejar vacío** |
| Baja (hoy TBD) | Silo 5 grueso: capacidad | m³ | `SILO5_VCAP_M3` | **confirmar / dejar vacío** |
| Baja (hoy TBD) | Silo 5 grueso: nivel | % | `SILO5_LEVEL_PCT` | **confirmar / dejar vacío** |
| Baja (hoy TBD) | Silo 5 grueso: caudal salida | kg/min | `SILO5_FOUT_KGMIN` | **confirmar / dejar vacío** |
| Baja (hoy TBD) | Tiempo encolador CE | s | `T_ENC_CE_S` | **confirmar / dejar vacío** |
| Baja (hoy TBD) | Tiempo encolador CI | s | `T_ENC_CI_S` | **confirmar / dejar vacío** |

**Mínimo para arrancar:** con solo `V_PRENSA_M_MIN` (velocidad de prensa) el simulador ya funciona. Todo lo demás mejora la precisión pero es opcional. Las filas "TBD" pueden dejarse vacías indefinidamente.

---

## 4. Cómo generar el archivo (dos opciones)

### Opción A (recomendada) — Job programado en SQL Server
Un **SQL Server Agent Job** que cada pocos segundos ejecute un `SELECT` de los tags
y lo escriba a `datos/hmi.csv`. Cada fila debe salir ya con el formato
`VARIABLE:VALOR;` (se arma concatenando en el propio `SELECT`):

```sql
-- Pseudo-consulta: adaptar tabla/columnas reales (WinCC Tag Logging o vista de valores actuales).
-- Produce una línea "VARIABLE:VALOR;" por tag.
SELECT tag_del_csv + ':' + CONVERT(varchar(32), valor_actual) + ';' AS linea
FROM  <tabla_o_vista_de_valores_en_vivo>
WHERE tag_del_csv IN ('V_PRENSA_M_MIN','PESO_MANTA_KGM2','PCT_SL1', ...);
```
El resultado se exporta a `datos/hmi.csv` (con `bcp`, `sqlcmd -o`, SSIS, o PowerShell).
Ejemplo de salida esperada:

```
V_PRENSA_M_MIN:14.5;
PESO_MANTA_KGM2:11.5;
PCT_SL1:47.1;
```

### Opción B — OPC-UA / WinCC
Si prefieren, un script que lea del **servidor OPC-UA de WinCC** (ya instalado:
`OPCUASERVERWINCCPRO`) y escriba el mismo CSV.

En ambos casos **el simulador no cambia**: solo lee el archivo.

---

## 5. Frecuencia

- El simulador relee cada **2 segundos**.
- Basta con que el archivo se actualice a esa frecuencia o similar (cada 1–5 s está bien).
- Si el archivo no cambia, no pasa nada (el simulador simplemente no ve cambios).
- Si el archivo desaparece o falla, el simulador muestra "reconectando…" y se
  recupera solo cuando vuelve — no hay que recargar la página.

---

## 6. Preguntas abiertas para IT

1. ¿En qué tabla/vista de SQL Server (o en OPC-UA) están los **valores en vivo** de estos tags?
2. ¿Cuál es el **nombre real** de cada tag (columna "Tag real WinCC")?
3. ¿Cada cuánto se actualiza el dato del HMI (para afinar el intervalo)?
4. ¿La carpeta del sitio y el SQL estarán en el **mismo servidor**? (facilita escribir el archivo)

Con las respuestas 1 y 2, el simulador queda conectado a datos reales.
