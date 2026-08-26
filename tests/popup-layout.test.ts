import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('the toolbar popup height is driven by its content', async () => {
    const css = await readFile(new URL('../src/assets/popup.css', import.meta.url), 'utf8')
    const bodyRule = css.match(/body\s*\{([^}]*)\}/s)?.[1] ?? ''

    assert.doesNotMatch(
        bodyRule,
        /\bheight\s*:\s*100vh\b/,
        'a viewport-height body feeds Chrome popup resizing back into document layout and makes the popup flicker',
    )
})
