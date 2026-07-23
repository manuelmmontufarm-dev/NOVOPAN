/* ============================================================
   NOVOPAN · Línea 1 — Generador de PDF de reportes (sin dependencias)
   ------------------------------------------------------------
   Arma un PDF de SOLO TEXTO a mano (fuente Courier, que todo visor
   trae incrustada → cero fuentes que embeber) para que el operador
   pueda «Descargar PDF» de un cambio o de todo el reporte y guardarlo
   antes de resetear. Nada de librerías: el simulador es estático.

   Courier es monoespaciada → el ajuste de línea es exacto por conteo
   de caracteres. Texto en WinAnsi (Windows-1252) para que los acentos
   del español salgan bien; los símbolos que WinAnsi no tiene (→ ≈ τ …)
   se traducen a equivalentes ASCII ANTES de codificar.
   ============================================================ */

const PT = 10;            // tamaño de fuente
const LEAD = 13.5;        // interlineado
const MARGIN = 48;        // margen (pt)
const PAGE_W = 612;       // Carta (8.5")
const PAGE_H = 792;       // Carta (11")
const CHAR_W = PT * 0.6;  // ancho de glifo Courier = 0.6 em
const MAX_CHARS = Math.floor((PAGE_W - MARGIN * 2) / CHAR_W);        // ~84
const LINES_PER_PAGE = Math.floor((PAGE_H - MARGIN * 2) / LEAD);     // ~51

/* Símbolos frecuentes en los reportes que WinAnsi no cubre → ASCII seguro. */
const SUBS = [
  [/→/g, '->'], [/←/g, '<-'], [/≈/g, '~'], [/≥/g, '>='], [/≤/g, '<='],
  [/τ/g, 'tau'], [/ρ/g, 'rho'], [/·/g, '*'], [/—/g, '-'], [/–/g, '-'],
  [/…/g, '...'], [/✓/g, 'OK'], [/✔/g, 'OK'], [/✖/g, 'X'], [/✗/g, 'X'],
  [/⚠/g, '!'], [/●/g, '*'], [/°/g, ' grados'], [/²/g, '2'], [/³/g, '3'],
];
function toAsciiSafe(s) {
  let out = String(s ?? '');
  for (const [re, rep] of SUBS) out = out.replace(re, rep);
  return out;
}

/* String (ya ASCII-seguro) → bytes WinAnsi. Latin-1 (0x20-0x7E, 0xA0-0xFF)
   cubre los acentos; cualquier cosa fuera de rango cae a '?'. */
function winAnsiBytes(s) {
  const out = [];
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c >= 0x20 && c <= 0x7e) out.push(c);          // ASCII imprimible
    else if (c >= 0xa0 && c <= 0xff) out.push(c);     // Latin-1 (á é í ó ú ñ ü ª º …)
    else out.push(0x3f);                              // '?'
  }
  return out;
}

/* Escapa ( ) \ que en PDF delimitan cadenas de texto. */
function escapePdf(s) {
  return s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

/* Ajuste de línea a MAX_CHARS respetando palabras; una palabra más larga que
   el ancho se corta en seco (una ruta o un id no debe romper el documento). */
function wrapLine(line, max = MAX_CHARS) {
  const raw = toAsciiSafe(line).replace(/\t/g, '    ');
  if (raw.length <= max) return [raw];
  const words = raw.split(/(\s+)/); // conserva los espacios
  const rows = [];
  let cur = '';
  for (const w of words) {
    if ((cur + w).length <= max) { cur += w; continue; }
    if (cur.trim()) rows.push(cur.replace(/\s+$/, ''));
    if (w.length > max) {                 // palabra gigante: cortar duro
      let rest = w;
      while (rest.length > max) { rows.push(rest.slice(0, max)); rest = rest.slice(max); }
      cur = rest;
    } else {
      cur = w.replace(/^\s+/, '');
    }
  }
  if (cur.trim()) rows.push(cur.replace(/\s+$/, ''));
  return rows.length ? rows : [''];
}

function paginate(lines) {
  const wrapped = [];
  for (const l of lines) for (const r of wrapLine(l)) wrapped.push(r);
  const pages = [];
  for (let i = 0; i < wrapped.length; i += LINES_PER_PAGE) {
    pages.push(wrapped.slice(i, i + LINES_PER_PAGE));
  }
  return pages.length ? pages : [['']];
}

/* Array de líneas de texto → Blob PDF. */
export function textLinesToPdfBlob(lines) {
  const pages = paginate(lines);
  const bytes = [];
  const offsets = {};
  const putAscii = (s) => { for (let i = 0; i < s.length; i++) bytes.push(s.charCodeAt(i) & 0xff); };
  const putBytes = (arr) => { for (const b of arr) bytes.push(b); };
  const obj = (n) => { offsets[n] = bytes.length; putAscii(`${n} 0 obj\n`); };

  putAscii('%PDF-1.4\n');
  putBytes([0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a]); // comentario binario

  const FONT_OBJ = 3;
  // numeración: 1 catálogo · 2 pages · 3 fuente · luego (page,content) por página
  const pageNum = (i) => 4 + i * 2;
  const contentNum = (i) => 5 + i * 2;

  obj(1); putAscii('<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

  const kids = pages.map((_, i) => `${pageNum(i)} 0 R`).join(' ');
  obj(2); putAscii(`<< /Type /Pages /Kids [ ${kids} ] /Count ${pages.length} >>\nendobj\n`);

  obj(FONT_OBJ);
  putAscii('<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>\nendobj\n');

  pages.forEach((pageLines, i) => {
    obj(pageNum(i));
    putAscii(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] `
      + `/Resources << /Font << /F1 ${FONT_OBJ} 0 R >> >> /Contents ${contentNum(i)} 0 R >>\nendobj\n`);

    // stream de contenido (posiciona el cursor y baja LEAD por línea con T*)
    const cs = [];
    const csAscii = (s) => { for (let k = 0; k < s.length; k++) cs.push(s.charCodeAt(k) & 0xff); };
    csAscii(`BT /F1 ${PT} Tf ${LEAD} TL ${MARGIN} ${PAGE_H - MARGIN} Td\n`);
    for (const line of pageLines) {
      csAscii('(');
      putBytesInto(cs, winAnsiBytes(escapePdf(line)));
      csAscii(') Tj T*\n');
    }
    csAscii('ET');

    obj(contentNum(i));
    putAscii(`<< /Length ${cs.length} >>\nstream\n`);
    putBytes(cs);
    putAscii('\nendstream\nendobj\n');
  });

  // tabla xref
  const xrefOffset = bytes.length;
  const total = 4 + pages.length * 2; // objetos 1..(3 + 2*pages); +1 por el 0
  putAscii(`xref\n0 ${total}\n`);
  putAscii('0000000000 65535 f \n');
  for (let n = 1; n < total; n++) {
    const off = offsets[n] ?? 0;
    putAscii(`${String(off).padStart(10, '0')} 00000 n \n`);
  }
  putAscii(`trailer\n<< /Size ${total} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

  return new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
}

function putBytesInto(arr, src) { for (const b of src) arr.push(b); }

/* Descarga directa de un PDF de texto. */
export function downloadTextPdf(filename, lines) {
  const blob = textLinesToPdfBlob(lines);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
