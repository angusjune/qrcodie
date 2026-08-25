import { ref } from 'vue'
import { getIconDictionary, colors } from '@/action-icon'
import { msg } from '@/utils/i18n'
import { defaultOptions } from '@/utils/options'
import { openQrCodePopup } from '@/utils/popup-source'

const optionsStored     = ref<UserOptions>({} as UserOptions);
const colorSchemeStored = ref<ColorScheme>('light');

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

// context menus
chrome.contextMenus.onClicked.addListener(async ({ menuItemId, pageUrl }) => {
    switch(menuItemId) {
        case 'generateQrCode':
            try {
                await openQrCodePopup(pageUrl)
            } catch (error) {
                console.error('Failed to open QR code popup:', error)
            }
            break;
        default:
            break;
    }
});

chrome.runtime.onInstalled.addListener(() => {
    setIcon();
    // adding contextmenu on install
    chrome.contextMenus.create({
        contexts: ['page'],
        /** @ts-ignore */
        title: msg('generate_code'),
        id: 'generateQrCode'
    });
});

chrome.runtime.onStartup.addListener(() => {
    setIcon();
});
