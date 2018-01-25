/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * Portions Copyright (C) Philipp Kewisch, 2017 */

// The top button, next to the details
if (!document.getElementById("top-save-close-btn")) {
  let topActions = document.getElementById("top-actions");
  let topSaveButton = document.getElementById("top-save-btn");

  let topSaveCloseButton = topSaveButton.cloneNode(true);
  topSaveCloseButton.id = "top-save-close-btn";
  topSaveCloseButton.textContent = "Save & Close";
  topActions.appendChild(topSaveCloseButton);
  topSaveCloseButton.addEventListener("click", (event) => {
    browser.runtime.sendMessage({ action: "close-after-complete" });
  });
}

// The bottom button, next to the comment box
if (!document.getElementById("bottom-save-close-btn")) {
  let bottomActions = document.getElementById("new-comment-actions");
  let bottomSaveButton = document.getElementById("bottom-save-btn");

  let bottomSaveCloseButton = bottomSaveButton.cloneNode(true);
  bottomSaveCloseButton.id = "bottom-save-close-btn";
  bottomSaveCloseButton.textContent = "Save & Close";
  bottomActions.insertBefore(bottomSaveCloseButton, bottomSaveButton.nextElementSibling);
  bottomSaveCloseButton.addEventListener("click", (event) => {
    browser.runtime.sendMessage({ action: "close-after-complete" });
  });
}
