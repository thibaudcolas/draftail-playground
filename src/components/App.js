import React from 'react';

import {
    getInitialContentState,
    saveContentState,
    postRequest,
} from '../utils';

import SplitPanel from './SplitPanel';
import Editor from './Editor';
import Highlight from './Highlight';

import JSONView from 'react-json-view';

const initialContentState = getInitialContentState();

const initialConfig = {
    entity_decorators: {
        LINK: 'link',
        IMAGE: 'image',
        HORIZONTAL_RULE: 'hr',
    },
    block_map: {
        'header-three': 'h3',
        'header-four': 'h4',
        'ordered-list-item': {
            element: 'li',
            wrapper: 'ol',
        },
        'unordered-list-item': {
            element: 'li',
            wrapper: 'ul',
            wrapper_props: {
                class: 'bullet-list',
            },
        },
    },
    style_map: {
        BOLD: 'strong',
        ITALIC: {
            element: 'em',
            props: {
                class: 'u-font-italic',
            },
        },
    },
};

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            contentState: initialContentState,
            exporterConfig: initialConfig,
            html: '',
            prettified: '',
        };

        this.onSave = this.onSave.bind(this);
        this.onChangeConfig = this.onChangeConfig.bind(this);

        this.onSave(initialContentState);
    }

    onSave(contentState) {
        const { exporterConfig } = this.state;

        postRequest(
            '/api/export',
            {
                contentState,
                exporterConfig,
            },
            ({ html, prettified }) => {
                this.setState({
                    contentState,
                    html,
                    prettified,
                });

                saveContentState(contentState);
            },
        );
    }

    onChangeConfig(update) {
        const { contentState } = this.state;
        const exporterConfig = update.updated_src;

        postRequest(
            '/api/export',
            {
                contentState,
                exporterConfig,
            },
            ({ html, prettified }) => {
                this.setState({
                    exporterConfig,
                    html,
                    prettified,
                });
            },
        );
    }

    render() {
        const { contentState, html, prettified, exporterConfig } = this.state;

        return (
            <div>
                <SplitPanel>
                    <Editor
                        rawContentState={initialContentState}
                        onSave={this.onSave}
                    />
                    <div>
                        <div className="editor__toolbar">
                            <div className="toolbar-group">
                                <button
                                    className="toolbar-button"
                                    disabled
                                    style={{ pointerEvents: 'none' }}
                                >
                                    Generated HTML
                                </button>
                            </div>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: html }} />
                    </div>
                </SplitPanel>
                <hr />
                <SplitPanel>
                    <Highlight
                        value={JSON.stringify(contentState, null, 2)}
                        language="js"
                    />
                    <Highlight value={prettified} language="html" />
                </SplitPanel>
                <JSONView
                    src={exporterConfig}
                    name={false}
                    enableClipboard={false}
                    displayObjectSize={false}
                    displayDataTypes={false}
                    onEdit={this.onChangeConfig}
                    onAdd={this.onChangeConfig}
                    onDelete={this.onChangeConfig}
                />
            </div>
        );
    }
}

export default App;
