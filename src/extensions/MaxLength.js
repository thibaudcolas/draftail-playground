import { EditorState } from "draft-js";
import PropTypes from "prop-types";
import React, { Component, PureComponent } from "react";
import { ToolbarButton } from "draftail";
import Select from "react-simpler-select";

import Modal from "../components/Modal";

import "./MaxLength.css";

const MAX_CONTENT_LENGTH = 50;

const CONTENT_LENGTHS = {};
CONTENT_LENGTHS[140] = "Tweet";
CONTENT_LENGTHS[280] = "Double tweet";
CONTENT_LENGTHS[1 * 10 * 200] = "1-min read";
CONTENT_LENGTHS[3 * 10 * 200] = "3-min read";
CONTENT_LENGTHS[5 * 10 * 200] = "5-min read";
CONTENT_LENGTHS[10 * 10 * 200] = "10-min read";
CONTENT_LENGTHS[211591 * 10 * 200] = "Crime and Punishment";

const CONTENT_LENGTH_OPTIONS = Object.keys(CONTENT_LENGTHS).map((value) => ({
  value,
  label: CONTENT_LENGTHS[value],
}));

const getMeterColor = (progress) => {
  let color = "#1da1f2";

  if (progress >= 1) {
    color = "#ff4136";
  } else if (progress >= 0.9) {
    color = "orange";
  }

  return color;
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

    this.state = {
      isOpen: false,
      threshold: CONTENT_LENGTH_OPTIONS[0].value,
    };

    this.onRequestClose = this.onRequestClose.bind(this);
    this.onChangeThreshold = this.onChangeThreshold.bind(this);
  }

  onRequestClose() {
    this.setState({
      isOpen: false,
    });
  }

  onChangeThreshold(threshold) {
    const { getEditorState, onChange } = this.props;
    const editorState = getEditorState();
    this.setState({
      threshold: Number(threshold),
    });
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
  renderToken({ children, contentState }) {
    console.log(contentState.getPlainText().length);
    return (
      <mark
        key={contentState.getPlainText().length}
        style={{ backgroundColor: "#ff4136" }}
      >
        {children}
      </mark>
    );
  }

  getDecorations(block, callback, contentState) {
    const blockKey = block.getKey();
    const blockLength = block.getLength();

    // TODO Needs to remove the blocks when they are gone.
    // this.blockLength[blockKey] = blockLength;

    let isBeforeCurrent = true;
    const previousContentLength = contentState
      .getBlockMap()
      .filter((block) => {
        isBeforeCurrent = isBeforeCurrent && block.getKey() !== blockKey;
        return isBeforeCurrent;
      })
      .reduce((length, block) => length + block.getLength(), 0);

    // const previousContentLength = Object.keys(this.blockLength)
    //   .filter((key, i, keys) => i < keys.indexOf(blockKey))
    //   .reduce((length, key) => {
    //     return length + this.blockLength[key];
    //   }, 0);

    console.log(previousContentLength);

    if (previousContentLength + blockLength > MAX_CONTENT_LENGTH) {
      const startOffset = Math.max(
        0,
        MAX_CONTENT_LENGTH - previousContentLength,
      );
      callback(startOffset, blockLength);
    }
  }
}

export default MaxLength;
