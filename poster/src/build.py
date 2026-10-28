"""Arma poster/poster-tecnox.html: un solo archivo con la fuente, la captura y el QR embebidos."""
import base64
import re
from pathlib import Path

src = Path(__file__).parent
out = src.parent / 'poster-tecnox.html'


def b64(name):
    return base64.b64encode((src / name).read_bytes()).decode()


qr = (src / 'qr.svg').read_text()
qr = qr[qr.index('<svg'):]
qr = re.sub(r'width="[^"]+" height="[^"]+"', '', qr, count=1)
qr = qr.replace('<svg ', '<svg class="qr" role="img" aria-label="Código QR a tecnox-tienda.vercel.app" ', 1)
qr = qr.replace('fill="#ffffff"', 'fill="#fff4cf"').replace('stroke:#000000', 'stroke:#0a0a0b')

html = (src / 'poster.template.html').read_text()
html = (html.replace('{{FONT}}', b64('archivo-latin.woff2'))
            .replace('{{SCREEN}}', b64('screen-home.jpg'))
            .replace('{{QR}}', qr))
out.write_text(html)
print(out, f'{out.stat().st_size / 1024:.0f} KB')
