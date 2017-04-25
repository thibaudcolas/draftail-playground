import os
import re

from bs4 import BeautifulSoup

from flask import Flask, request, abort, send_from_directory

from draftjs_exporter.constants import BLOCK_TYPES, ENTITY_TYPES
from draftjs_exporter.defaults import BLOCK_MAP, STYLE_MAP
from draftjs_exporter.dom import DOM
from draftjs_exporter.html import HTML


def HR(props):
    return DOM.create_element('hr')


def Link(props):
    return DOM.create_element('a', {
        'href': props['url']
    }, props['children'])


def Image(props):
    return DOM.create_element('img', {
        'src': props.get('src'),
        'width': props.get('width'),
        'height': props.get('height'),
        'alt': props.get('altText'),
    })


def Icon(props):
    href = 'icon-%s' % props.get('name', '')
    return DOM.create_element(
        'svg',
        {'class': 'icon'},
        DOM.create_element('use', {'xlink:href': href})
    )


config = {
    'entity_decorators': {
        ENTITY_TYPES.LINK: Link,
        ENTITY_TYPES.IMAGE: Image,
        ENTITY_TYPES.HORIZONTAL_RULE: HR,
    },
    # Extend/override the default block map.
    'block_map': dict(BLOCK_MAP, **{
        BLOCK_TYPES.UNORDERED_LIST_ITEM: {
            'element': 'li',
            'wrapper': 'ul',
            'wrapper_props': {'class': 'bullet-list'},
        },
    }),
    # Extend/override the default style map.
    'style_map': dict(STYLE_MAP, **{
        'HIGHLIGHT': {
            'element': 'strong',
            'props': {'style': {'textDecoration': 'underline'}}
        },
    }),
}

app = Flask(__name__, static_folder='./build/static/')


def prettify(markup):
    return re.sub(r'</?(body|html|head)>', '', BeautifulSoup(markup, 'html5lib').prettify()).strip()


@app.route('/')
def home():
    return send_from_directory('build', 'index.html')


@app.route('/favicon.ico')
def favicon():
    return send_from_directory('build', 'favicon.ico')


@app.route('/api/export', methods=['GET', 'POST'])
def export():
    exporter = HTML(config)

    if request.json is None:
        abort(400)

    return prettify(exporter.render(request.json))


@app.route('/static/<path:path>')
def static_file(path):
    print(path)
    return app.send_static_file(path)


if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
