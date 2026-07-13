/**
 * TraceEngine — posición del cambio en la línea con modelo m_dot.
 *
 * Cada nodo aporta un t_total según su modelo:
 *   - bin / hopper / cstr → τ = M / F × 60 + buffer
 *   - fixed (sprays)      → t = retentionSec + buffer
 *   - transport (banda)   → t = L / v × 60 + buffer  (v = v_banda fija o v_prensa)
 *
 * Convención de merge (esparcidores → banda blanca):
 *   La banda blanca solo arranca cuando el ÚLTIMO (más lento) esparcidor termina.
 *   El min() de mergeElapsed = "tiempo desde que las TRES capas están presentes".
 */

import {
  PATHS, PATH_IDS, DOWNSTREAM, nodesForPath, pathsForInjection, startNodeForPath,
  DOWNSTREAM_STAGE_IDS, segmentAtM, bandWaypoints, bandSegmentsWithBounds,
} from './process-graph.js';

// ── Helpers de parámetros ──

function buffer(nodeId, params) {
  return Math.max(0, params[`buffer:${nodeId}`] ?? 0);
}

function len(nodeId, params, node) {
  return params[`len:${nodeId}`] ?? node.lengthM ?? 0;
}

function factor(nodeId, params, node) {
  const f = params[`factor:${nodeId}`] ?? node.speedFactor ?? 1;
  return f > 0 ? f : 1;
}

/** Velocidad efectiva (m/min): banda inclinada fija HMI o acoplada a prensa. */
function beltSpeed(node, params, pressSpeed) {
  const vFixed = Number(params[`speed:${node.id}`] ?? node.beltSpeedMperMin ?? 0);
  if (vFixed > 0) return vFixed;
  return pressSpeed * factor(node.id, params, node);
}

/** Lee el flujo (kg/min) que el nodo demanda según su flowSource y la receta. */
function flowFor(node, params) {
  if (!node || !node.flowSource) return 0;
  const FSL = Number(params['_global:F_SL']) || 0;
  const FCL = Number(params['_global:F_CL']) || 0;
  const pSL1 = (Number(params['_global:pctSL1']) || 0) / 100;
  const pSL2 = (Number(params['_global:pctSL2']) || 0) / 100;

  switch (node.flowSource) {
    case 'F_SL':  return FSL;
    case 'F_CL':  return FCL;
    case 'F_SL1': return FSL * pSL1;
    case 'F_SL2': return FSL * pSL2;
    default:      return 0;
  }
}

/** τ por nodo según su modelo. NO incluye buffer (se suma aparte). */
function tauForNode(node, params) {
  if (!node) return 0;
  // Modelo bin/hopper: τ = M / F × 60
  if (node.model === 'bin' || node.model === 'hopper') {
    const M = Number(params[`mass:${node.id}`] ?? node.holdupKg ?? 0);
    const F = flowFor(node, params);
    if (M <= 0 || F <= 0) return 0;
    return (M / F) * 60;
  }
  // Modelo fijo (sprays): retentionSec puro
  if (node.model === 'fixed') {
    return params[`ret:${node.id}`] ?? node.retentionSec ?? 0;
  }
  // Nodos transport puros: τ = 0
  return 0;
}

/** Transporte (s) de un nodo. Inclinadas: v fija HMI; bandas comunes: v_prensa. */
function transportForNode(node, speed, params) {
  const L = len(node.id, params, node);
  if (L <= 0) return 0;
  const v = beltSpeed(node, params, speed);
  if (v <= 0) return 0;
  return (L / v) * 60;
}

/** Tiempo total que el cambio tarda en cruzar un nodo (τ + transporte + buffer manual). */
function nodeTotalSec(node, speed, params) {
  return tauForNode(node, params) + transportForNode(node, speed, params) + buffer(node.id, params);
}

// ── Walk ──

/**
 * Avanza por nodos; devuelve completados, activo y tiempo restante en ruta.
 * Para nodos mixtos (τ + transporte) usa progreso combinado.
 */
