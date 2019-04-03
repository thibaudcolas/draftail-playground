declare module "draftail" {
  export const DraftailEditor: typeof React.Component;
  export const Icon: typeof React.FunctionComponent;
  export const ToolbarButton: typeof React.FunctionComponent;

  export const DraftUtils: {};

  export const BLOCK_TYPE: {
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
    ATOMIC: "atomic";
  };
  export const ENTITY_TYPE: {
    LINK: "LINK";
    IMAGE: "IMAGE";
    HORIZONTAL_RULE: "HORIZONTAL_RULE";
  };
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
