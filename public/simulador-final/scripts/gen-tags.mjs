#!/usr/bin/env node
/* Genera TAGS.md a partir del código y de los CSV reales.
   No se edita TAGS.md a mano: se corre `node scripts/gen-tags.mjs` desde
   simulador-final/. Así la lista nunca se desincroniza del parser. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TAG_MAP, WINCC_ALIAS, CSV_SOURCES } from '../js/hmi-csv.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

/* Qué servidor declara cada alias: se lee de los CSV que se despliegan, no de
   una tabla aparte — si IT mueve un tag de archivo, esto lo refleja solo. */
const serverOf = {};
for (const src of CSV_SOURCES) {
  let text;
  try { text = fs.readFileSync(path.join(root, src.file), 'utf8'); } catch { continue; }
  for (const line of text.split(/\r?\n/)) {
    if (/^\s*[#/]/.test(line)) continue;
    const m = line.match(/^\s*([A-Za-z0-9_.-]+)\s*:/);
    if (m) serverOf[m[1].toUpperCase()] = src.label;
  }
}

const aliasOf = {};
for (const [wincc, canon] of Object.entries(WINCC_ALIAS)) {
  (aliasOf[canon] ??= []).push(wincc);
}

const KIND_LABEL = {
  hmi: 'HMI · dato vivo',
  est: 'estimado',
  measured: 'medido en planta',
};

const rows = Object.entries(TAG_MAP).map(([tag, meta]) => ({
  tag,
  kind: meta.kind,
  unit: meta.unit,
  keys: meta.keys,
  alias: aliasOf[tag] ?? [],
  server: (aliasOf[tag] ?? []).map((a) => serverOf[a.toUpperCase()]).filter(Boolean)[0] ?? '',
}));

const counts = rows.reduce((a, r) => ((a[r.kind] = (a[r.kind] ?? 0) + 1), a), {});
const mapped = rows.filter((r) => r.alias.length).length;

const esc = (s) => String(s).replace(/\|/g, '\\|');
const out = [];
out.push('# Tags que consume el simulador');
out.push('');
out.push('> Archivo **generado**. No editar a mano — correr `node scripts/gen-tags.mjs`');
out.push('> desde `simulador-final/`. Sale de `TAG_MAP` + `WINCC_ALIAS` + los CSV desplegados.');
out.push('');
out.push(`**${rows.length} parámetros** · ${mapped} con tag real de WinCC ya cableado.`);
out.push('');
out.push('| Origen del dato | Cantidad | Qué significa |');
out.push('|---|---|---|');
out.push(`| HMI · dato vivo | ${counts.hmi ?? 0} | debería llegar del PLC vía CSV |`);
out.push(`| medido en planta | ${counts.measured ?? 0} | cinta métrica / plano — constante |`);
out.push(`| estimado | ${counts.est ?? 0} | supuesto del modelo, pendiente de confirmar |`);
out.push('');
out.push('## Archivos CSV que se leen');
out.push('');
out.push('En este orden; **el último gana** y toda colisión queda avisada en el pill de estado.');
out.push('');
out.push('| # | Archivo | Servidor |');
out.push('|---|---|---|');
CSV_SOURCES.forEach((s, i) => out.push(`| ${i + 1} | \`${s.file}\` | ${s.label} |`));
out.push('');

for (const [kind, title] of [
  ['hmi', 'Dato vivo del HMI'],
  ['measured', 'Medido en planta (constante)'],
  ['est', 'Estimado (pendiente de confirmar)'],
]) {
  const sub = rows.filter((r) => r.kind === kind);
  out.push(`## ${title} — ${sub.length}`);
  out.push('');
  out.push('| Tag del CSV | Unidad | Tag real de WinCC | Servidor | Clave(s) del modelo |');
  out.push('|---|---|---|---|---|');
  for (const r of sub) {
    out.push(`| \`${r.tag}\` | ${esc(r.unit)} | ${r.alias.length ? r.alias.map((a) => `\`${a}\``).join('<br>') : '—'} | ${r.server || '—'} | ${r.keys.map((k) => `\`${k}\``).join('<br>')} |`);
  }
  out.push('');
}

fs.writeFileSync(path.join(root, 'TAGS.md'), out.join('\n'));
console.log(`TAGS.md · ${rows.length} parámetros · ${mapped} con alias WinCC · ${KIND_LABEL.hmi}: ${counts.hmi}`);
