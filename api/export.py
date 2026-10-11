import json
import logging
import re
from http.server import BaseHTTPRequestHandler
from typing import Any

from bs4 import BeautifulSoup
from draftjs_exporter import __version__
from draftjs_exporter.constants import BLOCK_TYPES, ENTITY_TYPES, INLINE_STYLES
from draftjs_exporter.defaults import BLOCK_MAP, STYLE_MAP
from draftjs_exporter.error import ConfigException
from draftjs_exporter.html import HTML

from .decorators import import_decorator, missing_block, missing_inline
from .markdown import render_markdown

logger = logging.getLogger(__name__)


def prettify(markup: str) -> str:
    return re.sub(
        r"</?(body|html|head)>",
        "",
        BeautifulSoup(markup, "html5lib").prettify(),
    ).strip()


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError(message)


def validate_config(config: Any) -> None:
    require(isinstance(config, dict), "exporterConfig must be an object")
    for name in ("block_map", "style_map", "entity_decorators"):
        mapping = config.get(name, {})
        require(isinstance(mapping, dict), f"{name} must be an object")
        for key, value in mapping.items():
            label = f"{name}.{key}"
            if name == "entity_decorators":
                import_decorator(value)
                continue
            if isinstance(value, dict):
                require("element" in value, f"{label} must define an element")
                require(
                    not value.keys() - {"element", "props", "wrapper", "wrapper_props"},
                    f"{label} contains unsupported options",
                )
                for field in ("element", "wrapper"):
                    tag = value.get(field)
                    require(
                        tag is None or isinstance(tag, str),
                        f"{label}.{field} must be a string or null",
                    )
                for field in ("props", "wrapper_props"):
                    props = value.get(field)
                    require(
                        props is None or isinstance(props, dict),
                        f"{label}.{field} must be an object or null",
                    )
            else:
                require(
                    value is None or isinstance(value, str),
                    f"{label} must be a string, object, or null",
                )


def validate_content(content: Any) -> None:
    # Draftail represents an empty editor as null.
    if content is None:
        return
    require(isinstance(content, dict), "contentState must be an object or null")
    blocks = content.get("blocks")
    entities = content.get("entityMap")
    require(isinstance(blocks, list), "contentState.blocks must be an array")
    require(isinstance(entities, dict), "contentState.entityMap must be an object")
    for key, entity in entities.items():
        label = f"entityMap.{key}"
        require(isinstance(entity, dict), f"{label} must be an object")
        require(isinstance(entity.get("type"), str), f"{label}.type must be a string")
        require(isinstance(entity.get("data"), dict), f"{label}.data must be an object")
        field = {"LINK": "url", "IMAGE": "src"}.get(entity["type"])
        if field:
            require(
                isinstance(entity["data"].get(field), str),
                f"{label}.data.{field} must be a string",
            )
    for index, block in enumerate(blocks):
        label = f"blocks[{index}]"
        require(isinstance(block, dict), f"{label} must be an object")
        for field in ("text", "type"):
            require(
                isinstance(block.get(field), str), f"{label}.{field} must be a string"
            )
        depth = block.get("depth", 0)
        require(type(depth) is int and depth >= 0, f"{label}.depth must be nonnegative")
        if "data" in block:
            require(isinstance(block["data"], dict), f"{label}.data must be an object")
        for field in ("entityRanges", "inlineStyleRanges"):
            ranges = block.get(field)
            require(isinstance(ranges, list), f"{label}.{field} must be an array")
            for item in ranges:
                require(
                    isinstance(item, dict), f"{label}.{field} entries must be objects"
                )
                for number in ("offset", "length"):
                    value = item.get(number)
                    require(
                        type(value) is int and value >= 0,
                        f"{label}.{field}.{number} must be a nonnegative integer",
                    )
                if field == "entityRanges":
                    require(
                        type(item.get("key")) is int and str(item["key"]) in entities,
                        f"{label}.entityRanges references an unknown entity",
                    )
                else:
                    require(
                        isinstance(item.get("style"), str),
                        f"{label}.inlineStyleRanges.style must be a string",
                    )


def export_document(request: Any) -> dict[str, str]:
    require(isinstance(request, dict), "Request must be an object")
    require("exporterConfig" in request, "exporterConfig is required")
    require("contentState" in request, "contentState is required")
    config = request["exporterConfig"]
    content = request["contentState"]
    validate_config(config)
    validate_content(content)

    entity_decorators = {ENTITY_TYPES.FALLBACK: missing_inline}
    block_map = {**BLOCK_MAP, **config.get("block_map", {})}
    style_map = {**STYLE_MAP, **config.get("style_map", {})}
    block_map[BLOCK_TYPES.FALLBACK] = missing_block
    style_map[INLINE_STYLES.FALLBACK] = missing_inline
    for type_, value in config.get("entity_decorators", {}).items():
        entity_decorators[type_] = import_decorator(value)

    # Constructing HTML selects its DOM engine anew after each Markdown export.
    exporter = HTML(
        {
            "entity_decorators": entity_decorators,
            "block_map": block_map,
            "style_map": style_map,
        }
    )
    html = exporter.render(content)
    return {
        "html": html,
        "markdown": render_markdown(content),
        "prettified": prettify(html),
        "version": __version__,
    }


class handler(BaseHTTPRequestHandler):
    def send_json(self, status: int, body: dict[str, Any]) -> None:
        data = json.dumps(body).encode("utf8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_POST(self) -> None:
        try:
            content_length = int(self.headers.get("Content-Length", ""))
            require(content_length >= 0, "Content-Length must be nonnegative")
            post_data = self.rfile.read(content_length)
            request = json.loads(post_data)
        except ValueError, UnicodeError:
            self.send_json(
                400, {"error": "Request must contain valid JSON and Content-Length"}
            )
            return

        try:
            result = export_document(request)
        except (ValueError, TypeError, KeyError, ConfigException) as error:
            self.send_json(400, {"error": str(error)})
            return
        except Exception:
            logger.exception("Export failed")
            self.send_json(500, {"error": "Export failed. Please try again."})
            return

        self.send_json(200, result)
