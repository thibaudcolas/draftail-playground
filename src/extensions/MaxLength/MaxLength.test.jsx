import React from "react";
import { convertFromRaw, EditorState } from "draft-js";
import { render } from "@testing-library/react";
import { vi } from "vitest";
import MaxLength, { MaxLengthDecorator } from "./MaxLength";

describe("MaxLength", () => {
  it("works", () => {
    const { container } = render(<MaxLength getEditorState={() => EditorState.createEmpty()} />);
    expect(container).toMatchSnapshot();
  });

  it("recovers from sessionStorage / JSON parsing issues", () => {
    window.sessionStorage.setItem("threshold", "140");
    const parseSpy = vi.spyOn(JSON, "parse").mockImplementationOnce(() => {
      throw new Error();
    });

    // getDefaultThreshold() catches the JSON.parse error and logs it via
    // console.error, which setupTests re-throws. The app recovers
    // (renders with the default threshold), so silence that logger here.
    const consoleError = console.error;
    console.error = () => {};

    try {
      render(<MaxLength getEditorState={() => EditorState.createEmpty()} />);
    } finally {
      console.error = consoleError;
      parseSpy.mockRestore();
    }
  });
});

describe("MaxLengthDecorator", () => {
  it("decorates", () => {
    const decorator = new MaxLengthDecorator();
    render(decorator.component({ children: <div>Test!</div> }));
    expect(document.querySelector("mark.overflow-mark")?.textContent).toBe("Test!");
  });

  describe("finds decorations", () => {
    it("single block below threshold", () => {
      const decorator = new MaxLengthDecorator();
      const callback = vi.fn();

      const content = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "a",
            text: "test",
          },
        ],
      });
      const block = content.getFirstBlock();
      decorator.strategy(block, callback, content);
      expect(callback).not.toHaveBeenCalledWith();
    });

    it("single block above threshold", () => {
      const decorator = new MaxLengthDecorator();
      const callback = vi.fn();

      const content = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "a",
            text: "test".repeat(200),
          },
        ],
      });
      const block = content.getFirstBlock();
      decorator.strategy(block, callback, content);
      expect(callback).not.toHaveBeenCalledWith();
    });

    it("multiple blocks below threshold", () => {
      const decorator = new MaxLengthDecorator();
      const callback = vi.fn();

      const content = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "a",
            text: "test",
          },
          {
            key: "b",
            text: "test",
          },
        ],
      });
      const block = content.getFirstBlock();
      decorator.strategy(block, callback, content);
      expect(callback).not.toHaveBeenCalledWith();
    });

    it("multiple blocks above threshold", () => {
      const decorator = new MaxLengthDecorator();
      const callback = vi.fn();

      const content = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "a",
            text: "test".repeat(200),
          },
          {
            key: "b",
            text: "test",
          },
        ],
      });
      const block = content.getFirstBlock();
      decorator.strategy(block, callback, content);
      expect(callback).not.toHaveBeenCalledWith();
    });
  });
});