function walkNodes(nodes, tSec, speed, params, startNodeId = null) {
  const completed = [];
  let elapsed = tSec;
  let active = !startNodeId;

  for (const node of nodes) {
    if (!active) {
      if (node.id === startNodeId) {
        active = true;
      } else {
        completed.push(node.id);
        continue;
      }
    }

    const tau = tauForNode(node, params);
    const tr = transportForNode(node, speed, params);
    const buf = buffer(node.id, params);
    const total = tau + tr + buf;
    const mixed = tau > 0 && tr > 0;

    // Fase 0: buffer manual (al inicio del nodo, antes del τ).
    if (buf > 0) {
      if (elapsed < buf) {
        return {
          completed,
          active: {
            nodeId: node.id,
            nodeLabel: node.label,
            phase: 'buffer',
            progressInNode: elapsed / total,
            positionM: 0,
            retentionRemainingSec: buf - elapsed,
          },
          mergeElapsed: null,
        };
      }
      elapsed -= buf;
    }

    // Fase 1: retención (τ).
    if (tau > 0) {
      if (elapsed < tau) {
        return {
          completed,
          active: {
            nodeId: node.id,
            nodeLabel: node.label,
            phase: 'retention',
            progressInNode: mixed ? (buf + elapsed) / total : (buf + elapsed) / (buf + tau),
            positionM: 0,
            retentionRemainingSec: tau - elapsed,
          },
          mergeElapsed: null,
        };
      }
      completed.push(node.id);
      elapsed -= tau;
    } else if (node.kind === 'retention') {
      if (elapsed > 0 || tSec > 0) {
        completed.push(node.id);
      } else {
        return {
          completed,
          active: {
            nodeId: node.id,
            nodeLabel: node.label,
            phase: 'retention',
            progressInNode: 0,
            positionM: 0,
            retentionRemainingSec: 0,
          },
          mergeElapsed: null,
        };
      }
    }

    // Fase 2: transporte (bandas).
    if (tr > 0) {
      if (elapsed < tr) {
        const vEff = beltSpeed(node, params, speed);
        const L = len(node.id, params, node);
        const posM = (elapsed / 60) * vEff;
        return {
          completed,
          active: {
            nodeId: node.id,
            nodeLabel: node.label,
            phase: 'transport',
            progressInNode: mixed
              ? (buf + tau + elapsed) / total
              : posM / L,
            positionM: posM,
            retentionRemainingSec: 0,
          },
          mergeElapsed: null,
        };
      }
      completed.push(node.id);
      elapsed -= tr;
    }
  }

  return { completed, active: null, mergeElapsed: elapsed };
}

function tracePath(tSec, speed, pathId, params, activePaths, injectionId) {
  if (!activePaths.includes(pathId)) return null;

  const nodes = nodesForPath(pathId);

  if (DOWNSTREAM_STAGE_IDS.includes(injectionId)) {
    return {
      pathId,
      pathColor: PATHS[pathId]?.color ?? '#666',
      nodeId: 'merge',
      nodeLabel: 'Unión banda blanca',
      phase: 'merged',
      mergeElapsed: tSec,
      progressInNode: 0,
      positionM: 0,
      retentionRemainingSec: 0,
      completedNodeIds: nodes.map((n) => n.id),
    };
  }

  const startId = startNodeForPath(injectionId, pathId);
  if (!startId) return null;

  const { completed, active, mergeElapsed } = walkNodes(
    nodes,
    tSec,
    speed,
    params,
    startId,
  );

  if (active) {
    return {
      pathId,
      pathColor: PATHS[pathId]?.color ?? '#666',
      ...active,
      completedNodeIds: completed,
    };
  }

  return {
    pathId,
    pathColor: PATHS[pathId]?.color ?? '#666',
    nodeId: 'merge',
    nodeLabel: 'Unión banda blanca',
    phase: 'merged',
    mergeElapsed: mergeElapsed ?? 0,
    progressInNode: 0,
    positionM: 0,
    retentionRemainingSec: 0,
    completedNodeIds: completed,
  };
}

function traceDownstream(elapsed, speed, params, fromStageId = null) {
  const completed = [];
  let started = !fromStageId || fromStageId === 'white';

  for (const node of DOWNSTREAM) {
    if (!started) {
      if (node.id === fromStageId) started = true;
      else continue;
    }

    const tr = transportForNode(node, speed, params);
    const buf = buffer(node.id, params);
    const need = tr + buf;

    if (buf > 0 && elapsed < buf) {
      return {
        pathId: 'merged',
        pathColor: '#004E38',
        nodeId: node.id,
        nodeLabel: node.label,
        phase: 'buffer',
        progressInNode: elapsed / need,
        positionM: 0,
        retentionRemainingSec: buf - elapsed,
        completedNodeIds: completed,
      };
    }
    if (buf > 0) elapsed -= buf;

    if (tr > 0 && elapsed < tr) {
      const vEff = beltSpeed(node, params, speed);
      const L = len(node.id, params, node);
      const posM = (elapsed / 60) * vEff;
      const seg = node.segments ? segmentAtM(node.id, posM) : null;
      return {
        pathId: 'merged',
        pathColor: '#004E38',
        nodeId: node.id,
        nodeLabel: node.label,
        phase: 'transport',
        progressInNode: posM / L,
        positionM: posM,
        bandId: node.id,
        ...(seg ?? {}),
        retentionRemainingSec: 0,
        completedNodeIds: completed,
      };
    }
    if (tr > 0) {
      completed.push(node.id);
      elapsed -= tr;
    }
  }
  return {
    pathId: 'merged',
    pathColor: '#004E38',
    nodeId: 'done',
    nodeLabel: 'Salida prensa',
    phase: 'done',
    progressInNode: 1,
    positionM: 0,
    retentionRemainingSec: 0,
    completedNodeIds: [...completed, 'done'],
  };
}

