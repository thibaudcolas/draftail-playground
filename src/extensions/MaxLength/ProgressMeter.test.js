import React from "react";
import { shallow } from "enzyme";
import ProgressMeter from "./ProgressMeter";

describe("ProgressMeter", () => {
  it("works", () => {
    expect(shallow(<ProgressMeter radius={8} progress={0.5} />))
      .toMatchInlineSnapshot(`
<svg
  className="ProgressMeter Draftail-Icon"
  height={16}
  width={16}
>
  <circle
    className="ProgressMeter__background"
    cx="50%"
    cy="50%"
    r={8}
  />
  <circle
    className="ProgressMeter__progressbar"
    cx="50%"
    cy="50%"
    r={8}
    stroke="#1da1f2"
    style={
      Object {
        "strokeDasharray": 50.26548245743669,
        "strokeDashoffset": 25.132741228718345,
      }
    }
  />
</svg>
`);
  });

  it("has the warning color", () => {
    expect(
      shallow(<ProgressMeter radius={8} progress={0.9} />)
        .find(".ProgressMeter__progressbar")
        .props().stroke,
    ).toBe("orange");
  });

  it("has the error color", () => {
    expect(
      shallow(<ProgressMeter radius={8} progress={1} />)
        .find(".ProgressMeter__progressbar")
        .props().stroke,
    ).toBe("#ff4136");
  });

  it("animates", () => {
    expect(
      shallow(<ProgressMeter radius={8} progress={1} />)
        .find("svg")
        .prop("className"),
    ).toMatchInlineSnapshot(
      `"ProgressMeter Draftail-Icon ProgressMeter--pulse"`,
    );
  });
});
