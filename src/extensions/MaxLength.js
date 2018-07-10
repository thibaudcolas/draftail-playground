import { EditorState } from "draft-js";
import PropTypes from "prop-types";
import React, { Component, PureComponent } from "react";
import { ToolbarButton } from "draftail";
import Select from "react-simpler-select";

import Modal from "../components/Modal";

import "./MaxLength.css";

const CONTENT_LENGTHS = {};
CONTENT_LENGTHS[140] = "Tweet";
CONTENT_LENGTHS[280] = "Double tweet";
CONTENT_LENGTHS[3 * 10 * 200] = "3-min read";
CONTENT_LENGTHS[211591 * 10 * 200] = "Crime and Punishment";

const CONTENT_LENGTH_OPTIONS = Object.keys(CONTENT_LENGTHS).map((value) => ({
  value,
  label: CONTENT_LENGTHS[value],
}));

const getDefaultThreshold = () => {
  return (
    JSON.parse(window.sessionStorage.getItem("threshold")) ||
    CONTENT_LENGTH_OPTIONS[0].value
  );
};

const getMeterColor = (progress) => {
  let color = "#1da1f2";

  if (progress >= 1) {
    color = "#ff4136";
  } else if (progress >= 0.9) {
    color = "orange";
  }

  return color;
};

const forceResetEditorState = (editorState) => {
  return EditorState.set(
    EditorState.createWithContent(
      editorState.getCurrentContent(),
      editorState.getDecorator(),
    ),
    {
      selection: editorState.getSelection(),
      undoStack: editorState.getUndoStack(),
      redoStack: editorState.getRedoStack(),
    },
  );
};

const delayAndIdle = (timeoutHandle, idleHandle, callback) => {
  if (timeoutHandle) {
    window.clearTimeout(timeoutHandle);
  }

  if (idleHandle) {
    window.clearIdleCallback(idleHandle);
  }

  if (window.requestIdleCallback) {
    timeoutHandle = window.setTimeout(() => {
      idleHandle = window.requestIdleCallback(callback, {
        timeout: 500,
      });
    }, 500);
  } else {
    timeoutHandle = window.setTimeout(callback, 1000);
  }
};

class ProgressMeter extends PureComponent {
  render() {
    const { radius, progress } = this.props;
    const diameter = radius * 2;
    const circumference = diameter * Math.PI;
    const isFull = progress >= 1;

    return (
      <svg
        height={diameter}
        width={diameter}
        className={`ProgressMeter Draftail-Icon${
          isFull ? " ProgressMeter--pulse" : ""
        }`}
      >
        <circle
          className="ProgressMeter__background"
          cx="50%"
          cy="50%"
          r={radius}
        />
        <circle
          className="ProgressMeter__progressbar"
          cx="50%"
          cy="50%"
          r={radius}
          stroke={getMeterColor(progress)}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: isFull
              ? 0
              : circumference - circumference * progress,
          }}
        />
      </svg>
    );
  }
}

/**
 * A basic control showing the reading time / content length for the editor’s content.
 */
class MaxLength extends Component {
  constructor(props) {
    super(props);
    const threshold = getDefaultThreshold();

    this.state = {
      isOpen: false,
      threshold,
    };

    this.onRequestClose = this.onRequestClose.bind(this);
    this.onChangeThreshold = this.onChangeThreshold.bind(this);
    this.forceRenderDecorators = this.forceRenderDecorators.bind(this);
    this.delayForceResetEditorState = delayAndIdle.bind(
      null,
      this.timeoutHandle,
      this.idleHandle,
      this.forceRenderDecorators,
    );
  }

  onRequestClose() {
    this.setState({
      isOpen: false,
    });
  }

  onChangeThreshold(value) {
    const threshold = Number(value);
    this.setState({
      threshold,
    });

    window.sessionStorage.setItem("threshold", JSON.stringify(threshold));

    this.forceRenderDecorators();
  }

  forceRenderDecorators() {
    const { getEditorState, onChange } = this.props;
    const editorState = getEditorState();

    onChange(forceResetEditorState(editorState));
  }

  componentDidUpdate() {
    const { getEditorState } = this.props;
    const editorState = getEditorState();
    const lastChange = editorState.getLastChangeType();

    if (lastChange) {
      this.forceRenderDecorators();
    }
  }

  render() {
    const { getEditorState } = this.props;
    const { isOpen, threshold } = this.state;
    const editorState = getEditorState();
    const content = editorState.getCurrentContent();
    const contentLength = content
      .getBlockMap()
      .reduce((length, block) => length + block.getLength(), 0);

    return (
      <React.Fragment>
        <ToolbarButton
          name="MAX_LENGTH"
          title={`Max length: ${CONTENT_LENGTHS[threshold].label}`}
          icon={
            <ProgressMeter radius={8} progress={contentLength / threshold} />
          }
          onClick={() => {
            this.setState({
              isOpen: true,
            });
          }}
        />
        <Modal
          onRequestClose={this.onRequestClose}
          onAfterOpen={this.onAfterOpen}
          isOpen={isOpen}
          contentLabel="Max length chooser"
        >
          <label>
            Set a length threshold
            <Select
              value={threshold}
              options={CONTENT_LENGTH_OPTIONS}
              onChange={this.onChangeThreshold}
            />
          </label>
        </Modal>
      </React.Fragment>
    );
  }
}

MaxLength.propTypes = {
  getEditorState: PropTypes.func.isRequired,
};

export class MaxLengthDecorator {
  constructor() {
    this.blockLength = {};
    this.component = this.renderToken.bind(this);
    this.strategy = this.getDecorations.bind(this);
  }

  // Renders the decorated tokens.
  renderToken({ children }) {
    return <mark className="overflow-mark">{children}</mark>;
  }

  getDecorations(block, callback, contentState) {
    const blockKey = block.getKey();
    const blockLength = block.getLength();

    const previousContentLength = contentState
      .getBlockMap()
      .takeUntil((block) => block.getKey() === blockKey)
      .reduce((length, block) => length + block.getLength(), 0);

    const threshold = getDefaultThreshold();

    if (previousContentLength + blockLength > threshold) {
      console.log("decorate");
      const startOffset = Math.max(0, threshold - previousContentLength);
      callback(startOffset, blockLength);
    }
  }
}

export default MaxLength;
