import React from "react";
import { RawDraftContentState } from "draft-js";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import JSONView from "react-json-view";

import Highlight from "./Highlight";

import "./Exports.css";

const savedTab = Number(window.sessionStorage.getItem("tab-index"));
const initTab = savedTab || 0;

const saveTab = (tab: number) => {
  window.sessionStorage.setItem("tab-index", JSON.stringify(tab));
};

type Props = {
  markdown: string;
  contentState: RawDraftContentState | null;
  prettified: string;
  exporterConfig: Object;
  onChangeConfig: (edit: { updated_src: {} }) => any;
};

const Exports = ({
  markdown,
  contentState,
  prettified,
  exporterConfig,
  onChangeConfig,
}: Props) => {
  return (
    <Tabs defaultIndex={initTab} onSelect={saveTab}>
      <TabList>
        <Tab>Markdown</Tab>
        <Tab>JSON</Tab>
        <Tab>HTML</Tab>
        <Tab>Configuration</Tab>
      </TabList>

      <TabPanel>
        <Highlight value={markdown} language="markdown" />
      </TabPanel>
      <TabPanel>
        <Highlight
          value={JSON.stringify(contentState, null, 2)}
          language="json"
        />
      </TabPanel>
      <TabPanel>
        <Highlight value={prettified} language="html" />
      </TabPanel>
      <TabPanel>
        <p>
          Have a look at the{" "}
          <a href="https://github.com/springload/draftjs_exporter/">
            Draft.js exporter configuration.
          </a>
        </p>
        <JSONView
          src={exporterConfig}
          name={false}
          enableClipboard={false}
          displayObjectSize={false}
          displayDataTypes={false}
          onEdit={onChangeConfig}
          onAdd={onChangeConfig}
          onDelete={onChangeConfig}
        />
      </TabPanel>
    </Tabs>
  );
};

export default Exports;
