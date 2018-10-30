import { EditorState } from "draft-js";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { ToolbarButton } from "draftail";
import Select from "react-simpler-select";

import Modal from "../../components/Modal";
import ProgressMeter from "./ProgressMeter";

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
          contentLabel="Maximum length"
        >
          <label>
            <p>How long should your content be?</p>
            <Select
              className="MaxLength__select"
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

/**
 * Creates text decorations based on the length of text of each block, and its preceding blocks.
 */
export class MaxLengthDecorator {
  constructor() {
    this.blockLength = {};
    this.component = this.renderDecoration.bind(this);
    this.strategy = this.createDecorations.bind(this);
  }

  renderDecoration({ children }) {
    return <mark className="overflow-mark">{children}</mark>;
  }

  createDecorations(block, callback, contentState) {
    const blockKey = block.getKey();
    const blockLength = block.getLength();

    const previousContentLength = contentState
      .getBlockMap()
      .takeUntil((block) => block.getKey() === blockKey)
      .reduce((length, block) => length + block.getLength(), 0);

    const currentLength = previousContentLength + blockLength;
    const threshold = getDefaultThreshold();
    const shouldDecorate = currentLength > threshold;

    if (shouldDecorate) {
      // Decorate from the first character going over the threshold, to the end of the block.
      const startOffset = Math.max(0, threshold - previousContentLength);
      callback(startOffset, blockLength);
    }
  }
}

export default MaxLength;
