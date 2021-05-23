declare module "draftail" {
  import {
    EditorState,
    ContentState,
    RawDraftContentState,
    DraftStyleMap,
    ContentBlock,
  } from "draft-js";
  import * as React from "react";

  type BtnMetaProps = {
    /** Describes the control in the editor UI, concisely. */
    label?: string;
    /** Describes the control in the editor UI. */
    description?: string;
    /** Represents the control in the editor UI. */
    icon?: IconProp;
  };

  type BlockType = {
    /** Unique type shared between block instances. */
    type: string;
    /** DOM element used to display the block within the editor area. */
    element?: string;
  } & BtnMetaProps;

  type InlineStyle = {
    /** Unique type shared between inline style instances. */
    type: string;
    /** CSS properties (in JS format) to apply for styling within the editor area. */
    style?: DraftStyleMap;
  } & BtnMetaProps;

  type BaseEntityType = {
    /** Unique type shared between entity instances. */
    type: string;

    /** Array of attributes the entity uses, to preserve when filtering entities on paste.
     * If undefined, all entity data is preserved.
     */
    attributes?: string[] | null;
    /** Attribute - regex mapping, to preserve entities based on their data on paste.
     * For example, { url: '^https:' } will only preserve links that point to HTTPS URLs.
     */
    allowlist?: Record<string, string | boolean> | null;
    /** Attribute - regex mapping, to preserve entities based on their data on paste.
     * For example, { url: '^https:' } will only preserve links that point to HTTPS URLs.
     */
    whitelist?: Record<string, string | boolean> | null;
  } & BtnMetaProps;

  type SourceProps = {
    /** The editorState is available for arbitrary content manipulation. */
    editorState: EditorState;
    /** Takes the updated editorState, or null if there are no changes, and focuses the editor. */
    onComplete: (nextState: EditorState) => void;
    /** Closes the source, without focusing the editor again. */
    onClose: () => void;
    /** Current entity to edit, if any. */
    entityType: BaseEntityType;
    /** Current entityKey to edit, if any. */
    entityKey: string | null;
    /** Whole entityType configuration, as provided to the editor. */
    entity: EntityInstance | null;
  };

  type DecoratorProps = {
    /** The key of the decorated entity. */
    entityKey: string;
    /** The editor’s content. */
    contentState: ContentState;
    /** Rich text to be displayed inside the decorator. */
    children: React.ReactNode;
    /** Shorthand to edit entity data. */
    onEdit: (entityKey: string) => void;
    /** Shorthand to remove an entity, and the related block. */
    onRemove: (entityKey: string, blockKey: string) => void;
  };

  type BlockProps = {
    block: ContentBlock;
    blockProps: {
      /** The editorState is available for arbitrary content manipulation. */
      editorState: EditorState;
      /** Current entity to manage. */
      entity: EntityInstance;
      /** Current entityKey to manage. */
      entityKey: string;
      /** Whole entityType configuration, as provided to the editor. */
      entityType: BaseEntityType;
      /** Make the whole editor read-only, except for the block. */
      lockEditor: () => void;
      /** Make the editor editable again. */
      unlockEditor: () => void;
      /** Shorthand to edit entity data. */
      onEditEntity: (entityKey: string) => void;
      /** Shorthand to remove an entity, and the related block. */
      onRemoveEntity: (entityKey: string, blockKey: string) => void;
      /** Update the editorState with arbitrary changes. */
      onChange: (EditorState) => void;
    };
  };

  type EntityType = BaseEntityType & {
    /** React component providing the UI to manage entities of this type. */
    source: React.ComponentType<SourceProps>;
    /** React component to display inline entities. */
    decorator?: React.ComponentType<DecoratorProps> | null;
    /** React component to display block-level entities. */
    block?: React.ComponentType<BlockProps> | null;
  };

  type ControlProps = {
    getEditorState: () => EditorState;
    onChange: (EditorState) => void;
  };

  type ToolbarProps = {};

  export interface DraftailEditorProps {
    /** Initial content of the editor. Use this to edit pre-existing content. */
    rawContentState?: RawDraftContentState | null;
    /** Called when changes occurred. Use this to persist editor content. */
    onSave?: ((content: null | RawDraftContentState) => void) | null;
    /** Content of the editor, when using the editor as a controlled component. Incompatible with `rawContentState` and `onSave`. */
    editorState?: EditorState | null;
    /** Called whenever the editor state is updated. Use this to manage the content of a controlled editor. Incompatible with `rawContentState` and `onSave`. */
    onChange?: ((editorState: EditorState) => void) | null;
    /** Called when the editor receives focus. */
    onFocus?: (() => void) | null;
    /** Called when the editor loses focus. */
    onBlur?: (() => void) | null;
    /** Displayed when the editor is empty. Hidden if the user changes styling. */
    placeholder?: string | null;
    /** Enable the use of horizontal rules in the editor. */
    enableHorizontalRule?: boolean | BtnMetaProps;
    /** Enable the use of line breaks in the editor. */
    enableLineBreak?: boolean | BtnMetaProps;
    /** Show undo control in the toolbar. */
    showUndoControl?: boolean | BtnMetaProps;
    /** Show redo control in the toolbar. */
    showRedoControl?: boolean | BtnMetaProps;
    /** Disable copy/paste of rich text in the editor. */
    stripPastedStyles?: boolean;
    /** Set whether spellcheck is turned on for your editor.
     * See https://draftjs.org/docs/api-reference-editor.html#spellcheck.
     */
    spellCheck?: boolean;
    /** Set whether the editor should be rendered in readOnly mode.
     * See https://draftjs.org/docs/api-reference-editor.html#readonly
     */
    readOnly?: boolean;
    /** Optionally set the overriding text alignment for this editor.
     * See https://draftjs.org/docs/api-reference-editor.html#textalignment.
     */
    textAlignment?: string | null;
    /** Optionally set the overriding text directionality for this editor.
     * See https://draftjs.org/docs/api-reference-editor.html#textdirectionality.
     */
    textDirectionality?: string | null;
    /** Set if auto capitalization is turned on and how it behaves.
     * See https://draftjs.org/docs/api-reference-editor.html#autocapitalize-string.
     */
    autoCapitalize?: string | null;
    /** Set if auto complete is turned on and how it behaves.
     * See https://draftjs.org/docs/api-reference-editor.html#autocomplete-string.
     */
    autoComplete?: string | null;
    /** Set if auto correct is turned on and how it behaves.
     * See https://draftjs.org/docs/api-reference-editor.html#autocorrect-string.
     */
    autoCorrect?: string | null;
    /** See https://draftjs.org/docs/api-reference-editor.html#aria-props. */
    ariaDescribedBy?: string | null;
    /** List of the available block types. */
    blockTypes?: BlockType[];
    /** List of the available inline styles. */
    inlineStyles?: InlineStyle[];
    /** List of the available entity types. */
    entityTypes?: EntityType[];
    /** List of active decorators. */
    decorators?: DraftDecorator[];
    /** List of extra toolbar controls. */
    controls?: React.ComponentType<ControlProps>[];
    /** List of plugins of the draft-js-plugins architecture. */
    plugins?: any[];
    /** Optionally override the default Draftail toolbar, removing or replacing it. */
    topToolbar?: React.ComponentType<ToolbarProps> | null;
    /** Optionally add a custom toolbar underneath the editor, e.g. for metrics. */
    bottomToolbar?: React.ComponentType<ToolbarProps> | null;
    /** Max level of nesting for list items. 0 = no nesting. Maximum = 10. */
    maxListNesting?: number;
    /** Frequency at which to call the onSave callback (ms). */
    stateSaveInterval?: number;
  }

  export class DraftailEditor extends React.Component<DraftailEditorProps, {}> {
    /**
     * Imperative focus API similar to that of Draft.js.
     * See https://draftjs.org/docs/advanced-topics-managing-focus.html#content.
     */
    focus(): void;
  }

  type IconProp = string | string[] | React.ReactNode;

  /**
   * Icon as SVG element. Can optionally render a React element instead.
   */
  export const Icon: (props: {
    icon: IconProp;
    title?: string | null;
    className?: string | null;
  }) => JSX.Element;

  /**
   * Displays a basic button, with optional active variant,
   * enriched with a tooltip. The tooltip stops showing on click.
   */
  export const ToolbarButton: (props: {
    name?: string | null;
    active?: boolean;
    label?: string | null;
    title?: string | null;
    icon?: IconProp | null;
    onClick?: (str: string) => void;
  }) => JSX.Element;

  export const DraftUtils: {};

  /**
   * See https://github.com/facebook/draft-js/blob/master/src/model/immutable/DefaultDraftBlockRenderMap.js.
   */
  export const BLOCK_TYPE: {
    /**
     * Represent a normal text block (paragraph).
     */
    UNSTYLED: "unstyled";
    HEADER_ONE: "header-one";
    HEADER_TWO: "header-two";
    HEADER_THREE: "header-three";
    HEADER_FOUR: "header-four";
    HEADER_FIVE: "header-five";
    HEADER_SIX: "header-six";
    UNORDERED_LIST_ITEM: "unordered-list-item";
    ORDERED_LIST_ITEM: "ordered-list-item";
    BLOCKQUOTE: "blockquote";
    CODE: "code-block";
    /**
     * Represents a "custom" non-text block, with arbitrary content.
     */
    ATOMIC: "atomic";
  };

  export const ENTITY_TYPE: {
    LINK: "LINK";
    IMAGE: "IMAGE";
    HORIZONTAL_RULE: "HORIZONTAL_RULE";
  };

  /**
   * See https://github.com/facebook/draft-js/blob/master/src/model/immutable/DefaultDraftInlineStyle.js.
   */
  export const INLINE_STYLE: {
    BOLD: "BOLD";
    ITALIC: "ITALIC";
    CODE: "CODE";
    UNDERLINE: "UNDERLINE";
    STRIKETHROUGH: "STRIKETHROUGH";
    MARK: "MARK";
    QUOTATION: "QUOTATION";
    SMALL: "SMALL";
    SAMPLE: "SAMPLE";
    INSERT: "INSERT";
    DELETE: "DELETE";
    KEYBOARD: "KEYBOARD";
    SUPERSCRIPT: "SUPERSCRIPT";
    SUBSCRIPT: "SUBSCRIPT";
  };
}
