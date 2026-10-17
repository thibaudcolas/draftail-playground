import json
import unittest
from concurrent.futures import ThreadPoolExecutor
from copy import deepcopy
from io import BytesIO
from socket import socket
from socketserver import BaseServer
from threading import Barrier
from typing import Any
from unittest.mock import create_autospec, patch

from draftjs_exporter import (
    DOM,
    ContentState,
    Element,
    Exporter,
    MarkdownParseError,
    Props,
)

from api.decorators import hr, image, import_decorator, link
from api.export import handler
from api.markdown import render_markdown


def document() -> dict[str, Any]:
    return {
        "exporterConfig": {
            "entity_decorators": {
                "LINK": "link",
                "IMAGE": "image",
                "HORIZONTAL_RULE": "hr",
            }
        },
        "contentState": {
            "blocks": [
                {
                    "key": "first",
                    "type": "unstyled",
                    "text": "Hello",
                    "depth": 0,
                    "inlineStyleRanges": [],
                    "entityRanges": [],
                }
            ],
            "entityMap": {},
        },
    }


class ExportTests(unittest.TestCase):
    def request(
        self, body: bytes, length: str | None = "auto"
    ) -> tuple[int, dict[str, str], dict[str, Any]]:
        if length == "auto":
            length = str(len(body))
        header = f"Content-Length: {length}\r\n" if length is not None else ""
        request = BytesIO(f"POST /api/export HTTP/1.0\r\n{header}\r\n".encode() + body)
        response_buffer = BytesIO()
        sock = create_autospec(socket, instance=True)
        sock.makefile.return_value = request
        sock.sendall.side_effect = response_buffer.write
        server = create_autospec(BaseServer, instance=True)
        with patch.object(handler, "log_message"):
            handler(sock, ("127.0.0.1", 1), server)
        head, response = response_buffer.getvalue().split(b"\r\n\r\n", 1)
        lines = head.decode().split("\r\n")
        headers = dict(line.split(": ", 1) for line in lines[1:])
        self.assertEqual(headers["Content-Type"], "application/json; charset=utf-8")
        self.assertEqual(int(headers["Content-Length"]), len(response))
        return int(lines[0].split()[1]), headers, json.loads(response)

    def post(self, payload: Any) -> tuple[int, dict[str, str], dict[str, Any]]:
        return self.request(json.dumps(payload).encode())

    def test_decorator_lookup(self) -> None:
        for name, expected in (("link", link), ("image", image), ("hr", hr)):
            self.assertIs(import_decorator(name), expected)
        with self.assertRaisesRegex(ValueError, "Unknown decorator"):
            import_decorator("missing")

    def import_source(self, markdown: str) -> dict[str, Any]:
        status, _, body = self.post(
            {"markdown": markdown, "exporterConfig": document()["exporterConfig"]}
        )
        self.assertEqual(status, 200, body)
        return body

    def test_markdown_import(self) -> None:
        body = self.import_source(
            "# Heading\n\n**Bold** and [link](https://example.com)\n\n"
            "![A cat](/cat.png)\n\n---\n\n```python\nprint(1)\n```\n\n"
            "1. Ordered\n   - Nested"
        )
        content = body["contentState"]
        self.assertEqual(
            [block["type"] for block in content["blocks"]],
            [
                "header-one",
                "unstyled",
                "atomic",
                "atomic",
                "code-block",
                "ordered-list-item",
                "unordered-list-item",
            ],
        )
        self.assertEqual(content["blocks"][-1]["depth"], 1)
        entities = {entity["type"]: entity for entity in content["entityMap"].values()}
        self.assertEqual(entities["LINK"]["data"]["url"], "https://example.com")
        self.assertEqual(
            entities["IMAGE"]["data"],
            {
                "src": "/cat.png",
                "alt": "A cat",
                "altText": "A cat",
            },
        )
        self.assertIn("HORIZONTAL_RULE", entities)
        self.assertIn('<a href="https://example.com">link</a>', body["html"])
        self.assertIn('alt="A cat"', body["html"])
        self.assertIn("<pre><code>print(1)</code></pre>", body["html"])
        self.assertIn("![A cat](/cat.png)", body["markdown"])

    def test_markdown_import_heading_and_depth_limits(self) -> None:
        body = self.import_source("#### Four\n\n##### Five\n\n###### Six")
        self.assertEqual(
            [block["type"] for block in body["contentState"]["blocks"]],
            ["header-three"] * 3,
        )
        body = self.import_source(
            "\n".join("  " * depth + "- Item" for depth in range(7))
        )
        self.assertEqual(
            [block["depth"] for block in body["contentState"]["blocks"]],
            [0, 1, 2, 3, 4, 4, 4],
        )

    def test_markdown_import_empty(self) -> None:
        for source in ("", " \n\n"):
            body = self.import_source(source)
            self.assertEqual(body["contentState"], {"blocks": [], "entityMap": {}})
            self.assertEqual(body["html"], "")
            self.assertEqual(body["markdown"], "")

    def test_markdown_import_emoji_offsets_round_trip(self) -> None:
        body = self.import_source("😀 **hi😀** [ok😀](https://example.com)")
        content = body["contentState"]
        block = content["blocks"][0]
        self.assertEqual(
            block["inlineStyleRanges"],
            [
                {"offset": 2, "length": 3, "style": "BOLD"},
            ],
        )
        self.assertEqual(block["entityRanges"], [{"offset": 6, "length": 3, "key": 0}])
        self.assertEqual(
            body["html"],
            '<p>😀 <strong>hi😀</strong> <a href="https://example.com">ok😀</a></p>',
        )
        original = deepcopy(content)
        status, _, exported = self.post(
            {
                "contentState": content,
                "exporterConfig": document()["exporterConfig"],
            }
        )
        self.assertEqual(status, 200, exported)
        self.assertEqual(exported["html"], body["html"])
        self.assertEqual(exported["markdown"], body["markdown"])
        self.assertNotIn("contentState", exported)
        self.assertEqual(content, original)

    def test_markdown_import_bad_requests_and_parser_errors(self) -> None:
        for source in (None, 123, [], {}):
            status, _, body = self.post({"markdown": source, "exporterConfig": {}})
            self.assertEqual(status, 400, body)
            self.assertIn("markdown", body["error"])
        payload = document()
        payload["markdown"] = "text"
        status, _, body = self.post(payload)
        self.assertEqual(status, 400, body)
        for error, expected_status in (
            (MarkdownParseError("Invalid source", line=2), 400),
            (RuntimeError("private"), 500),
        ):
            with (
                patch("api.export.import_markdown", side_effect=error),
                patch("api.export.logger"),
            ):
                status, _, body = self.post({"markdown": "text", "exporterConfig": {}})
            self.assertEqual(status, expected_status, body)
            self.assertNotIn("contentState", body)
            self.assertNotIn("private", body["error"])

    def test_success_and_repeated_exports(self) -> None:
        for _ in range(3):
            status, _, body = self.post(document())
            self.assertEqual(status, 200)
            self.assertEqual(body["html"], "<p>Hello</p>")
            self.assertEqual(body["markdown"].strip(), "Hello")
            self.assertIn("Hello", body["prettified"])
            self.assertTrue(body["version"])

    def test_empty_content(self) -> None:
        for content in (None, {"blocks": [], "entityMap": {}}):
            payload = document()
            payload["contentState"] = content
            status, _, body = self.post(payload)
            self.assertEqual(status, 200)
            self.assertEqual(body["html"], "")
            self.assertEqual(body["markdown"], "")

    def test_entity_exports(self) -> None:
        cases = (
            (
                "LINK",
                {"url": "https://example.com"},
                '<a href="https://example.com">Hello</a>',
                "[Hello](https://example.com)",
            ),
            (
                "LINK",
                {"url": "https://example.com/a b"},
                '<a href="https://example.com/a b">Hello</a>',
                "[Hello](https://example.com/a%20b)",
            ),
            (
                "IMAGE",
                {"src": "/photo.png", "altText": "A cat"},
                'alt="A cat"',
                "![A cat](/photo.png)",
            ),
            ("HORIZONTAL_RULE", {}, "<hr", "---"),
        )
        for entity_type, data, html, markdown in cases:
            with self.subTest(entity_type=entity_type):
                payload = document()
                content = payload["contentState"]
                content["entityMap"]["0"] = {
                    "type": entity_type,
                    "mutability": "IMMUTABLE",
                    "data": data,
                }
                content["blocks"][0]["entityRanges"] = [
                    {"offset": 0, "length": 5, "key": 0}
                ]
                status, _, body = self.post(payload)
                self.assertEqual(status, 200, body)
                self.assertIn(html, body["html"])
                self.assertIn(markdown, body["markdown"])

    def test_invalid_json_and_length(self) -> None:
        for body, length in (
            (b"{", "auto"),
            (b"\xff", "auto"),
            (b"{}", None),
            (b"{}", "-1"),
            (b"{}", "no"),
        ):
            with self.subTest(body=body, length=length):
                status, _, result = self.request(body, length)
                self.assertEqual(status, 400)
                self.assertTrue(result["error"])

    def test_markdown_escaping_and_code_delimiters(self) -> None:
        cases = (
            (
                "# Heading *literal* [link] <b>",
                "unstyled",
                [],
                "\\# Heading \\*literal\\* \\[link\\] \\<b>\n\n",
            ),
            (
                "a`b",
                "unstyled",
                [{"offset": 0, "length": 3, "style": "CODE"}],
                "``a`b``\n\n",
            ),
            ("```\ncode", "code-block", [], "````\n```\ncode\n````\n\n"),
            (
                " bold ",
                "unstyled",
                [{"offset": 0, "length": 6, "style": "BOLD"}],
                " **bold** \n\n",
            ),
        )
        for text, block_type, styles, expected in cases:
            with self.subTest(text=text):
                payload = document()
                payload["contentState"]["blocks"][0].update(
                    text=text, type=block_type, inlineStyleRanges=styles
                )
                status, _, body = self.post(payload)
                self.assertEqual(status, 200, body)
                self.assertEqual(body["markdown"], expected)

    def test_nested_inline_styles(self) -> None:
        payload = document()
        payload["contentState"]["blocks"][0].update(
            text="Bold Italic",
            inlineStyleRanges=[
                {"offset": 0, "length": 11, "style": "BOLD"},
                {"offset": 5, "length": 6, "style": "ITALIC"},
            ],
        )
        status, _, body = self.post(payload)
        self.assertEqual(status, 200, body)
        self.assertEqual(body["html"], "<p><strong>Bold <em>Italic</em></strong></p>")

    def test_list_starting_at_nonzero_depth(self) -> None:
        payload = document()
        payload["contentState"]["blocks"][0].update(type="unordered-list-item", depth=2)
        status, _, body = self.post(payload)
        self.assertEqual(status, 200, body)
        self.assertEqual(
            body["html"],
            "<ul><li><ul><li><ul><li>Hello</li></ul></li></ul></li></ul>",
        )
        self.assertEqual(body["markdown"], "    - Hello\n\n")

    def test_markdown_mixed_lists_and_consecutive_quotes(self) -> None:
        cases = (
            (
                [
                    ("ordered-list-item", 0),
                    ("unordered-list-item", 1),
                    ("ordered-list-item", 0),
                ],
                "1. Hello\n   - Hello\n2. Hello\n\n",
            ),
            ([("blockquote", 0), ("blockquote", 0)], "> Hello\n>\n> Hello\n\n"),
        )
        for blocks, expected in cases:
            with self.subTest(blocks=blocks):
                payload = document()
                template = payload["contentState"]["blocks"][0]
                payload["contentState"]["blocks"] = [
                    {**template, "key": str(index), "type": block_type, "depth": depth}
                    for index, (block_type, depth) in enumerate(blocks)
                ]
                status, _, body = self.post(payload)
                self.assertEqual(status, 200, body)
                self.assertEqual(body["markdown"], expected)

    def test_entity_destinations(self) -> None:
        for entity_type, field, markdown in (
            ("LINK", "url", "[Hello]()"),
            ("IMAGE", "src", "![A \\[cat\\]]()"),
        ):
            for data in ({"altText": "A [cat]"}, {field: None, "altText": "A [cat]"}):
                with self.subTest(entity_type=entity_type, data=data):
                    payload = document()
                    content = payload["contentState"]
                    content["entityMap"]["0"] = {
                        "type": entity_type,
                        "mutability": "IMMUTABLE",
                        "data": data,
                    }
                    content["blocks"][0]["entityRanges"] = [
                        {"offset": 0, "length": 5, "key": 0}
                    ]
                    status, _, body = self.post(payload)
                    self.assertEqual(status, 200, body)
                    self.assertEqual(body["markdown"].strip(), markdown)
                    for invalid in (123, []):
                        content["entityMap"]["0"]["data"] = {**data, field: invalid}
                        status, _, body = self.post(payload)
                        self.assertEqual(status, 400, body)

    def test_engines_remain_isolated_during_nested_and_concurrent_exports(self) -> None:
        content: ContentState = {
            "blocks": [{"type": "unstyled", "text": "*Hello*", "depth": 0}],
            "entityMap": {},
        }

        def nested_export(props: Props) -> Element:
            self.assertEqual(render_markdown(content), "\\*Hello\\*\n\n")
            return DOM.create_element("p", {}, props["children"])

        html = Exporter({"block_map": {"unstyled": nested_export}})
        self.assertEqual(html.render(content), "<p>*Hello*</p>")

        barrier = Barrier(2, timeout=5)

        def concurrent_export(props: Props) -> Element:
            # Keep an HTML render active while the shared Markdown exporter runs.
            barrier.wait()
            barrier.wait()
            return DOM.create_element("p", {}, props["children"])

        html = Exporter({"block_map": {"unstyled": concurrent_export}})
        with ThreadPoolExecutor(max_workers=1) as pool:
            pending = pool.submit(html.render, content)
            barrier.wait()
            try:
                self.assertEqual(render_markdown(content), "\\*Hello\\*\n\n")
            finally:
                barrier.wait()
            self.assertEqual(pending.result(timeout=5), "<p>*Hello*</p>")

    def test_invalid_payloads(self) -> None:
        cases: list[Any] = [None, [], {}, {"exporterConfig": {}}]
        for config in (
            None,
            [],
            {"block_map": []},
            {"style_map": {"BOLD": 1}},
            {"block_map": {"unstyled": {}}},
            {"entity_decorators": {"LINK": "unknown"}},
            {"entity_decorators": {"LINK": []}},
        ):
            payload = document()
            payload["exporterConfig"] = config
            cases.append(payload)
        for content in (
            [],
            {},
            {"blocks": [], "entityMap": []},
            {"blocks": [None], "entityMap": {}},
            {"blocks": [{"text": 1, "type": "unstyled"}], "entityMap": {}},
        ):
            payload = document()
            payload["contentState"] = content
            cases.append(payload)
        for update in (
            {"depth": -1},
            {"entityRanges": [{}]},
            {"entityRanges": [{"offset": 0, "length": 1, "key": 9}]},
            {"inlineStyleRanges": [{"offset": "0", "length": 1, "style": "BOLD"}]},
        ):
            payload = document()
            payload["contentState"]["blocks"][0].update(update)
            cases.append(payload)
        for payload in cases:
            with self.subTest(payload=payload):
                status, _, body = self.post(deepcopy(payload))
                self.assertEqual(status, 400, body)
                self.assertTrue(body["error"])

    def test_custom_configuration(self) -> None:
        payload = document()
        payload["exporterConfig"]["block_map"] = {
            "unstyled": {"element": "section", "props": {"class": "sample"}}
        }
        status, _, body = self.post(payload)
        self.assertEqual(status, 200)
        self.assertEqual(body["html"], '<section class="sample">Hello</section>')

    def test_unexpected_failure_returns_json(self) -> None:
        with (
            patch("api.export.export_document", side_effect=RuntimeError("private")),
            self.assertLogs("api.export", level="ERROR"),
        ):
            status, _, body = self.post(document())
        self.assertEqual(status, 500)
        self.assertNotIn("private", body["error"])


if __name__ == "__main__":
    unittest.main()
