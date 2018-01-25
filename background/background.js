/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * Portions Copyright (C) Philipp Kewisch, 2017 */

let gTabsToClose = new Set();

/**
 * Initialize listeners for tabs load and content script
 */
function initListeners() {
  // Listen to content script messages that detected context menu clicks
  browser.runtime.onMessage.addListener((data, sender, sendReply) => {
    if (data.action == "close-after-complete") {
      gTabsToClose.add(sender.tab.id);
    } else if (data.action == "target-submit-button") {
      // Pending bug 1407227
      // showContextMenu(data.value);
    }
  });

  // Listen for tab loading to close the tab as soon as possible
  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (gTabsToClose.has(tabId) && changeInfo.status == "loading" && changeInfo.url) {
      browser.tabs.remove(tabId);
      gTabsToClose.delete(tabId);
    }
  });
}

/**
 * Click handler for the context menu item
 *
 * @param info      The click info for the context menu
 * @param tab       The tab the context menu was used on
 */
function contextMenuClick(info, tab) {
  browser.tabs.sendMessage(tab.id, { action: "submit-last-form" }).then((handled) => {
    if (handled) {
      gTabsToClose.add(tab.id);
    }
  });
}

/**
 * Hide or show the context menu respecting state
 *
 * @param state     True to show, false to hide
 */
function showContextMenu(state) {
  if (state) {
    browser.menus.create({
      id: "submit-and-close",
      title: "Submit & Close Tab",
      contexts: ["page", "editable", "password"],
      onclick: contextMenuClick
    });
  } else {
    browser.menus.remove("submit-and-close");
  }
}

initListeners();
showContextMenu(true);
