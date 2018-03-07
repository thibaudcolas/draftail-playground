// @flow
import { Component } from "react";
import { AtomicBlockUtils, EditorState } from "draft-js";

type Props = {
  editorState: EditorState,
  entityType: Object,
  onComplete: Function,
};

const createPlaceholderImage = (editorState) => {
  const data = {
    src: "",
  };

  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(
    "IMAGE",
    "IMMUTABLE",
    data,
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

  return AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, " ");
};

class ImageSource extends Component<Props> {
  componentDidMount() {
    const { editorState, onComplete } = this.props;

    onComplete(createPlaceholderImage(editorState));
  }

  render() {
    return null;
  }
}

export default ImageSource;
