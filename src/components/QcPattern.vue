<script lang="ts" setup>
import { computed, ref } from 'vue'
import Pizza from '~icons/fluent-emoji/pizza'
import Heart from '~icons/fluent-emoji/sparkling-heart'
import Goofy from '~icons/fluent-emoji/zany-face'
import Smile from '~icons/fluent-emoji/slightly-smiling-face'
import Star from '~icons/fluent-emoji/star'
import Confetti from '~icons/fluent-emoji/party-popper'
import Love from '~icons/fluent-emoji/love-you-gesture'
import Rainbow from '~icons/fluent-emoji/rainbow'

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


const icon = computed(() => {
    switch(props.emoji) {
        case 'heart': return Heart
        case 'goofy': return Goofy
        case 'smile': return Smile
        case 'star': return Star
        case 'confetti': return Confetti
        case 'love': return Love
        case 'rainbow': return Rainbow
        default: return Pizza
    }
})

const background = computed<string>(() => props.type === 'color' ? (bgColors[props.color] ?? bgColors.white) : bgColors.white )

const rotates = [-45, 45, 15, -15]

function getRandomItem(array: any[]) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

const rowCount = ref(4)
const colCount = ref(4)
</script>

<template>
    <div class="pattern">
        <div v-if="type === 'emoji'" class="pattern__emoji">
            <div v-for="row in rowCount" class="pattern__emoji__row" :style="{ '--col-count': colCount }">
                <component v-for="item in colCount" :is="icon" :style="{ transform: `rotate(${getRandomItem(rotates)}deg)`, transformOrigin: 'center' }" />
            </div>
        </div>
        <Transition name="slide-in-up">
            <div class="pattern__color" v-if="type !== 'emoji'" :style="{ background }"></div>
        </Transition>
    </div>
</template>

<style lang="postcss" scoped>
.pattern {
    --emoji-size: 60px;

    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: var(--surface);

    &__emoji {
        position: absolute;

        & > *:nth-child(2n) {
            transform: translateX(calc(var(--emoji-size) / 3));
        }

        & > *:nth-child(2n+1) {
            transform: translateX(calc(var(--emoji-size) / -3));
        }

        &__row {
            font-size: var(--emoji-size);
            display: grid;
            grid-template-columns: repeat(var(--col-count, 4), auto);
            gap: calc(var(--emoji-size) * 1.2);
            padding: calc(var(--emoji-size) * 0.6) 0;
        }
    }

    &__color {
        position: absolute;
        width: 100%;
        height: 100%;
    }
}
</style>