export const defaultOptions: UserOptions = {
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
}

/** read options directly from storage, avoiding a service worker round-trip */
export function getOptions(callback: (options: UserOptions) => void) {
    chrome.storage.sync.get(defaultOptions, items => {
        callback(items as UserOptions)
    })
}

/** persist options; the service worker picks up changes via storage.onChanged */
export function setOptions(options: UserOptions) {
    chrome.storage.sync.set({ ...options })
}
