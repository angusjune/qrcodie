<script lang="ts" setup>
import { ref, VNodeRef } from 'vue'

const props = withDefaults(defineProps<{
    svg?: string,
    size?: number,
    simpleUi?: boolean,
}>(), {
    size: 200,
    simpleUi: false,
})

const elRef = ref<VNodeRef | null>(null)

const rotateX = ref(0)
const rotateY = ref(0)

const hover = ref(false)

function mouseMove(e: MouseEvent) {
    const { top, left, width, height } = document.querySelector('.code-card')!.getBoundingClientRect()
    const x = e.clientX - left;
    const y = e.clientY - top;

    const xRatio = x / width;
    const yRatio = y / height;
    rotateX.value = yRatio * -10 + 5;
    rotateY.value = xRatio * 10 - 5;
}

function mouseLeave() {
    hover.value = false;
    rotateX.value = 0;
    rotateY.value = 0;
}
</script>

<template>
    <div class="wrap">
        <div 
            class="code-card" 
            :class="{'code-card--simple-ui': simpleUi, 'code-card--hover': hover}" 
            role="presentation" 
            ref="elRef" 
            :style="{ transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`}"
            @mouseenter="hover = true"
            @mousemove="mouseMove" 
            @mouseleave="mouseLeave"
        >
            <template v-if="!svg">Nothing</template>
            <div v-else class="code-card__content" v-html="svg" :style="{width: size + 'px'}"></div>
    </div>
</div>
</template>

<style lang="postcss" scoped>
.wrap {
    perspective: 500px;
}

.code-card {
    display: grid;
    place-items: center;
    background: var(--surface);
    border-radius: 16px;
    aspect-ratio: 1;
    box-shadow: var(--code-wrap-shadow, 0 1px 2px rgba(0, 0, 0, 0.02), 0 2px 7px rgba(0, 0, 0, 0.04), 0 5px 17px rgba(0, 0, 0, 0.05), 0 18px 54px rgba(0, 0, 0, 0.07));
    transition: transform 0.5s ease-out;

    &--hover {
        transition-duration: 0.1s;
    }

    &--simple-ui {
        --code-wrap-shadow: none;
        transform: none !important;
    }

    &__content {
        width: 200px;
        aspect-ratio: 1;
    }
}
</style>