'use strict'

function showCard(data){
    var wrapper = $('<div>');
    var content = $('<div>');
    console.log("fuck yeah");
    console.log(data);
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        setTimeout(function() {
            if (request.message == "getSelection"){
                sendResponse({selection: window.getSelection().toString()});
            }
            if (request.message == "showCard"){
                showCard(request);
            }
        }, 1);
        return true;        
    });