# Novopan Instructivos — Design System

Sistema de diseño para los **Instructivos de Procedimiento (IJP)** de **Novopan del Ecuador**, planta de tableros de partículas (MDP) en Itulcachi, Quito. Su propósito es producir documentos e interfaces de **recepción, descargas/consumo e inventario** que sean claros, consistentes (ISO 9001) y legibles para operadores en piso.

**Audiencia:** operadores de balanza, ayudantes de patios y supervisores. Trabajadores rurales, 30–60 años, baja exposición a interfaces digitales. Todo el sistema prioriza tipografía grande, mucho espacio en blanco, pasos numerados e íconos descriptivos.

## Fuentes / materiales recibidos
- `assets/novopan-logo.jpg` — logotipo de marca (NOVOPAN · PANELES DE MADERA), verde sobre amarillo. De aquí se muestrearon los colores de marca.
- Brief del cliente (estructura del IJP, componentes requeridos, tono). No se entregó codebase ni Figma; el sistema se construyó desde el brief y el logo.

## Estructura de un IJP (orden ISO 9001, consistente entre todos)
1. Definiciones → 2. Responsabilidad → 3. Actividades (numeradas 4.1–4.15) → 4. Excepciones → 5. Equipos → 6. Teclas del sistema → 7. Documentos relacionados.

El componente `SectionHeader` y la numeración mantienen este orden idéntico en Recepción, Descargas y Consumo, e Inventario.

---

## CONTENT FUNDAMENTALS

**Idioma:** español (Ecuador), registro institucional. Sin anglicismos ni jerga técnica innecesaria.

**Persona y tono:** instrucciones en **imperativo directo y de cortesía** ("Verifique la guía", "Registre el peso", "No autorice la descarga si…"). Se le habla al operador de **usted**, nunca de tú. Tono institucional, calmado, sin alarmismo salvo en prohibiciones.

**Casing:**
- Títulos de sección y de tarjeta: MAYÚSCULAS (uppercase), familia display.
- Cuerpo e instrucciones: oración normal (sentence case).
- Etiquetas/badges: MAYÚSCULAS con tracking amplio.

**Concisión:** una idea por paso. Frases cortas. Verbo al inicio. Evitar subordinadas largas.

**Numeración:** las actividades se citan como 4.1, 4.2… y las excepciones referencian el paso ("Excepción 4.3"). Los documentos usan códigos (`FR-REC-01`, `IJP-DES-001`).

**Emoji:** no se usan. La iconografía la aporta Material Symbols (ver ICONOGRAPHY).

**Ejemplos de copy:**
- Instrucción: "Verifique la guía de remisión antes de pesar el vehículo."
- Advertencia: "No descargue si la humedad supera el límite del lote."
- Prohibición: "Prohibido el ingreso de vehículos sin guía de remisión."
- Excepción: "Si la balanza falla, registre el peso manual y avise al supervisor."

---

## VISUAL FOUNDATIONS

**Colores.** Dos colores de marca muestreados del logo: **verde Novopan `#004E38`** (primario, autoridad institucional) y **amarillo `#FFDE00`** (acento, atención). Neutros cálidos tipo papel (`--surface-50 #F6F7F4`) para que el documento "respire". Sistema de seguridad con cuatro estados de color fijos: **amarillo = advertencia, rojo = prohibido, verde = correcto, azul = nota**; el color carga el significado. El amarillo de advertencia es un ámbar (`--warn-accent #F6B40A`) distinto del amarillo de marca para no confundirse. Ver `tokens/colors.css`.

**Tipografía.** Una superfamilia: **Barlow** (cuerpo) y **Barlow Semi Condensed** (display). Elegida por su legibilidad tipo señalética industrial y por ser la coincidencia más cercana al grotesco geométrico pesado del logo. Cuerpo desde **19px** (≈14pt) y títulos de 30px+; piso alto a propósito para lectura en tablet de planta. Números tabulares en tablas. Display siempre en mayúsculas con tracking ligeramente negativo. Ver `tokens/typography.css`.
> **Sustitución de fuente (confirmar):** se usó **Barlow** desde Google Fonts como aproximación. Si Novopan tiene una fuente de marca oficial, envíela y la integramos como `@font-face` local.

