import assert from 'node:assert/strict'
import test from 'node:test'

import {
    openQrCodePopup,
    resolvePopupSource,
} from '../src/utils/popup-source.ts'

test('the context-menu popup renders a QR code for the clicked page', async () => {
    const clickedPageUrl = 'https://example.com/products/42?view=full#details'
    let popupUrl: string | undefined

    await openQrCodePopup(
        clickedPageUrl,
        async createData => {
            popupUrl = createData.url as string
            return {} as chrome.windows.Window
        },
    )

    const popupLocation = new URL(popupUrl!, 'chrome-extension://qrcodie/')
    const source = await resolvePopupSource(
        popupLocation.search,
        async () => [{} as chrome.tabs.Tab],
    )

    const renderedCard = source ? 'QR code' : 'Nothing'
    assert.equal(renderedCard, 'QR code')
    assert.equal(source, clickedPageUrl)
})

test('the toolbar popup still reads the active tab URL', async () => {
    const activeTabUrl = 'https://example.com/from-toolbar'
    const source = await resolvePopupSource(
        '',
        async queryInfo => {
            assert.deepEqual(queryInfo, {
                active: true,
                lastFocusedWindow: true,
            })
            return [{ url: activeTabUrl } as chrome.tabs.Tab]
        },
    )

    assert.equal(source, activeTabUrl)
})
