import PropTypes from 'prop-types';
import React from 'react';
import Prism from 'prismjs';

import 'prismjs/themes/prism.css';

const Highlight = ({ value, language }) => (
    <pre>
        <code
            dangerouslySetInnerHTML={{
                __html: Prism.highlight(value, Prism.languages[language]),
            }}
        />
    </pre>
);

Highlight.propTypes = {
    value: PropTypes.string.isRequired,
    language: PropTypes.oneOf(Object.keys(Prism.languages)).isRequired,
}

export default Highlight;
