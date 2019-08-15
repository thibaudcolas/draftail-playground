import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import App from "./components/App";

const mount = document.getElementById("root");

if (mount) {
  ReactDOM.render(<App />, mount);
}
