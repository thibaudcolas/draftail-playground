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
  return (
    JSON.parse(window.localStorage.getItem("contentState")) ||
    defaultContentState
  );
};

export const saveContentState = (contentState) => {
  window.localStorage.setItem("contentState", JSON.stringify(contentState));
};
