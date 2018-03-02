// @flow
import { Component } from "react";
import { RichUtils, EditorState } from "draft-js";
import { DraftUtils } from "draftail";

type Props = {
  editorState: EditorState,
  options: Object,
  entity: Object,
  onUpdate: Function,
};

class LinkSource extends Component<Props> {
  componentDidMount() {
    const { editorState, entity, options, onUpdate } = this.props;
    const url = window.prompt("Link URL", entity ? entity.getData().url : "");
    let nextState = editorState;

    if (url) {
      const selection = editorState.getSelection();
      const entityData = {
        url: url,
      };

      const hasText = !selection.isCollapsed();

      if (hasText) {
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
          options.type,
          "MUTABLE",
          entityData,
        );

        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        nextState = RichUtils.toggleLink(editorState, selection, entityKey);
      } else {
        nextState = DraftUtils.createEntity(
          editorState,
          options.type,
          entityData,
          url,
          "MUTABLE",
        );
      }
    }

    onUpdate(nextState);
  }

  render() {
    return null;
  }
}

// $FlowFixMe
LinkSource.defaultProps = {
  entity: null,
};

export default LinkSource;
