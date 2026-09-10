# NOVOPAN — Pasantía e Instructivos

Repositorio de documentación de la pasantía en Novopan del Ecuador (Itulcachi, Quito): recepción y preparación de madera, aglomerados (Línea 1), transcripciones, IJPs y entregables.

## Estructura del repo (2026-06-22)

```
NOVOPAN-SLIDES/
├── README.md · TODAY.md · 00_Index.md · linea-1-overview.md
├── POLICY_DOCUMENTOS_FINALES.md · AGENT_INSTRUCTIONS.md
│
├── parte-1-preparacion-madera/     ← recepción, patios, balanza, IJP-REC (CERRADO 19-jun)
│   ├── instructivos/               IJPs, finales docx/pdf/html, CONTENIDO_MAESTRO
│   ├── html-app/                   guía React interactiva
│   ├── notas/ · transcripciones/ · presentaciones/
│   └── technical-research/
│
├── parte-2-aglomerados/            ← encolados L1: silos → prensa → estacado (ACTIVO)
│   ├── encolados/                  PROCESO, BASE_INFO, notas Codex
│   ├── transcripciones/            lotes 2026-06-22
│   ├── technical-research/
│   └── deck/                       presentación visual Encolados.dc.html
│
└── _compartido/                    glosario, personas, sistemas, pendientes
    ├── glossary/ · reference/ · decisions-and-open-items/
```

**Límite entre partes:** la Parte 1 termina en la **salida de preparación de madera** (partícula clasificada en **silos**). La Parte 2 empieza en **encolados / formación / prensa** — ver [`linea-1-overview.md`](linea-1-overview.md).

## Reglas del repo

1. **Antes de cada `git push`** actualizar [`TODAY.md`](TODAY.md).
2. **Parte 1 — contenido IJP:** editar solo [`parte-1-preparacion-madera/instructivos/finales/CONTENIDO_MAESTRO.md`](parte-1-preparacion-madera/instructivos/finales/CONTENIDO_MAESTRO.md); el agent sincroniza derivados (ver [`AGENT_INSTRUCTIONS.md`](AGENT_INSTRUCTIONS.md)).
3. **Parte 2:** documentación viva en `parte-2-aglomerados/encolados/`; no mezclar entregables con Parte 1.
4. Transcripciones raw no se editan; notas limpias van en `notas/` o `transcripciones/*/notes/`.

## Inicio rápido

| Qué | Dónde |
|-----|--------|
| Índice maestro | [`00_Index.md`](00_Index.md) |
| Guía recepción (navegador) | `parte-1-preparacion-madera/html-app/NOVOPNHTML1.html` |
| Proceso encolados | `parte-2-aglomerados/encolados/PROCESO.md` |
| Base conocimiento aglomerados | `parte-2-aglomerados/encolados/BASE_INFO_ENCOLADOS.md` |
| Deck visual encolados | `parte-2-aglomerados/deck/Encolados.dc.html` |
| Despliegue en planta (Puente + simulador local, quién corre qué compu) | [`bridge/DESPLIEGUE-PLANTA.md`](bridge/DESPLIEGUE-PLANTA.md) |
| Bitácora | [`TODAY.md`](TODAY.md) |

## Contexto

- **Planta:** Novopan del Ecuador — tableros MDP/MDP-RH.
- **Sistemas:** ANI, Factory Track, INFOR.
- **Supervisor SGC:** Daniel Sotalin.
