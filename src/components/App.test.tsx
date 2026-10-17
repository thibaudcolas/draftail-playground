import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { RawDraftContentState } from "draft-js";
import App from "./App";
import { defaultContentState, postRequest } from "../utils";

vi.mock("../utils", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../utils")>()),
  postRequest: vi.fn(),
}));

const editedContent = {
  ...defaultContentState,
  blocks: [{ ...defaultContentState.blocks[0], text: "Updated story" }],
};

vi.mock("./Editor", () => ({
  default: ({
    onSave,
    rawContentState,
  }: {
    onSave: (content: RawDraftContentState | null) => void;
    rawContentState: RawDraftContentState | null;
  }) => (
    <>
      <pre data-testid="editor-content">{JSON.stringify(rawContentState)}</pre>
      <button onClick={() => onSave(editedContent)}>Edit story</button>
      <button onClick={() => onSave(null)}>Clear story</button>
    </>
  ),
}));

vi.mock("./Exports", () => ({
  default: ({
    contentState,
    onChangeConfig,
  }: {
    contentState: RawDraftContentState | null;
    onChangeConfig: (update: { updated_src: object }) => void;
  }) => (
    <>
      <pre data-testid="content">{JSON.stringify(contentState)}</pre>
      <button
        onClick={() => onChangeConfig({ updated_src: { block_map: { unstyled: "section" } } })}
      >
        Edit configuration
      </button>
    </>
  ),
}));

const response = (text: string) => ({ html: `<p>${text}</p>`, markdown: text, prettified: text });
const pending = () => {
  let resolve!: (value: unknown) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<unknown>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

beforeEach(() => {
  vi.mocked(postRequest).mockReset();
  window.localStorage.clear();
});

it("saves edits and updates JSON before an export finishes, then retries failures", async () => {
  const request = pending();
  vi.mocked(postRequest)
    .mockResolvedValueOnce(response("Original preview"))
    .mockReturnValueOnce(request.promise)
    .mockResolvedValueOnce(response("Updated preview"));
  render(<App />);
  await screen.findByText("Original preview");
  fireEvent.click(screen.getByText("Edit story"));
  expect(JSON.parse(window.localStorage.getItem("contentState")!)).toEqual(editedContent);
  expect(screen.getByTestId("content").textContent).toContain("Updated story");
  await act(async () => request.reject(new Error("Offline")));
  expect(screen.getByText("Original preview")).toBeTruthy();
  expect(screen.getByText(/Export failed/)).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Retry export" }));
  await screen.findByText("Updated preview");
  expect(postRequest).toHaveBeenLastCalledWith(
    "/api/export",
    expect.objectContaining({ contentState: editedContent }),
  );
});

it("ignores stale successful responses across content and configuration changes", async () => {
  const first = pending();
  const second = pending();
  const third = pending();
  vi.mocked(postRequest)
    .mockReturnValueOnce(first.promise)
    .mockReturnValueOnce(second.promise)
    .mockReturnValueOnce(third.promise);
  render(<App />);
  fireEvent.click(screen.getByText("Edit story"));
  fireEvent.click(screen.getByText("Edit configuration"));
  expect(postRequest).toHaveBeenLastCalledWith("/api/export", {
    contentState: editedContent,
    exporterConfig: { block_map: { unstyled: "section" } },
  });
  await act(async () => third.resolve(response("Latest preview")));
  await act(async () => second.resolve(response("Stale preview")));
  await act(async () => first.reject(new Error("Stale error")));
  expect(screen.getByText("Latest preview")).toBeTruthy();
  expect(screen.queryByText("Stale preview")).toBeNull();
  expect(screen.queryByText(/Export failed/)).toBeNull();
});

it("exports and persists an empty editor", async () => {
  vi.mocked(postRequest).mockResolvedValue(response(""));
  render(<App />);
  await act(async () => {
    fireEvent.click(screen.getByText("Clear story"));
  });
  expect(window.localStorage.getItem("contentState")).toBe("null");
  expect(postRequest).toHaveBeenLastCalledWith(
    "/api/export",
    expect.objectContaining({ contentState: null }),
  );
});

it("shows malformed export responses as retryable failures", async () => {
  vi.mocked(postRequest).mockResolvedValue({ html: 42 });
  render(<App />);
  expect(await screen.findByRole("button", { name: "Retry export" })).toBeTruthy();
});

it("keeps editing and exporting when browser storage fails", async () => {
  vi.mocked(postRequest).mockResolvedValue(response("Preview"));
  const storage = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("Quota exceeded");
  });
  try {
    render(<App />);
    await act(async () => {
      fireEvent.click(screen.getByText("Edit story"));
    });
    expect(screen.getByText(/could not be saved/)).toBeTruthy();
    expect(screen.getByTestId("content").textContent).toContain("Updated story");
    expect(screen.getByText("Preview")).toBeTruthy();
  } finally {
    storage.mockRestore();
  }
});

it("ignores responses after unmount", async () => {
  const request = pending();
  vi.mocked(postRequest).mockReturnValue(request.promise);
  const { unmount } = render(<App />);
  unmount();
  await act(async () => request.resolve(response("Late response")));
});

