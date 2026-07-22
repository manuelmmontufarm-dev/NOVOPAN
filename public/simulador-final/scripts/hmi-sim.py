#!/usr/bin/env python3
"""
NOVOPAN · Línea 1 — generador de CSV EN VIVO para ver el simulador en acción.

Escribe `datos/hmi-sistemas.csv` cada N segundos (10 por defecto) en el MISMO
formato que manda Sistemas desde el Historian SQL:

    Datetime,Tagname,Value
    7/22/2026 14:03,H_PressSpeed_PV,14.77

O sea: no es un formato de mentira hecho para la demo, es el contrato real
congelado en `datos/fixtures/sistemas-historian.csv`. Lo que se prueba aquí es
exactamente el camino que va a correr en planta — sniffer → perfil `tabla` →
normalizador → modelo — incluida la columna `Datetime`, que es de donde el
widget de la cabecera saca "de cuándo es el dato".

    python3 scripts/hmi-sim.py                 # cada 10 s, oscilación normal
    python3 scripts/hmi-sim.py --interval 2    # ritmo real del HMI de planta
    python3 scripts/hmi-sim.py --paro silo6    # simula un silo DETENIDO (F=0)
    python3 scripts/hmi-sim.py --basura 6      # cada 6 ciclos, un CSV ilegible

La escritura es ATÓMICA (temporal + os.replace): el navegador nunca lee un
archivo a medio escribir. El job real de planta debería escribir igual.

Ctrl+C para salir; el archivo generado queda fuera de git (.gitignore).
"""
import argparse
import math
import os
import random
import signal
import sys
import tempfile
import time
from datetime import datetime, timedelta, timezone

# El servidor de planta estampa hora de Quito (UTC−5 todo el año).
QUITO = timezone(timedelta(hours=-5))

AQUI = os.path.dirname(os.path.abspath(__file__))
DECK = os.path.dirname(AQUI)
DESTINO = os.path.join(DECK, 'datos', 'hmi-sistemas.csv')

# tag → (base, amplitud, periodo s). La base sale del contrato real.
# Solo oscilan los que se ven moverse en pantalla; el resto va constante para
# que un cambio en la pantalla se pueda atribuir a un tag concreto.
TAGS = {
    # velocidad de prensa: manda el recorrido aguas abajo
    'H_PressSpeed_PV':                  (14.77, 1.20, 97),
    'H_FL_FormConv_Speed_PV':           (14.77, 1.20, 97),
    # flujos y niveles de los silos finales (τ_silo = ρ·V·L% / F × 60)
    '066_C_Dry_Material_CL_discharge':  (17273.0, 2600.0, 71),   # kg/h → CL (silo 5)
    '066_C_Dry_Material_CL_Level':      (52.8, 7.0, 143),
    '066_C_Dry_Material_SL_discharge':  (3802.0, 900.0, 89),     # kg/h → SL (silo 6)
    '066_C_Dry_Material_SL_Level':      (35.8, 6.0, 127),
    # dosificadoras
    'F_CL_DosBin_Weight_PV':            (44.17, 6.0, 53),
    'F_SL_DosBin_Weight_PV':            (35.15, 5.0, 61),
    'F_CL_FlakeDens_PV':                (125.40, 6.0, 181),
    'F_SL_FlakeDens_PV':                (154.82, 7.0, 167),
    'F_SL_FlakeFlow_PV':                (96.79, 11.0, 79),
    'H_CL_Total_Flakes':                (292.76, 24.0, 83),
    # receta / calidad
    'H_Act_MatWeight_SP':               (11.60, 0.25, 211),
    'H_Act_SL1_SP':                     (47.00, 1.50, 233),
    'H_Moisure_PV':                     (12.99, 0.60, 149),
    'H_MaterialFlow_TonsPerHour':       (25.27, 2.20, 107),
}

# Tags constantes del contrato: van igual que en el archivo real. Se incluyen
# a propósito para que el simulador siga viendo el archivo COMPLETO (incluidos
# los 21 tags que todavía no están mapeados, que deben seguir dando un solo
# aviso agregado y no romper nada).
CONSTANTES = {
    'F_CL_DosBin_Speed_SP': 6.181257248,
    'F_SL_DosBin_Speed_SP': 2.757644415,
    'F_CL_Filling_PV': 39.51099396,
    'F_SL_Filling_PV': 53.63136673,
    'F_CL_FlakeFlow_PV': 273.1824341,
    'H_CC_Filling_PV': 58.8409996,
    'H_SL1_Filling_PV': 62.71699905,
    'H_SL2_Filling_PV': 60.81399918,
    'H_Empty_ON': 0,
    'H_PP_Lower_Speed_PV': 0,
    'H_PP_Upper_Speed_PV': 0,
    'H_TrimSaw_Width': 2526.626709,
    'IMAN_AUTO': 1,
    'P_Act_LineSpeed_SP': 14.30000019,
    'Q_Act_FinalThickness': 18,
    'Q_Act_PanelAmount': 30000,
    'Q_Act_PanelLength': 2150,
    'Q_Act_PanelWidth': 2440,
}

