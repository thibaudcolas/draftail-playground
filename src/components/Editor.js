import PropTypes from 'prop-types';
import React from 'react';

import DraftailEditor, { ENTITY_TYPE, BLOCK_TYPE, INLINE_STYLE } from 'draftail';
import 'draftail/dist/draftail.css';

import LinkSource from '../entities/LinkSource';
import ImageSource from '../entities/ImageSource';
import Link from '../entities/Link';

const Editor = ({ rawContentState, onSave }) => (
    <DraftailEditor
        rawContentState={rawContentState}
        onSave={onSave}
        enableHorizontalRule={true}
        enableLineBreak={false}
        stripPastedStyles={false}
        entityTypes={[
            { label: '', type: ENTITY_TYPE.IMAGE, icon: 'icon-image', source: ImageSource, imageFormats: [] },
            { label: '', type: ENTITY_TYPE.LINK, icon: 'icon-link', source: LinkSource, decorator: Link },
        ]}
        blockTypes={[
            { label: 'H3', type: BLOCK_TYPE.HEADER_THREE },
            { label: 'H4', type: BLOCK_TYPE.HEADER_FOUR },
            { label: '', type: BLOCK_TYPE.UNORDERED_LIST_ITEM, icon: 'icon-list-ul' },
        ]}
        inlineStyles={[
            { label: 'Bold', type: INLINE_STYLE.BOLD, icon: 'icon-bold' },
            { label: 'Italic', type: INLINE_STYLE.ITALIC, icon: 'icon-italic' },
        ]}
    />
);

Editor.propTypes = {
    rawContentState: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
};

export default Editor;
