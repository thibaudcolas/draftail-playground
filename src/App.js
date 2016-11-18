import React, { Component } from 'react';
import DraftailEditor from 'draftail';

const $ = window.jQuery;

class App extends Component {
    constructor() {
        super();

        this.state = {
            htmlResult: '',
        };

        let prevContentState;

        window.setInterval(() => {
            const contentState = $('[name="demo"]')[0].value;

            if (contentState && contentState !== prevContentState) {
                $.ajax({
                    type: 'POST',
                    url: '/api/export',
                    contentType: 'application/json',
                    data: contentState,
                    success: (html) => {
                        this.setState({
                            htmlResult: html,
                        });
                    },
                });
            }

            prevContentState = contentState;
        }, 1000);
    }

    render() {
        const { htmlResult } = this.state;
        return (
            <div>
                <DraftailEditor
                    name="demo"
                    value="{}"
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
                        ],
                        INLINE_STYLES: [
                            { label: 'Bold', style: 'BOLD', icon: 'bold' },
                            { label: 'Italic', style: 'ITALIC', icon: 'italic' },
                        ],
                    }}
                />
                <div dangerouslySetInnerHTML={{ __html: htmlResult }}></div>
            </div>
        );
    }
}

export default App;
