// // var extensionId = "mkcklmkocgdkacinopkjdecfmbojiapa";

// var port = chrome.runtime.connect(extensionId, {
//     name: "follow"
// });

// port.onMessage.addListener(function (msg) {
//     if (msg.question == "Who's there?")
//         port.postMessage({
//             answer: "Madame"
//         });
//     else if (msg.question == "Madame who?")
//         port.postMessage({
//             answer: "Madame... Bovary"
//         });
// });



// var socket = io.connect('http://localhost:3000');

// socket.on('mouseEnter', function (data) {
//     console.log(data);
// });

// socket.on('mouseLeave', function (data) {
//     console.log(data);
// });

// socket.on('mouseMove', function (data) {
//     console.log(data);
// });

// document.onmousemove = function (e) {
//     socket.emit('mouseMove', {
//         x: e.pageX,
//          y: e.pageY
//     });
// };
