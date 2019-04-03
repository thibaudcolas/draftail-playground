import { Modifier, EditorState } from "draft-js";

const createEntity = (
  editorState: EditorState,
  entityType: string,
  entityData: {},
  entityText: string,
  entityMutability: "IMMUTABLE" | "MUTABLE" = "IMMUTABLE",
) => {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const contentStateWithEntity = contentState.createEntity(
    entityType,
    entityMutability,
    entityData,
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

  let nextContentState;

  if (selection.isCollapsed()) {
    nextContentState = Modifier.insertText(
      contentState,
      selection,
      entityText,
      undefined,
      entityKey,
    );
  } else {
    nextContentState = Modifier.replaceText(
      contentState,
      selection,
      entityText,
      undefined,
      entityKey,
    );
  }

  const nextState = EditorState.push(
    editorState,
    nextContentState,
    "insert-fragment",
  );

  return nextState;
};

export default createEntity;
