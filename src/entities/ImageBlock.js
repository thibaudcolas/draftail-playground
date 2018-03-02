import PropTypes from "prop-types"
import React, { Component } from "react"

const propTypes = {
  block: PropTypes.object.isRequired,
  blockProps: PropTypes.shape({
    editorState: PropTypes.object.isRequired,
    entity: PropTypes.object,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
}

/**
 * Editor block to preview and edit images.
 */
class ImageBlock extends Component {
  render() {
    const { blockProps } = this.props
    const { entity } = blockProps
    const { src, alt } = entity.getData()

    return <img className="ImageBlock" src={src} alt={alt} width="256" />
  }
}

ImageBlock.propTypes = propTypes

export default ImageBlock
