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

const $input = document.querySelector('#input');
const $qrCode = document.querySelector('#qrCode');

chrome.browserAction.onClicked.addListener(tab => {
  console.log('clicked');
  const url = tab.url;
  const qrCode = new QRCode({
    content: url,
    padding: 0,
    width: 200,
    height: 200,
    color: "#222",
    background: "transparent",
    join: true,
    ecl: "M",
  }).svg();

  chrome.runtime.sendMessage(
      {inputValue: url, qrCode: qrCode},
      response => {
        console.log(response.message);
      }
    );
  // console.log(tab);
  // $input.value = url;

  
  // $qrCode.innerHTML = qrcode;
});