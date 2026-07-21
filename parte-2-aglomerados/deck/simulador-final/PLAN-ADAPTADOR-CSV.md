# Plan · Adaptador de formatos CSV (lo que sea que mande IT)

> **Estado: implementado (21-jul-2026).** Los 5 pasos de §5 están hechos.
> · Código: `js/hmi-csv.js` → `detectarPerfil` · `normalizar` · `adaptarCsv`
> · Pruebas: `js/adaptador.test.js` (50) + fixtures en `datos/fixtures/`
>   — `node js/adaptador.test.js`, o `tests.html` §4 en el navegador.
> · Respaldo manual: `datos/adaptador.ejemplo.json` (copiar a `adaptador.json`).
> Los 56 tests de `route-model.test.js` siguen pasando sin cambios, y los CSV
> reales de `datos/` pasan byte a byte iguales (hay un test que lo vigila).

**Objetivo:** que el simulador acepte el archivo que IT buenamente logre
generar — sin pedirles que lo re-formateen — y lo normalice al modelo interno.
La regla de diseño: **nosotros nos adaptamos a IT, no al revés**, porque cada
ida y vuelta con Sistemas cuesta días.

---

## 0. Lo que el parser YA tolera (no re-implementar)

- `TAG: valor;` — una o varias por línea · decimal `.` o `,` · comentarios
  `#` y `//` · BOM · valor vacío = pendiente · tag desconocido = aviso sin
  romper · `TAG,valor` clásico · separador tab · nombres WinCC con alias y
  conversión de unidad (`{ tag, scale }`) · 4 archivos combinados con
  precedencia y aviso de colisión.

Los huecos son los formatos que un export automático de WinCC / SQL Server
suele producir y que hoy NO entran:

| Hueco | Ejemplo real probable |
|---|---|
| Tabla con encabezado | `Tagname;Value;Timestamp` + una fila por tag |
| Columnas en otro orden / de más | `Fecha,Planta,Tag,Unidad,Valor,Calidad` |
| Formato "ancho" | una fila por timestamp, cada tag es una columna |
| Export de TagLogging de WinCC | `VarName;TimeString;VarValue;Validity` |
| Valores con comillas y miles | `"1.234,56"` en locale alemán/ecuatoriano |
| Calidad/validez por fila | descartar filas `Validity=0` / `Quality≠GOOD` |

---

## 1. Arquitectura: sniffer → perfil → normalizador

Un solo punto de entrada nuevo en `hmi-csv.js`:

```
detectarPerfil(texto) → { perfil, confianza, detalle }
normalizar(texto, perfil) → texto canónico "TAG: valor;"  →  parseHmiCsv() actual
```

El parser actual NO se toca: todo formato raro se convierte al canónico y
entra por la puerta de siempre. Así los 56 tests existentes siguen valiendo
tal cual, y el pill de estado muestra el perfil detectado
(`● HMI CSV · tabla WinCC · 42 tags`).

### Perfiles, en orden de detección

1. **`kv`** (actual) — hay `:` antes que cualquier delimitador de tabla en las
   primeras líneas útiles. Pasa directo, costo cero.
2. **`tabla`** — primera línea útil parece encabezado (≥2 columnas, ninguna
   celda numérica). Se localizan las columnas de tag y de valor por nombre
   (`tag|tagname|varname|variable|nombre` / `value|varvalue|valor|pv`) y si no
   por contenido (columna de texto no-numérico = tag; columna numérica = valor).
   Columnas extra (fecha, unidad, calidad) se ignoran — salvo calidad, ver §3.
3. **`ancho`** — encabezado con muchos nombres que matchean `TAG_MAP`/alias y
   filas numéricas: se toma la ÚLTIMA fila (la más reciente) y cada columna es
   un tag.
4. **`desconocido`** — nada matchea: el pill muestra error con las primeras 2
   líneas del archivo en el tooltip, para diagnosticar por teléfono sin pedir
   el archivo.

### Robustez de celdas (aplica a todos los perfiles)

