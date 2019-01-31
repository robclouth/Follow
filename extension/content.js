let cursorsOnPage = {};
let docWidth = $(document).width(),
  docHeight = $(document).height();
let lastData;

const port = chrome.runtime.connect({
  name: "follow"
});

chrome.runtime.onMessage.addListener(function(msg) {
  if (msg.type == "cursorEnter") onCursorEnter(msg.data);
  else if (msg.type == "cursorLeave") onCursorLeave(msg.data);
  else if (msg.type == "cursorMove") onCursorMove(msg.data);
});

function throttle(func, wait, options) {
  let context, args, result;
  let timeout = null;
  let previous = 0;
  if (!options) options = {};
  const later = function() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function() {
    const now = Date.now();
    if (!previous && options.leading === false) previous = now;
    const remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}

$(document).mousemove(
  throttle(function(e) {
    port.postMessage({
      type: "cursorMove",
      data: {
        x: e.pageX,
        y: e.pageY
      }
    });
  }, 100)
);

$(window).resize(function() {
  docWidth = $(document).width();
  docHeight = $(document).height();
});

function onCursorEnter(data) {
  let $cursorElem;
  if (data.clientId in cursorsOnPage) {
    const cursor = cursorsOnPage[data.clientId];
    $cursorElem = cursor.$cursorElem;
  } else {
    $cursorElem = $(`<div id="cursor-${data.clientId}" class="cursor"/>`);
    $("body").append($cursorElem);
    cursorsOnPage[data.clientId] = {
      $cursorElem: $cursorElem
    };
  }

  $cursorElem.offset({
    left: data.x || 0,
    top: data.y || 0
  });

  lastData = data;
  console.log("onCursorEnter");
}

function onCursorLeave(data) {
  const $cursorElem = cursorsOnPage[data.clientId].$cursorElem;
  if ($cursorElem) {
    $cursorElem.addClass("leave-start");
    setTimeout(function() {
      $cursorElem.removeClass("leave-start");
      $cursorElem.addClass("leave-end");
    }, 5000);
    setTimeout(function() {
      $cursorElem.remove();
    }, 7000);

    delete cursorsOnPage[data.clientId];
  }
  console.log("onCursorLeave");
}

function onCursorMove(data) {
  const cursor = cursorsOnPage[data.clientId];

  if (!cursor) onCursorEnter(data);
  const $cursorElem = cursor.$cursorElem;

  $cursorElem.offset({
    left: data.x,
    top: data.y
  });

  console.log("onCursorMove");
}
