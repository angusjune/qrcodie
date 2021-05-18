'use strict';

import "./popup.scss";
import QRCode from 'qrcode-svg';
import Canvg from 'canvg';
import SvgToMiniDataURI from 'mini-svg-data-uri';

const $input  = document.querySelector('#input');
const $qrCode = document.querySelector('#qrCode');
const $canvas = document.querySelector('#canvas');
const $btnPaste = document.querySelector('#btnPaste');
const $btnClear = document.querySelector('#btnClear');

const isBrowserDark = window.matchMedia('(prefers-color-scheme: dark)').matches || chrome.extension.inIncognitoContext;
chrome.runtime.sendMessage({ isBrowserDark: isBrowserDark });

if (isBrowserDark) {
  chrome.action.setIcon({ path: {
      16: 'icons/icon-light-16.png',
      24: 'icons/icon-light-24.png',
      32: 'icons/icon-light-16.png'
  }});
} else {
  chrome.action.setIcon({ path: {
      16: 'icons/icon-16.png',
      24: 'icons/icon-24.png',
      32: 'icons/icon-16.png'
  }});
}

// Initial content of the qr code
let initContent = '';

// Initial preferences
let displayInput = true;
let dlAsSvg = false;
let dpCodeStyle = 'auto';
let dlCodeStyle = 'light';

// Get preferences from storage
chrome.storage.sync.get({
  displayInput: true,
  dlAsSvg: false,
  dpCodeStyle: 'auto', // displayed code style
  dlCodeStyle: 'light', // downloaded code style
}, result => {
  displayInput = result.displayInput;
  dlAsSvg = result.dlAsSvg;
  dpCodeStyle = result.dpCodeStyle;
  dlCodeStyle = result.dlCodeStyle;

  init();
});

const init =() => {
  
  const isDpCodeDark = !(dpCodeStyle === 'light' || !isBrowserDark);
  const isDlCodeDark = !(dlCodeStyle === 'light' || !isBrowserDark);

  if (!isDpCodeDark) { document.querySelector('body').classList.add('light'); }
  if (!displayInput) { document.querySelector('body').classList.add('remove-textfield'); }

  const generateCode = content => {
    // Create a qr code to be displayed
    const qrCode = new QRCode({
      content: content,
      padding: 0,
      color: isDpCodeDark ? '#eee' : '#222',
      container: 'svg-viewbox',
      background: 'transparent',
      join: true,
    }).svg();

    $qrCode.innerHTML = qrCode;

    // Create a qr code to be download
    const qrCodeToExport = new QRCode({
      content: content,
      padding: 4,
      width: 400,
      height: 400,
      color: isDlCodeDark ? '#eee' : '#222',
      background: isDlCodeDark ? '#292A2D' : '#fff',
      join: true
    }).svg();

    // Draw the svg code on canvas, so that it can be converted to png
    const ctx = $canvas.getContext('2d');
    ctx.scale(2, 2);
    const v = Canvg.fromString(ctx, qrCodeToExport);
    v.start();

    // Set the attribute of the qr code to be downloaded
    $qrCode.setAttribute('href', dlAsSvg ? SvgToMiniDataURI(qrCodeToExport) : $canvas.toDataURL('image/png'));
    $qrCode.setAttribute('download', dlAsSvg ? 'qr-code.svg': 'qr-code@2x.png');
  };

  // Generate qr code of the current url
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
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

  // Generate new code on content change
  $input.addEventListener('input', e => {
    generateCode(e.target.value);
    showBtnClear();
  });

  // On input blur
  $input.addEventListener('blur', e => {
    if (e.target.value == '') {
      $input.value = initContent;
      generateCode(initContent);
      hideBtnClear();
    }
  });

  // Select all on focus
  $input.addEventListener('focus', e => {
    $input.select();
  });

  // Paste button
  $btnPaste.addEventListener('click', e => {
    e.preventDefault();
    $input.select();
    document.execCommand('paste');
  });

  // Clear button
  $btnClear.addEventListener('click', e => {
    e.preventDefault();
    $input.value = initContent;
    generateCode(initContent);
    hideBtnClear();
  });
};
