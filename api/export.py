import re
import json
from http.server import BaseHTTPRequestHandler

from bs4 import BeautifulSoup

from draftjs_exporter import __version__
from draftjs_exporter.constants import BLOCK_TYPES, ENTITY_TYPES, INLINE_STYLES
from draftjs_exporter.defaults import BLOCK_MAP, STYLE_MAP
from draftjs_exporter.html import HTML

from .decorators import import_decorator, missing_block, missing_inline

from .markdown import render_markdown


def prettify(markup):
    return re.sub(
        r"</?(body|html|head)>",
        "",
        BeautifulSoup(markup, "html5lib").prettify(),
    ).strip()


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers["Content-Length"])
            post_data = self.rfile.read(content_length)
            request_json = json.loads(post_data)
        except Exception:
            self.send_response(400)
            return

        exporter_config = request_json["exporterConfig"]

        entity_decorators = {}
        block_map = dict(BLOCK_MAP, **exporter_config.get("block_map", {}))
        style_map = dict(STYLE_MAP, **exporter_config.get("style_map", {}))

        entity_decorators[ENTITY_TYPES.FALLBACK] = missing_inline
        block_map[BLOCK_TYPES.FALLBACK] = missing_block
        style_map[INLINE_STYLES.FALLBACK] = missing_inline

        for type_, value in exporter_config.get(
            "entity_decorators", {}
        ).items():
            entity_decorators[type_] = import_decorator(value)

        exporter = HTML(
            {
                "entity_decorators": entity_decorators,
                "block_map": block_map,
                "style_map": style_map,
            }
        )

        html = exporter.render(request_json["contentState"])
        markdown = render_markdown(request_json["contentState"])

        ret = json.dumps(
            {
                "html": html,
                "markdown": markdown,
                "prettified": prettify(html),
                "version": __version__,
            }
        )

        self.send_response(200)
        self.send_header("Content-type", "application/json; charset=utf-8")
        self.end_headers()
        self.wfile.write(ret.encode("utf8"))
        return


# def run(server_class=HTTPServer, handler_class=Server, port=8008):
#     server_address = ('', port)
#     httpd = server_class(server_address, handler_class)

#     print 'Starting httpd on port %d...' % port
#     httpd.serve_forever()

# if __name__ == "__main__":
#     from sys import argv

#     if len(argv) == 2:
#         run(port=int(argv[1]))
#     else:
#         run()
