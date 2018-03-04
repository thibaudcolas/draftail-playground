// @flow
import React from "react";
import styled from "styled-components";
import { ResizableBox, Resizable } from "react-resizable";
import type { Node } from "react";

import "./SidePanel.css";

// Remove propTypes declaration preventing 100% height.
delete Resizable.propTypes;
delete ResizableBox.propTypes;

const VIEWPORT_WIDTH = document.documentElement
  ? document.documentElement.clientWidth
  : 1024;
const IS_BIG = VIEWPORT_WIDTH >= 768;
const MIN_PANEL_WIDTH = IS_BIG ? 320 : VIEWPORT_WIDTH;
const MIN_PREVIEW_WIDTH = 320;
const MAX_PANEL_WIDTH = VIEWPORT_WIDTH - (IS_BIG ? MIN_PREVIEW_WIDTH : 0);
const RESIZABLE_AXIS = IS_BIG ? "x" : "none";

console.log(MAX_PANEL_WIDTH);

const savedWidth = Number(window.sessionStorage.getItem("panel-width"));
const initWidth = savedWidth || Math.max(MIN_PANEL_WIDTH, VIEWPORT_WIDTH * 0.4);

const saveWidth = (
  e: SyntheticEvent<EventTarget>,
  { size }: { size: { width: number, height: number } },
) => {
  window.sessionStorage.setItem("panel-width", size.width);
};

const Container = styled.div`
  padding: 1rem;

  @media screen and (min-width: 768px) {
    min-height: 100vh;
    border-right: 1px solid #333;
    padding: 2rem;
  }
`;

type Props = {
  children: Node,
};

const SidePanel = ({ children }: Props) => (
  <ResizableBox
    width={initWidth}
    height="100%"
    axis={RESIZABLE_AXIS}
    minConstraints={[MIN_PANEL_WIDTH, "100%"]}
    maxConstraints={[MAX_PANEL_WIDTH, "100%"]}
    onResizeStop={saveWidth}
  >
    <Container>{children}</Container>
  </ResizableBox>
);

export default SidePanel;
