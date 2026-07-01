#!/usr/bin/env python3
"""Servidor local sin caché para desarrollo del simulador trazabilidad."""

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8847
ROOT = os.path.dirname(os.path.abspath(__file__))


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt, *args):
        sys.stderr.write("[serve-dev:%s] %s\n" % (PORT, fmt % args))


if __name__ == "__main__":
    os.chdir(ROOT)
    with ThreadingHTTPServer(("", PORT), NoCacheHandler) as httpd:
        print(f"Serving NOVOPAN deck (no-cache) → http://localhost:{PORT}/trazabilidad/")
        print("Ctrl+C para parar")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopped.")
