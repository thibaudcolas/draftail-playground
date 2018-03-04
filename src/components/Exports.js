// @flow
import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import JSONView from "react-json-view";

import Highlight from "./Highlight";

import "./Exports.css";

type Props = {
  markdown: string,
  contentState: string,
  prettified: string,
  exporterConfig: Object,
  onChangeConfig: Function,
};

const Exports = ({
  markdown,
  contentState,
  prettified,
  exporterConfig,
  onChangeConfig,
}: Props) => {
  return (
    <Tabs>
      <TabList>
        <Tab>Markdown</Tab>
        <Tab>JSON</Tab>
        <Tab>HTML</Tab>
        <Tab>Exporter configuration</Tab>
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
