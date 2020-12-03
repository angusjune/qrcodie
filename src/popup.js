'use strict';

import "./popup.css";
import QRCode from 'qrcode-svg';
import Canvg from 'canvg';

(function() {
  const $input  = document.querySelector('#input');
  const $qrCode = document.querySelector('#qrCode');
  const $canvas = document.querySelector('#canvas');
  const $btnPaste = document.querySelector('#btnPaste');
  const $btnClear = document.querySelector('#btnClear');

  let initContent = '';

  const isDark = window.matchMedia('(prefers-color-scheme: dark)');

  const generateCode = content => {
    // Create a qr code to be displayed
    const qrCode = new QRCode({
      content: content,
      padding: 0,
      color: isDark ? '#eee' : '#222',
      container: 'svg-viewbox',
      background: 'transparent',
      join: true,
    }).svg();

    // Create a qr code to be download
    const qrCodeToExport = new QRCode({
      content: content,
      padding: 4,
      width: 400,
      height: 400,
      color: '#222',
      background: '#fff',
      join: true
    }).svg();

    const ctx = $canvas.getContext('2d');
    ctx.scale(2, 2);
    const v = Canvg.fromString(ctx, qrCodeToExport);
    v.start();

    $qrCode.innerHTML = qrCode;
    $qrCode.setAttribute('href', $canvas.toDataURL('image/png'));
  };

  chrome.tabs.query({active: true}, tabs => {
    const url = tabs[0].url;
    initContent = url;
    generateCode(url);
    $input.value = url;
  });

  const hideBtnClear = () => {
    $btnClear.classList.add('hidden');
    $input.classList.remove('shrink');
  };

  const showBtnClear = () => {
    $btnClear.classList.remove('hidden');
    $input.classList.add('shrink');
  };

  // Paste button
  $btnPaste.addEventListener('click', e => {
    e.preventDefault();
    $input.select();
    document.execCommand('paste');
    generateCode($input.value);
    showBtnClear();
  });

  $btnClear.addEventListener('click', e => {
    e.preventDefault();
    $input.value = initContent;
    generateCode(initContent);
    hideBtnClear();
  });


  // We will make use of Storage API to get and store `count` value
  // More information on Storage API can we found at
  // https://developer.chrome.com/extensions/storage

  // To get storage access, we have to mention it in `permissions` property of manifest.json file
  // More information on Permissions can we found at
  // https://developer.chrome.com/extensions/declare_permissions
  // const counterStorage = {
  //   get: cb => {
  //     chrome.storage.sync.get(['count'], result => {
  //       cb(result.count);
  //     });
  //   },
  //   set: (value, cb) => {
  //     chrome.storage.sync.set(
  //       {
  //         count: value,
  //       },
  //       () => {
  //         cb();
  //       }
  //     );
  //   },
  // };

  // function setupCounter(initialValue = 0) {
  //   document.getElementById('counter').innerHTML = initialValue;

  //   document.getElementById('incrementBtn').addEventListener('click', () => {
  //     updateCounter({
  //       type: 'INCREMENT',
  //     });
  //   });

  //   document.getElementById('decrementBtn').addEventListener('click', () => {
  //     updateCounter({
  //       type: 'DECREMENT',
  //     });
  //   });
  // }

  // function updateCounter({ type }) {
  //   counterStorage.get(count => {
  //     let newCount;

  //     if (type === 'INCREMENT') {
  //       newCount = count + 1;
  //     } else if (type === 'DECREMENT') {
  //       newCount = count - 1;
  //     } else {
  //       newCount = count;
  //     }

  //     counterStorage.set(newCount, () => {
  //       document.getElementById('counter').innerHTML = newCount;

  //       // Communicate with content script of
  //       // active tab by sending a message
  //       chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  //         const tab = tabs[0];

  //         chrome.tabs.sendMessage(
  //           tab.id,
  //           {
  //             type: 'COUNT',
  //             payload: {
  //               count: newCount,
  //             },
  //           },
  //           response => {
  //             console.log('Current count value passed to contentScript file');
  //           }
  //         );
  //       });
  //     });
  //   });
  // }

  // function restoreCounter() {
  //   // Restore count value
  //   counterStorage.get(count => {
  //     if (typeof count === 'undefined') {
  //       // Set counter value as 0
  //       counterStorage.set(0, () => {
  //         setupCounter(0);
  //       });
  //     } else {
  //       setupCounter(count);
  //     }
  //   });
  // }

  // document.addEventListener('DOMContentLoaded', restoreCounter);

  // // Communicate with background file by sending a message
  // chrome.runtime.sendMessage(
  //   {
  //     type: 'GREETINGS',
  //     payload: {
  //       message: 'Hello, my name is Pop. I am from Popup.',
  //     },
  //   },
  //   response => {
  //     console.log(response.message);
  //   }
  // );
})();
