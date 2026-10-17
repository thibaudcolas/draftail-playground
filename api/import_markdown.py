from draftjs_exporter import BLOCK_TYPES, ENTITY_TYPES, ContentState, MarkdownImporter


def import_markdown(markdown: str) -> ContentState:
    content = MarkdownImporter().import_markdown(markdown)
    for block in content.get("blocks", []):
        if block.get("type") in (
            BLOCK_TYPES.HEADER_FOUR,
            BLOCK_TYPES.HEADER_FIVE,
            BLOCK_TYPES.HEADER_SIX,
        ):
            block["type"] = BLOCK_TYPES.HEADER_THREE
        block["depth"] = min(block.get("depth", 0), 4)
    for entity in content.get("entityMap", {}).values():
        if entity["type"] == ENTITY_TYPES.IMAGE:
            entity["data"]["altText"] = entity["data"].get("alt", "")
    return content
