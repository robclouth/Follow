var extensionId = "mkcklmkocgdkacinopkjdecfmbojiapa";

var cursorsOnPage = {};

function onCursorEnter(data) {
    var $cursorElem = $('<div id="cursor-' + data.clientId + '" class="cursor"/>');
    cursorsOnPage[data.clientId] = $cursorElem;
    $('body').append($cursorElem);
    console.log('onCursorEnter');
}

function onCursorLeave(data) {
    var $cursorElem = cursorsOnPage[data.clientId];
    if ($cursorElem) {
        $cursorElem.remove();
        delete cursorsOnPage[data.clientId];
    }
    console.log('onCursorEnter');
}

function onCursorMove(data) {
    var $cursorElem = cursorsOnPage[data.clientId];
    if ($cursorElem) {
        $cursorElem.offset({
            top: data.y,
            left: data.x
        });
    }
    console.log('onCursorMove');
}

var port = chrome.runtime.connect(extensionId, {
    name: 'follow'
});

chrome.runtime.onMessage.addListener(function (msg) {
    if (msg.type == 'cursorEnter')
        onCursorEnter(msg.data);
    else if (msg.type == 'cursorLeave')
        onCursorLeave(msg.data);
    else if (msg.type == 'cursorMove')
        onCursorMove(msg.data);
});

document.onmousemove = function (e) {
    port.postMessage({
        type: 'cursorMove',
        data: {
            x: e.pageX,
            y: e.pageY
        }
    });
};

port.postMessage({
    type: 'mouseEnter',
    data: {
        url: document.location.href
    }
});



// var s = document.createElement('script');
// s.src = chrome.extension.getURL('follow.js');
// s.onload = function() {
//     this.remove();
// };
// (document.head || document.documentElement).appendChild(s);