var socket = io.connect('http://localhost:3000');
var currUrl = null;

chrome.runtime.onConnect.addListener(function (port) {
    console.assert(port.name == 'follow');

    port.onMessage.addListener(function (msg) {
        socket.emit(msg.type, msg.data);
    });
});

chrome.tabs.onCreated.addListener(function (tab) {
    changeUrl(tab.url);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    changeUrl(tab.url);
});

chrome.tabs.onActivated.addListener(function () {
    chrome.tabs.getSelected(null, function (tab) {
        changeUrl(tab.url);
    });
});

chrome.tabs.getSelected(null, function (tab) {
    changeUrl(tab.url);
});

function changeUrl(newUrl){
    //remove parameters
    newUrl =  newUrl.split('?')[0];

    if(newUrl !== currUrl){
        socket.emit('urlChange', newUrl);
        currUrl = newUrl;
    }
}

function sendToCurrentTab(type, data) {
    chrome.tabs.getSelected(null, function (tab) {
        if(tab.id < 0)
            return;
        chrome.tabs.sendMessage(tab.id, {
            type: type,
            data: data
        }, function (response) {});
    });
}

socket.on('cursorEnter', function (data) {
    sendToCurrentTab('cursorEnter', data);
});

socket.on('cursorLeave', function (data) {
    sendToCurrentTab('cursorLeave', data);
});

socket.on('clientDisconnect', function (data) {
    sendToCurrentTab('cursorLeave', data);
});

socket.on('cursorMove', function (data) {
    sendToCurrentTab('cursorMove', data);
});