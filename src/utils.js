export const postRequest = (endpoint, data, successCallback) => {
    const request = new XMLHttpRequest();
    request.open('POST', endpoint, true);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
            successCallback(request.responseText);
        }
    };
    request.send(data);
};


// eslint-disable-next-line
export const defaultContentState = {"entityMap":{},"blocks":[{"key":"b1ito","text":"Draftail works well with draftjs_exporter!","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"c2s1c","text":"List item","type":"unordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"c4l1f","text":"Nested","type":"unordered-list-item","depth":1,"inlineStyleRanges":[{"offset":0,"length":6,"style":"ITALIC"}],"entityRanges":[],"data":{}},{"key":"3onpa","text":"and back","type":"unordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]};

export const getInitialContentState = () => {
    return JSON.parse(window.sessionStorage.getItem('demo:contentState')) || defaultContentState;
};

export const saveContentState = (contentState) => {
    window.sessionStorage.setItem('demo:contentState', JSON.stringify(contentState));
}
