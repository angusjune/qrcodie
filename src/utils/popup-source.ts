type CreatePopupWindow = (
    createData: chrome.windows.CreateData,
) => Promise<chrome.windows.Window>

type QueryTabs = (
    queryInfo: chrome.tabs.QueryInfo,
) => Promise<chrome.tabs.Tab[]>

export async function openQrCodePopup(
    sourceUrl?: string,
    createWindow: CreatePopupWindow = createData => chrome.windows.create(createData),
) {
    const popupUrl = sourceUrl
        ? `popup.html?${new URLSearchParams({ source: sourceUrl })}`
        : 'popup.html'

    await createWindow({
        url: popupUrl,
        type: 'popup',
        width: 340,
        height: 450,
    })
}

export async function resolvePopupSource(
    locationSearch: string,
    queryTabs: QueryTabs = queryInfo => chrome.tabs.query(queryInfo),
) {
    const sourceUrl = new URLSearchParams(locationSearch).get('source')
    if (sourceUrl) {
        return sourceUrl
    }

    const [tab] = await queryTabs({ active: true, lastFocusedWindow: true })
    return tab?.url
}