- Delimitador por conteo en las primeras 10 líneas: `;` `\t` `,` `|`
  (cuidado: si el decimal es coma, `;` gana — regla ya existente en
  `toNumber`, se reutiliza).
- Comillas: se des-citan celdas `"..."` (ya existe `unquote`, hoy solo para kv).
- Números: se reutiliza `toNumber` con su lógica de locale.

## 2. Configuración manual de respaldo (`datos/adaptador.json`, opcional)

Si el sniffer no acierta con el export real de IT, un JSON opcional fija el
mapeo sin tocar código:

```json
{ "hmi-formacion.csv": { "perfil": "tabla", "colTag": "VarName",
    "colValor": "VarValue", "colCalidad": "Validity", "calidadOk": "1" } }
```

Ausente el archivo → todo funciona por autodetección (cero fricción hoy).

## 3. Calidad de dato

Si el export trae columna de validez (`Validity`, `Quality`, `QC`), las filas
malas se tratan como **valor vacío** (= pendiente, conserva el último bueno),
no como cero. Un cero falso es el peor resultado posible: número creíble y
equivocado.

## 4. Pruebas (antes de escribir el normalizador)

Fixtures en `datos/fixtures/` — un archivo por formato de la tabla de huecos,
más los dos formatos actuales como regresión. Suite nueva `adaptador.test.js`
con el mismo mini-harness de `route-model.test.js`:

- cada fixture → mismo `updates{}` esperado
- perfil detectado correcto y visible en el resultado
- `Validity=0` → pendiente, no cero
- archivo basura → `desconocido` + tooltip con las líneas
- fila con tag desconocido dentro de tabla → aviso, resto sigue

## 5. Orden de ejecución (½ día total, incremental)

| Paso | Qué | Riesgo |
|---|---|---|
| 1 | Fixtures + tests en rojo | — |
| 2 | Sniffer + perfil `tabla` (el export más probable de SQL/WinCC) | bajo — no toca el camino kv |
| 3 | Perfil `ancho` + calidad | bajo |
| 4 | `adaptador.json` opcional | bajo |
| 5 | Pill muestra perfil + tooltip de diagnóstico | cosmético |

Cada paso deja el simulador funcionando; el perfil `kv` actual jamás pasa por
código nuevo. Cuando IT mande su primer archivo real, ese archivo se congela
como fixture y se convierte en el contrato.

## 6 · Qué se ve cuando el CSV viene raro (implementado)

Regla: **el simulador nunca inventa un número, y nunca se calla un archivo que
no pudo leer.** Un cero falso es peor que un hueco.

| Situación | Qué hace | Qué se ve en el pill |
|---|---|---|
| Archivo ilegible (HTML de error, formato ajeno) | descarta ese archivo, sigue con los demás | rojo · `✖ hmi-encolado.csv` + las 2 primeras líneas en el tooltip |
| Tabla legible pero ningún tag del modelo | descarta el archivo | rojo · aviso con el perfil que creyó ver, las columnas usadas y el ejemplo de tags |
| Algunos tags ajenos al modelo | los ignora, el resto entra | ⚠ un solo aviso agregado (`12 tag(s) … : A, B, C…`) |
| Fila con `Validity=0` / `Quality≠GOOD` | queda **pendiente** (conserva el último bueno) | ⚠ `N fila(s) descartadas por calidad` |
| Celda no numérica (`OFF`, `N/A`) | no escribe nada | ⚠ `valor inválido en TAG` |
| Perfil detectado con confianza baja | igual lo usa | ⚠ sugiere fijarlo en `datos/adaptador.json` |
| `adaptador.json` presente pero con JSON inválido | sigue por autodetección | ⚠ lo dice con el error del parser |
| Ningún CSV disponible | conserva el último bueno | rojo · `reconectando…` con la hora del último válido |

El tooltip corta a 10 avisos y dice cuántos quedaron fuera: sirve para
diagnosticar por teléfono sin pedir el archivo.
