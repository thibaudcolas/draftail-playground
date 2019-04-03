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

type Props = {
  onRequestClose: () => void;
  onAfterOpen: () => void;
  isOpen: boolean;
  contentLabel: string;
  children: React.ReactNode;
};

const Modal = ({
  onRequestClose,
  onAfterOpen,
  isOpen,
  contentLabel,
  children,
}: Props) => (
  <ReactModal
    className={className}
    overlayClassName={overlayClassName}
    bodyOpenClassName="modal__container--open"
    portalClassName="portal"
    onRequestClose={onRequestClose}
    onAfterOpen={onAfterOpen}
    isOpen={isOpen}
    contentLabel={contentLabel}
  >
    <button
      className="modal__button modal__button--close"
      onClick={onRequestClose}
    >
      ×
    </button>
    <h2 className="modal__title">{contentLabel}</h2>
    <div className="modal__content">{children}</div>
    <div className="modal__actions">
      <button
        className="modal__button modal__button--confirm"
        onClick={onRequestClose}
      >
        Ok
      </button>
    </div>
  </ReactModal>
);

export default Modal;
