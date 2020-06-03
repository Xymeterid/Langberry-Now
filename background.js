// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

function getJishoTranslation(text){
  let apiRequest = "https://jisho.org/api/v1/search/words?keyword=" + text;
  let retreivedData = {};
  fetch(apiRequest).then(r => r.text()).then(result => {
    var responseObject = JSON.parse(result);
    let foundItem = responseObject["data"][0];
    retreivedData.kanji = foundItem["japanese"][0]["word"];
    retreivedData.reading = foundItem["japanese"][0]["reading"];
    retreivedData.meaning = foundItem["senses"][0]["english_definitions"];
  })
  return retreivedData;
}

console.log("background script was launched successfuly");

chrome.commands.onCommand.addListener(function(command) {
  if (command != "langberry_translate") return;
  console.log("shortcut pressed");

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    console.log(tabs);
    chrome.tabs.sendMessage(tabs[0].id, {message: "getSelection"}, function(response) {
      if (response === null) console.log("something went wrong");
      let selectedText = (response.selection).trim();
      console.log(selectedText)
      let gotData = getJishoTranslation(selectedText);
      console.log(gotData);
    });
  });
});

