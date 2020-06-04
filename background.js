// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

function getJishoTranslation(text){
  let apiRequest = "https://jisho.org/api/v1/search/words?keyword=\"" + text + "\"";
  let retreivedData = {"test": "test"};
  return fetch(apiRequest)
    .then(result => result.json())
    .then(data => data["data"][0])      
    .then(foundItem => {
      let retreivedData = {}; 
      retreivedData.kanji = foundItem["japanese"][0]["word"];
      retreivedData.reading = foundItem["japanese"][0]["reading"];
      retreivedData.meanings = foundItem["senses"][0]["english_definitions"];
      return (retreivedData);
    }).catch(function(err) {
    console.log('Fetch Error :-S', err);
  }); 
}

chrome.commands.onCommand.addListener(function(command) {
  if (command != "langberry_translate") return;

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    let gotData = {};

      chrome.tabs.sendMessage(tabs[0].id, {message: "getSelection"}, function(response) {
      if (response === null) console.log("got null responce");
      if (response.selection == "") return;
      let selectedText = (response.selection).trim();
      getJishoTranslation(selectedText).then(function(results){
        gotData = results;
        if (gotData === undefined) {
          gotData = {
            "error":"No translation was found, sorry"
          };
        }
        gotData["message"] = "showCard";
        console.log(gotData);
        chrome.tabs.sendMessage(tabs[0].id, gotData);
      });
    });
  });
  
});

