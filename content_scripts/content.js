'use strict'

let lastClickX = 0;
let lastClickY = 0;

function removeCard(){
    $("#id_wrapper").remove();
}

function showCard(data){
    removeCard();

    let wrapper = $('<div>');
    let content = $('<div>');

    wrapper.attr("id", "id_wrapper");
    content.attr("id", "id_content");

    wrapper.click(e =>{
        e.stopPropagation();
    });

    let kanji = data.kanji || '';
    let reading = data.reading || '';
    let meanings = data.meanings ? data.meanings.join(', ') : '';

    let kanji_with_reading = $('<ruby>').text(kanji).append($('<rt>').text(reading));

    content
        .append($('<a>').addClass("close_btn").attr("id", "close_btn"))
        .append($('<p>').append(kanji_with_reading))
        .append($('<p>').text(meanings));
    
    wrapper.append(content);
    $('body').append(wrapper);

    let boxclose = $("#close_btn");

    boxclose.click(event => {
        wrapper.remove();
    });

    let width = $('#id_wrapper' ).innerWidth();
    let height = $('#id_wrapper').innerHeight();
    let currentY = lastClickY - 200;
    let currentX = lastClickX - 25;

    wrapper.css("top", currentY + "px");
    wrapper.css("left", currentX + "px");
}

document.onclick = function(e)
{
    lastClickX = e.pageX;
    lastClickY = e.pageY;
    removeCard();
};

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