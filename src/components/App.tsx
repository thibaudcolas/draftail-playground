import React from "react";
import styled from "styled-components";
import { RawDraftContentState, convertFromRaw, convertToRaw } from "draft-js";

import { getInitialContentState, saveContentState, postRequest } from "../utils";

import SidePanel from "./SidePanel";
import LivePage from "./LivePage";
import Editor from "./Editor";
import Exports from "./Exports";
import MarkdownInput from "./MarkdownInput";

const initialContentState = getInitialContentState();

const initialConfig = {
  entity_decorators: {
    LINK: "link",
    IMAGE: "image",
    HORIZONTAL_RULE: "hr",
  },
  block_map: {
    "header-three": "h3",
    "header-four": "h4",
    "ordered-list-item": {
      element: "li",
      wrapper: "ol",
    },
    "unordered-list-item": {
      element: "li",
      wrapper: "ul",
      wrapper_props: {
        class: "bullet-list",
      },
    },
  },
  style_map: {
    BOLD: "strong",
    ITALIC: {
      element: "em",
      props: {
        class: "u-font-italic",
      },
    },
  },
};

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;

  > :last-child {
    flex: 1;
  }

  @media screen and (min-width: 768px) {
    flex-direction: row;
  }
`;

type Props = {};

type Export = {
  html: string;
  markdown: string;
  prettified: string;
};

const isExport = (result: unknown): result is Export =>
  !!result &&
  typeof result === "object" &&
  "html" in result &&
  typeof result.html === "string" &&
  "markdown" in result &&
  typeof result.markdown === "string" &&
  "prettified" in result &&
  typeof result.prettified === "string";

type State = {
  contentState: RawDraftContentState | null;
  exporterConfig: {};
  exportError: string;
  storageError: string;
  exporting: boolean;
  slowExport: boolean;
  importing: boolean;
  editorRevision: number;
} & Export;

class App extends React.Component<Props, State> {
  private requestId = 0;
  private mounted = false;
  private progressTimeout?: number;

  constructor(props: Props) {
    super(props);

    this.state = {
      contentState: initialContentState,
      exporterConfig: initialConfig,
      html: "",
      markdown: "",
      prettified: "",
      exportError: "",
      storageError: "",
      exporting: false,
      slowExport: false,
      importing: false,
      editorRevision: 0,
    };

    this.onSave = this.onSave.bind(this);
    this.onChangeConfig = this.onChangeConfig.bind(this);
  }

  componentDidMount() {
    this.mounted = true;
    this.exportContent();
  }

  componentWillUnmount() {
    this.mounted = false;
    this.requestId += 1;
    window.clearTimeout(this.progressTimeout);
  }

  exportContent = async () => {
    const requestId = ++this.requestId;
    const { contentState, exporterConfig } = this.state;
    window.clearTimeout(this.progressTimeout);
    this.setState({ exporting: true, slowExport: false, exportError: "" });
    this.progressTimeout = window.setTimeout(() => {
      if (requestId === this.requestId) this.setState({ slowExport: true });
    }, 1000);
    try {
      const result = await postRequest("/api/export", { contentState, exporterConfig });
      if (!isExport(result)) {
        throw new Error("Invalid export response");
      }
      if (requestId === this.requestId) {
        this.setState({
          html: result.html,
          markdown: result.markdown,
          prettified: result.prettified,
          exporting: false,
          slowExport: false,
        });
      }
    } catch {
      if (requestId === this.requestId) {
        this.setState({
          exporting: false,
          slowExport: false,
          exportError:
            "Export failed. The preview and exports may be out of date. Check your connection and configuration, then retry.",
        });
      }
    } finally {
      if (requestId === this.requestId) window.clearTimeout(this.progressTimeout);
    }
  };

  onSave(contentState: RawDraftContentState | null) {
    let storageError = "";
    try {
      saveContentState(contentState);
    } catch {
      storageError =
        "Your changes could not be saved in this browser. Keep this page open to avoid losing them.";
    }
    this.setState({ contentState, storageError }, this.exportContent);
  }

  importMarkdown = async (markdown: string) => {
    const requestId = this.requestId;
    const { exporterConfig } = this.state;
    this.setState({ importing: true });
    try {
      const result = await postRequest("/api/export", { markdown, exporterConfig });
      if (!this.mounted) return;
      if (requestId !== this.requestId) {
        throw new Error(
          "The editor or configuration changed during import. Please retry to replace the latest content.",
        );
      }
      if (
        !isExport(result) ||
        !("contentState" in result) ||
        !result.contentState ||
        typeof result.contentState !== "object" ||
        !("blocks" in result.contentState) ||
        !Array.isArray(result.contentState.blocks) ||
        !("entityMap" in result.contentState)
      ) {
        throw new Error("The import response was invalid. Your current content has been kept.");
      }
      // Validate and normalize the imported data before mounting a new Draftail editor.
      const contentState = result.contentState.blocks.length
        ? convertToRaw(convertFromRaw(result.contentState as RawDraftContentState))
        : null;
      let storageError = "";
      try {
        saveContentState(contentState);
      } catch {
        storageError =
          "Your changes could not be saved in this browser. Keep this page open to avoid losing them.";
      }
      this.requestId += 1;
      window.clearTimeout(this.progressTimeout);
      this.setState(({ editorRevision }) => ({
        contentState,
        editorRevision: editorRevision + 1,
        storageError,
        html: result.html,
        markdown: result.markdown,
        prettified: result.prettified,
        exportError: "",
        exporting: false,
        slowExport: false,
      }));
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.startsWith("The editor") || error.message.startsWith("The import"))
      )
        throw error;
      throw new Error(
        "Markdown could not be imported. Your current content has been kept. Check your connection and configuration, then retry.",
      );
    } finally {
      if (this.mounted) this.setState({ importing: false });
    }
  };

  onChangeConfig(update: { updated_src: {} }) {
    this.setState({ exporterConfig: update.updated_src }, this.exportContent);
  }

  render() {
    const {
      contentState,
      html,
      markdown,
      prettified,
      exporterConfig,
      exportError,
      storageError,
      exporting,
      slowExport,
    } = this.state;

    return (
      <AppContainer>
        <SidePanel>
          <Editor
            key={this.state.editorRevision}
            rawContentState={contentState}
            onSave={this.onSave}
            readOnly={this.state.importing}
          />
          <MarkdownInput onImport={this.importMarkdown} />

          <p role="status">{storageError}</p>
          <p role="status">{exportError || (slowExport ? "Export in progress…" : "")}</p>

          <button
            type="button"
            onClick={() => {
              if (!exporting) this.exportContent();
            }}
            aria-disabled={exporting}
          >
            {exporting ? "Exporting…" : exportError ? "Retry export" : "Update exports"}
          </button>
          <Exports
            markdown={markdown}
            contentState={contentState}
            prettified={prettified}
            exporterConfig={exporterConfig}
            onChangeConfig={this.onChangeConfig}
          />
        </SidePanel>
        <LivePage html={html} />
      </AppContainer>
    );
  }
}

export default App;
