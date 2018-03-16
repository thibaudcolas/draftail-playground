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
      text: "Introducing Draft.js in Wagtail 🐦",
      type: "header-one",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "crn5h",
      text: "Hi 👋, I'm Thibaud! @thibaud_colas 🇫🇮",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 19,
          length: 14,
          key: 0,
        },
      ],
      data: {},
    },
    {
      key: "1gr7m",
      text: "Why, how, what next:",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "d13jo",
      text: "Why Wagtail’s new editor is built with Draft.js",
      type: "unordered-list-item",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 0,
          length: 47,
          key: 1,
        },
      ],
      data: {},
    },
    {
      key: "e8rds",
      text: "Rethinking rich text pipelines with Draft.js",
      type: "unordered-list-item",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 0,
          length: 44,
          key: 2,
        },
      ],
      data: {},
    },
    {
      key: "8gc8g",
      text: "(UI/UX blog post on its way)",
      type: "unordered-list-item",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "d2gfp",
      text: "",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "126t8",
      text: " ",
      type: "atomic",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 0,
          length: 1,
          key: 3,
        },
      ],
      data: {},
    },
    {
      key: "cgf48",
      text: "",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "9ab7g",
      text: "Demos! 🌈",
      type: "header-one",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "9vbau",
      text:
        "Demos built with the Draft.js framework, not (only) with Wagtail’s editor",
      type: "blockquote",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 21,
          length: 8,
          key: 4,
        },
      ],
      data: {},
    },
    {
      key: "1lkbk",
      text: "Draftail ",
      type: "header-two",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "9nr06",
      text: "Draftail Playground",
      type: "unordered-list-item",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 0,
          length: 19,
          key: 5,
        },
      ],
      data: {},
    },
    {
      key: "fakgg",
      text: "Rich text formats: Draftail",
      type: "unordered-list-item",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 19,
          length: 8,
          key: 6,
        },
      ],
      data: {},
    },
    {
      key: "butav",
      text: "Copy-paste: Draft.js filters",
      type: "unordered-list-item",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 12,
          length: 16,
          key: 7,
        },
      ],
      data: {},
    },
    {
      key: "f3bf2",
      text: "More formats: Draftail examples",
      type: "unordered-list-item",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 14,
          length: 17,
          key: 8,
        },
      ],
      data: {},
    },
    {
      key: "c8ccn",
      text: "Draft.js plugins",
      type: "header-two",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "9r2i5",
      text: "High quality plugins with great UX on top of Draft.js.",
      type: "blockquote",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "ej6eo",
      text: "😄emojis!",
      type: "unordered-list-item",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 0,
          length: 8,
          key: 9,
        },
      ],
      data: {},
    },
    {
      key: "c2qnp",
      text: "@mentions",
      type: "unordered-list-item",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 0,
          length: 9,
          key: 10,
        },
      ],
      data: {},
    },
    {
      key: "7dj08",
      text: "Videos (embeds) ---> https://www.youtube.com/watch?v=YPj8SIhDR68",
      type: "unordered-list-item",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 0,
          length: 15,
          key: 11,
        },
        {
          offset: 21,
          length: 43,
          key: 12,
        },
      ],
      data: {},
    },
    {
      key: "2ge6d",
      text: "Counter",
      type: "unordered-list-item",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 0,
          length: 7,
          key: 13,
        },
      ],
      data: {},
    },
    {
      key: "e9csm",
      text: "More Draft.js",
      type: "header-two",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "aed1h",
      text: "Stickers",
      type: "unordered-list-item",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 0,
          length: 8,
          key: 14,
        },
      ],
      data: {},
    },
    {
      key: "bf9v2",
      text: "Mathjax ",
      type: "unordered-list-item",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 0,
          length: 7,
          key: 15,
        },
      ],
      data: {},
    },
    {
      key: "27pu3",
      text: "KaTeX",
      type: "unordered-list-item",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 0,
          length: 5,
          key: 16,
        },
      ],
      data: {},
    },
    {
      key: "77b76",
      text: "Markdown shortcuts",
      type: "unordered-list-item",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 0,
          length: 18,
          key: 17,
        },
      ],
      data: {},
    },
    {
      key: "ehjks",
      text: "",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "d1qqm",
      text: " ",
      type: "atomic",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 0,
          length: 1,
          key: 18,
        },
      ],
      data: {},
    },
    {
      key: "3eepp",
      text: "",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "dpkc1",
      text: "What next?",
      type: "header-one",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "8soci",
      text: "Blog posts:",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "9c4b2",
      text: "Why Wagtail’s new editor is built with Draft.js",
      type: "unordered-list-item",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 0,
          length: 47,
          key: 19,
        },
      ],
      data: {},
    },
    {
      key: "cr8aa",
      text: "Rethinking rich text pipelines with Draft.js",
      type: "unordered-list-item",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 0,
          length: 44,
          key: 20,
        },
      ],
      data: {},
    },
    {
      key: "5rvja",
      text: "(UI/UX blog post on its way)",
      type: "unordered-list-item",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "ct82l",
      text: "How you can help:",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "tob6",
      text: "Try out the editor, inside and outside of Wagtail",
      type: "unordered-list-item",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 31,
          length: 18,
          key: 21,
        },
      ],
      data: {},
    },
    {
      key: "5pj78",
      text: "Try to break it (and report issues 😄)",
      type: "unordered-list-item",
      depth: 0,
      inlineStyleRanges: [
        {
          offset: 0,
          length: 16,
          style: "BOLD",
        },
      ],
      entityRanges: [
        {
          offset: 7,
          length: 8,
          key: 22,
        },
      ],
      data: {},
    },
    {
      key: "dcsk6",
      text: "Review and improve the user guide",
      type: "unordered-list-item",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 23,
          length: 10,
          key: 23,
        },
      ],
      data: {},
    },
    {
      key: "4ql80",
      text: "",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "enqf4",
      text: " ",
      type: "atomic",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 0,
          length: 1,
          key: 24,
        },
      ],
      data: {},
    },
    {
      key: "9s8cm",
      text: "",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "1kib4",
      text: "I'm Thibaud! @thibaud_colas 🇫🇮",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 13,
          length: 15,
          key: 25,
        },
      ],
      data: {},
    },
    {
      key: "62u7v",
      text: "",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "3013q",
      text: "Presentation: https://draftail-playground.herokuapp.com/",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 14,
          length: 42,
          key: 26,
        },
      ],
      data: {},
    },
  ],
  entityMap: {
    "0": {
      type: "LINK",
      mutability: "MUTABLE",
      data: {
        url: "https://twitter.com/thibaud_colas",
      },
    },
    "1": {
      type: "LINK",
      mutability: "MUTABLE",
      data: {
        url:
          "https://wagtail.io/blog/why-wagtail-new-editor-is-built-with-draft-js/",
      },
    },
    "2": {
      type: "LINK",
      mutability: "MUTABLE",
      data: {
        url:
          "https://wagtail.io/blog/rethinking-rich-text-pipelines-with-draft-js/",
      },
    },
    "3": {
      type: "HORIZONTAL_RULE",
      mutability: "IMMUTABLE",
      data: {},
    },
    "4": {
      type: "LINK",
      mutability: "MUTABLE",
      data: {
        url: "https://draftjs.org/",
      },
    },
    "5": {
      type: "LINK",
      mutability: "MUTABLE",
      data: {
        url: "https://draftail-playground.herokuapp.com/",
      },
    },
    "6": {
      type: "LINK",
      mutability: "MUTABLE",
      data: {
        url: "https://springload.github.io/draftail/",
      },
    },
    "7": {
      type: "LINK",
      mutability: "MUTABLE",
      data: {
        url: "https://thibaudcolas.github.io/draftjs-filters/",
      },
    },
    "8": {
      type: "LINK",
      mutability: "MUTABLE",
      data: {
        url: "https://springload.github.io/draftail/examples/",
      },
    },
    "9": {
      type: "LINK",
      mutability: "MUTABLE",
      data: {
        url: "https://www.draft-js-plugins.com/plugin/emoji",
      },
    },
    "10": {
      type: "LINK",
      mutability: "MUTABLE",
      data: {
        url: "https://www.draft-js-plugins.com/plugin/mention",
      },
    },
    "11": {
      type: "LINK",
      mutability: "MUTABLE",
      data: {
        url: "https://www.draft-js-plugins.com/plugin/video",
      },
    },
    "12": {
      type: "LINK",
      mutability: "MUTABLE",
      data: {
        url: "https://www.youtube.com/watch?v=YPj8SIhDR68",
      },
    },
    "13": {
      type: "LINK",
      mutability: "MUTABLE",
      data: {
        url: "https://www.draft-js-plugins.com/plugin/counter",
      },
    },
    "14": {
      type: "LINK",
      mutability: "MUTABLE",
      data: {
        url: "https://www.draft-js-plugins.com/plugin/sticker",
      },
    },
    "15": {
      type: "LINK",
      mutability: "MUTABLE",
      data: {
        url: "https://efloti.github.io/draft-js-mathjax-plugin/",
      },
    },
    "16": {
      type: "LINK",
      mutability: "MUTABLE",
      data: {
        url: "https://letranloc.github.io/draft-js-katex-plugin/",
      },
    },
    "17": {
      type: "LINK",
      mutability: "MUTABLE",
      data: {
        url: "https://ngs.github.io/draft-js-markdown-shortcuts-plugin/",
      },
    },
    "18": {
      type: "HORIZONTAL_RULE",
      mutability: "IMMUTABLE",
      data: {},
    },
    "19": {
      type: "LINK",
      mutability: "MUTABLE",
      data: {
        url:
          "https://wagtail.io/blog/why-wagtail-new-editor-is-built-with-draft-js/",
      },
    },
    "20": {
      type: "LINK",
      mutability: "MUTABLE",
      data: {
        url:
          "https://wagtail.io/blog/rethinking-rich-text-pipelines-with-draft-js/",
      },
    },
    "21": {
      type: "LINK",
      mutability: "MUTABLE",
      data: {
        url: "https://springload.github.io/draftail/",
      },
    },
    "22": {
      type: "LINK",
      mutability: "MUTABLE",
      data: {
        url: "https://springload.github.io/draftail/",
      },
    },
    "23": {
      type: "LINK",
      mutability: "MUTABLE",
      data: {
        url:
          "https://github.com/springload/draftail/tree/master/docs/user-guide",
      },
    },
    "24": {
      type: "HORIZONTAL_RULE",
      mutability: "IMMUTABLE",
      data: {},
    },
    "25": {
      type: "LINK",
      mutability: "MUTABLE",
      data: {
        url: "https://twitter.com/thibaud_colas",
      },
    },
    "26": {
      type: "LINK",
      mutability: "MUTABLE",
      data: {
        url: "https://draftail-playground.herokuapp.com/",
      },
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
