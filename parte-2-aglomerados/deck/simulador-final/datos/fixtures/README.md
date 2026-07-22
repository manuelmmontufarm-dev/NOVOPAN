# Fixtures del adaptador de formatos CSV

Un archivo por formato que IT podría mandar. **Todos** describen exactamente el
mismo estado de planta, así que todos deben producir el mismo `updates{}`:

| Tag (canónico) | Alias WinCC usado en algunos fixtures | Valor | Clave del modelo |
|---|---|---|---|
| `V_PRENSA_M_MIN`    | `H_PressSpeed_PV`     | 14.5    | `v_prensa` |
| `PESO_MANTA_KGM2`   | `H_Act_MatWeight_SP`  | 6.8     | `_global:peso_manta` |
| `F_CL_KGMIN`        | `H_CL_Total_Flakes`   | 320.5   | `_global:F_CL` |
| `DOSING_CL_M_KG`    | `F_CL_DosBin_Weight`  | 1234.56 | `p1:dosG_M` · `mass:dosing-thick` |

`1234.56` está a propósito: obliga a distinguir separador de miles de separador
decimal en cada formato (`1.234,56`, `"1.234,56"`, `1234.56`).

| Fixture | Perfil esperado | Qué cubre |
|---|---|---|
| `kv-actual.csv` | `kv` | formato de hoy — debe pasar **sin tocarse** |
| `kv-clasico.csv` | `kv` | `TAG,valor` clásico — también pasa directo |
| `tabla-wincc.csv` | `tabla` | `Tagname;Value;Timestamp` |
| `tabla-columnas-extra.csv` | `tabla` | columnas de más y en otro orden + tag desconocido |
| `taglogging-validity.csv` | `tabla` | export de TagLogging + `Validity=0` → pendiente |
| `ancho.csv` | `ancho` | una fila por timestamp, un tag por columna |
| `tabla-sin-encabezado.csv` | `tabla` | sin encabezado: columnas detectadas por contenido |
| `tabla-nombres-raros.csv` | `tabla` | encabezado inútil (`Col1…`) + `datos/adaptador.json` |
| `miles-comillas.csv` | `tabla` | celdas entre comillas con decimal alemán |
| `basura.csv` | `desconocido` | página de error HTML — no debe romper nada |
| `sistemas-historian.csv` | `tabla` | **EL CONTRATO** — archivo real de Sistemas 22-jul (ver README-sistemas.md) |
| `tendencia-metso.csv` | `ancho` | Save To File real del HMI (ver README-tendencia.md) |

**El primer archivo real de IT llegó el 22-jul-2026** y quedó congelado como
`sistemas-historian.csv`: ese es el contrato. Los demás fixtures se conservan
como red de seguridad por si Sistemas cambia el formato sin avisar.
