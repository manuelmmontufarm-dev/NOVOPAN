# Prompt maestro · simulador profesional Patios → Sensores

Trabaja sobre el simulador combinado de NOVOPAN ubicado en `parte-2-aglomerados/deck/trazabilidad-total/`. Debes entregar una implementación funcional y verificable, no solo un diseño o una propuesta.

## Objetivo

Convertir el simulador Patios → Sensores en una HMI técnica, profesional y legible. La vista Línea debe representar el proceso físico con rutas claras; la vista Parámetros debe documentar cada tiempo mediante ecuaciones elegantes y auditables. El archivo `datos/hmi.csv` será la única fuente editable de parámetros.

## Reglas de proceso obligatorias

1. Usa los nombres de planta en español. No inventes nombres genéricos como “collector”; usa **Colector CL**, **Colector SL**, **Colector de Partículas Grandes** y **Colector de Polvo**.
2. Representa explícitamente las cuatro salidas de clasificación:
   - Zarandas → Colector CL → Silo 5 → dosificación CL → Encoladora CI.
   - Zarandas → Colector SL → Windsifter 1 → Windsifter 2 → Silo 6 → dosificación SL → Encoladora CE.
   - Zarandas → Colector de Partículas Grandes → Windsifter 3 → Refinadores → Ciclones → Clasificadores → reingreso SL.
   - Zarandas → Colector de Polvo → Silo 4 → Silo 8 → Quemador.
3. Solo las **Encoladoras CI y CE** usan una retención estimada de **40 s**.
4. Los esparcidores no tienen una retención fija de 40 s. Calcula:
   - Esparcidor SL1: `M_ESP1 / (F_SL × PCT_SL1/100) × 60`.
   - Esparcidor CL: `M_ESP2 / F_CL × 60`.
   - Esparcidor SL2: `M_ESP3 / (F_SL × PCT_SL2/100) × 60`.
5. Conserva unidades dimensionalmente correctas:
   - `kg/h` → multiplicar por `3600 s/h`.
   - `kg/min` y `m/min` → multiplicar por `60 s/min`.
   - Silos: `τ = (ρ × V × L/100) / F`, con el factor de conversión correspondiente.
   - Bandas: `τ = L/v × 60`.

## Vista Línea

- Organiza el SVG de izquierda a derecha por zonas: Patios y reducción, Silos verdes, Bunker/secado, Clasificación, Silos finales, Encolado/formación, Preprensa/prensa y Corte/sensores.
- Evita cruces ambiguos. Diferencia visualmente CL, SL, reproceso y biomasa; usa flechas direccionales y etiquetas breves.
- Cada equipo clicable debe iniciar el trazador en ese equipo y consumir los tiempos de los pasos posteriores de su ruta.
- Los colectores deben existir como nodos visibles, clicables y conectados al grafo temporal.
- Mantén una jerarquía visual sobria tipo HMI industrial: alto contraste, colores funcionales, tipografía consistente y estados accesibles.

## Vista Parámetros

Para cada paso que agrega tiempo, crea una tarjeta con este orden:

1. Nombre del equipo y origen del dato: HMI, medido, calculado o estimado.
2. Ecuación simbólica renderizada con **KaTeX local**, incluyendo unidades junto a cada variable.
3. La misma ecuación con los valores actuales del CSV sustituidos y sus unidades.
4. Un último signo igual y el resultado destacado en segundos.
5. Debajo, los campos actualmente utilizados, cada uno con nombre, valor, unidad y tag CSV.

Incluye tarjetas explícitas para tiempos fijos; deben verse como `τ_equipo = t_equipo [s] = valor [s]`. Para pasos instantáneos documenta `τ = 0 s` y explica que no se modela acumulación. Agrupa las tarjetas siguiendo el orden físico del proceso.

## Autoridad del CSV

- No uses `localStorage` ni actualices el objeto del modelo directamente desde un input.
- Al editar un campo, modifica primero el texto CSV activo, vuelve a parsear todo el documento y después propaga el resultado al simulador y a las ecuaciones.
- Si el CSV proviene del servidor estático, permite descargar el documento editado. Si el usuario conecta un archivo local mediante File System Access, persiste los cambios de forma segura y con debounce.
- Un mismo tag puede sincronizar alias del modelo combinado y del motor detallado, pero no debe sobrescribir variables físicamente diferentes.
- La velocidad de prensa de la barra superior también debe editar su tag CSV y seguir el mismo flujo.

## Criterios de aceptación

- No hay errores de consola ni errores de sintaxis.
- El CSV contiene todos los tags mostrados como editables.
- Cambiar un parámetro modifica el texto CSV primero y actualiza inmediatamente la ecuación y el movimiento del simulador.
- Cambiar `T_ENC_CI_S` afecta solo a la Encoladora CI; cambiar `M_ESP2_KG` recalcula el Esparcidor CL mediante `M/F`; no existe ningún `T_ESP*_S = 40`.
- Las cuatro rutas de colectores son visibles y lógicas.
- Todas las tarjetas muestran ecuación simbólica, sustitución con unidades y resultado en segundos.
- Verifica escritorio y ancho móvil; el contenido matemático debe desplazarse horizontalmente antes de romper el diseño.
- Ejecuta comprobaciones de sintaxis, `git diff --check` y una prueba real en navegador antes de entregar.
