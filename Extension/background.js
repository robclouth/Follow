var socket = io.connect('http://localhost:3000');
var port;

chrome.runtime.onConnect.addListener(function (newPort) {
    console.assert(newPort.name == 'follow');

    port = newPort;

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

function sendToTabs(url, type, data) {
    chrome.tabs.query({
        url: url,
        currentWindow: true
    }, function (tabs) {
        for (var i in tabs) {
            chrome.tabs.sendMessage(tabs[i].id, {
                type: type,
                data: data
            }, function (response) {});
        }
    });
}

socket.on('cursorEnter', function (data) {
    sendToTabs(data.toUrl, 'cursorEnter', data);
});

socket.on('cursorLeave', function (data) {
    sendToTabs(data.fromUrl, 'cursorLeave', data);
});

socket.on('cursorMove', function (data) {
    sendToTabs(data.url, 'cursorMove', data);
});