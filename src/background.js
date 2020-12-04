'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.type === 'GREETINGS') {
//     const message = `Hi ${
//       sender.tab ? 'Con' : 'Pop'
//     }, my name is Bac. I am from Background. It's great to hear from you.`;

//     // Log message coming from the `request` parameter
//     console.log(request.payload.message);
//     // Send a response message
//     sendResponse({
//       message,
//     });
//   }
// });

const isDark  = window.matchMedia("(prefers-color-scheme: dark)").matches; // OS set to dark mode
const isIncognito = chrome.extension.inIncognitoContext; // Chrome is in incognito context


if (isDark || isIncognito) {
    // set light-colored icon in dark UI
    chrome.browserAction.setIcon({ path: `icons/icon-light-48.png`});
}