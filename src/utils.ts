import { RawDraftContentState } from "draft-js";

export const postRequest = (
  endpoint: string,
  data: {},
  successCallback: (data: any) => void,
) => {
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
      text: "Hello! This is Draftail 🙂",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
  ],
  entityMap: {},
};

export const getInitialContentState = () => {
  const contentState = window.localStorage.getItem("contentState");
  return (contentState && JSON.parse(contentState)) || defaultContentState;
};

export const saveContentState = (contentState: RawDraftContentState) => {
  window.localStorage.setItem("contentState", JSON.stringify(contentState));
};
