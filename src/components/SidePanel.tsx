import React from "react";
import styled from "styled-components";
import { ResizableBox, Resizable } from "react-resizable";

import "./SidePanel.css";

// Remove propTypes declaration preventing 100% height.
// eslint-disable-next-line react/forbid-foreign-prop-types
delete (Resizable as any).propTypes;
// eslint-disable-next-line react/forbid-foreign-prop-types
delete (ResizableBox as any).propTypes;

const VIEWPORT_WIDTH = document.documentElement
  ? document.documentElement.clientWidth
  : 1024;
const IS_BIG = VIEWPORT_WIDTH >= 768;
const IS_DESKTOP = VIEWPORT_WIDTH >= 1024;
const MIN_PANEL_WIDTH = IS_BIG ? 400 : "100%";
const MIN_PREVIEW_WIDTH = 320;
const MAX_PANEL_WIDTH = VIEWPORT_WIDTH - (IS_BIG ? MIN_PREVIEW_WIDTH : 0);
const RESIZABLE_AXIS = IS_BIG ? "x" : "none";

const savedWidth = Number(window.sessionStorage.getItem("panel-width"));
const initWidth =
  savedWidth || IS_BIG
    ? Math.max(IS_BIG ? 400 : 0, VIEWPORT_WIDTH * 0.4, IS_DESKTOP ? 560 : 0)
    : "100%";

const saveWidth = (
  e: React.SyntheticEvent<Element, Event>,
  { size }: { size: { width: number; height: number } },
) => {
  window.sessionStorage.setItem("panel-width", JSON.stringify(size.width));
};

const Container = styled.div`
  padding: 1rem;

  @media screen and (min-width: 768px) {
    min-height: 100vh;
    padding: 2rem;
  }
`;

type Props = {
  children: React.ReactNode;
};

const SidePanel = ({ children }: Props) => (
  <ResizableBox
    // @ts-ignore
    width={initWidth}
    // @ts-ignore
    height="100%"
    axis={RESIZABLE_AXIS}
    // @ts-ignore
    minConstraints={[MIN_PANEL_WIDTH, "100%"]}
    // @ts-ignore
    maxConstraints={[MAX_PANEL_WIDTH, "100%"]}
    onResizeStop={saveWidth}
  >
    <Container>{children}</Container>
  </ResizableBox>
);

export default SidePanel;
