from draftjs_exporter.html import HTML
from draftjs_exporter.dom import DOM
from draftjs_exporter_markdown import (
    BLOCK_MAP,
    ENGINE,
    ENTITY_DECORATORS,
    STYLE_MAP,
)

exporter = HTML(
    {
        "block_map": BLOCK_MAP,
        "style_map": STYLE_MAP,
        "entity_decorators": ENTITY_DECORATORS,
        "engine": ENGINE,
    }
)


def render_markdown(content_state):
    DOM.use(ENGINE)
    return exporter.render(content_state)
