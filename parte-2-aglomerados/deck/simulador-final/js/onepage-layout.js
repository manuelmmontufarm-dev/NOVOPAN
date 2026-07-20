/* ============================================================
   NOVOPAN · Sección 2 — layout de UNA PANTALLA (sin scroll)
   ------------------------------------------------------------
   Recompone el SVG existente en filas apiladas:
     [Sección 1 wireframe — solo si el toggle está encendido]
     [0 · Silos / dosificación / encolado]
     [Línea 0 → 47.6 m  (2A + 2B)]
     [Línea 47.6 → 92 m (2C + 2D + 2E)]
   No toca la simulación: la fila 2 muestra el grupo original
   (recortado) y la fila 3 es un <use> recortado del mismo grupo,
   así los trazadores/colchón se ven en ambas filas sin cambios
   en combined-app.js. Los clics de la fila 3 se re-mapean por
   coordenadas al equipo original.
   ============================================================ */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var svg = document.getElementById('lineCanvas');
  var anim = document.getElementById('section2Animated');
  var intake = document.getElementById('section2Intake');
  var wf = document.getElementById('part1Wireframe');
  var bridges = document.getElementById('aerialBridges');
  var preTracers = document.getElementById('preTracers');
  if (!svg || !anim || !intake) return;

  // combined-app.js es un módulo con imports: puede evaluarse DESPUÉS de este
  // script. Espera a que haya pintado la regla/anotaciones antes de recomponer.
  function whenReady(fn, tries) {
    var wp = document.getElementById('rulerLabels');
    if (wp && wp.childNodes.length) { fn(); return; }
    if ((tries || 0) > 100) { fn(); return; }
    setTimeout(function () { whenReady(fn, (tries || 0) + 1); }, 50);
  }
  whenReady(init);
  function init() {

  // ── constantes (coordenadas LOCALES del grupo animado: x = 80 + 70·m) ──
  var L0 = 40;        // borde izq. visible (tambor en x=86)
  var CUT = 3212;     // corte al final de la banda azul (45 m = x 3230): el tambor y la nariz quedan enteros en la fila 2
  var L1 = 6620;      // borde derecho (incluye sensores a 88.4 m + panel)
  var S = 0.78;       // escala relativa de las filas intake / wireframe
  var BAND_H = 572;   // alto de cada fila de línea (incluye regla + anotaciones)
  var GAP = 10;
  var STRIP_H = 262;  // alto de la franja de silos/dosificación (dibujada a escala 1:1)
  var b1Y = 0, b2Y = 0, iY = 0; // se calculan en compose()

  function el(tag, attrs) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }

  // ── 1) Quitar el translate(1900 0) del grupo animado y envolverlo ──
  anim.removeAttribute('transform');
  var band1 = el('g', { id: 'bandL1' });
  anim.parentNode.insertBefore(band1, anim);
  band1.appendChild(anim);

  // defs + clips
  var defs = svg.querySelector('defs') || svg.insertBefore(el('defs', {}), svg.firstChild);
  var clipA = el('clipPath', { id: 'opClipB1', clipPathUnits: 'userSpaceOnUse' });
  clipA.appendChild(el('rect', { x: L0, y: -4, width: CUT - L0, height: BAND_H + 8 }));
  var clipB = el('clipPath', { id: 'opClipB2', clipPathUnits: 'userSpaceOnUse' });
  clipB.appendChild(el('rect', { x: CUT, y: -4, width: L1 - CUT, height: BAND_H + 8 }));
  defs.appendChild(clipA); defs.appendChild(clipB);

  band1.setAttribute('clip-path', 'url(#opClipB1)');
  if (bridges) bridges.style.display = 'none'; // los puentes aéreos cruzan filas: fuera en una pantalla

  // fila 3: instancia recortada del MISMO grupo (trazadores incluidos)
  var band2 = el('use', { id: 'bandL2', 'clip-path': 'url(#opClipB2)' });
  band2.setAttribute('href', '#section2Animated');
  band2.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#section2Animated');
  band2.style.cursor = 'pointer';
  band1.parentNode.insertBefore(band2, band1.nextSibling);

  // rótulos de continuación entre filas
  var joins = el('g', {
    id: 'opJoins',
    'font-family': "'Barlow Semi Condensed',sans-serif",
    'font-weight': '800', 'font-size': '20', fill: '#676E69',
  });
  svg.appendChild(joins);

  // ── 2) Composición + viewBox: O Sección 2 O Sección 1, nunca apiladas ──
  // Vista S2 (default): franja de silos/dosificación + DOS filas de línea
  // (0→45 y 45→92 m). Vista S1 (flecha ←): el wireframe de preparación a
  // PANTALLA COMPLETA. Se cambia con las flechas, sin deslizamiento.
  var s1View = false;
  var wfOX = 0, wfOY = 0;   // offsets de la vista S1 (para mapear tracers P1)
  function sec1On() { return !document.documentElement.classList.contains('sec1-off'); }

  function compose() {
    if (!sec1On()) s1View = false;           // apagada ⇒ solo existe la S2
    document.body.classList.toggle('s1-view', s1View);
    if (s1View) composeS1(); else composeS2();
    updateArrows();
    refreshPreTracers();
  }

  // Sección 1 a pantalla completa: solo el wireframe, ajustado al viewBox.
  function composeS1() {
    [intake, band1, band2, joins].forEach(function (g) { if (g) g.style.display = 'none'; });
    wf.style.visibility = 'visible';
    wf.removeAttribute('transform');
    var bb = wf.getBBox();
    wfOX = 8 - bb.x; wfOY = 8 - bb.y;
    wf.setAttribute('transform', 'translate(' + wfOX + ' ' + wfOY + ')');
    svg.setAttribute('viewBox', '0 0 ' + (bb.width + 16) + ' ' + (bb.height + 16));
    svg.removeAttribute('width');
    svg.removeAttribute('height');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.style.width = '100%';
    svg.style.height = '100%';
    document.body.classList.remove('sec1-on');
  }

  function composeS2() {
    if (wf) wf.style.visibility = 'hidden';   // la S1 solo se ve en su vista
    [intake, band1, band2, joins].forEach(function (g) { if (g) g.style.display = ''; });
    iY = 0;
    b1Y = iY + STRIP_H + GAP;
    b2Y = b1Y + BAND_H + GAP + 10;
    intake.setAttribute('transform', 'translate(30 ' + iY + ')');
    band1.setAttribute('transform', 'translate(' + (-L0) + ' ' + b1Y + ')');
    band2.setAttribute('transform', 'translate(' + (-CUT) + ' ' + b2Y + ')');
    var W = Math.max(CUT - L0, L1 - CUT) + 10;
    var H = b2Y + BAND_H + 6;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.removeAttribute('width');
    svg.removeAttribute('height');
    svg.setAttribute('preserveAspectRatio', 'xMidYMin meet');
    svg.style.width = '100%';
    svg.style.height = '100%';
    document.body.classList.remove('sec1-on');
    // rótulos de continuación + separadores finos entre filas
    joins.textContent = '';
    var mCut = ((CUT - 80) / 70).toFixed(0);
    joins.appendChild(el('line', { x1: 30, y1: b1Y - 8, x2: W - 30, y2: b1Y - 8, stroke: '#D9DDD9', 'stroke-width': 2 }));
    joins.appendChild(el('line', { x1: 30, y1: b2Y - 14, x2: W - 30, y2: b2Y - 14, stroke: '#D9DDD9', 'stroke-width': 2 }));
    // conectores banda inclinada → esparcidor (tocan el cabezal que alimentan)
    var SL1x = 544 - L0, CLx = 1140 - L0 + 40, SL2x = 1638 - L0;
    var e1x = 1480, e2x = 3140, ey = iY + 78;
    function connector(d, color) {
      joins.appendChild(el('path', { d: d, fill: 'none', stroke: color, 'stroke-width': 3.5, 'stroke-dasharray': '10 8', 'stroke-linejoin': 'round', opacity: '0.9' }));
    }
    function tip(x, y, color) {
      joins.appendChild(el('polygon', { points: (x - 9) + ',' + (y - 14) + ' ' + (x + 9) + ',' + (y - 14) + ' ' + x + ',' + y, fill: color }));
    }
    // FINA: tronco que baja y se reparte a SL1 (izq) y SL2 (der)
    connector('M ' + e1x + ' ' + ey + ' V ' + (iY + 240) + ' H ' + SL1x + ' V ' + (b1Y + 42), '#1565C0');
    tip(SL1x, b1Y + 56, '#1565C0');
    connector('M ' + e1x + ' ' + (iY + 240) + ' H ' + SL2x + ' V ' + (b1Y + 42), '#1565C0');
    tip(SL2x, b1Y + 56, '#1565C0');
    // GRUESA → CL
    connector('M ' + e2x + ' ' + ey + ' V ' + (iY + 258) + ' H ' + CLx + ' V ' + (b1Y + 42), '#0A7D5A');
    tip(CLx, b1Y + 56, '#0A7D5A');
    var t1 = el('text', { x: CUT - L0 - 14, y: b1Y + 452, 'text-anchor': 'end', fill: '#676E69' });
    t1.textContent = mCut + ' m · LA BANDA CONTINÚA ABAJO ↓';
    var t2 = el('text', { x: 14, y: b2Y + 452, fill: '#676E69' });
    t2.textContent = '↑ VIENE DE ' + mCut + ' m';
    joins.appendChild(t1); joins.appendChild(t2);
  }

  // ── 3) Clics en la fila 3 (<use>) → re-despachar al equipo original ──
  var hitRects = null;
  function buildHitRects() {
    hitRects = [];
    anim.querySelectorAll('[data-inject-m]').forEach(function (node) {
      try {
        var bb = node.getBBox();
        var tx = 0, ty = 0;
        var m = /translate\(\s*([-\d.]+)[ ,]+([-\d.]+)?/.exec(node.getAttribute('transform') || '');
        if (m) { tx = parseFloat(m[1]) || 0; ty = parseFloat(m[2]) || 0; }
        hitRects.push({ node: node, x: bb.x + tx, y: bb.y + ty, w: bb.width, h: bb.height });
      } catch (e) { /* nodo sin render */ }
    });
  }
  band2.addEventListener('click', function (e) {
    if (!hitRects) buildHitRects();
    var pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    var p = pt.matrixTransform(svg.getScreenCTM().inverse());
    var lx = p.x + CUT, ly = p.y - b2Y;   // composed → local del grupo animado
    var best = null, bestD = 1e9;
    hitRects.forEach(function (r) {
      if (r.x + r.w < CUT - 10) return;   // solo equipos de la fila 3
      var dx = Math.max(r.x - lx, 0, lx - (r.x + r.w));
      var dy = Math.max(r.y - ly, 0, ly - (r.y + r.h));
      var d = Math.hypot(dx, dy);
      if (d < bestD) { bestD = d; best = r.node; }
    });
    if (best && bestD < 40) {
      best.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    }
  });

  // ── 4) Trazadores upstream (#preTracers) → re-mapeo por fila ──
  // La franja de silos ya vive en coordenadas de la fila superior (identidad +
  // desplazamiento); el wireframe P1 se re-mapea a su banda escalada.
  var lastWritten = new WeakMap();
  function mapPreTransform(node) {
    var m = /translate\(\s*([-\d.]+)[ ,]+([-\d.]+)\s*\)/.exec(node.getAttribute('transform') || '');
    if (!m) return;
    var x = parseFloat(m[1]), y = parseFloat(m[2]);
    // Región del wireframe P1 (coords globales negativas) vs franja de silos.
    // Cada tracer solo se ve en SU vista: los de la S1 en la vista S1 y los
    // de la franja de entrada en la vista S2.
    var inWf = x < -60;
    var visible = inWf ? (s1View && sec1On()) : !s1View;
    node.style.visibility = visible ? '' : 'hidden';
    var cx, cy, sc;
    if (inWf) {
      cx = wfOX + (x + 2160); cy = wfOY + (y - 18); sc = 1;
    } else {
      cx = 30 + Math.max(x, -20); cy = iY + y; sc = 1;
    }
    var val = 'translate(' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ') scale(' + sc + ')';
    if (lastWritten.get(node) === val) return;
    lastWritten.set(node, val);
    node.setAttribute('transform', val);
  }

  // Re-mapea todos los tracers P1 vivos al cambiar de vista.
  function refreshPreTracers() {
    if (!preTracers) return;
    preTracers.querySelectorAll('.p1-tracer').forEach(function (g) {
      lastWritten.delete(g);
      mapPreTransform(g);
    });
  }
  if (preTracers) {
    new MutationObserver(function (muts) {
      muts.forEach(function (mu) {
        var t = mu.target;
        if (t.nodeType !== 1) return;
        var g = t.closest ? t.closest('.p1-tracer') : null;
        if (!g) return;
        if (lastWritten.get(g) === g.getAttribute('transform')) return;
        mapPreTransform(g);
      });
    }).observe(preTracers, { subtree: true, childList: true, attributes: true, attributeFilter: ['transform'] });
  }

  // ── 5) Agrandar rótulos (el lienzo completo se ve a ~60%: los textos
  //       se escalan al alza para quedar legibles en pantalla) ──
  function scaleGroupAbout(nodes, cx, cy, f) {
    if (!nodes.length) return;
    var wrap = el('g', { transform: 'translate(' + cx + ' ' + cy + ') scale(' + f + ') translate(' + (-cx) + ' ' + (-cy) + ')' });
    var parent = nodes[0].parentNode;
    parent.insertBefore(wrap, nodes[0]);
    nodes.forEach(function (n) { wrap.appendChild(n); });
  }
  function boostPlate(rect, f) {
    f = parseFloat(rect.getAttribute('data-boost')) || f;
    var group = [rect];
    var n = rect.nextElementSibling;
    while (n && n.tagName === 'text') { group.push(n); n = n.nextElementSibling; }
    if (group.length < 2) return;
    var x = parseFloat(rect.getAttribute('x') || 0), y = parseFloat(rect.getAttribute('y') || 0);
    var w = parseFloat(rect.getAttribute('width') || 0), h = parseFloat(rect.getAttribute('height') || 0);
    scaleGroupAbout(group, x + w / 2, y + h / 2, f);
  }
  function boostLabels() {
    // placas blancas / amarillas de máquinas (línea) y del intake
    anim.querySelectorAll('rect[fill="#FFFFFF"], rect[fill="#FFDE00"]').forEach(function (r) {
      if (r.hasAttribute('data-noboost')) return;
      if (parseFloat(r.getAttribute('width') || 0) > 300) { boostPlate(r, 1.25); return; }
      boostPlate(r, 1.7);
    });
    // cintas de zona 2A–2E (rx=13) — ya se recogen arriba solo si fill blanco; estas son de color
    anim.querySelectorAll('g > rect[rx="13"]').forEach(function (r) {
      if ((r.getAttribute('fill') || '').toUpperCase() === '#FFFFFF') return;
      boostPlate(r, 1.4);
    });
    // textos sueltos de la línea (IMÁN, BANDA BLANCA, TABLERO POST-PRENSA…)
    anim.querySelectorAll(':scope > text').forEach(function (t) {
      var fs = parseFloat(t.getAttribute('font-size') || 0);
      if (fs && fs <= 12) t.setAttribute('font-size', (fs * 1.5).toFixed(1));
    });
    // regla y anotaciones (generadas por combined-app antes de este script)
    var rl = document.getElementById('rulerLabels');
    if (rl) rl.setAttribute('font-size', '17');
    document.querySelectorAll('#distSegments text').forEach(function (t) { t.setAttribute('font-size', '13'); });
    document.querySelectorAll('#distWaypoints text').forEach(function (t) {
      var fs = parseFloat(t.getAttribute('font-size') || 9);
      t.setAttribute('font-size', fs >= 9 ? '15' : '12');
    });
    // la franja de silos/dosificación ya está dibujada con tipografía final
  }

  // ── Flechas de navegación S1 ⇄ S2 ──
  // La flecha ← lleva a la Sección 1 a pantalla completa; la flecha → vuelve
  // a la Sección 2. Sin slide: cambio directo. La flecha a S1 SOLO existe con
  // la Sección 1 encendida, y ninguna se muestra en la pestaña Parámetros.
  var toS1 = null, toS2 = null;
  function updateArrows() {
    if (!toS1) return;
    var canvasEl = document.getElementById('canvasScroll');
    var lineaVisible = canvasEl && !canvasEl.classList.contains('is-hidden');
    toS1.style.display = (sec1On() && !s1View && lineaVisible) ? 'flex' : 'none';
    toS2.style.display = (sec1On() && s1View && lineaVisible) ? 'flex' : 'none';
  }
  function makeArrow(id, cls, icon, label, title) {
    var b = document.createElement('button');
    b.type = 'button';
    b.id = id;
    b.className = 'op-nav-arrow ' + cls;
    b.title = title;
    b.setAttribute('aria-label', title);
    b.innerHTML = '<span class="ms">' + icon + '</span><span>' + label + '</span>';
    b.style.display = 'none';
    document.body.appendChild(b);
    return b;
  }

  // ── arranque ──
  boostLabels();
  toS1 = makeArrow('toS1Arrow', 'op-nav-arrow--left', 'arrow_back', 'Sección 1', 'Ver la Sección 1 · preparación (pantalla completa)');
  toS2 = makeArrow('toS2Arrow', 'op-nav-arrow--right', 'arrow_forward', 'Sección 2', 'Volver a la Sección 2 · formación → tablero');
  toS1.addEventListener('click', function () { s1View = true; compose(); });
  toS2.addEventListener('click', function () { s1View = false; compose(); });
  document.addEventListener('keydown', function (e) {
    if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName || '')) return;
    if (!sec1On()) return;
    var canvasEl = document.getElementById('canvasScroll');
    if (!canvasEl || canvasEl.classList.contains('is-hidden')) return;
    if (e.key === 'ArrowLeft' && !s1View) { s1View = true; compose(); }
    else if (e.key === 'ArrowRight' && s1View) { s1View = false; compose(); }
  });
  // Las pestañas Línea/Parámetros deciden si las flechas se ven.
  ['tabLinea', 'tabParams'].forEach(function (id) {
    document.getElementById(id)?.addEventListener('click', function () { setTimeout(updateArrows, 0); });
  });
  compose();
  var toggle = document.getElementById('sec1Toggle');
  if (toggle) toggle.addEventListener('change', function () { setTimeout(compose, 0); });
  document.body.classList.add('onepage');
  }
})();
