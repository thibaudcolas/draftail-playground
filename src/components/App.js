import React from 'react';

import { getInitialContentState, saveContentState, postRequest } from '../utils';

import SplitPanel from './SplitPanel';
import Editor from './Editor';

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
                    <pre>{JSON.stringify(contentState, null, 4)}</pre>
                    <pre><xmp dangerouslySetInnerHTML={{__html: generatedHTML}}></xmp></pre>
                </SplitPanel>
            </div>
        );
    }
}

export default App;
// const displayResult = (contentState) => {
//     postRequest('/api/export', JSON.stringify(contentState), (html) => {
//         document.querySelector('[data-export]').innerHTML = html;
//         document.querySelector('[data-code]').innerHTML = JSON.stringify(contentState, null, 4);
//     });
// };
