'use strict';

import "./options.scss";
import {MDCSwitch} from '@material/switch';
import {MDCFormField} from '@material/form-field';
import {MDCRadio} from '@material/radio';

const radio = new MDCRadio(document.querySelector('.mdc-radio'));
const formField = new MDCFormField(document.querySelector('.mdc-form-field'));
formField.input = radio;

const switchDisplayInput = new MDCSwitch(document.querySelector('#displayInput'));
const switchDlAsSvgs     = new MDCSwitch(document.querySelector('#dlAsSvg'));

// Get app preferences from storage
chrome.storage.sync.get({
    displayInput: true,
    dlAsSvg: false,

    dpCodeStyle: 'auto', // displayed code style
    dlCodeStyle: 'light', // downloaded code style
}, result => {
    switchDisplayInput.checked = result.displayInput;
    switchDlAsSvgs.checked     = result.dlAsSvg;

    new MDCRadio(document.querySelector(`#dpCodeStyle-${result.dpCodeStyle}`)).checked = true;
    new MDCRadio(document.querySelector(`#dlCodeStyle-${result.dlCodeStyle}`)).checked = true;
});

// Display input changed
document.querySelector('#displayInputNative').addEventListener('change', e => {
    chrome.storage.sync.set({ 'displayInput': e.target.checked });
});

// Download as svg changed
document.querySelector('#dlAsSvg').addEventListener('change', e => {
    chrome.storage.sync.set({ 'dlAsSvg': e.target.checked });
});

// Displayed code style
const dpCodeStyleRadios = document.querySelectorAll('[name=dp-code-style]');
dpCodeStyleRadios.forEach(item => {
    item.addEventListener('change', e => {
        if(e.target.checked) {
            chrome.storage.sync.set({ 'dpCodeStyle': e.target.value });
        }
    });
});

// Downloaded code style
const dlCodeStyleRadios = document.querySelectorAll('[name=dl-code-style]');
dlCodeStyleRadios.forEach(item => {
    item.addEventListener('change', e => {
        if(e.target.checked) {
            chrome.storage.sync.set({ 'dlCodeStyle': e.target.value });
        }
    });
});

// i18n
document.querySelectorAll('[data-msg]').forEach(item => {
    item.textContent = chrome.i18n.getMessage(item.dataset.msg);
})