it("announces slow exports and preserves button focus through completion", async () => {
  vi.useFakeTimers();
  const request = pending();
  vi.mocked(postRequest).mockReturnValue(request.promise);
  try {
    render(<App />);
    const button = screen.getByRole("button", { name: "Exporting…" });
    button.focus();
    fireEvent.click(button);
    expect(postRequest).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Export in progress…")).toBeNull();
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText("Export in progress…").getAttribute("role")).toBe("status");
    await act(async () => request.resolve(response("Done")));
    expect(screen.queryByText("Export in progress…")).toBeNull();
    expect(document.activeElement).toBe(button);
    expect(button.getAttribute("aria-disabled")).toBe("false");
    expect(vi.getTimerCount()).toBe(0);
  } finally {
    vi.useRealTimers();
  }
});

const importedContent = {
  ...defaultContentState,
  blocks: [
    { ...defaultContentState.blocks[0], text: "Imported story", type: "header-one" as const },
  ],
};
const importResponse = { ...response("Imported preview"), contentState: importedContent };
const submitMarkdown = (markdown = "# Imported story") => {
  fireEvent.click(screen.getByText("Import Markdown"));
  fireEvent.change(screen.getByLabelText("Markdown input"), { target: { value: markdown } });
  fireEvent.click(screen.getByRole("button", { name: "Replace editor content" }));
};

it("imports Markdown into the editor, persists it, and refreshes the preview", async () => {
  vi.mocked(postRequest)
    .mockResolvedValueOnce(response("Original preview"))
    .mockResolvedValueOnce(importResponse);
  render(<App />);
  await screen.findByText("Original preview");
  submitMarkdown();
  await screen.findByText("Imported preview");
  expect(screen.getByTestId("editor-content").textContent).toContain("Imported story");
  expect(JSON.parse(window.localStorage.getItem("contentState")!)).toEqual(importedContent);
  expect(postRequest).toHaveBeenLastCalledWith(
    "/api/export",
    expect.objectContaining({ markdown: "# Imported story" }),
  );
  expect(screen.getByText(/Markdown imported/).getAttribute("role")).toBe("status");
});

it("preserves current content and Markdown input when import fails, then allows retry", async () => {
  vi.mocked(postRequest)
    .mockResolvedValueOnce(response("Original preview"))
    .mockRejectedValueOnce(new Error("Offline"))
    .mockResolvedValueOnce(importResponse);
  render(<App />);
  await screen.findByText("Original preview");
  submitMarkdown();
  await screen.findByText(/Markdown could not be imported/);
  expect(screen.getByText("Original preview")).toBeTruthy();
  expect(screen.getByTestId("editor-content").textContent).not.toContain("Imported story");
  expect((screen.getByLabelText("Markdown input") as HTMLTextAreaElement).value).toBe(
    "# Imported story",
  );
  fireEvent.click(screen.getByRole("button", { name: "Replace editor content" }));
  await screen.findByText("Imported preview");
});

it("ignores old exports after import succeeds", async () => {
  const initial = pending();
  vi.mocked(postRequest).mockReturnValueOnce(initial.promise).mockResolvedValueOnce(importResponse);
  render(<App />);
  submitMarkdown();
  await screen.findByText("Imported preview");
  await act(async () => initial.resolve(response("Stale preview")));
  expect(screen.getByText("Imported preview")).toBeTruthy();
  expect(screen.queryByText("Stale preview")).toBeNull();
});

it("does not overwrite newer content with a pending import", async () => {
  const request = pending();
  vi.mocked(postRequest)
    .mockResolvedValueOnce(response("Original preview"))
    .mockReturnValueOnce(request.promise)
    .mockResolvedValueOnce(response("Updated preview"));
  render(<App />);
  await screen.findByText("Original preview");
  submitMarkdown();
  // Simulate a delayed editor save that arrives while the import is pending.
  fireEvent.click(screen.getByText("Edit story"));
  await screen.findByText("Updated preview");
  await act(async () => request.resolve(importResponse));
  expect(screen.getByText(/changed during import/)).toBeTruthy();
  expect(screen.getByTestId("editor-content").textContent).toContain("Updated story");
});

it("clears the editor when importing empty Markdown", async () => {
  vi.mocked(postRequest)
    .mockResolvedValueOnce(response("Original preview"))
    .mockResolvedValueOnce({ ...response(""), contentState: { blocks: [], entityMap: {} } });
  render(<App />);
  await screen.findByText("Original preview");
  submitMarkdown("");
  await screen.findByText(/Markdown imported/);
  expect(screen.getByTestId("editor-content").textContent).toBe("null");
  expect(window.localStorage.getItem("contentState")).toBe("null");
});

it("keeps the document when the import response is malformed", async () => {
  vi.mocked(postRequest)
    .mockResolvedValueOnce(response("Original preview"))
    .mockResolvedValueOnce({ ...response("Bad preview"), contentState: {} });
  render(<App />);
  await screen.findByText("Original preview");
  submitMarkdown();
  await screen.findByText(/import response was invalid/);
  expect(screen.getByText("Original preview")).toBeTruthy();
});
