<script lang="ts" setup>
import { ref, onMounted, watch, computed, FunctionalComponent } from 'vue'
import debounce from 'lodash.debounce'
import { msg } from '@/utils/i18n'
import KrSection from './components/KrSection.vue'
import KrToggleRow from './components/KrToggleRow.vue'
import KrSelectGroup from './components/KrSelectGroup.vue'
import KrSelectItem from './components/KrSelectItem.vue'
import KrSliderRow from './components/KrSliderRow.vue'
import KrColorInputRow from './components/KrColorInputRow.vue'
import Pizza from '~icons/fluent-emoji/pizza'
import Heart from '~icons/fluent-emoji/sparkling-heart'
import Goofy from '~icons/fluent-emoji/zany-face'
import Smile from '~icons/fluent-emoji/slightly-smiling-face'
import Star from '~icons/fluent-emoji/star'
import Confetti from '~icons/fluent-emoji/party-popper'
import Love from '~icons/fluent-emoji/love-you-gesture'
import Rainbow from '~icons/fluent-emoji/rainbow'
import { getIcon, colors as actionIconColors } from './action-icon'

const options = ref<UserOptions>({} as UserOptions)

onMounted(() => {
    chrome.runtime.sendMessage({type: 'GET_OPTIONS'}, (res) => {
        options.value = res
    })
})

watch(options, debounce((val) => {
    chrome.runtime.sendMessage({ type: "SET_OPTIONS", data: val })
}, 300), { deep: true })

interface OptionItem {
    title: string,
    hidden?: boolean,
    options?: Array<{ value: string, label: string, [key: string]: any }>
}

const items = computed<Record<keyof UserOptions, OptionItem>>(() => {
    return {
        displayAction: { title: msg('show_action') },
        displayInput: { title: msg('show_input') },
        simpleUi: { title: msg('simple_ui') },
        popupStyle: {
            title: msg('popup_style'),
            options: [
                { value: 'color', label: msg('color') },
                { value: 'emoji', label: msg('emoji') },
            ]
        },
        enableClickToChangeBg: { title: msg('enable_click_to_change_bg') },
        color: {
            title: msg('color'),
            options: [
                { value: 'white', label: msg('white'), bg: '#fff' },
                { value: 'dark', label: msg('dark'), bg: 'linear-gradient( 135deg, #2B373C 10%, #253136 100%)' },
                { value: 'orange', label: msg('orange'), bg: 'linear-gradient( 135deg, #FDD819 10%, #E80505 100%)' },
                { value: 'green', label: msg('green'), bg: 'linear-gradient( 135deg, #81FBB8 10%, #28C76F 100%)' },
                { value: 'blue', label: msg('blue'), bg: 'linear-gradient( 135deg, #ABDCFF 10%, #0396FF 100%)' },
                { value: 'purple', label: msg('purple'), bg: 'linear-gradient( 135deg, #CE9FFC 10%, #7367F0 100%)' },
                { value: 'pink', label: msg('pink'), bg: 'linear-gradient( 135deg, #FFD3A5 10%, #FD6585 100%)' },
            ]
        },
        emoji: {
            title: msg('emoji'),
            options: [
                { value: 'pizza', label: msg('pizza') },
                { value: 'heart', label: msg('heart') },
                { value: 'goofy', label: msg('goofy') },
                { value: 'smile', label: msg('smile') },
                { value: 'star', label: msg('star') },
                { value: 'confetti', label: msg('confetti') },
                { value: 'love', label: msg('love') },
                { value: 'rainbow', label: msg('rainbow') },
            ]
        },
        qrCodeSize: { title: msg('qr_code_size') },

        iconStyle: {
            title: msg('icon_style'),
            options: [
                { value: 'solid', label: msg('solid'), imageData: getIcon('solid', options.value.iconColor, 20) },
                { value: 'outline', label: msg('outline'), imageData: getIcon('outline', options.value.iconColor, 20) },
            ]
        },
        iconColor: {
            title: msg('icon_color'),
            options: [
                { value: 'auto', label: msg('auto'), bg: 'linear-gradient(135deg, #444 0%, #444 50%, #FFF 50.1%, #FFF 100%)' },
                { value: 'light', label: msg('light'), bg: actionIconColors.light },
                { value: 'dark', label: msg('dark'), bg: actionIconColors.dark },
                { value: 'yellow', label: msg('yellow'), bg: actionIconColors.yellow },
                { value: 'blue', label: msg('blue'), bg: actionIconColors.blue },
                { value: 'custom', label: msg('custom'), bg: 'conic-gradient(from 180deg at 50% 50%, #ED5757 0deg, #FCFF52 114.37500357627869deg, #16C7FF 226.87499284744263deg, #ED5757 360deg)' },
            ]
        },
        iconCustomColor: { title: msg('icon_custom_color'), hidden: options.value.iconColor !== 'custom' },

        enableDownload: { title: msg('enable_download') },
        dlAsSvg: { title: msg('download_as_svg'), hidden: !options.value.enableDownload },
    }
})

const emojis: Record<UserOptions['emoji'], FunctionalComponent> = {
    pizza: Pizza,
    heart: Heart,
    goofy: Goofy,
    smile: Smile,
    star: Star,
    confetti: Confetti,
    love: Love,
    rainbow: Rainbow,
}

