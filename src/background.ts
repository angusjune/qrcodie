import { ref } from 'vue'
import { getIconDictionary, colors } from '@/action-icon'
import { msg } from '@/utils/i18n'

const optionsStored     = ref<UserOptions>({} as UserOptions);
const colorSchemeStored = ref<ColorScheme>('light');

const defaultOptions: UserOptions = {
    displayInput: true,
    displayAction: true,
    dlAsSvg: false,
    enableDownload: true,
    popupStyle: 'emoji',
    color: 'white',
    emoji: 'pizza',
    enableClickToChangeBg: true,
    qrCodeSize: 170,
    iconStyle: 'solid',
    iconColor: 'auto',
    iconCustomColor: '#444444',
    simpleUi: false,
};

// get options
chrome.storage.sync.get(defaultOptions, (items) => {
    optionsStored.value = items as UserOptions;
});

// get color scheme
chrome.storage.local.get({
    colorScheme: 'light',
}, items => {
    colorSchemeStored.value = items.colorScheme;
});

function setIcon() {
    const color = optionsStored.value.iconColor;
    let c = '';

    if (color === 'auto') {
        c = colorSchemeStored.value === 'light' ? '#444' : '#fff';
    } else if (color === 'custom') {
        c = optionsStored.value.iconCustomColor;
    } else {
        c = colors[color];
    }

    chrome.action.setIcon({
        imageData: getIconDictionary(optionsStored.value.iconStyle, c),
    });

    return getIconDictionary(optionsStored.value.iconStyle, c);
}

setIcon();

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync') {
        for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
            optionsStored.value[key as keyof UserOptions] = newValue as never;
        }
    } else if (areaName === 'local') {
        colorSchemeStored.value = changes.colorScheme.newValue as ColorScheme;
    }
    setIcon();
});

chrome.runtime.onMessage.addListener(({ type, data }, sender, sendResponse) => {
    switch (type) {
        case 'GET_OPTIONS':
            sendResponse(optionsStored.value);
            break;
        case 'SET_OPTIONS':
            chrome.storage.sync.set(data, () => {
                optionsStored.value = {
                    ...optionsStored.value,
                    ...data,
                } as UserOptions;
            });
            break;
        case 'SET_COLOR_SCHEME':
            chrome.storage.local.set({ colorScheme: data.colorScheme }, () => {
                colorSchemeStored.value = data.colorScheme;
            });
            break;
        default:
            break;
    }
});

// adding contextmenu on install
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        contexts: ['page'],
        title: msg('generate_code'),
        id: 'generateQRCode'
    });
    chrome.contextMenus.create({
        contexts: ['action'],
        /** @ts-ignore */
        title: 'open in tab',
        id: 'openInTab'
    });

    setIcon();
});
  
chrome.contextMenus.onClicked.addListener(({ menuItemId }, tab) => {
    switch(menuItemId) {
        case 'generateQRCode':
            chrome.tabs.create({ url: chrome.runtime.getURL('popup.html') });
            break;
        case 'openInTab':
            /** @ts-ignore */
            if (chrome.sidePanel) {
                /** @ts-ignore */
                chrome.sidePanel.open({ windowId: tab?.windowId})
            } else {
                chrome.tabs.create({ url: chrome.runtime.getURL('popup.html') });
            }
            break;
        default:
            break;
    }
});