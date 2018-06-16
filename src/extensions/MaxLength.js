import { EditorState } from "draft-js";
import PropTypes from "prop-types";
import React from "react";
import { ToolbarButton } from "draftail";

const MAX_CONTENT_LENGTH = 50;

const getCounterColor = (contentLength) => {
  let color = "#1da1f2";

  if (contentLength >= MAX_CONTENT_LENGTH) {
    color = "#ff4136";
  } else if (contentLength + 10 >= MAX_CONTENT_LENGTH) {
    color = "orange";
  }

  return color;
};

/**
 * A basic control showing the reading time / content length for the editor’s content.
 */
const MaxLength = ({ getEditorState, onChange }) => {
  const editorState = getEditorState();
  const content = editorState.getCurrentContent();
  const contentLength = content
    .getBlockMap()
    .reduce((length, block) => length + block.getLength(), 0);
  const isOverThreshold = contentLength > MAX_CONTENT_LENGTH;

  const radius = 8;
  const circumference = radius * 2 * Math.PI;
  const color = getCounterColor(contentLength);

  return (
    <svg
      height="16"
      width="16"
      style={{
        overflow: "visible",
        transform: "rotate(-90deg)",
      }}
    >
      <circle
        cx="50%"
        cy="50%"
        r={radius}
        fill="none"
        strokeWidth="1"
        stroke="#eee"
      />
      <circle
        cx="50%"
        cy="50%"
        r={radius}
        fill="none"
        strokeWidth="2"
        stroke={color}
        style={{
          strokeDasharray: circumference,
          strokeDashoffset: isOverThreshold
            ? 0
            : circumference -
              (circumference * contentLength) / MAX_CONTENT_LENGTH,
        }}
      />
    </svg>
  );
};

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
