<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
    items: { label: string, value: string }[],
    modelValue?: string,
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: typeof props.modelValue): void
}>()

const value = computed({
    get: () => props.modelValue ?? props.items[0].value,
    set: (value) => emit('update:modelValue', value),
})

function selectNext() {
    const currentIndex = props.items.findIndex(item => item.value === value.value)
    const nextIndex = currentIndex === props.items.length - 1 ? 0 : currentIndex + 1
    value.value = props.items[nextIndex].value
}
</script>

<template>
    <button class="switch-button" @click="selectNext">
        <TransitionGroup name="slide-in-out-up">
            <span class="switch-button__inner" v-for="item in items" :key="item.value" v-show="value === item.value">{{ item.label }}</span>
        </TransitionGroup>
    </button>
</template>

<style lang="postcss" scoped>
.switch-button {
    width: 62px;
    height: 24px;
    color: rgba(var(--on-surface-primary-rgb), .9);
    border: 1px solid rgba(var(--on-surface-primary-rgb), .9);
    text-transform: uppercase;
    font-size: 12px;
    font-weight: bold;
    background: transparent;
    transition: 0.15s ease-out;
    transition-property: color, background, outline-offset;
    outline: 1px solid rgba(var(--on-surface-primary-rgb), .9);
    border-radius: 999px;
    overflow: hidden;
    backdrop-filter: blur(10px);
    touch-action: manipulation;
    user-select: none;
    mix-blend-mode: hard-light;

    &:hover, &:focus-visible {
        background: rgba(var(--on-surface-primary-rgb), .9);
        color: var(--on-surface-primary-invert);
    }

    &:focus-visible {
        outline-width: 2px;
        outline-offset: 2px;
    }

    &__inner {
        display: block;
    }
}
</style>