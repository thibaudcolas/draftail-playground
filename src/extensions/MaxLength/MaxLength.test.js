import React from "react";
import { convertFromRaw } from "draft-js";
import { shallow } from "enzyme";
import MaxLength, { MaxLengthDecorator } from "./MaxLength";

describe("MaxLength", () => {
  it("works", () => {
    expect(
      shallow(<MaxLength radius={8} progress={0.5} />),
    ).toMatchInlineSnapshot();
  });
});
describe("MaxLengthDecorator", () => {
  it("decorates", () => {
    const decorator = new MaxLengthDecorator();
    expect(
      shallow(decorator.component(<div>Test!</div>)),
    ).toMatchInlineSnapshot();
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
