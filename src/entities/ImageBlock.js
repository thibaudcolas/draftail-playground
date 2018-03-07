// @flow
import React, { Component } from "react";
import { ContentBlock, EditorState } from "draft-js";
import { DraftUtils } from "draftail";

import Imgur from "../utils/imgur";

import "./ImageBlock.css";

type Props = {
  block: ContentBlock,
  blockProps: {
    editorState: EditorState,
    entity: Object,
    onChange: Function,
    lockEditor: Function,
    unlockEditor: Function,
  },
};

/**
 * Editor block to preview and edit images.
 */
class ImageBlock extends Component<Props> {
  imgur: ?Object;
  dropzone: ?HTMLDivElement;

  constructor(props: Props) {
    super(props);

    (this: any).imgurUpload = this.imgurUpload.bind(this);
    (this: any).saveImage = this.saveImage.bind(this);
  }

  componentDidMount() {
    this.imgurUpload();
  }

  imgurUpload() {
    const { block, blockProps } = this.props;
    const {
      editorState,
      onChange,
      entity,
      lockEditor,
      unlockEditor,
    } = blockProps;

    const data = entity.getData();
    const { src } = data;

    if (!src && !this.imgur && this.dropzone) {
      lockEditor();

      this.imgur = new Imgur(this.dropzone, {
        clientid: "184151f0d2e1e93",
        callback: (res) => {
          if (res.success) {
            const data = {
              src: res.data.link,
            };

            onChange(DraftUtils.updateBlockEntity(editorState, block, data));

            unlockEditor();
          }
        },
      });
    }
  }

  saveImage(e: SyntheticEvent<HTMLFormElement>) {
    const { block, blockProps } = this.props;
    const { editorState, onChange, unlockEditor } = blockProps;

    const form = e.target;

    const data = {
      // $FlowFixMe
      src: form.querySelector('[name="url"]').value || "",
    };

    onChange(DraftUtils.updateBlockEntity(editorState, block, data));
    unlockEditor();
  }

  render() {
    const { blockProps } = this.props;
    const { entity } = blockProps;
    const data = entity.getData();
    const { src, alt } = data;

    return src ? (
      <img className="ImageBlock" src={src} alt={alt} width="256" />
    ) : (
      <form className="ImageBlock__form" onSubmit={this.saveImage}>
        <fieldset>
          <label>
            <p>URL</p>
            <input
              className="ImageBlock__input"
              name="url"
              type="text"
              placeholder="https://i.imgur.com/br3fTMr.gif"
            />
          </label>
          <p>
            Anonymous, <strong>public</strong>{" "}
            <a href="https://imgur.com/">Imgur</a> upload
          </p>
          <div
            className="dropzone"
            ref={(ref) => {
              this.dropzone = ref;
            }}
          />
          <button type="submit">Save</button>
        </fieldset>
      </form>
    );
  }
}

export default ImageBlock;
