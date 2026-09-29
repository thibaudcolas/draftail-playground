import React from "react";
import { render } from "@testing-library/react";
import ProgressMeter from "./ProgressMeter";

describe("ProgressMeter", () => {
  it("works", () => {
    const { container } = render(<ProgressMeter radius={8} progress={0.5} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("has the warning color", () => {
    const { container } = render(<ProgressMeter radius={8} progress={0.9} />);
    const progressbar = container.querySelector(".ProgressMeter__progressbar") as SVGElement;
    expect(progressbar.getAttribute("stroke")).toBe("orange");
  });

  it("has the error color", () => {
    const { container } = render(<ProgressMeter radius={8} progress={1} />);
    const progressbar = container.querySelector(".ProgressMeter__progressbar") as SVGElement;
    expect(progressbar.getAttribute("stroke")).toBe("#ff4136");
  });

  it("animates", () => {
    const { container } = render(<ProgressMeter radius={8} progress={1} />);
    const svg = container.querySelector("svg") as SVGElement;
    expect(svg.getAttribute("class")).toBe("ProgressMeter Draftail-Icon ProgressMeter--pulse");
  });
});
