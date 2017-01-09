import React from 'react';
import ReactDOM from 'react-dom';
import DraftailEditor from 'draftail';
import './wagtail-icons.css';
import './draftail.css';
import './index.css';

const $ = window.jQuery;

const displayResult = (contentState) => {
    $.ajax({
        type: 'POST',
        url: '/api/export',
        contentType: 'application/json',
        data: JSON.stringify(contentState),
        success: (html) => {
            document.querySelector('[data-export]').innerHTML = html;
            document.querySelector('[data-code]').innerHTML = JSON.stringify(contentState, null, 4);
        },
    });
};

const defaultContentState = {
    entityMap: {},
    blocks: [
        {
            key: 'b1ito',
            text: 'Hello, World!',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [
                {
                    offset: 0,
                    length: 13,
                    style: 'BOLD',
                },
            ],
            entityRanges: [],
            data: {},
        },
    ],
};

displayResult(defaultContentState);

const onSave = (rawContentState) => {
    displayResult(rawContentState);
};

ReactDOM.render((
    <DraftailEditor
        rawContentState={defaultContentState}
        onSave={onSave}
        options={{
            modelPickerOptions: [],
            imageFormats: [],
            mediaControls: [],
            dialogControls: [],
            sources: [],
            decorators: [],
            BLOCK_TYPES: [
                { label: 'H2', style: 'header-two' },
                { label: 'H3', style: 'header-three' },
                { label: 'UL', style: 'unordered-list-item', icon: 'list-ul' },
                { label: 'OL', style: 'ordered-list-item', icon: 'list-ol' },
            ],
            INLINE_STYLES: [
                { label: 'Bold', style: 'BOLD', icon: 'bold' },
                { label: 'Italic', style: 'ITALIC', icon: 'italic' },
            ],
        }}
    />
), document.querySelector('[data-mount]'));
