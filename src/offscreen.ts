const mq = window.matchMedia('(prefers-color-scheme: dark)')

function sendColorScheme(isDark: boolean) {
    chrome.runtime.sendMessage({
        type: 'SET_COLOR_SCHEME',
        data: { colorScheme: isDark ? 'dark' : 'light' },
    })
}

// Send initial value immediately
sendColorScheme(mq.matches)

// Listen for changes via matchMedia event
mq.addEventListener('change', (e) => {
    sendColorScheme(e.matches)
})

// Poll periodically as a fallback — the matchMedia event alone isn't always
// reliable when the service worker has been sleeping and the offscreen doc was
// recreated, because the first 'change' event may have been missed.
let lastKnownIsDark = mq.matches
setInterval(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (isDark !== lastKnownIsDark) {
        lastKnownIsDark = isDark
        sendColorScheme(isDark)
    }
}, 10_000)
