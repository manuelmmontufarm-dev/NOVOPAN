#!/usr/bin/env python3
"""
NOVOPAN · Generador de CSV del HMI para pruebas de lectura en vivo.

Reescribe datos/hmi.csv cada N segundos (default 2 s, igual que el job real
de WinCC/SQL) oscilando un grupo de tags HMI alrededor de sus valores base.
El resto del documento (comentarios, orden, tags no listados) se conserva:
usa el hmi.csv existente como plantilla.

La escritura es ATÓMICA (archivo temporal + os.replace) para que el fetch
del simulador nunca lea un archivo a medio escribir — el job real de planta
debería escribir igual.

Uso:
  python3 scripts/hmi-csv-simulator.py \
      --path parte-2-aglomerados/deck/trazabilidad-total/datos/hmi.csv \
      [--interval 2] [--garble 0] [--cycles 0]

  --interval  segundos entre escrituras (default 2)
  --garble N  cada N ciclos escribe UNA vez un CSV malformado (prueba de
              resiliencia: el simulador debe conservar el último valor
              válido y avisar). 0 = nunca (default).
  --cycles N  termina tras N ciclos. 0 = infinito (Ctrl+C para salir).
"""
import argparse
import math
import os
import re
import sys
import tempfile
import time

# tag → (amplitud, periodo s). La base se lee del propio CSV plantilla.
OSCILLATE = {
    'V_PRENSA_M_MIN': (1.8, 60),
    'F_SL_KGMIN': (12.0, 50),
    'F_CL_KGMIN': (9.0, 65),
    'SILO1_L_PCT': (10.0, 80),
    'SILO2A_L_PCT': (8.0, 70),
    'BUNKER_L_PCT': (12.0, 55),
    'SILO5_L_PCT': (8.0, 90),
    'SILO6_L_PCT': (6.0, 75),
    'SILO5_FOUT_KGMIN': (20.0, 85),
    'SILO6_FOUT_KGMIN': (10.0, 95),
}


def read_base(template, tag):
    m = re.search(rf'(?m){re.escape(tag)}\s*:\s*([^;]*);', template)
    if not m:
        return None
    try:
        return float(m.group(1).strip().replace(',', '.'))
    except ValueError:
        return None


def render(template, bases, t):
    out = template
    for tag, (amp, period) in OSCILLATE.items():
        base = bases.get(tag)
        if base is None:
            continue
        val = round(base + amp * math.sin(2 * math.pi * t / period), 2)
        val = max(0.1, val)  # el parser ignora negativos; nunca los emitimos
        out = re.sub(rf'(?m)({re.escape(tag)}\s*:\s*)[^;]*;', rf'\g<1>{val};', out)
    return out


def atomic_write(path, text):
    d = os.path.dirname(os.path.abspath(path))
    fd, tmp = tempfile.mkstemp(dir=d, prefix='.hmi-', suffix='.tmp')
    try:
        with os.fdopen(fd, 'w', encoding='utf-8') as f:
            f.write(text)
        os.replace(tmp, path)
    finally:
        if os.path.exists(tmp):
            os.unlink(tmp)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--path', required=True, help='ruta del hmi.csv a reescribir')
    ap.add_argument('--interval', type=float, default=2.0)
    ap.add_argument('--garble', type=int, default=0)
    ap.add_argument('--cycles', type=int, default=0)
    args = ap.parse_args()

    with open(args.path, encoding='utf-8') as f:
        template = f.read()
    bases = {tag: read_base(template, tag) for tag in OSCILLATE}
    print(f'[hmi-sim] plantilla {args.path} · {sum(v is not None for v in bases.values())} tags oscilando '
          f'cada {args.interval} s' + (f' · basura cada {args.garble} ciclos' if args.garble else ''))

    t0 = time.time()
    n = 0
    while True:
        n += 1
        if args.garble and n % args.garble == 0:
            atomic_write(args.path, '@@@ CSV ROTO A PROPOSITO @@@\nsin separadores ni tags validos\n')
            print(f'[hmi-sim] ciclo {n}: CSV malformado (prueba de resiliencia)')
        else:
            text = render(template, bases, time.time() - t0)
            atomic_write(args.path, text)
            v = read_base(text, 'V_PRENSA_M_MIN')
            print(f'[hmi-sim] ciclo {n}: escrito · V_PRENSA={v}')
        if args.cycles and n >= args.cycles:
            break
        time.sleep(args.interval)


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(0)
