import React, { Component } from "react";
import { BlockProps } from "draftail";

/**
 * Editor block to preview and edit images.
 */
class ImageBlock extends Component<BlockProps> {
  render() {
    const { blockProps } = this.props;
    const { entity } = blockProps;
    const { src, alt } = entity.getData();

    return <img className="ImageBlock" src={src} alt={alt} width="256" />;
  }
}

export default ImageBlock;
