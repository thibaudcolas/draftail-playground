import { Component } from "react";
import { AtomicBlockUtils, EditorState } from "draft-js";

type Props = {
  editorState: EditorState;
  entityType: {
    type: string;
  };
  onComplete: Function;
};

class ImageSource extends Component<Props> {
  componentDidMount() {
    const { editorState, entityType, onComplete } = this.props;

    const url = window.prompt("Image URL", "/example.jpg");

    if (url) {
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        entityType.type,
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

      onComplete(nextState);
    } else {
      onComplete(editorState);
    }
  }

  render() {
    return null;
  }
}

export default ImageSource;
