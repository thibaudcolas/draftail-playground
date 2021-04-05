from draftjs_exporter.dom import DOM

from importlib import import_module


def hr(props):
    return DOM.create_element("hr")


def link(props):
    return DOM.create_element("a", {"href": props["url"]}, props["children"])


def image(props):
    return DOM.create_element(
        "img",
        {
            "src": props.get("src"),
            "width": props.get("width", 256),
            "height": props.get("height"),
            "alt": props.get("altText"),
        },
    )


def icon(props):
    href = "icon-%s" % props.get("name", "")
    return DOM.create_element(
        "svg",
        {"class": "icon"},
        DOM.create_element("use", {"xlink:href": href}),
    )


def missing_block(props):
    return DOM.create_element(
        "div", {"class": "missing-block"}, props["children"]
    )


def missing_inline(props):
    return DOM.create_element(
        "span", {"class": "missing-inline"}, props["children"]
    )


def import_decorator(name):
    return getattr(import_module(".decorators", __name__), name, None)
