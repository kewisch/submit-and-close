/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * Portions Copyright (C) Philipp Kewisch, 2017 */

/**
 * Checks if the passed element is a submit button
 *
 * @param elem      The element to check
 * @return          True, if the element is a submit button
 */
function isSubmitElem(elem) {
  return ["button", "input"].includes(elem.localName) && elem.type == "submit";
}

/**
 * Finds forms on the current page that contain a submit button
 *
 * @param forms     The array of forms to search
 * @return          The filtered list of forms
 */
function findSubmitForms(forms) {
  return forms.filter((form) => {
    for (let elem of form) {
      if (isSubmitElem(elem)) {
        return true;
      }
    }
    return false;
  });
}

/**
 * Gets the most recent form, either the one whose submit button was last
 * context-clicked on, or if there is only one form with a submit button on the
 * page then that one.
 *
 * Calling this function will also reset the last clicked form.
 */
function getLastForm() {
  let returnForm = getLastForm._form;
  getLastForm._form = null;

  if (!returnForm) {
    let submitForms = findSubmitForms([...document.forms]);
    if (submitForms.length == 1) {
      returnForm = submitForms[0];
    }
  }

  return returnForm;
}

/**
 * Sets the last clicked form.
 *
 * @param form      The html form element to save.
 */
function setLastForm(form) {
  getLastForm._form = form;
}

/**
 * Initialize listeners for context menu and background script
 */
function initListeners() {
  // The context menu listener determines the last clicked form
  document.addEventListener("contextmenu", (event) => {
    if (event.target.form) {
      setLastForm(event.target.form);
    }
    browser.runtime.sendMessage({ action: "target-submit-button", value: !!event.target.form });
  }, { capture: true });

  // The background listener submits the last found form, in case the browser
  // context menu item was used.
  browser.runtime.onMessage.addListener((data, sender, sendReply) => {
    let handled = false;
    if (data.action == "submit-last-form") {
      let lastForm = getLastForm();
      if (lastForm) {
        lastForm.submit();
        handled = true;
      }
    }
    sendReply(handled);
  });
}

initListeners();
