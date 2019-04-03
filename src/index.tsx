import React from "react";
import ReactDOM from "react-dom";
import "normalize.css";
import "./index.css";

import "./utils/polyfills";

import App from "./components/App";
import * as serviceWorker from "./serviceWorker";

const mount = document.getElementById("root");

if (mount) {
  ReactDOM.render(<App />, mount);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
