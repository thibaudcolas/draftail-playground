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
            generatedHTML: '',
        };

        this.onSave = this.onSave.bind(this);

        this.onSave(initialContentState);
    }

    onSave(contentState) {
        postRequest('/api/export', JSON.stringify(contentState), (html) => {
            this.setState({
                contentState: contentState,
                generatedHTML: html,
            });

            saveContentState(contentState);
        });
    }

    render() {
        const { contentState, generatedHTML } = this.state;

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
                        <div dangerouslySetInnerHTML={{__html: generatedHTML}}></div>
                    </div>
                </SplitPanel>
                <hr/>
                <SplitPanel>
                    <Highlight value={JSON.stringify(contentState, null, 2)} language="js" />
                    <Highlight value={generatedHTML} language="html" />
                </SplitPanel>
            </div>
        );
    }
}

export default App;
