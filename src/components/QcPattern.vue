<script lang="ts" setup>
import { computed } from 'vue'
import SvgToMiniDataURI from 'mini-svg-data-uri'
import pizza from '@/icons/pizza.svg?raw'
import heart from '~icons/fluent-emoji/sparkling-heart?raw'
import goofy from '~icons/fluent-emoji/zany-face?raw'
import smile from '~icons/fluent-emoji/slightly-smiling-face?raw'
import star from '~icons/fluent-emoji/star?raw'
import confetti from '~icons/fluent-emoji/party-popper?raw'
import love from '~icons/fluent-emoji/love-you-gesture?raw'
import rainbow from '~icons/fluent-emoji/rainbow?raw'

const props = withDefaults(defineProps<{
    type?: UserOptions['popupStyle']
    color?: UserOptions['color']
    emoji?: UserOptions['emoji']
}>(), {
    type: 'color',
    color: 'white',
    emoji: 'pizza',
})

const bgColors: Record<UserOptions['color'], string> = {
    white: '#fff',
    dark: 'linear-gradient( 135deg, #2B373C 10%, #253136 100%)',
    orange: 'linear-gradient( 135deg, #FDD819 10%, #E80505 100%)',
    green: 'linear-gradient( 135deg, #81FBB8 10%, #28C76F 100%)',
    blue: 'linear-gradient( 135deg, #ABDCFF 10%, #0396FF 100%)',
    purple: 'linear-gradient( 135deg, #CE9FFC 10%, #7367F0 100%)',
    pink: 'linear-gradient( 135deg, #FFD3A5 10%, #FD6585 100%)',
}

const icons: Record<UserOptions['emoji'], string> = {
    pizza,
    heart,
    goofy,
    smile,
    star,
    confetti,
    love,
    rainbow,
}

const background = computed<string>(() => props.type === 'color' ? (bgColors[props.color] ?? bgColors.white) : bgColors.white )

const rotates = [-45, 45, 15, -15]

function getRandomItem(array: any[]) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

// pattern geometry: emojis repeat every 2.2x their size, with every
// other row shifted sideways by a third of the emoji size
const emojiSize = 60
const pitch = emojiSize * 2.2
const tileSize = pitch * 2
const rowShift = (emojiSize / 3) * 2
const rowTop = emojiSize * 0.6

// place one icon inside the tile, rotated around its own center
function placeIcon(rawSvg: string, x: number, y: number, rotate: number) {
    const openTagEnd = rawSvg.indexOf('>')
    const openTag = rawSvg.slice(0, openTagEnd)
        .replace(/\s(?:width|height|x|y)="[^"]*"/g, '')
        + ` x="${x}" y="${y}" width="${emojiSize}" height="${emojiSize}">`
    const center = `${x + emojiSize / 2} ${y + emojiSize / 2}`
    return `<g transform="rotate(${rotate} ${center})">${openTag}${rawSvg.slice(openTagEnd + 1)}</g>`
}

// the browser rasterizes this tile once and repeats it, instead of
// painting a grid of complex gradient/filter-heavy inline svgs
const emojiTile = computed<string>(() => {
    const rawSvg = icons[props.emoji] ?? icons.pizza
    const placements = [
        { x: 0, y: rowTop },
        { x: pitch, y: rowTop },
        { x: rowShift, y: rowTop + pitch },
        { x: rowShift + pitch, y: rowTop + pitch },
    ]
    const body = placements.map(({ x, y }) => placeIcon(rawSvg, x, y, getRandomItem(rotates))).join('')
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${tileSize}" height="${tileSize}" viewBox="0 0 ${tileSize} ${tileSize}">${body}</svg>`
})

const emojiStyle = computed(() => ({
    backgroundImage: `url("${SvgToMiniDataURI(emojiTile.value)}")`,
    backgroundSize: `${tileSize}px ${tileSize}px`,
}))
</script>

<template>
    <div class="pattern">
        <div v-if="type === 'emoji'" class="pattern__emoji" :style="emojiStyle"></div>
        <Transition name="slide-in-up">
            <div class="pattern__color" v-if="type !== 'emoji'" :style="{ background }"></div>
        </Transition>
    </div>
</template>

<style lang="postcss" scoped>
.pattern {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: var(--surface);

    &__emoji {
        position: absolute;
        inset: 0;
        background-repeat: repeat;
    }

    &__color {
        position: absolute;
        width: 100%;
        height: 100%;
    }
}
</style>
