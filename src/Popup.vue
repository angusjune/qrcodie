<script setup lang="ts">
import { ref, watch, computed, onMounted, VNodeRef } from 'vue'
import debounce from 'lodash.debounce'
import QRCode from 'qrcode-svg'
import { Canvg } from 'canvg'
import SvgToMiniDataURI from 'mini-svg-data-uri'
import QcTextfield from '@/components/QcTextfield.vue'
import QcCodeCard from './components/QcCodeCard.vue'
import QcPattern from './components/QcPattern.vue'
import QcSwitchButton from './components/QcSwitchButton.vue'
import { msg } from '@/utils/i18n'

const options = ref<UserOptions>({} as UserOptions)

const currentUrl     = ref<string | undefined>(undefined)
const qrCode         = ref<string | undefined>(undefined)
const qrCodeToExport = ref<string | undefined>(undefined)
const customContent  = ref<string>('')

const canvas = ref<VNodeRef | null>(null)

const codeColors: Record<UserOptions['color'], string> = {
    white: '#111',
    dark: '#111',
    orange: '#E80505',
    green: '#28C76F',
    blue: '#0396FF',
    purple: '#7367F0',
    pink: '#FD6585',
}

const popupThemes: {label: string, value: UserOptions['popupStyle']}[] = [{label: msg('color'), value: 'color'}, {label: msg('emoji'), value: 'emoji'}]
const emojis: UserOptions['emoji'][] = ['pizza', 'heart', 'goofy', 'smile', 'star', 'confetti', 'love', 'rainbow']
const colors: UserOptions['color'][] = ['white', 'dark', 'green', 'blue', 'purple', 'pink']

// get options
chrome.runtime.sendMessage({ type: 'GET_OPTIONS' }, (response) => {
  options.value = response
})

// set options
watch(options, debounce(val => {
    chrome.runtime.sendMessage({ type: 'SET_OPTIONS', data: val })
}, 300), { deep: true })

onMounted(async () => {
    // get current tab url
    const tab = await getCurrentTab()
    currentUrl.value = tab?.url

    // set color scheme
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    chrome.runtime.sendMessage({ type: 'SET_COLOR_SCHEME', data: { colorScheme: isDark ? 'dark' : 'light' } })
})

// get info of the current tab
async function getCurrentTab() {
    const queryOptions = { active: true, lastFocusedWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

// generates qr code
function generateCode(content: string) {
    const props: QRCode.Options = {
        content: content,
        padding: 0,
        color: codeColor.value,
        container: 'svg-viewbox',
        background: 'transparent',
        join: true,
    }
    // Create a qr code to be displayed
    qrCode.value = new QRCode(props).svg()

    // Create a qr code to be download
    qrCodeToExport.value = new QRCode({
        ...props,
        padding: 4,
        width: 400,
        height: 400,
        container: 'svg',
        background: '#fff',
    }).svg()

    // Draw the svg code on canvas, so that it can be converted to png
    const ctx = canvas.value.getContext('2d')
    ctx.scale(2, 2)
    const v = Canvg.fromString(ctx, qrCodeToExport.value)
    v.start()
}

// qr code content
const codeContent = computed<string>(() => {
    // if no custom content, use url of the current tab
    if (!customContent.value) {
        return currentUrl.value ?? ''
    }
    return customContent.value
})

const inputValue = computed<string>({
    get: () => customContent.value ? customContent.value : currentUrl.value ?? '',
    set: (value) => customContent.value = value 
})

// color of the qr code
const codeColor = computed<string>(() => (options.value.popupStyle === 'color' && !options.value.simpleUi) ? (codeColors[options.value.color] ?? codeColors.white) : codeColors.white )

// generates new code when content or color changes
watch([codeContent, codeColor], ([newContent, newCodeColor]) => {
    newContent && generateCode(newContent)
})

// get the next item in an array
function nextInArray(array: any[], current?: any) {
    const c = current ?? array[0]

    const index = array.indexOf(c)
    const nextIndex = (index + 1) % array.length
    return array[nextIndex]
}

const inputFocus = ref(false)
const inputDoBlur = ref(true)

watch(inputFocus, val => {
    if (val) {
        inputDoBlur.value = false
    } else {
        // prevent changing the bg when the user is just trying to blur the input
        setTimeout(() => {
            inputDoBlur.value = true
        }, 100)
    }
})

function clickBg() {
    if (inputDoBlur.value && options.value.enableClickToChangeBg) {
        if (options.value.popupStyle === 'emoji') {
            options.value.emoji = nextInArray(emojis, options.value.emoji)
        } else {
            options.value.color = nextInArray(colors, options.value.color)
        }
    }
}

const codeCardProps = computed(() => {
    return {
        ... (options.value.enableDownload && qrCodeToExport.value) ? 
        { 
            download: options.value.dlAsSvg ? 'qr-code.svg' : 'qr-code@2x.png',
            href: options.value.dlAsSvg ? SvgToMiniDataURI(qrCodeToExport.value) : canvas.value.toDataURL('image/png'),
            role: 'button',
            ariaLabel: msg('download_qr_code'),
        } : {},
    }
})
</script>

<template>
    <div class="container">

        <div v-if="!options.simpleUi" class="bg" @click="clickBg" aria-hidden="true">
            <QcPattern :type="options.popupStyle" :emoji="options.emoji" :color="options.color" />
        </div>

        <section v-if="options.displayAction && !options.simpleUi" class="actions">
            <QcSwitchButton :items="popupThemes" v-model="options.popupStyle" />
        </section>

        <section class="content">
            <component :is="options.enableDownload ? 'a' : 'div'" v-bind="codeCardProps">
                <QcCodeCard :svg="qrCode" :size="options.qrCodeSize" :simpleUi="options.simpleUi" />
            </component>
        </section>

        <section v-if="options.displayInput" class="form" :class="{'form--expanded': !inputDoBlur}">
            <QcTextfield v-model="inputValue" :hideClear="!customContent" v-model:focus="inputFocus" />
        </section>

        <canvas ref="canvas" style="display: none;" />
    </div>
</template>

<style lang="postcss" scoped>
.container {
    display: flex;
    flex-direction: column;
    position: relative;
}

.bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.content {
    padding: var(--spacing-4) calc(var(--spacing-4) * 2);
}

.actions {
    position: relative;
    padding-top: var(--spacing-4);
    display: flex;
    gap: var(--spacing-2);
    justify-content: center;
}

.form {
    position: relative;
    padding: 0 calc(var(--spacing-4) * 2) var(--spacing-4);
    transition: padding 0.2s cubic-bezier(0.25, 1, 0.5, 1);

    &--expanded {
        padding-left: var(--spacing-3);
        padding-right: var(--spacing-3);
    }
}
</style>