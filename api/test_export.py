import json
import unittest
from copy import deepcopy
from io import BytesIO
from typing import Any
from unittest.mock import patch

from api.decorators import hr, image, import_decorator, link
from api.export import handler


class RequestSocket:
    def __init__(self, request: bytes) -> None:
        self.request = BytesIO(request)
        self.response = BytesIO()

    def makefile(self, mode: str, *args: Any) -> BytesIO:
        return self.request

    def sendall(self, data: bytes) -> None:
        self.response.write(data)


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
        sock = RequestSocket(
            f"POST /api/export HTTP/1.0\r\n{header}\r\n".encode() + body
        )
        with patch.object(handler, "log_message"):
            handler(sock, ("127.0.0.1", 1), None)
        head, response = sock.response.getvalue().split(b"\r\n\r\n", 1)
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
                "IMAGE",
                {"src": "/photo.png", "altText": "A cat"},
                'alt="A cat"',
                "![](/photo.png)",
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
