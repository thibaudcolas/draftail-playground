// @flow
import { Component } from "react";
import { createPortal } from "react-dom";
import type { Node } from "react";

type Props = {
  onClose: Function,
  node: Element,
  children: Node,
  closeOnClick: boolean,
  closeOnType: boolean,
  closeOnResize: boolean,
};

/**
 * A Portal component which automatically closes itself
 * when certain events happen outside.
 * See https://reactjs.org/docs/portals.html.
 */
class Portal extends Component<Props> {
  portal: HTMLDivElement;

  constructor(props: Props) {
    super(props);

    (this: any).portal = document.createElement("div");

    (this: any).onCloseEvent = this.onCloseEvent.bind(this);
  }

  onCloseEvent(e: Event) {
    const { onClose } = this.props;

    // $FlowFixMe
    if (!this.portal.contains(e.target)) {
      onClose();
    }
  }

  componentDidMount() {
    const {
      node,
      onClose,
      closeOnClick,
      closeOnType,
      closeOnResize,
    } = this.props;

    node.appendChild(this.portal);

    if (closeOnClick) {
      document.addEventListener("mouseup", this.onCloseEvent);
    }

    if (closeOnType) {
      document.addEventListener("keyup", this.onCloseEvent);
    }

    if (closeOnResize) {
      window.addEventListener("resize", onClose);
    }
  }

  componentWillUnmount() {
    const { node, onClose } = this.props;

    node.removeChild(this.portal);

    document.removeEventListener("mouseup", this.onCloseEvent);
    document.removeEventListener("keyup", this.onCloseEvent);
    window.removeEventListener("resize", onClose);
  }

  render() {
    const { children } = this.props;

    return createPortal(children, this.portal);
  }
}

// $FlowFixMe
Portal.defaultProps = {
  node: document.body,
  children: null,
  closeOnClick: false,
  closeOnType: false,
  closeOnResize: false,
};

export default Portal;
