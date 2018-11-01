import React from "react";
import { shallow } from "enzyme";
import ProgressMeter from "./ProgressMeter";

describe("ProgressMeter", () => {
  it("works", () => {
    expect(
      shallow(<ProgressMeter radius={8} progress={0.5} />),
    ).toMatchInlineSnapshot();
  });

  it("has the warning color", () => {
    expect(
      shallow(<ProgressMeter radius={8} progress={0.9} />)
        .find(".ProgressMeter__progressbar")
        .getDOMNode()
        .getAttribute("stroke"),
    ).toBe("orangeee");
  });

  it("has the error color", () => {
    expect(
      shallow(<ProgressMeter radius={8} progress={1} />)
        .find(".ProgressMeter__progressbar")
        .getDOMNode()
        .getAttribute("stroke"),
    ).toBe("orangeee");
  });

  it("animates", () => {
    expect(
      shallow(<ProgressMeter radius={8} progress={1} />)
        .find("svg")
        .prop("className"),
    ).toMatchInlineSnapshot();
  });
});
