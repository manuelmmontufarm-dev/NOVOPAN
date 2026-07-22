# `sistemas-historian.csv` — EL CONTRATO (22-jul-2026)

Réplica exacta del primer archivo real que generó Sistemas, visto en el
servidor `D:\CSV-simulador_cambios_PB1\DatosCSV` (hoja `Historian` de su
consulta SQL, foto 22-jul-2026 12:36). Este archivo ES el contrato: si el
adaptador lo lee, lee lo que la planta produce.

Formato: `Datetime,Tagname,Value` · un solo archivo con TODO (Preparación +
Encolado + Formación juntos) · decimal con punto · fecha `M/D/YYYY HH:MM`.

Particularidades que este fixture obliga a cubrir:

1. **`F_*_DosBin_Weight_PV`** — en la pantalla del HMI el tag aparece SIN
   `_PV`; el Historian lo entrega CON `_PV`. El alias acepta ambos.
2. **`Datetime` distinto por tag** (12:36, 11:42, 11:36…): su consulta trae el
   último valor conocido de cada tag. Cuando traiga VARIOS instantes por tag,
   gana el más reciente por fecha — no la última línea del archivo.
3. **21 de los 34 tags** aún no existen en el modelo (llenados %, POF,
   humedad…): un solo aviso agregado, y el resto entra normal.
4. `P_Act_LineSpeed_SP` (14.30) ≠ `H_PressSpeed_PV` (14.77): el simulador usa
   `H_PressSpeed_PV` a propósito; el otro queda como tag no mapeado.
5. `F_CL_FlakeFlow_PV` (273.2) vs `H_CL_Total_Flakes` (292.8): redundantes con
   ~7 % de diferencia. El modelo usa `H_CL_Total_Flakes`; el otro NO se mapea
   para no generar un conflicto permanente en el pill.
