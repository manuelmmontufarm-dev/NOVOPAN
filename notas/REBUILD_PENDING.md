# Rebuild pendiente del bundle estático

**Fecha:** 2026-06-19
**Causa:** Se editó `NOVOPNHTML1_files/Screens.jsx` con fixes de contenido. El bundle `NOVOPAN_Guia_Recepcion_Madera_FINAL_ESTATICO.html` se actualizó parcialmente vía find/replace, pero **2 secciones nuevas** requieren rebuild completo con babel.

## Estado actual

| Archivo | Estado |
|---|---|
| `NOVOPNHTML1_files/Screens.jsx` | ✅ Completo (todos los fixes) |
| `NOVOPAN_Guia_Recepcion_Madera_FINAL.html` (print template) | ✅ Funciona (referencia Screens.jsx vía script) |
| `NOVOPNHTML1.html` (runtime React) | ✅ Funciona (referencia Screens.jsx vía script) |
| `NOVOPAN_Guia_Recepcion_Madera_FINAL_ESTATICO.html` (bundle) | ⚠️ Parcial — falta rebuild para 2 secciones nuevas |

## Backup
`NOVOPAN_Guia_Recepcion_Madera_FINAL_ESTATICO.html.bak` = versión previa a los find/replace.

## Cambios aplicados a Screens.jsx (Fase 2)
1. ✅ Tiempo muestra rolliza: `20 a 40 min` → `25 a 40 min` (también en ESTATICO)
2. ✅ Etiquetado Patio 5: ahora balanza envía la etiqueta (también en ESTATICO)
3. ✅ Altura ruma: 5 m máx (excepcional 6 m), patrón 2+camino+2 (también en ESTATICO)
4. ✅ Checklist ruma alineado a altura nueva (también en ESTATICO)
5. ⚠️ **NUEVO**: Card "Humedad: último filtro antes del cierre" + Callout verificación salida Balanza 1 — **NO está en ESTATICO** (requiere rebuild)
6. ⚠️ **NUEVO**: Callout "FIFO con excepción justificada" en 4.14 — **NO está en ESTATICO** (requiere rebuild)

## Cómo regenerar el bundle estático

El proceso que usaste con Codex es lo más confiable. Si no lo recuerdas, los pasos manuales serían:

```bash
# 1. Transpilar Screens.jsx con babel
cd /Users/manue/Documents/NOVOPAN/NOVOPNHTML1_files
npx -y @babel/cli@7 Screens.jsx \
  --presets=@babel/preset-react,@babel/preset-env \
  -o Screens.compiled.js

# 2. Hidratar el SSR (esto es lo que probablemente hace tu script de Codex):
#    - Toma NOVOPAN_Guia_Recepcion_Madera_FINAL.html como template
#    - Inyecta Screens.compiled.js inline (sin el <script type="text/babel">)
#    - Ejecuta React server-render para llenar <div id="root">
#    - Escribe NOVOPAN_Guia_Recepcion_Madera_FINAL_ESTATICO.html

# Si no tienes el script de Codex a mano, lo más fácil:
# - Abre NOVOPNHTML1.html en Chrome
# - Inspecciona, copia el <div id="root"> completo (con HTML hidratado)
# - Pégalo en _ESTATICO.html reemplazando el <div id="root">...</div> existente
# - Reemplaza también el <script>...transpiled JS...</script> con Screens.compiled.js inline
```

## Validación visual mínima
Antes de considerar el rebuild OK, verifica que en ESTATICO aparezcan estos strings:
- `"Humedad: último filtro antes del cierre"`
- `"Verificación de humedad en salida"`
- `"FIFO con excepción justificada"`

Si no aparecen, el rebuild no recogió los cambios.
