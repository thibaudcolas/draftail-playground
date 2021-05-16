import { Component } from "react";
import { createPortal } from "react-dom";

type Props = {
  onClose: () => void;
  node: Element;
  children: React.ReactNode;
  closeOnClick: boolean;
  closeOnType: boolean;
  closeOnResize: boolean;
};

/**
 * A Portal component which automatically closes itself
 * when certain events happen outside.
 * See https://reactjs.org/docs/portals.html.
 */
class Portal extends Component<Props> {
  portal: HTMLDivElement;

  static defaultProps = {
    node: document.body,
    children: null,
    closeOnClick: false,
    closeOnType: false,
    closeOnResize: false,
  };

  constructor(props: Props) {
    super(props);

    this.portal = document.createElement("div");
    this.onCloseEvent = this.onCloseEvent.bind(this);
  }

  onCloseEvent(e: Event) {
    const { onClose } = this.props;

    if (!this.portal.contains(e.target as Element)) {
      onClose();
    }
  }

  componentDidMount() {
    const { node, onClose, closeOnClick, closeOnType, closeOnResize } =
      this.props;

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

export default Portal;
