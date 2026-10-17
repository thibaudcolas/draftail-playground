from draftjs_exporter import DOM, Component, Element, Props


def hr(props: Props) -> Element:
    return DOM.create_element("hr")


def link(props: Props) -> Element:
    return DOM.create_element("a", {"href": props.get("url")}, props["children"])


def image(props: Props) -> Element:
    return DOM.create_element(
        "img",
        {
            "src": props.get("src"),
            "width": props.get("width", 256),
            "height": props.get("height"),
            "alt": props.get("altText"),
        },
    )


def icon(props: Props) -> Element:
    href = f"icon-{props.get('name', '')}"
    return DOM.create_element(
        "svg",
        {"class": "icon"},
        DOM.create_element("use", {"xlink:href": href}),
    )


def missing_block(props: Props) -> Element:
    return DOM.create_element("div", {"class": "missing-block"}, props["children"])


def missing_inline(props: Props) -> Element:
    return DOM.create_element("span", {"class": "missing-inline"}, props["children"])


def import_decorator(name: str) -> Component:
    all_decorators = {
        "hr": hr,
        "link": link,
        "image": image,
        "icon": icon,
        "missing_block": missing_block,
        "missing_inline": missing_inline,
    }
    if not isinstance(name, str) or name not in all_decorators:
        raise ValueError(f"Unknown decorator: {name!r}")
    return all_decorators[name]
