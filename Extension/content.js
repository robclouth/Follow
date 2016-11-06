var extensionId = "hdkccnbnblofabgpalliknpjhcpphckc";

var cursorsOnPage = {};
var docWidth = $(document).width(), docHeight = $(document).height();
var selectorGen = new CssSelectorGenerator();
var $prevMouseTarget = null;
var targetWidth = 0, targetHeight = 0;

function onCursorEnter(data) {
    var $cursorElem = $('<div id="cursor-' + data.clientId + '" class="cursor"/>');
    $cursorElem.offset({
        top: data.y || 0,
        left: data.x || 0
    });
    cursorsOnPage[data.clientId] = {
        cursorElem: $cursorElem,
        overElem: data.relElemSel
    };
    $('body').append($cursorElem);
    console.log('onCursorEnter');
}

function onCursorLeave(data) {
    var $cursorElem = cursorsOnPage[data.clientId].cursorElem;
    if ($cursorElem) {
        $cursorElem.remove();
        delete cursorsOnPage[data.clientId];
    }
    console.log('onCursorLeave');
}

function onCursorMove(data) {
    var cursor = cursorsOnPage[data.clientId];
    
    if (cursor) {
        var $cursorElem = cursor.cursorElem;
        if(data.relElemSel){
            var $relElemLocal = $(data.relElemSel);
            cursor.overElem = $relElemLocal;
            
            var offset = $relElemLocal.offset();
            cursor.overElemBounds = {
                x: offset.left,
                y: offset.top,
                width: $relElemLocal.width(),
                height: $relElemLocal.height()
            };
        }

        if(cursor.overElemBounds){
            $cursorElem.offset({
                top: data.y * cursor.overElemBounds.height + cursor.overElemBounds.y,
                left: data.x * cursor.overElemBounds.width + cursor.overElemBounds.x,
            });
        }
    } else {
        onCursorEnter(data);
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

$(document).mousemove(function (e) {
    var selector = null;

    var $target = $(e.target);
    var changed = false;

    if(!$target.is($prevMouseTarget)){
        selector = selectorGen.getSelector($target[0]);
        $prevMouseTarget = $target;
        targetWidth = $target.width();
        targetHeight = $target.height();
        changed = true;
    }

    var offset = $target.offset(); 
    var relX = (e.pageX - offset.left) / targetWidth;
    var relY = (e.pageY - offset.top) / targetHeight;
   
    port.postMessage({
        type: 'cursorMove',
        data: changed? {
            relElemSel: selector,
            x: relX,
            y: relY,
        }: {
            x: relX,
            y: relY,
        }
    });
});

$(window).resize(function() {
    docWidth = $(document).width();
    docHeight = $(document).height();
});

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