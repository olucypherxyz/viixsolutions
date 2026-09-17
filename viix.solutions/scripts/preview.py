#!/usr/bin/env python3
"""Serve the static site with clean URLs and the branded 404 page."""
from __future__ import annotations

import argparse
import mimetypes
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        self._serve(include_body=True)

    def do_HEAD(self):
        self._serve(include_body=False)

    def _serve(self, include_body: bool) -> None:
        route = self.path.split("?", 1)[0]
        mapped = self._map_clean_url(route)
        if mapped is None:
            self._send_404(include_body)
            return
        self.path = mapped
        if include_body:
            super().do_GET()
        else:
            super().do_HEAD()

    def _map_clean_url(self, route: str) -> str | None:
        path = route.split("#", 1)[0]
        if path != "/" and path.endswith("/"):
            path = path[:-1]
        relative = path.lstrip("/")
        target = (ROOT / relative).resolve() if relative else ROOT
        try:
            target.relative_to(ROOT)
        except ValueError:
            return None
        if target.is_file():
            return "/" + target.relative_to(ROOT).as_posix()
        html = target.with_suffix(".html")
        if html.is_file():
            return "/" + html.relative_to(ROOT).as_posix()
        index = target / "index.html"
        if index.is_file():
            return "/" + index.relative_to(ROOT).as_posix()
        if path in {"", "/"} and (ROOT / "index.html").is_file():
            return "/index.html"
        return None

    def _send_404(self, include_body: bool) -> None:
        page = ROOT / "404.html"
        data = page.read_bytes() if page.is_file() else b"Not found"
        content_type = mimetypes.guess_type("404.html")[0] or "text/html"
        self.send_response(404)
        self.send_header("Content-Type", f"{content_type}; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        if include_body:
            self.wfile.write(data)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8765)
    args = parser.parse_args()
    server = ThreadingHTTPServer((args.host, args.port), Handler)
    print(f"Serving {ROOT} at http://{args.host}:{args.port}/")
    server.serve_forever()


if __name__ == "__main__":
    main()
