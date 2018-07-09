import React from "react";
import ReactModal from "react-modal";

import "./Modal.css";

const className = {
  base: "modal",
  afterOpen: "modal--open",
  beforeClose: "modal--before-close",
};

const overlayClassName = {
  base: "modal__overlay",
  afterOpen: "modal__overlay--open",
  beforeClose: "modal__overlay--before-close",
};

ReactModal.setAppElement(document.body);

const Modal = (props) => (
  <ReactModal
    className={className}
    overlayClassName={overlayClassName}
    bodyOpenClassName="modal__container--open"
    portalClassName="portal"
    {...props}
  />
);

export default Modal;
