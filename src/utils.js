export const postRequest = (endpoint, data, successCallback) => {
  const request = new XMLHttpRequest();
  request.open("POST", endpoint, true);
  request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  request.onload = () => {
    if (request.status >= 200 && request.status < 400) {
      successCallback(JSON.parse(request.responseText));
    }
  };
  request.send(JSON.stringify(data));
};

// eslint-disable-next-line
export const defaultContentState = {
  blocks: [
    {
      key: "b1ito",
      text: "Why Wagtail’s new editor is built with Draft.js",
      type: "header-one",
      depth: 0,
      inlineStyleRanges: [{ offset: 0, length: 47, style: "BOLD" }],
      entityRanges: [],
      data: {},
    },
    {
      key: "ba7s7",
      text:
        "Have you ever worked with rich text editors? You know how frustrating of an experience that can be. Users enter content without much confidence in how the editor will preserve it. Developers have to harden their sites to handle the unstructured soup that is rich text. Designers see their layout completely destroyed by the cheer variation in shape and length. A recipe for frustration.",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [{ offset: 361, length: 25, style: "BOLD" }],
      entityRanges: [],
      data: {},
    },
    {
      key: "67jbt",
      text: " ",
      type: "atomic",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [{ offset: 0, length: 1, key: 0 }],
      data: {},
    },
    {
      key: "fe44d",
      text:
        "It’s time to add some noodles and flavour, give some structure to your bland broth and enjoy rich text again.",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [{ offset: 43, length: 39, key: 1 }],
      data: {},
    },
    {
      key: "69loq",
      text: "",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "91i32",
      text: " ",
      type: "atomic",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [{ offset: 0, length: 1, key: 2 }],
      data: {},
    },
    {
      key: "57k2l",
      text: "Introducing Draft.js",
      type: "header-two",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "384sd",
      text:
        "Draft.js is a framework for building rich text editors in React, powered by an immutable model and abstracting over cross-browser differences.",
      type: "blockquote",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [{ offset: 0, length: 8, key: 3 }],
      data: {},
    },
  ],
  entityMap: {
    "0": { type: "HORIZONTAL_RULE", mutability: "IMMUTABLE", data: {} },
    "1": {
      type: "LINK",
      mutability: "MUTABLE",
      data: {
        url: "https://torchbox.com/blog/rich-text-fields-and-faster-horses/",
      },
    },
    "2": {
      type: "IMAGE",
      mutability: "IMMUTABLE",
      data: {
        altText: "Test image alt text",
        alignment: "left",
        src: "/example.jpg",
      },
    },
    "3": {
      type: "LINK",
      mutability: "MUTABLE",
      data: { href: "https://draftjs.org/", url: "https://draftjs.org/" },
    },
  },
};

export const getInitialContentState = () => {
  return (
    JSON.parse(window.localStorage.getItem("contentState")) ||
    defaultContentState
  );
};

export const saveContentState = (contentState) => {
  window.localStorage.setItem("contentState", JSON.stringify(contentState));
};
