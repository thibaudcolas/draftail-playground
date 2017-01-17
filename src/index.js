import React from 'react';
import ReactDOM from 'react-dom';
import DraftailEditor, { BLOCK_TYPE, INLINE_STYLE } from 'draftail';
import 'draftail/dist/draftail.css';
import './index.css';

const postRequest = (endpoint, data, successCallback) => {
    const request = new XMLHttpRequest();
    request.open('POST', endpoint, true);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
            successCallback(request.responseText);
        }
    };
    request.send(data);
};

const displayResult = (contentState) => {
    postRequest('/api/export', JSON.stringify(contentState), (html) => {
        document.querySelector('[data-export]').innerHTML = html;
        document.querySelector('[data-code]').innerHTML = JSON.stringify(contentState, null, 4);
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
        enableHorizontalRule
        enableLineBreak
        blockTypes={[
            { label: 'H2', type: BLOCK_TYPE.HEADER_TWO },
            { label: 'H3', type: BLOCK_TYPE.HEADER_THREE },
            { label: 'UL', type: BLOCK_TYPE.UNORDERED_LIST_ITEM, icon: 'icon-list-ul' },
            { label: 'OL', type: BLOCK_TYPE.ORDERED_LIST_ITEM, icon: 'icon-list-ol' },
        ]}
        inlineStyles={[
            { label: 'Bold', type: INLINE_STYLE.BOLD, icon: 'icon-bold' },
            { label: 'Italic', type: INLINE_STYLE.ITALIC, icon: 'icon-italic' },
        ]}
    />
), document.querySelector('[data-mount]'));
