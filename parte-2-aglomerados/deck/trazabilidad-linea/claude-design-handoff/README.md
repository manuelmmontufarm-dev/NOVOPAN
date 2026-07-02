# Handoff Claude Design · NOVOPAN Sección 2

Paquete listo para entregar a **Claude Design** (proyecto **NUEVO**).

## Cómo usar (3 pasos)

1. **Comprime esta carpeta** en un `.zip` (o sube la carpeta entera).
2. En Claude Design, crea un **proyecto nuevo** (no continúes el handoff viejo de 2025).
3. Sube el zip + **2 capturas de pantalla** (ver `capturas/INSTRUCCIONES.md`) y pega el texto de **`PROMPT.md`**.

## Simulador en vivo (para capturas)

https://novopan.vercel.app/trazabilidad-linea

- Captura 1: pestaña **Línea** (SVG + toolbar).
- Captura 2: pestaña **Parámetros**.

## Contenido del paquete

| Archivo / carpeta | Para qué |
|-------------------|----------|
| **`PROMPT.md`** | Texto principal — copiar y pegar en Claude Design |
| **`GUIA_COMPLETA.md`** | Contexto, reglas de planta, mediciones, qué NO hacer |
| **`MEDICIONES.md`** | Tablas de metros y waypoints (fuente de verdad) |
| **`implementacion-actual/`** | Código HTML/CSS **como está hoy** en Vercel (jul-2026) |
| **`referencia-original/`** | Handoff v1 (`.dc.html`) — solo estilo, no escala |
| **`capturas/`** | Instrucciones para las screenshots que debes añadir tú |

## Entregable esperado de Claude Design

- Un `.dc.html` (HTML/SVG/CSS vanilla, sin React).
- SVG proporcional a **85.15 m** medidos, incluido el tramo post-prensa hasta sensores.
- Toolbar v2: línea siempre corriendo, solo **v_prensa**, botón **Aplicar cambio aquí**.
- Parámetros v2: inputs limpios, ecuaciones colapsadas.

## Después

Devuelve el `.dc.html` a Cursor para integrarlo en `trazabilidad-linea/`.

## Crear zip (opcional)

Desde la carpeta padre:

```bash
cd "parte-2-aglomerados/deck/trazabilidad-linea"
zip -r ~/Desktop/novopan-seccion2-claude-design.zip claude-design-handoff
```
