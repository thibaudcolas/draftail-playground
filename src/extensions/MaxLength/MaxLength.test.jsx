import React from "react";
import { convertFromRaw, EditorState } from "draft-js";
import { shallow, mount } from "enzyme";
import MaxLength, { MaxLengthDecorator } from "./MaxLength";

describe("MaxLength", () => {
  it("works", () => {
    expect(
      shallow(<MaxLength getEditorState={() => EditorState.createEmpty()} />),
    ).toMatchSnapshot();
  });

  it("recovers from sessionStorage / JSON parsing issues", () => {
    window.sessionStorage.setItem('threshold', "140")
    jest.spyOn(JSON, "parse").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(() => {
      mount(<MaxLength getEditorState={() => EditorState.createEmpty()} />);
    }).toThrow();

    jest.restoreAllMocks();
  });
});

describe("MaxLengthDecorator", () => {
  it("decorates", () => {
    const decorator = new MaxLengthDecorator();
    expect(shallow(decorator.component(<div>Test!</div>)))
      .toMatchInlineSnapshot(`
<mark
  className="overflow-mark"
/>
`);
  });

  describe("finds decorations", () => {
    it("single block below threshold", () => {
      const decorator = new MaxLengthDecorator();
      const callback = jest.fn();

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
      const callback = jest.fn();

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
      const callback = jest.fn();

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
      const callback = jest.fn();

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