export function resolvePathIds(injectionId) {
  return pathsForInjection(injectionId);
}

export function computeAllMarkers(tSec, speedMperMin, injectionId, params) {
  const pathIds = pathsForInjection(injectionId);
  const markers = [];
  const allCompleted = new Set();
  const mergedLayers = [];
  let pendingUpstream = 0;
  const downstreamStart = DOWNSTREAM_STAGE_IDS.includes(injectionId) && injectionId !== 'done'
    ? injectionId
    : null;

  for (const pathId of pathIds) {
    const m = tracePath(tSec, speedMperMin, pathId, params, pathIds, injectionId);
    if (!m) continue;
    for (const id of m.completedNodeIds ?? []) allCompleted.add(id);

    if (m.phase === 'merged') {
      mergedLayers.push(m);
      const pathMeta = PATHS[pathId];
      markers.push({
        pathId: m.pathId,
        pathColor: m.pathColor,
        nodeId: 'merge-point',
        nodeLabel: `${pathMeta?.label ?? pathId} · capa en colchón`,
        phase: 'colchon',
        progressInNode: 1,
        layerRow: pathMeta?.row ?? 'core',
        mergeElapsed: m.mergeElapsed ?? 0,
        completedNodeIds: m.completedNodeIds,
      });
    } else {
      pendingUpstream++;
      markers.push(m);
    }
  }

  // Banda blanca solo avanza cuando TODAS las capas han llegado (min de mergeElapsed
  // entre todas las rutas = tiempo desde que la última capa llegó).
  if (pendingUpstream === 0 && mergedLayers.length > 0) {
    const sinceAllMerged = Math.min(...mergedLayers.map((m) => m.mergeElapsed ?? 0));
    if (sinceAllMerged > 0 || downstreamStart) {
      const down = traceDownstream(sinceAllMerged, speedMperMin, params, downstreamStart);
      for (const id of down.completedNodeIds ?? []) allCompleted.add(id);
      markers.push(down);
      for (const m of markers) {
        if (m.phase === 'colchon') m.phase = 'colchon-done';
      }
    }
  }

  return {
    markers,
    pathIds,
    completedNodeIds: [...allCompleted],
    simulationTimeSec: tSec,
    speedMperMin,
  };
}

/** Time when the marker first reaches the start of a given stage (relativo a t=0 de inyección). */
export function arrivalTimeForStage(stageId, speedMperMin, params, injectionId) {
  // Sub-segmento o waypoint de banda downstream: 'white:point-iman', 'press:point:m19', 'red:zone-vapor'.
  if (typeof stageId === 'string' && stageId.includes(':')) {
    const bandId = stageId.slice(0, stageId.indexOf(':'));
    if (bandId === 'white' || bandId === 'red' || bandId === 'press') {
      const rest = stageId.slice(bandId.length + 1);
      const bandStart = arrivalTimeForStage(bandId, speedMperMin, params, injectionId);
      if (bandStart == null) return null;
      let atM = null;
      const wp = (bandWaypoints(bandId) ?? []).find((w) => w.id === rest);
      if (wp) atM = wp.atM;
      else {
        const seg = (bandSegmentsWithBounds(bandId) ?? []).find((s) => s.id === rest);
        if (seg) atM = seg.startM;
      }
      if (atM == null) return null;
      return bandStart + (speedMperMin > 0 ? (atM / speedMperMin) * 60 : 0);
    }
  }

  const pathIds = pathsForInjection(injectionId);

  if (DOWNSTREAM_STAGE_IDS.includes(injectionId)) {
    let t = 0;
    let started = injectionId === 'white';
    for (const node of DOWNSTREAM) {
      if (node.id === injectionId) started = true;
      if (!started) continue;
      if (node.id === stageId) return t;
      t += nodeTotalSec(node, speedMperMin, params);
    }
    if (stageId === 'done') return t;
    return null;
  }

  let minUpstream = Infinity;
  for (const pathId of pathIds) {
    const startId = startNodeForPath(injectionId, pathId);
    if (!startId) continue;
    const nodes = nodesForPath(pathId);
    let active = false;
    let t = 0;
    for (const node of nodes) {
      if (!active) {
        if (node.id === startId) active = true;
        else continue;
      }
      if (node.id === stageId) {
        minUpstream = Math.min(minUpstream, t);
        break;
      }
      t += nodeTotalSec(node, speedMperMin, params);
    }
  }
  if (minUpstream !== Infinity) return minUpstream;

  let preDownstream = 0;
  for (const pathId of pathIds) {
    const startId = startNodeForPath(injectionId, pathId);
    if (!startId) continue;
    const nodes = nodesForPath(pathId);
    let active = false;
    let t = 0;
    for (const node of nodes) {
      if (!active) {
        if (node.id === startId) active = true;
        else continue;
      }
      t += nodeTotalSec(node, speedMperMin, params);
    }
    preDownstream = Math.max(preDownstream, t);
  }

  let t = preDownstream;
  for (const node of DOWNSTREAM) {
    if (node.id === stageId) return t;
    t += nodeTotalSec(node, speedMperMin, params);
  }
  if (stageId === 'done') return t;
  return null;
}

