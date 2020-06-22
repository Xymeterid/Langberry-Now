'use strict'

let lastClickX = 0;
let lastClickY = 0;

//Видаляє попередньо додану картку якщо вона існує
function removeCard() {
    $("#id_wrapper").remove();
}

//Додає картку на екран з заданими параметрами
function showCard(data) {
    removeCard();

    let wrapper = $('<div>');
    let content = $('<div>');

    wrapper.attr("id", "id_wrapper");
    content.attr("id", "id_content");

    wrapper.click(e => {
        e.stopPropagation();
    });

    if ('error' in data) {
        content
            .append($('<a>').addClass("close_btn").attr("id", "close_btn"))
            .append($('<p>').append(data.error))
    } else {
        let kanji = data.kanji || '';
        let reading = data.reading || '';
        let meanings = data.meanings[0]["english_definitions"] ? data.meanings[0]["english_definitions"].join(', ') : '';

        let kanji_with_reading = $('<ruby>').text(kanji).append($('<rt>').text(reading));

        content
            .append($('<a>').addClass("close_btn").attr("id", "close_btn"))
            .append($('<p>').append(kanji_with_reading))
            .append($('<a>').addClass("left_btn").attr("id", "left_meaning_btn"))
            .append($('<p>').text(meanings).attr("id", "meanings"))
            .append($('<a>').addClass("right_btn").attr("id", "right_meaning_btn"))
            .append($('<input>').addClass("input_box").val(kanji + "#" + meanings));
    }

    wrapper.append(content);
    $('body').append(wrapper);

    let boxclose = $("#close_btn");

    boxclose.click(event => {
        wrapper.remove();
    });

    if (!('error' in data)) {
        let kanji = data.kanji
        let current_meaning = 0;
        let p_meanings = $("#meanings")
        let meaning_next = $("#right_meaning_btn");
        let meaning_prev = $("#left_meaning_btn");
        meaning_prev.hide();
        let meanings_array = data.meanings
        if (Object.keys(meanings_array).length <= 1){
            meaning_next.hide();
        }

        let input = $(".input_box").click(function () {
            $(this).select();
        });

        function cycleMeaning(direction) {
            
            if (direction > 0){
                current_meaning++;
            }
            else {
                current_meaning--;
            }
            
            let new_meanings = meanings_array[current_meaning]["english_definitions"] ? data.meanings[current_meaning]["english_definitions"].join(', ') : '';
            p_meanings.text(new_meanings);
            console.log(Object.keys(meanings_array).length);
            input.val(kanji + "#" + new_meanings);

            if (current_meaning == (Object.keys(meanings_array).length) - 1) {
                console.log("reached end");
                meaning_next.hide();
            }
            else{
                meaning_next.show()
            }
    
            if (current_meaning == 0) {
                console.log("reached start");
                meaning_prev.hide();
            }
            else{
                meaning_prev.show();
            }
        }

        meaning_next.click(event => cycleMeaning(1));
        meaning_prev.click(event => cycleMeaning(-1));
    }
    
    let currentY = lastClickY + 25;
    let currentX = lastClickX - 25;

    wrapper.css("top", currentY + "px");
    wrapper.css("left", currentX + "px");
}

document.onclick = function(e) {
    lastClickX = e.pageX;
    lastClickY = e.pageY;
    removeCard();
};

//Лісенер на повідомлення
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        setTimeout(function() {
            if (request.message == "getSelection") {
                sendResponse({
                    selection: window.getSelection().toString()
                });
            }
            if (request.message == "showCard") {
                showCard(request);
            }
        }, 1);
        return true;
    });