from draftjs_exporter.dom import DOM

from importlib import import_module


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


def MissingBlock(props):
    return DOM.create_element('div', {'class': 'missing-block'}, props['children'])


def MissingInline(props):
    return DOM.create_element('span', {'class': 'missing-inline'}, props['children'])


def import_decorator(name):
    return getattr(import_module('decorators'), name, None)
