import React from "react";
import styled from "styled-components";
import Prism from "prismjs";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-json";

import "prismjs/themes/prism.css";

const onCopy = (value: string) => {
  const hidden = document.createElement("textarea");
  hidden.value = value;
  document.body.appendChild(hidden);
  hidden.select();
  document.execCommand("copy");
  document.body.removeChild(hidden);
};

const Pre = styled.pre`
  position: relative;
`;

const CopyButton = styled.button`
  position: absolute;
  right: 1rem;
`;

type Props = {
  value: string;
  language: string;
};

const Highlight = ({ value, language }: Props) => (
  <Pre className={`language-${language}`}>
    <CopyButton onClick={onCopy.bind(null, value)}>Copy</CopyButton>
    <code
      dangerouslySetInnerHTML={{
        __html: Prism.highlight(value, Prism.languages[language], language),
      }}
    />
  </Pre>
);

export default Highlight;
