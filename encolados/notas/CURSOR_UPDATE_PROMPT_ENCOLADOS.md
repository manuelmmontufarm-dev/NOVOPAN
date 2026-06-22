# Cursor Prompt — Update Encolados With Process Tracking Detail

Use this prompt in Cursor to update the Encolados visual/documentation package.

```text
You are working in the NOVOPAN-SLIDES repository.

Goal:
Update the Encolados presentation/page so it is more detailed, more current, and includes the new process-tracking information from the 2026-06-22 plant conversations. The current PDF `/Users/manue/Downloads/Encolados.pdf` already has a good 10-stage structure, but it is missing the most important new idea: end-to-end traceability of process changes from encolado/dosification through formation, prepress, hot press, quality sensors, cooling, and stacking.

Read these files first:
- `/Users/manue/NOVOPAN-SLIDES/encolados/BASE_INFO_ENCOLADOS.md` as the master source of all notes, audio discoveries, stages, brands-to-confirm, and technical gaps.
- `/Users/manue/Downloads/Encolados.pdf` for the current visual output and slide structure.
- `/Users/manue/NOVOPAN-SLIDES/encolados/PROCESO.md` for the current process content.
- `/Users/manue/NOVOPAN-SLIDES/encolados/notas/2026-06-22-resumenes-reuniones.md` for meeting summaries.
- `/Users/manue/Documents/NOVOPAN/transcripts/2026-06-22_encolados/notes/proceso_trazabilidad_cambios.md` for the new process-tracking detail.
- `/Users/manue/Documents/NOVOPAN/technical-research/research_aglomerados_2026-06-22.md` for technical research/gaps.
- Existing design prompt: `/Users/manue/NOVOPAN-SLIDES/encolados/notas/CLAUDE_DESIGN_PROMPT_ENCOLADOS.md`.

If the HTML/source that generated `Encolados.pdf` exists, update it. If no source exists, create a new standalone HTML in `encolados/visual/encolados_proceso_v2.html` and document how to export it to PDF. Keep it browser-openable with no build step unless the repo already has a better local pattern.

Main update direction:
The current 11 pages are stage-by-stage. Keep that, but add a cross-cutting "traceability of changes" layer. The deck should answer:
- What happens in each stage?
- What sensors/signals matter?
- What variables are measured?
- What goes wrong today?
- How would a process-change marker move through the line?
- What would the operator need to see in a single overview screen?

Add or revise content as follows:

1. Add a new early slide or section: "Vista general de trazabilidad"
- Show the process as a continuous path:
  Dosificación/Encolado -> Transportadores -> Formación -> SL1 / CL / SL2 -> Sprays -> Esparcidores -> Imán/Detector/Perfilómetro -> Preprensa -> Prensa -> Espesor/Reventados/Peso/Densidad -> Enfriador -> Estacado.
- Add a moving "change marker" concept: a recipe/dosing change starts at a timestamp and moves through the line based on distance, speed, and pulses/rotations.
- Explain why this matters: operators need to know when a change reaches each station and when to evaluate output quality.

2. Add a new slide or panel: "Modelo de seguimiento"
Include:
```text
distancia_avanzada = pulsos_detectados * distancia_por_pulso
tiempo_estimado = distancia_restante / velocidad_actual
posicion_cambio = origen_del_cambio + distancia_avanzada
```
Explain the three implementation options:
- Physical marker on belt: useful for initial calibration, but not durable.
- Pulse/rotation tracking: preferred first MVP, using existing sensors/rodillo pulses.
- PLC-to-PLC integration: best long term, but more programming complexity because machines have separate PLCs.

3. Update the main overview slide
It currently shows the 10 stages and two master ideas. Add:
- "Missing today: one HMI/overview that shows the whole line."
- "Current interfaces are separated: esparcidores/preprensa/nariz/banda transferencia/prensa."
- "Target: one view showing where each change is now."

4. Update each stage slide with a consistent structure
For each stage, use the same information architecture:
- What happens here
- Inputs/outputs
- Instrumentation/signals
- Process variables
- Failure modes/current issue
- What the traceability system needs from this stage

5. Stage-specific content to add

Silos:
- Fine particle -> external/top-bottom layers.
- Medium particle/biruta/polvo -> core layer.
- Ultrasonic level 0-100, paletas min/max, inductive pulses for screw rotations.
- Gap: confirm number/capacity of silos and active silo logic.

Dosimbuncas / dosing bins:
- Name still pending: dosimbuncas/dosimil/dosibunker.
- One bin per layer/material type.
- Discharge logic: kg/min = load cell weight + motor/rotation speed.
- Explain that constant volume + weight + speed estimate discharge.
- Gap: HMI tag, capacity, setpoints.

Classification:
- Rodillo/cama moleteada classification is mechanical, not PID.
- Mention 0.3-1.3 mm roughness/depth range from field notes, but mark as "verify exact values."

Encolador:
- Material + resina + parafina + agua/aditives.
- Include SP/PV/LMN: setpoint, measured process value, manipulated output.
- Healthy pump control should not sit at 100%; 40-50% nominal is preferred.
- Current issue: PV oscillates, controller not stable.
- Include flowmeters: electromagnetic and/or Coriolis, but mark exact technology by line as pending.
- Include pressure sensors with membrane that can foul with resin/paraffin and require maintenance cleaning.

Sprays / release agent:
- Add this explicitly if it is not in the current deck.
- Water + release agent/desmoldante around 1.5% concentration, to prevent sticking to belt and press steel belt.
- Confirm concentration and exact locations.

Esparcidores:
- Keep layer sandwich, but correct/flag the 53/43 issue:
  External total setpoint = 30%, core = 70%.
  Top/bottom split heard as 53/43 but this sums to 96, so show as "53/43 heard in audio - verify if 53/47 or if another factor exists."
- Tau:
  tau = sum(esparcidoras) - central scale.
  Target = 0 with small oscillation.
  Current = +5 constant, unresolved for ~6 months.
- Add dynamic calibration issue:
  Static calibration with test weights passes, production/dynamic weighing fails when belt is moving.
  Possible causes: belt drag, tare, zero reference, load-cell offset, mechanical alignment, vibration, material distribution.
- Include paper test/testigos: requested 30% external, measured around 33%.

Preprensa:
- ~153 bar hydraulic pressure.
- Compresses mat and expels air before hot press.
- Helps prevent internal defects/reventados when heat expands trapped air.
- Add connection point for traceability: after forming and before press.

Prensa caliente continua:
- It is the line master: press speed controls upstream/downstream rhythm.
- Temperatures observed: 220-220-220-215 C; thermal oil around 285 C.
- Press has multiple zones/areas; process tracking should show not just "in press" but "area 1 / heating zone 1 / heating zone 2 / etc."
- System of vapor is out of service as of 2026-06-22; mark current state and confirm whether temporary.
- Distances heard: formation/belt around 90 m, press around 22.1 m, another line/press around 16 m - mark all as verify before final numbers.

Quality sensors after press:
- Add a separate slide or strongly expand the post-press part.
- Include ultrasonic/internal defect detection ("reventados"): sensor below/above, received signal lower means internal issue.
- Thickness measurement: six thickness wheels/sensors; standard example 15.3 mm, max variation heard as 0.3 mm between low/high points - verify.
- Board weight and average density: weight + thickness + dimensions.
- 19-board rolling view: current board plus history/average to see trend after process changes.
- This is essential because the traceability system must tell when a change reaches QC sensors.

Corte:
- Cutting while moving, diagonal/angle compensation for perpendicular board.
- Control diagonals/orthogonality; calibration needed.
- Add relation to tracking: cut board ID or board count could become the handoff from continuous mat to discrete boards.

Enfriadoras:
- Star coolers rotate boards to balance heat and reduce warping/alabeo.
- 3 boards at a time, 180-degree rotation heard in notes; verify exact residence time.

Estacado:
- Optical sensors count boards.
- Pneumatic system executes stacking.
- Encoders in grouping are a frequent failure point.
- Groups of 3 boards; next area is sanding/calibration/lijado.

6. Add an "operator overview wireframe" slide
This should be the most important new slide. It should show:
- Horizontal line map with all stations.
- Active change cards: Change ID, origin, time started, current estimated position, ETA to press, ETA to QC.
- Stage status chips: normal/warning/fault/offline.
- Live variables: line speed, tau, mat weight, layer ratio, resin/paraffin flow, press zone temperatures, thickness, density, rejects/reventados.
- Quality correlation: "Change X reached QC at 14:32; trend improved/worsened."
- Pending data: distances, pulses per meter, exact tags.

7. Add an "MVP plan" slide
Phase 1 - map and measure:
- Measure distances between origin points, esparcidores, prepress, press entrance/exit, QC sensors, cooler, stacker.
- Capture speeds and existing tags.
- Count pulses per meter/rotation.

Phase 2 - prototype:
- Manual change marker.
- Estimate position using distance/speed/pulses.
- Show station ETA and current position.

Phase 3 - integrate:
- Pull PLC/HMI tags.
- Add history and quality correlation.
- Add alarms when a change is expected to affect output.

8. Add "gaps to confirm" slide or appendix
- 53/43 vs 53/47.
- Tau vs TAM exact formula and units.
- Names/tags: dosimbuncas, SL1/CL/SL2, Mezzo, IO-Link, profile meter.
- Exact distances: 90 m, 22.1 m, 16 m.
- Press make/model and zone definitions.
- Vapor system status.
- Resin type and actual flowmeter technology.
- Thickness tolerance and board standards.

Design requirements:
- Keep the current visual style if updating existing source: white background, dark green, NOVOPAN yellow, technical cards, clear step navigator.
- Make it denser but still readable. Avoid huge empty cards with only one sentence.
- Do not turn it into a marketing page. This is an operational/process tool.
- Prefer diagrams and compact tables over paragraphs.
- Add enough detail for a plant operator/engineer to recognize the process.
- Keep text in Spanish, with English technical terms only where used in plant/HMI (Core Layer, Top, Bottom, forming heads, HMI, PLC, IO-Link).
- Use clear status tags: CONFIRMAR, ACTUAL, PROBLEMA, MVP, GAP.
- Avoid claiming uncertain numbers as facts; mark uncertain values with "por confirmar".

Deliverables:
- Updated source HTML/component or a new standalone `encolados/visual/encolados_proceso_v2.html`.
- If possible, export a new PDF named `encolados/visual/Encolados_v2.pdf`.
- Update or create a short changelog in `encolados/notas/` explaining what changed.
- Do not delete the old prompt or old PDF reference.

Quality check:
- Open the output at 1440x810 and 1280x720.
- Ensure no text overlaps, cards are not empty, all slides fit, and navigation works.
- Verify the new traceability/process overview is present and easy to understand.
```

## Short Wireframe Prompt For Another AI

```text
Design a wireframe for a NOVOPAN Encolados process-tracking dashboard. It should help operators see where a recipe/dosing change is physically located as it moves from encolado/dosification through formation, esparcidores, preprensa, prensa, QC sensors, cooling, and stacking.

Required screens:
1. Main overview: horizontal process map with stations and a moving change marker.
2. Active changes panel: Change ID, origin point, start time, current station, distance traveled, ETA to press, ETA to QC, status.
3. Live process variables: line speed, tau, mat weight, layer ratio, resin/paraffin flow, press zone temperatures, thickness, density, reventados/rejects.
4. Stage detail drawer: what happens in the selected stage, sensors/tags, current values, failure modes, gaps to confirm.
5. Quality correlation: show when a change reaches post-press sensors and whether thickness/density/reventados improved or worsened.
6. Setup/calibration screen: distances between stations, pulses per meter, speed source, PLC tag mapping, manual marker calibration.

Style:
Industrial operations dashboard, dense but readable, white background, dark green and NOVOPAN yellow accents, status colors for normal/warning/fault/offline. No marketing hero. Use tables, chips, timelines, and compact diagrams.
```
