import PropTypes from 'prop-types';
import React from 'react';

import DraftailEditor, {
    ENTITY_TYPE,
    BLOCK_TYPE,
    INLINE_STYLE,
} from 'draftail';
import 'draftail/dist/draftail.css';

import LinkSource from '../entities/LinkSource';
import ImageSource from '../entities/ImageSource';
import Link from '../entities/Link';

const Editor = ({ rawContentState, onSave }) => (
    <DraftailEditor
        rawContentState={rawContentState}
        onSave={onSave}
        placeholder="Write here…"
        enableHorizontalRule={true}
        enableLineBreak={false}
        stripPastedStyles={false}
        entityTypes={[
            {
                type: ENTITY_TYPE.IMAGE,
                description: 'Image',
                icon: 'icon-image',
                source: ImageSource,
                imageFormats: [],
            },
            {
                type: ENTITY_TYPE.LINK,
                description: 'Link',
                icon: 'icon-link',
                source: LinkSource,
                decorator: Link,
            },
        ]}
        blockTypes={[
            {
                type: BLOCK_TYPE.HEADER_THREE,
                label: 'H3',
                description: 'Heading 3',
            },
            {
                type: BLOCK_TYPE.HEADER_FOUR,
                label: 'H4',
                description: 'Heading 4',
            },
            {
                type: BLOCK_TYPE.UNORDERED_LIST_ITEM,
                description: 'Bulleted list',
                icon: 'icon-list-ul',
            },
        ]}
        inlineStyles={[
            { description: 'Bold', type: INLINE_STYLE.BOLD, icon: 'icon-bold' },
            {
                description: 'Italic',
                type: INLINE_STYLE.ITALIC,
                icon: 'icon-italic',
            },
        ]}
    />
);

Editor.propTypes = {
    rawContentState: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
};

export default Editor;
