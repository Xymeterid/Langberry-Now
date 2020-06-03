'use strict'

console.log("content script was injected");

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("got message");

        if (request.message == "getSelection"){
            console.log(window.getSelection().toString());
            sendResponse({selection: window.getSelection().toString()});
        }
    });