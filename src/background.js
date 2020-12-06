'use strict';

const isBrowserDark  = window.matchMedia("(prefers-color-scheme: dark)") || chrome.extension.inIncognitoContext;

if (isBrowserDark) {
    // set light-colored icon in dark UI
    chrome.browserAction.setIcon({ path: `icons/icon-light-32.png`});
}

chrome.runtime.onMessage.addListener(message => {
    if (message.isBrowserDark) {
        chrome.browserAction.setIcon({ path: `icons/icon-light-32.png`});
    } else {
        chrome.browserAction.setIcon({ path: `icons/icon-32.png`});
    }
    console.log(message);
})