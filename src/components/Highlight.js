// @flow
import React from "react";
import Prism from "prismjs";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-json";

import "prismjs/themes/prism.css";

type Props = {
  value: string,
  language: string,
};

const Highlight = ({ value, language }: Props) => (
  <pre className={`language-${language}`}>
    <code
      dangerouslySetInnerHTML={{
        __html: Prism.highlight(value, Prism.languages[language]),
      }}
    />
  </pre>
);

export default Highlight;
