// @flow
import React from "react";
import ReactDOM from "react-dom";

import "normalize.css";
import "./index.css";

import "./utils/polyfills";

import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";

const mount = document.getElementById("root");

if (mount) {
  ReactDOM.render(<App />, mount);
}

registerServiceWorker();
