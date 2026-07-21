# `tendencia-metso.csv` — el formato real del "Save To File"

Calcado de `DENSIDADESHUMEDAD.CSV`, exportado del gráfico histórico del HMI de
Encolado el 21-jul-2026. Es el formato que Sistemas va a entregar en la
práctica, y tiene tres trampas juntas:

1. **La coma es separador Y decimal a la vez.** El encabezado declara 8
   columnas pero cada fila trae 12 campos: `13,90000` es un valor
   (13.9), no dos. El número de columnas del encabezado es lo único que
   desambigua.
2. **Muchos instantes, no uno.** Un export de tendencias trae horas o días de
   histórico. Solo interesa el último.
3. **Desordenado.** Las filas no vienen por fecha: aquí la más reciente
   (07/21/26 08:00) es la del MEDIO. Tomar la última línea da un dato viejo.

Valores correctos del instante más reciente:
`V_PRENSA=14.5 · PESO_MANTA=6.8 · H_CL_Total_Flakes=320.5 · DosBin=1234.56`
