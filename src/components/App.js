import React from 'react';

import { getInitialContentState, saveContentState, postRequest } from '../utils';

import SplitPanel from './SplitPanel';
import Editor from './Editor';
import Highlight from './Highlight';

const initialContentState = getInitialContentState();

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            contentState: initialContentState,
            html: '',
            prettified: '',
        };

        this.onSave = this.onSave.bind(this);

        this.onSave(initialContentState);
    }

    onSave(contentState) {
        postRequest('/api/export', JSON.stringify(contentState), ({ html, prettified }) => {
            this.setState({
                contentState,
                html,
                prettified,
            });

            saveContentState(contentState);
        });
    }

    render() {
        const { contentState, html, prettified } = this.state;

        return (
            <div>
                <SplitPanel>
                    <Editor
                        rawContentState={initialContentState}
                        onSave={this.onSave}
                    />
                    <div>
                        <div className="editor__toolbar">
                            <button className="RichEditor-styleButton" disabled>Generated HTML</button>
                        </div>
                        <div dangerouslySetInnerHTML={{__html: html}}></div>
                    </div>
                </SplitPanel>
                <hr/>
                <SplitPanel>
                    <Highlight value={JSON.stringify(contentState, null, 2)} language="js" />
                    <Highlight value={prettified} language="html" />
                </SplitPanel>
            </div>
        );
    }
}

export default App;
