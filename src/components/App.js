import React from "react";
import styled from "styled-components";

import {
  getInitialContentState,
  saveContentState,
  postRequest,
} from "../utils";

import SidePanel from "./SidePanel";
import LivePage from "./LivePage";
import Editor from "./Editor";
import Highlight from "./Highlight";

import JSONView from "react-json-view";

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

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contentState: initialContentState,
      exporterConfig: initialConfig,
      html: "",
      markdown: "",
      prettified: "",
    };

    this.onSave = this.onSave.bind(this);
    this.onChangeConfig = this.onChangeConfig.bind(this);

    this.onSave(initialContentState);
  }

  onSave(contentState) {
    const { exporterConfig } = this.state;

    postRequest(
      "/api/export",
      {
        contentState,
        exporterConfig,
      },
      ({ html, markdown, prettified }) => {
        this.setState({
          contentState,
          html,
          markdown,
          prettified,
        });

        saveContentState(contentState);
      },
    );
  }

  onChangeConfig(update) {
    const { contentState } = this.state;
    const exporterConfig = update.updated_src;

    postRequest(
      "/api/export",
      {
        contentState,
        exporterConfig,
      },
      ({ html, markdown, prettified }) => {
        this.setState({
          exporterConfig,
          html,
          markdown,
          prettified,
        });
      },
    );
  }

  render() {
    const {
      contentState,
      html,
      markdown,
      prettified,
      exporterConfig,
    } = this.state;

    return (
      <AppContainer>
        <SidePanel>
          <Editor rawContentState={initialContentState} onSave={this.onSave} />

          <details>
            <summary>Content (JSON)</summary>

            <Highlight
              value={JSON.stringify(contentState, null, 2)}
              language="json"
            />
          </details>

          <details>
            <summary>Content (Markdown)</summary>

            <Highlight value={markdown} language="markdown" />
          </details>

          <details>
            <summary>Content (HTML)</summary>

            <Highlight value={prettified} language="html" />
          </details>

          <details>
            <summary>Exporter configuration</summary>

            <JSONView
              src={exporterConfig}
              name={false}
              enableClipboard={false}
              displayObjectSize={false}
              displayDataTypes={false}
              onEdit={this.onChangeConfig}
              onAdd={this.onChangeConfig}
              onDelete={this.onChangeConfig}
            />
          </details>
        </SidePanel>
        <LivePage html={html} />
      </AppContainer>
    );
  }
}

// <SplitPanel>

//
// </SplitPanel>

export default App;
