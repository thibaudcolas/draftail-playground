import React, { Component } from "react";
import { Icon } from "draftail";
import { ContentState } from "draft-js";

import Tooltip, { Target } from "../components/Tooltip";
import Portal from "../components/Portal";

import "./TooltipEntity.css";

const shortenLabel = (label: string) => {
  let shortened = label;
  if (shortened.length > 25) {
    shortened = `${shortened.slice(0, 20)}…`;
  }

  return shortened;
};

type Props = {
  entityKey: string;
  contentState: ContentState;
  children: React.ReactNode;
  onEdit: Function;
  onRemove: Function;
  icon: string | Object | Array<string>;
  label: string;
};

type State = {
  showTooltipAt?: {
    container: Element;
  } & Target;
};

class TooltipEntity extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      showTooltipAt: undefined,
    };

    this.openTooltip = this.openTooltip.bind(this);
    this.closeTooltip = this.closeTooltip.bind(this);
  }

  openTooltip(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    const trigger = (e.target as HTMLAnchorElement).closest(
      "[data-draftail-trigger]",
    );
    const container = document.body;
    const containerRect = container.getBoundingClientRect();

    // Click is within the tooltip.
    if (!trigger || !document.documentElement || !document.body) {
      return;
    }

    const rect = trigger.getBoundingClientRect();

    this.setState({
      showTooltipAt: {
        container,
        top:
          rect.top -
          containerRect.top -
          (document.documentElement.scrollTop || document.body.scrollTop),
        left:
          rect.left -
          containerRect.left -
          (document.documentElement.scrollLeft || document.body.scrollLeft),
        width: rect.width,
        height: rect.height,
      },
    });
  }

  closeTooltip() {
    this.setState({ showTooltipAt: undefined });
  }

  render() {
    const { entityKey, contentState, children, onEdit, onRemove, icon, label } =
      this.props;
    const { showTooltipAt } = this.state;
    const { url } = contentState.getEntity(entityKey).getData();

    // Contrary to what JSX A11Y says, this should be a button but it shouldn't be focusable.
    /* eslint-disable jsx-a11y/anchor-is-valid */
    return (
      <a
        role="button"
        onMouseUp={this.openTooltip}
        className="TooltipEntity"
        data-draftail-trigger
      >
        <Icon icon={icon} className="TooltipEntity__icon" />
        {children}
        {showTooltipAt && (
          <Portal
            node={showTooltipAt.container}
            onClose={this.closeTooltip}
            closeOnClick
            closeOnType
            closeOnResize
          >
            <Tooltip target={showTooltipAt} direction="top-left">
              <a
                href={url}
                title={url}
                target="_blank"
                rel="noopener noreferrer"
                className="Tooltip__link"
              >
                {shortenLabel(label)}
              </a>

              <button
                className="Tooltip__button"
                onClick={onEdit.bind(null, entityKey)}
              >
                Edit
              </button>

              <button
                className="Tooltip__button"
                onClick={onRemove.bind(null, entityKey)}
              >
                Remove
              </button>
            </Tooltip>
          </Portal>
        )}
      </a>
    );
  }
}

export default TooltipEntity;
