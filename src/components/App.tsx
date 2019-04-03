import React from "react";
import styled from "styled-components";
import { RawDraftContentState } from "draft-js";

import {
  getInitialContentState,
  saveContentState,
  postRequest,
} from "../utils";

import SidePanel from "./SidePanel";
import LivePage from "./LivePage";
import Editor from "./Editor";
import Exports from "./Exports";

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

type State = {
  contentState: {};
  exporterConfig: {};
} & Export;

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      contentState: {},
      exporterConfig: initialConfig,
      html: "",
      markdown: "",
      prettified: "",
    };

    this.onSave = this.onSave.bind(this);
    this.onChangeConfig = this.onChangeConfig.bind(this);

    this.onSave(initialContentState);
  }

  onSave(contentState: RawDraftContentState) {
    const { exporterConfig } = this.state;

    postRequest(
      "/api/export",
      {
        contentState,
        exporterConfig,
      },
      ({ html, markdown, prettified }: Export) => {
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

  onChangeConfig(update: { updated_src: {} }) {
    const { contentState } = this.state;
    const exporterConfig = update.updated_src;

    postRequest(
      "/api/export",
      {
        contentState,
        exporterConfig,
      },
      ({ html, markdown, prettified }: Export) => {
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