**Espaciado y layout.** Escala base 4px, generosa (`tokens/spacing.css`). Columna de documento máx. ~1040px. Áreas táctiles con piso de **56px** (`--touch-min`) para uso con guantes. Densidad baja: mucho aire entre bloques.

**Fondos.** Planos. Off-white cálido para páginas; verde sólido para portadas y encabezados de sección. **Sin gradientes**, sin texturas, sin imágenes de fondo decorativas. El logo es el único elemento gráfico de marca.

**Bordes y tarjetas.** Bordes sturdy de **2px** (acentos de estado 4px en el borde izquierdo de los callouts). Radios suaves e institucionales (`--radius-md 10px`, tarjetas grandes 16px), nunca juguetones. Las tarjetas son superficie blanca + borde 2px + sombra baja.

**Sombras.** Bajas y suaves (`--shadow-sm/md/lg`). Los documentos se sienten apoyados sobre la página, no flotando. Sin sombras de color.

**Animación.** Mínima y funcional: transiciones de `background` de ~120ms en estados de navegación y checklist. Sin rebotes, sin loops decorativos, sin parallax. Respetar `prefers-reduced-motion`.

**Estados.**
- *Hover/activo de navegación:* el ítem se rellena de amarillo con texto verde.
- *Checklist marcado:* fila con fondo verde claro, caja rellena de verde con check, texto tachado.
- *Press:* sin encogimiento; cambio de color sólido (alto contraste, fácil de percibir).
- *Foco:* anillo verde `--focus-ring`.

**Transparencia/blur.** Casi nula. Solo overlays sutiles (`rgba(255,255,255,0.12)`) sobre el verde para chips dentro de encabezados. Sin glassmorphism.

**Vibra.** Institucional, robusta, "de planta". Señalética antes que app de consumo. Alto contraste, sin ornamento, todo legible a un brazo de distancia.

---

## ICONOGRAPHY

**Sistema:** **Material Symbols Rounded** (Google Fonts), peso 600, **rellenos** (`FILL 1`). Se eligió por su amplísima cobertura de pictogramas industriales reconocibles y porque las formas rellenas y redondeadas se leen mejor a distancia que las de trazo fino. Cargado vía CDN en `tokens/fonts.css`; envuelto por el componente `Icon`.

- **No** se dibujan SVG a mano ni se generan imágenes.
- **No** se usan emoji ni caracteres unicode como íconos.
- Íconos de dominio usados: `local_shipping` (camión), `balance` (balanza), `forest` (madera), `warehouse` (patio), `science` (muestra), `fact_check` (checklist), `inventory_2` (inventario), `warning`, `block` (prohibido), `check_circle`, `key`/`keyboard` (teclas), `groups` (roles), `schedule` (frecuencia), `description` (documento).
- Tamaños típicos: 22–40px en UI, 24–36px dentro de chips/badges. Color por defecto verde de marca o blanco sobre verde.

> Material Symbols se sirve desde CDN (requiere internet). Si la planta necesita uso offline, se puede empaquetar el subconjunto de glifos localmente — avísenos.

---

## ÍNDICE / MANIFIESTO

**Raíz**
- `styles.css` — punto de entrada global (solo `@import`). Los consumidores enlazan este archivo.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`.
- `readme.md` — este documento.
- `SKILL.md` — manifiesto compatible con Agent Skills.
- `assets/novopan-logo.jpg` — logotipo.

**Componentes** (`components/`, namespace `window.NovopanInstructivosDesignSystem_ed66c5`)
- `structure/` — `Icon`, `Badge`, `SectionHeader`, `ActivityStep`, `KeyCap`
- `feedback/` — `Callout` (advertencia / prohibido / correcto / nota / excepción)
- `checklists/` — `Checklist` (cajas marcables)
- `tables/` — `InfoTable` (roles y frecuencias)
- `process/` — `ProcessCard` (ficha de proceso), `FlowDiagram` (flujo)

Cada directorio incluye `.jsx`, `.d.ts`, `.prompt.md` y una tarjeta `@dsCard`.

**Fundamentos** (`guidelines/`) — tarjetas de especímenes para la pestaña Design System: colores (marca, neutros, seguridad), tipografía (display, cuerpo, escala), espaciado (escala, radios/sombras), marca (logo, iconografía).

**UI kit** (`ui_kits/guia_de_campo/`) — Guía de Campo de Recepción: IJP interactivo para tablet. Ver su `README.md`.
