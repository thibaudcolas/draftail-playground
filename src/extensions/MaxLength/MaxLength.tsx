import { ContentState, EditorState } from "draft-js";
import React, { Component } from "react";
import { ToolbarButton, ControlProps } from "draftail";
import Select from "react-simpler-select";

import Modal from "../../components/Modal";
import ProgressMeter from "./ProgressMeter";

import "./MaxLength.css";

const CONTENT_LENGTHS = {
  "140": "Tweet",
  "280": "Double tweet",
  // 3 * 10 * 200
  "6000": "3-min read",
  // 211591 * 10 * 200
  "423182000": "Crime and Punishment",
} as const;

const CONTENT_LENGTH_OPTIONS = Object.entries(CONTENT_LENGTHS).map(
  ([value, label]) => ({
    value,
    label,
  }),
);

const getDefaultThreshold = () => {
  let threshold = Number(CONTENT_LENGTH_OPTIONS[0].value);
  try {
    const raw = window.sessionStorage.getItem("threshold");
    if (raw) {
      const saved = JSON.parse(raw);

      if (saved) {
        threshold = Number(saved);
      }
    }
  } catch (e) {
    console.error("sessionStorage unavailable");
  }

  return threshold;
};

/**
 * Forces a reset of the whole editor state, so text decorations are re-calculated on all blocks.
 * By default, Draft.js only updates decorations for the blocks that are under focus.
 */
const forceResetEditorState = (editorState: EditorState) => {
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

type RequestIdleCallbackHandle = any;
type RequestIdleCallbackOptions = {
  timeout: number;
};
type RequestIdleCallbackDeadline = {
  readonly didTimeout: boolean;
  timeRemaining: () => number;
};

declare global {
  interface Window {
    requestIdleCallback: (
      callback: (deadline: RequestIdleCallbackDeadline) => void,
      opts?: RequestIdleCallbackOptions,
    ) => RequestIdleCallbackHandle;
    cancelIdleCallback: (handle: RequestIdleCallbackHandle) => void;
  }
}

/**
 * Execute time-consuming logic out of order with performance-sensitive JS on the main thread.
 */
const delayAndIdle = (callback: () => void, timeoutHandle: number) => {
  if (timeoutHandle) {
    window.clearTimeout(timeoutHandle);
  }

  return window.setTimeout(() => {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(callback, { timeout: 500 });
    } else {
      callback();
    }
  }, 500);
};

/**
 * A basic control showing the reading time / content length for the editor’s content.
 */
class MaxLength extends Component<
  ControlProps,
  { isOpen: boolean; threshold: keyof typeof CONTENT_LENGTHS }
> {
  private timeoutHandle: number;

  constructor(props: ControlProps) {
    super(props);
    const threshold = getDefaultThreshold();

    this.state = {
      isOpen: false,
      threshold,
    };

    this.timeoutHandle = 0;

    this.onClickButton = this.onClickButton.bind(this);
    this.onRequestClose = this.onRequestClose.bind(this);
    this.onChangeThreshold = this.onChangeThreshold.bind(this);
    this.forceRenderDecorators = this.forceRenderDecorators.bind(this);
  }

  onClickButton() {
    this.setState({
      isOpen: true,
    });
  }

  onRequestClose() {
    this.setState({
      isOpen: false,
    });
  }

  forceRenderDecorators() {
    const { getEditorState, onChange } = this.props;
    const editorState = getEditorState();

    this.timeoutHandle = delayAndIdle(() => {
      onChange(forceResetEditorState(editorState));
    }, this.timeoutHandle);
  }

  onChangeThreshold(value: keyof typeof CONTENT_LENGTHS) {
    const threshold = value;
    this.setState({
      threshold,
    });

    if (window.sessionStorage) {
      try {
        window.sessionStorage.setItem("threshold", JSON.stringify(threshold));
      } catch (e) {
        console.error("sessionStorage unavailable");
      }
    }

    this.forceRenderDecorators();
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
    const contentLength = content.getBlockMap().reduce(
      // @ts-ignore
      (length: number, block: { getLength: () => number }): number =>
        length + block.getLength(),
      0,
    );

    return (
      <React.Fragment>
        <ToolbarButton
          name="MAX_LENGTH"
          title={`Length: ${CONTENT_LENGTHS[threshold]}`}
          icon={
            <ProgressMeter
              radius={8}
              progress={contentLength / Number(threshold)}
            />
          }
          onClick={this.onClickButton}
        />
        <Modal
          onRequestClose={this.onRequestClose}
          onAfterOpen={() => {}}
          isOpen={isOpen}
          contentLabel="Maximum length"
        >
          <label>
            <p>How long should the content be?</p>
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

/**
 * Creates text decorations based on the length of text of each block, and its preceding blocks.
 */
export class MaxLengthDecorator {
  private component: (props: { children: React.ReactNode }) => JSX.Element;

  constructor() {
    this.component = this.renderDecoration.bind(this);
    // @ts-ignore
    this.strategy = this.createDecorations.bind(this);
  }

  renderDecoration({ children }: { children: React.ReactNode }) {
    return <mark className="overflow-mark">{children}</mark>;
  }

  createDecorations(
    // @ts-ignore
    block,
    callback: (start: number, length: number) => void,
    contentState: ContentState,
  ) {
    const blockKey = block.getKey();
    const blockLength = block.getLength();

    const previousContentLength = contentState
      .getBlockMap()
      // @ts-ignore
      .takeUntil((block) => block.getKey() === blockKey)
      // @ts-ignore
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