/**
 * Desglose ordenado de etapas anteriores con su tiempo y la etapa misma.
 * Cada paso lleva tau, transport, buffer y total.
 */
export function breakdownToStage(stageId, speedMperMin, params, injectionId) {
  const pathIds = resolvePathIds(injectionId);

  function walk(nodes, untilId, fromT = 0) {
    const out = [];
    let t = fromT;
    for (const node of nodes) {
      const tau = tauForNode(node, params);
      const tr = transportForNode(node, speedMperMin, params);
      const buf = buffer(node.id, params);
      const L = len(node.id, params, node);
      const total = tau + tr + buf;
      if (node.id === untilId) {
        return { steps: out, arrivalT: t, atNode: node, stageT: total };
      }
      out.push({
        id: node.id,
        label: node.label,
        tauSec: tau,
        transportSec: tr,
        bufferSec: buf,
        lengthM: L,
        startsAt: t,
        contributesSec: total,
        flowSource: node.flowSource ?? null,
        model: node.model ?? null,
      });
      t += total;
    }
    return { steps: out, arrivalT: t, atNode: null, stageT: 0 };
  }

  for (const pathId of pathIds) {
    const nodes = nodesForPath(pathId);
    const has = nodes.some((n) => n.id === stageId);
    if (has) {
      const w = walk(nodes, stageId);
      return {
        pathLabel: PATHS[pathId]?.label ?? pathId,
        ...w,
        downstream: false,
      };
    }
  }

  // Pista downstream: el cambio tarda lo que tarda la ruta más lenta antes de la blanca.
  let preDownstream = 0;
  let slowestPath = pathIds[0];
  for (const pathId of pathIds) {
    const nodes = nodesForPath(pathId);
    let t = 0;
    for (const node of nodes) t += nodeTotalSec(node, speedMperMin, params);
    if (t >= preDownstream) {
      preDownstream = t;
      slowestPath = pathId;
    }
  }
  const slowNodes = nodesForPath(slowestPath);
  const upstream = walk(slowNodes, null);
  upstream.steps.forEach((s) => (s.fromPath = PATHS[slowestPath]?.label ?? slowestPath));

  const w = walk(DOWNSTREAM, stageId, preDownstream);
  w.steps.unshift(
    ...upstream.steps.map((s) => ({ ...s, isUpstream: true })),
  );
  return {
    pathLabel: 'Tramo común',
    ...w,
    downstream: true,
    slowestPathLabel: PATHS[slowestPath]?.label ?? slowestPath,
  };
}

export function totalTravelTimeSec(speedMperMin, params, injectionId) {
  const pathIds = pathsForInjection(injectionId);

  if (DOWNSTREAM_STAGE_IDS.includes(injectionId)) {
    let t = 0;
    let started = injectionId === 'white';
    for (const node of DOWNSTREAM) {
      if (node.id === injectionId) started = true;
      if (!started) continue;
      t += nodeTotalSec(node, speedMperMin, params);
    }
    return t;
  }

  let maxT = 0;
  for (const pathId of pathIds) {
    const startId = startNodeForPath(injectionId, pathId);
    if (!startId) continue;
    let active = false;
    let t = 0;
    for (const node of nodesForPath(pathId)) {
      if (!active) {
        if (node.id === startId) active = true;
        else continue;
      }
      t += nodeTotalSec(node, speedMperMin, params);
    }
    maxT = Math.max(maxT, t);
  }
  for (const node of DOWNSTREAM) {
    maxT += nodeTotalSec(node, speedMperMin, params);
  }
  return maxT;
}

// Re-export para que la UI describa cada nodo.
export { tauForNode, transportForNode, flowFor, nodeTotalSec, beltSpeed };
