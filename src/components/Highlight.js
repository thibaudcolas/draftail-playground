// @flow
import React from "react";
import Prism from "prismjs";

import "prismjs/themes/prism.css";

type Props = {
  value: string,
  language: string,
};

const Highlight = ({ value, language }: Props) => (
  <pre>
    <code
      dangerouslySetInnerHTML={{
        __html: Prism.highlight(value, Prism.languages[language]),
      }}
    />
  </pre>
);

export default Highlight;
