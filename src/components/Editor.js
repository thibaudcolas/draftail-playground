// @flow
import React from "react";
import styled from "styled-components";

import {
  DraftailEditor,
  ENTITY_TYPE,
  BLOCK_TYPE,
  INLINE_STYLE,
} from "draftail";
import "draft-js/dist/Draft.css";
import "draftail/dist/draftail.css";

import LinkSource from "../entities/LinkSource";
import ImageSource from "../entities/ImageSource";
import ImageBlock from "../entities/ImageBlock";
import Link from "../entities/Link";
import ReadingTime from "../components/controls/ReadingTime";
import SentryBoundary from "../components/SentryBoundary";

const Container = styled.div`
  padding-bottom: 1.5rem;

  @media screen and (min-width: 768px) {
    margin-top: -2rem;
    padding-top: 150px;
  }

  .Draftail-Toolbar {
    min-height: 48px;
  }

  .Draftail-block--header-one:first-child {
    padding-top: 1.45rem;
  }
`;

const Title = styled.h2`
  height: 40px;
  margin-top: -40px;
  margin-bottom: 0;
`;

type Props = {
  rawContentState: Object,
  onSave: Function,
};

const Editor = ({ rawContentState, onSave }: Props) => (
  <Container>
    <Title>Tell your story…</Title>
    <SentryBoundary>
      <DraftailEditor
        rawContentState={rawContentState}
        onSave={onSave}
        placeholder="Write here…"
        enableHorizontalRule={true}
        enableLineBreak={false}
        spellCheck={true}
        stripPastedStyles={false}
        entityTypes={[
          {
            type: ENTITY_TYPE.IMAGE,
            description: "Image",
            icon: [
              "M959.884 128c0.040 0.034 0.082 0.076 0.116 0.116v767.77c-0.034 0.040-0.076 0.082-0.116 0.116h-895.77c-0.040-0.034-0.082-0.076-0.114-0.116v-767.772c0.034-0.040 0.076-0.082 0.114-0.114h895.77zM960 64h-896c-35.2 0-64 28.8-64 64v768c0 35.2 28.8 64 64 64h896c35.2 0 64-28.8 64-64v-768c0-35.2-28.8-64-64-64v0z",
              "M832 288c0 53.020-42.98 96-96 96s-96-42.98-96-96 42.98-96 96-96 96 42.98 96 96z",
              "M896 832h-768v-128l224-384 256 320h64l224-192z",
            ],
            source: ImageSource,
            block: ImageBlock,
          },
          {
            type: ENTITY_TYPE.LINK,
            description: "Link",
            icon: [
              "M440.236 635.766c-13.31 0-26.616-5.076-36.77-15.23-95.134-95.136-95.134-249.934 0-345.070l192-192c46.088-46.086 107.36-71.466 172.534-71.466s126.448 25.38 172.536 71.464c95.132 95.136 95.132 249.934 0 345.070l-87.766 87.766c-20.308 20.308-53.23 20.308-73.54 0-20.306-20.306-20.306-53.232 0-73.54l87.766-87.766c54.584-54.586 54.584-143.404 0-197.99-26.442-26.442-61.6-41.004-98.996-41.004s-72.552 14.562-98.996 41.006l-192 191.998c-54.586 54.586-54.586 143.406 0 197.992 20.308 20.306 20.306 53.232 0 73.54-10.15 10.152-23.462 15.23-36.768 15.23z",
              "M256 1012c-65.176 0-126.45-25.38-172.534-71.464-95.134-95.136-95.134-249.934 0-345.070l87.764-87.764c20.308-20.306 53.234-20.306 73.54 0 20.308 20.306 20.308 53.232 0 73.54l-87.764 87.764c-54.586 54.586-54.586 143.406 0 197.992 26.44 26.44 61.598 41.002 98.994 41.002s72.552-14.562 98.998-41.006l192-191.998c54.584-54.586 54.584-143.406 0-197.992-20.308-20.308-20.306-53.232 0-73.54 20.306-20.306 53.232-20.306 73.54 0.002 95.132 95.134 95.132 249.932 0.002 345.068l-192.002 192c-46.090 46.088-107.364 71.466-172.538 71.466z",
            ],
            source: LinkSource,
            decorator: Link,
          },
        ]}
        blockTypes={[
          {
            type: BLOCK_TYPE.HEADER_ONE,
          },
          {
            type: BLOCK_TYPE.HEADER_TWO,
          },
          {
            type: BLOCK_TYPE.HEADER_THREE,
          },
          {
            type: BLOCK_TYPE.UNORDERED_LIST_ITEM,
            icon: "#icon-list-ul",
          },
          {
            type: BLOCK_TYPE.CODE,
            icon: "#icon-code",
          },
          {
            type: BLOCK_TYPE.BLOCKQUOTE,
            icon: "#icon-openquote",
          },
        ]}
        inlineStyles={[
          {
            type: INLINE_STYLE.BOLD,
            icon: "#icon-bold",
          },
          {
            type: INLINE_STYLE.ITALIC,
            icon: "#icon-italic",
          },
        ]}
        controls={[ReadingTime]}
      />
    </SentryBoundary>
  </Container>
);

export default Editor;