const iconColorHex = computed(() => {
    if (options.value.iconColor === 'custom') {
        // user custom color
        return options.value.iconCustomColor
    } else if (options.value.iconColor === 'auto') {
        // auto detect
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        return isDark ? actionIconColors.light : actionIconColors.dark
    } else {
        return actionIconColors[options.value.iconColor]
    }
})

watch(iconColorHex, (val) => {
    const canvases: NodeListOf<HTMLCanvasElement> = document.querySelectorAll('.canvas-icon')

    canvases.forEach((canvas: HTMLCanvasElement) => {
        const ctx = canvas.getContext('2d')
        const size = 60
        ctx?.putImageData(getIcon((canvas.dataset.value as UserOptions['iconStyle']), val, size), 15, 15)
    })
}, { immediate: true })

</script>

<template>
    <div class="container">
        <KrSection :title="msg('popup')">
            <KrToggleRow :title="items.displayAction.title" v-model="options.displayAction" />
            <KrToggleRow :title="items.displayInput.title" v-model="options.displayInput" />
            <KrToggleRow :title="items.simpleUi.title" v-model="options.simpleUi" />

            <template v-if="!options.simpleUi">
                <KrSelectGroup :title="items.popupStyle.title" v-model="options.popupStyle" :items="items.popupStyle.options" hide-separator>
                    <template #items="{item, selected, setSelected}">
                        <KrSelectItem :value="item.value" :selected="selected" @update:selected="setSelected($event)">
                            <div class="option-text" :class="{'option-text--selected': item.value === selected}">
                                {{ item.label }}
                            </div>
                        </KrSelectItem>
                    </template>
                </KrSelectGroup>

                <KrSelectGroup v-if="options.popupStyle === 'emoji'" v-model="options.emoji" :items="items.emoji.options">
                    <template #items="{item, selected, setSelected}: {item: {label: string,value: UserOptions['emoji'] }, selected: string, setSelected: (val:string)=>void}">
                        <KrSelectItem :value="item.value" :selected="selected" circle @update:selected="setSelected($event)">
                            <div class="option-emoji" :title="item.label">
                                <component :is="emojis[item.value]" />
                            </div>
                        </KrSelectItem>
                    </template>
                </KrSelectGroup>

                <KrSelectGroup v-else v-model="options.color" :items="items.color.options">
                    <template #items="{item, selected, setSelected}">
                        <KrSelectItem :value="item.value" :selected="selected" circle @update:selected="setSelected($event)">
                            <div class="option-color" :style="{background: item.bg}" :title="item.label"></div>
                        </KrSelectItem>
                    </template>
                </KrSelectGroup>

                <KrToggleRow :title="items.enableClickToChangeBg.title" v-model="options.enableClickToChangeBg" />
            </template>

            <KrSliderRow :title="items.qrCodeSize.title" v-model="options.qrCodeSize" :step="5" :min="100" :max="200" hide-separator />
        </KrSection>

        <KrSection :title="msg('icon')">

            <KrSelectGroup :title="items.iconStyle.title" v-model="options.iconStyle" :items="items.iconStyle.options">
                <template #items="{item, selected, setSelected}">
                    <KrSelectItem :value="item.value" :selected="selected" @update:selected="setSelected($event)">
                        <div class="option-icon" :title="item.label">
                            <canvas class="canvas-icon" :data-value="item.value" width="90" height="90" />
                        </div>
                    </KrSelectItem>
                </template>
            </KrSelectGroup>

            <KrSelectGroup :title="items.iconColor.title" v-model="options.iconColor" :items="items.iconColor.options" :hide-separator="items.iconCustomColor.hidden">
                <template #items="{item, selected, setSelected}">
                    <KrSelectItem :value="item.value" :selected="selected" circle @update:selected="setSelected($event)">
                        <div class="option-color" :style="{background: item.bg}" :title="item.label"></div>
                    </KrSelectItem>
                </template>
            </KrSelectGroup>

            <KrColorInputRow v-if="!items.iconCustomColor.hidden" :title="items.iconCustomColor.title" v-model="options.iconCustomColor" hide-separator />

        </KrSection>

        <KrSection :title="msg('download')">
            <KrToggleRow :title="items.enableDownload.title" v-model="options.enableDownload" :hide-separator="items.dlAsSvg.hidden" />
            <KrToggleRow v-if="!items.dlAsSvg.hidden" :title="items.dlAsSvg.title" v-model="options.dlAsSvg" hide-separator />
        </KrSection>
    </div>
</template>

<style lang="postcss" scoped>
.option-text {
    font-size: 14px;
    line-height: 2;
    padding: 0 var(--spacing-2);

    &--selected {
        color: var(--kr-theme);
    }
}
.option-color {
    width: 30px;
    height: 30px;
    border-radius: 50%;
}

.option-icon {
    width: 30px;
    height: 30px;
    display: flex;;
}

.canvas-icon {
    width: 30px;
    height: 30px;
}

.option-emoji {
    display: flex;
    font-size: 30px;
    
    svg {
        transform: scale(0.8);
        transform-origin: center;
    }
}

</style>