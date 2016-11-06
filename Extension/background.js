var socket = io.connect('http://localhost:3000');

chrome.runtime.onConnect.addListener(function (newPort) {
    console.assert(newPort.name == 'follow');

    port.onMessage.addListener(function (msg) {
        socket.emit(msg.type, msg.data);
    });
});

chrome.tabs.onCreated.addListener(function (tab) {
    socket.emit('urlChange', tab.url);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    socket.emit('urlChange', tab.url);
});

chrome.tabs.onActivated.addListener(function () {
    chrome.tabs.getSelected(null, function (tab) {
        socket.emit('urlChange', tab.url);
    });
});

chrome.tabs.getSelected(null, function (tab) {
    socket.emit('urlChange', tab.url);
});

function sendToCurrentTab(type, data) {
    chrome.tabs.getSelected(null, function (tab) {
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