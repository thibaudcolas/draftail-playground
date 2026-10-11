import { RawDraftContentState } from "draft-js";

export const postRequest = async (endpoint: string, data: object): Promise<unknown> => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify(data),
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error("Export failed. Check your configuration and retry.");
    }
    return await response.json();
  } finally {
    window.clearTimeout(timeout);
  }
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

export const saveContentState = (contentState: RawDraftContentState | null) => {
  window.localStorage.setItem("contentState", JSON.stringify(contentState));
};
