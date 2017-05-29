import React from 'react';
import ReactDOM from 'react-dom';

import 'element-closest';

import 'normalize.css';
import './index.css';
import './icomoon/styles.css';

import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.querySelector('[data-mount]'));

registerServiceWorker();
