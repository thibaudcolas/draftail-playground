import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import { postRequest } from "../utils";

vi.mock("../utils", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../utils")>()),
  postRequest: vi.fn(),
}));

it("loads imported ranges into the real Draftail editor without shifting formatting after emoji", async () => {
  vi.mocked(postRequest)
    .mockResolvedValueOnce({ html: "", markdown: "", prettified: "" })
    .mockResolvedValueOnce({
      html: "<p>🙂 <strong>bold</strong> and <a href='https://example.com'>link</a></p>",
      markdown: "🙂 **bold** and [link](https://example.com)",
      prettified: "",
      contentState: {
        blocks: [
          {
            key: "imported",
            text: "🙂 bold and link",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [{ offset: 2, length: 4, style: "BOLD" }],
            entityRanges: [{ offset: 11, length: 4, key: 0 }],
            data: {},
          },
        ],
        entityMap: {
          "0": { type: "LINK", mutability: "MUTABLE", data: { url: "https://example.com" } },
        },
      },
    });
  const { container } = render(<App />);
  await screen.findByRole("button", { name: "Update exports" });
  fireEvent.click(screen.getByText("Import Markdown"));
  fireEvent.change(screen.getByLabelText("Markdown input"), {
    target: { value: "🙂 **bold** and [link](https://example.com)" },
  });
  const button = screen.getByRole("button", { name: "Replace editor content" });
  button.focus();
  fireEvent.click(button);
  await screen.findByText(/Markdown imported/);
  const editor = container.querySelector(".DraftEditor-root")!;
  expect(editor.textContent).toBe("🙂 bold and link");
  expect(editor.querySelector('[style*="font-weight: bold"]')?.textContent).toBe("bold");
  expect(document.activeElement).toBe(button);
  await waitFor(() =>
    expect(JSON.parse(localStorage.getItem("contentState")!).blocks[0].inlineStyleRanges).toEqual([
      { offset: 2, length: 4, style: "BOLD" },
    ]),
  );
});
