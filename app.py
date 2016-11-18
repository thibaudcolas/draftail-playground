from flask import Flask, request, abort, send_from_directory

from draftjs_exporter.constants import BLOCK_TYPES, ENTITY_TYPES
from draftjs_exporter.defaults import BLOCK_MAP, STYLE_MAP
from draftjs_exporter.dom import DOM
from draftjs_exporter.html import HTML


class Null:
    def render(self, props):
        return DOM.create_element()


class Link:
    def render(self, props):
        data = props.get('data', {})
        attributes = {}
        for key in data:
            attr = key if key != 'url' else 'href'
            attributes[attr] = data[key]

        return DOM.create_element('a', attributes, props['children'])


class Image:
    def render(self, props):
        data = props.get('data', {})

        return DOM.create_element('img', {
            'src': data.get('src'),
            'width': data.get('width'),
            'height': data.get('height'),
            'alt': data.get('alt'),
        })


class Icon:
    def render(self, props):
        href = 'icon-%s' % props.get('name', '')
        return DOM.create_element('svg', {'class': 'icon'}, DOM.create_element('use', {'xlink:href': href}))


config = {
    'entity_decorators': {
        ENTITY_TYPES.LINK: Link(),
        ENTITY_TYPES.IMAGE: Image(),
        ENTITY_TYPES.TOKEN: Null(),
    },
    # Extend/override the default block map.
    'block_map': dict(BLOCK_MAP, **{
        BLOCK_TYPES.UNORDERED_LIST_ITEM: {
            'element': 'li',
            'wrapper': ['ul', {'className': 'bullet-list'}],
        },
    }),
    # Extend/override the default style map.
    'style_map': dict(STYLE_MAP, **{
        'HIGHLIGHT': {'element': 'strong', 'textDecoration': 'underline'},
    }),
}

app = Flask(__name__, static_folder='./build/static/')


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

    return exporter.render(request.json)


@app.route('/static/<path:path>')
def static_file(path):
    print(path)
    return app.send_static_file(path)


if __name__ == '__main__':
    app.run()
