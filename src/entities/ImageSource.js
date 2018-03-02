// @flow
import { Component } from "react";
import { AtomicBlockUtils, EditorState } from "draft-js";

type Props = {
  editorState: EditorState,
  options: Object,
  onUpdate: Function,
};

class ImageSource extends Component<Props> {
  componentDidMount() {
    const { editorState, options, onUpdate } = this.props;

    const url = global.prompt("Image URL");

    if (url) {
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        options.type,
        "IMMUTABLE",
        {
          altText: "Test image alt text",
          alignment: "left",
          src: url,
        },
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const nextState = AtomicBlockUtils.insertAtomicBlock(
        editorState,
        entityKey,
        " ",
      );

      onUpdate(nextState);
    } else {
      onUpdate(editorState);
    }
  }

  render() {
    return null;
  }
}

export default ImageSource;
