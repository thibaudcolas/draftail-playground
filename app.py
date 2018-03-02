import os
import re
import json

from bs4 import BeautifulSoup

from flask import Flask, request, abort, send_from_directory

from draftjs_exporter.constants import BLOCK_TYPES, ENTITY_TYPES, INLINE_STYLES
from draftjs_exporter.defaults import BLOCK_MAP, STYLE_MAP
from draftjs_exporter.html import HTML

from decorators import import_decorator

from markdown import render_markdown

app = Flask(__name__, static_folder='./build', static_path='')


def prettify(markup):
    return re.sub(r'</?(body|html|head)>', '', BeautifulSoup(markup, 'html5lib').prettify()).strip()


@app.route('/')
def home():
    return send_from_directory('build', 'index.html')


@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('./build/static', path)


@app.route('/api/export', methods=['GET', 'POST'])
def export():
    if request.json is None:
        abort(400)

    exporter_config = request.json['exporterConfig']

    entity_decorators = {}
    block_map = dict(BLOCK_MAP, **exporter_config.get('block_map', {}))
    style_map = dict(STYLE_MAP, **exporter_config.get('style_map', {}))

    entity_decorators[ENTITY_TYPES.FALLBACK] = import_decorator(
        'missing_inline')
    block_map[BLOCK_TYPES.FALLBACK] = import_decorator('missing_block')
    style_map[INLINE_STYLES.FALLBACK] = import_decorator('missing_inline')

    for type_, value in exporter_config.get('entity_decorators', {}).iteritems():
        entity_decorators[type_] = import_decorator(value)

    exporter = HTML({
        'entity_decorators': entity_decorators,
        'block_map': block_map,
        'style_map': style_map,
    })

    html = exporter.render(request.json['contentState'])

    return json.dumps({
        'html': html,
        'markdown': render_markdown(request.json['contentState']),
        'prettified': prettify(html),
    })


if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
