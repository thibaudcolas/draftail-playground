from draftjs_exporter import (
    ENTITY_TYPES,
    MARKDOWN_CONFIG,
    ContentState,
    Element,
    Exporter,
    Props,
    md_image,
)


def image(props: Props) -> Element:
    # Draftail stores image alternative text as altText rather than alt.
    return md_image({**props, "alt": props.get("altText", "")})


exporter = Exporter(
    {
        **MARKDOWN_CONFIG,
        "entity_decorators": {
            **MARKDOWN_CONFIG.get("entity_decorators", {}),
            ENTITY_TYPES.IMAGE: image,
        },
    }
)


def render_markdown(content_state: ContentState | None) -> str:
    return exporter.render(content_state)
