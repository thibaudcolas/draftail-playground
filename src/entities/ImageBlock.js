// @flow
import React, { Component } from "react";
import { ContentBlock, EditorState } from "draft-js";

type Props = {
  block: ContentBlock,
  blockProps: {
    editorState: EditorState,
    entity: Object,
    onChange: Function,
  },
};

/**
 * Editor block to preview and edit images.
 */
class ImageBlock extends Component<Props> {
  render() {
    const { blockProps } = this.props;
    const { entity } = blockProps;
    const { src, alt } = entity.getData();

    return <img className="ImageBlock" src={src} alt={alt} width="256" />;
  }
}

export default ImageBlock;
