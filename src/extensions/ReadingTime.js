import PropTypes from "prop-types";
import React from "react";
import readingTime from "reading-time";
import { ToolbarButton } from "draftail";

/**
 * A basic control showing the reading time / content length for the editor’s content.
 */
const ReadingTime = ({ getEditorState }) => {
  const editorState = getEditorState();
  const content = editorState.getCurrentContent();
  const text = content.getPlainText();
  const stats = readingTime(text);
  return (
    <ToolbarButton
      name="READING_TIME"
      label={stats.text}
      title={`${text.length} characters`}
      onClick={() => {
        // eslint-disable-next-line no-alert
        window.alert(`${stats.words} words, ${text.length} characters`);
      }}
    />
  );
};

ReadingTime.propTypes = {
  getEditorState: PropTypes.func.isRequired,
};

export default ReadingTime;
