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
  entityMap: {
    "0": {
      type: "LINK",
      mutability: "MUTABLE",
      data: { url: "https://springload.github.io/draftail/" },
    },
    "1": {
      type: "LINK",
      mutability: "MUTABLE",
      data: { url: "https://github.com/springload/draftjs_exporter" },
    },
    "2": {
      type: "IMAGE",
      mutability: "IMMUTABLE",
      data: {
        altText: "Test image alt text",
        alignment: "left",
        src: "https://placekitten.com/g/260/160",
      },
    },
  },
  blocks: [
    {
      key: "b1ito",
      text: "Draftail works well with draftjs_exporter!",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        { offset: 0, length: 8, key: 0 },
        { offset: 25, length: 16, key: 1 },
      ],
      data: {},
    },
    {
      key: "f1nl8",
      text: " ",
      type: "atomic",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [{ offset: 0, length: 1, key: 2 }],
      data: {},
    },
    {
      key: "crmq4",
      text: "List item",
      type: "unordered-list-item",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "c4l1f",
      text: "Nested",
      type: "unordered-list-item",
      depth: 1,
      inlineStyleRanges: [{ offset: 0, length: 6, style: "ITALIC" }],
      entityRanges: [],
      data: {},
    },
    {
      key: "3onpa",
      text: "and back",
      type: "unordered-list-item",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
  ],
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
