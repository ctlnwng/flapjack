// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

const MAX_SAVED = 7;

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({ readingStack: [] });
});

chrome.browserAction.onClicked.addListener(savePage);

function savePage(tab) {
  const title = tab.title;
  const url = tab.url;
  const dateAdded = new Date();

  chrome.storage.local.get('readingStack', function (result) {
    const item = { title, url, dateAdded: dateAdded.toUTCString() };
    let readingStack = result.readingStack;

    if (readingStack.length > MAX_SAVED - 1) {
      readingStack = readingStack.slice(0, MAX_SAVED - 1);
    }

    chrome.storage.local.set({ readingStack: [item, ...readingStack] }, function() {
      console.log(`Successfully added ${item}`);
    });
  });
}