# --paro <equipo> → qué tag se clava en 0. Un flujo en 0 NO es un dato roto:
# es la máquina parada, y el simulador debe mostrar «PARO», no «0 s».
PAROS = {
    'silo5': ['066_C_Dry_Material_CL_discharge'],
    'silo6': ['066_C_Dry_Material_SL_discharge'],
    'silos': ['066_C_Dry_Material_CL_discharge', '066_C_Dry_Material_SL_discharge'],
    'prensa': ['H_PressSpeed_PV', 'H_FL_FormConv_Speed_PV'],
}


def sello(momento, con_segundos=True):
    """Fecha del Historian: M/D/YYYY HH:MM[:SS], sin ceros a la izquierda en la fecha.

    El archivo real del 22-jul llegó con resolución de MINUTO. Aquí se escriben
    segundos por defecto porque el generador reescribe cada 10 s: sin segundos,
    el widget de frescura mostraría el mismo instante durante un minuto entero
    y parecería congelado cuando en realidad el archivo sí cambió. El parser
    acepta los dos formatos; `--formato-minuto` reproduce el contrato literal.
    """
    base = f'{momento.month}/{momento.day}/{momento.year} {momento.hour:02d}:{momento.minute:02d}'
    return f'{base}:{momento.second:02d}' if con_segundos else base


def render(t, ahora, parados, con_segundos=True):
    filas = ['Datetime,Tagname,Value']
    marca = sello(ahora, con_segundos)
    for tag, (base, amp, periodo) in TAGS.items():
        if tag in parados:
            valor = 0.0
        else:
            # seno + un poco de ruido: dos ciclos seguidos nunca son idénticos,
            # así se ve que el archivo de verdad cambió y no quedó pegado.
            valor = base + amp * math.sin(2 * math.pi * t / periodo) + random.uniform(-amp, amp) * 0.06
            valor = max(0.01, valor)
        filas.append(f'{marca},{tag},{valor:.6f}')
    for tag, valor in CONSTANTES.items():
        filas.append(f'{marca},{tag},{valor}')
    return '\n'.join(filas) + '\n'


def escribir_atomico(ruta, texto):
    carpeta = os.path.dirname(ruta)
    fd, tmp = tempfile.mkstemp(dir=carpeta, prefix='.hmi-', suffix='.tmp')
    try:
        with os.fdopen(fd, 'w', encoding='utf-8') as f:
            f.write(texto)
        os.replace(tmp, ruta)
    finally:
        if os.path.exists(tmp):
            os.unlink(tmp)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--path', default=DESTINO, help=f'CSV a reescribir (default: {DESTINO})')
    ap.add_argument('--interval', type=float, default=10.0, help='segundos entre escrituras (default 10)')
    ap.add_argument('--paro', choices=sorted(PAROS), help='deja un equipo con flujo 0 (prueba del estado PARO)')
    ap.add_argument('--basura', type=int, default=0, help='cada N ciclos escribe un CSV ilegible (prueba de resiliencia)')
    ap.add_argument('--formato-minuto', action='store_true', help='Datetime sin segundos, igual que el archivo real del 22-jul')
    ap.add_argument('--ciclos', type=int, default=0, help='termina tras N ciclos (0 = infinito)')
    args = ap.parse_args()

    parados = set(PAROS.get(args.paro, []))
    os.makedirs(os.path.dirname(os.path.abspath(args.path)), exist_ok=True)
    print(f'[hmi-sim] escribiendo {args.path}')
    print(f'[hmi-sim] cada {args.interval:g} s · {len(TAGS)} tags oscilando + {len(CONSTANTES)} constantes'
          + (f' · PARO en {args.paro} ({", ".join(sorted(parados))})' if parados else '')
          + (f' · basura cada {args.basura} ciclos' if args.basura else ''))
    print('[hmi-sim] Ctrl+C para parar')

    t0 = time.time()
    n = 0
    while True:
        n += 1
        if args.basura and n % args.basura == 0:
            escribir_atomico(args.path, '@@@ CSV ROTO A PROPOSITO @@@\nsin columnas ni tags validos\n')
            print(f'[hmi-sim] ciclo {n}: CSV ilegible (el simulador debe conservar el último bueno y avisar)')
        else:
            ahora = datetime.now(QUITO)
            texto = render(time.time() - t0, ahora, parados, not args.formato_minuto)
            escribir_atomico(args.path, texto)
            v = texto.split('H_PressSpeed_PV,')[1].split('\n')[0]
            print(f'[hmi-sim] ciclo {n}: {sello(ahora, not args.formato_minuto)} · v_prensa={float(v):.2f} m/min')
        if args.ciclos and n >= args.ciclos:
            break
        time.sleep(args.interval)


if __name__ == '__main__':
    signal.signal(signal.SIGINT, lambda *_: sys.exit(0))
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(0)
