<script setup lang="ts">
import { ref, computed, VNodeRef } from 'vue'
import Paste from '~icons/material-symbols/content-paste-rounded'
import Reset from '~icons/material-symbols/redo-rounded'
import { msg } from '@/utils/i18n'

const props = withDefaults(defineProps<{
    modelValue?: string
    hideClear?: boolean
    focus?: boolean
}>(), {
    modelValue: '',
    hideClear: true,
    focus: false,
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: typeof props.modelValue): void,
    (e: 'update:focus', value: typeof props.focus): void,
}>()

const value = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})

const _focus = computed({
    get() {
        return props.focus
    },
    set(value) {
        emit('update:focus', value)
    }
})

function clear() {
    value.value = ''
    inputRef.value.focus()
}

const inputRef = ref<VNodeRef | null>(null)

function paste() {
    inputRef.value.focus()
    inputRef.value.select()
    document.execCommand('paste')
}
</script>

<template>
    <div class="textfield">
        <input class="textfield__input" type="text" v-model="value" ref="inputRef" @focus="_focus = true" @blur="_focus = false" />
        <div class="textfield__actions">
            <Transition>
                <button class="textfield__button" @click="clear" v-if="!hideClear" :aria-label="msg('reset')" :title="msg('reset')"><Reset /></button>
            </Transition>
            <button class="textfield__button" @click="paste" :aria-label="msg('paste')" :title="msg('paste')"><Paste /></button>
        </div>
    </div>
</template>

<style lang="postcss" scoped>
.textfield {
    height: 38px;
    display: flex;
    border-radius: 8px;
    background: var(--textfield-background);
    backdrop-filter: blur(10px);

    &__input {
        flex: 1;
        text-overflow: ellipsis;
        color: var(--on-surface-secondary);
        transition: color 0.12s ease-out;
        border: 0;
        background: none;
        font-size: 12px;
        padding: 0 var(--spacing-3);
        min-width: 0;

        &:focus, &:focus-visible {
            color: var(--on-surface-primary);
            outline: 0;
        }

        &:not(:focus) {
            cursor: pointer;
        }
    }

    &__actions {
        display: flex;
        margin: var(--spacing-1);
    }

    &__button {
        border: 0;
        padding: 0;
        background: none;
        border-radius: 6px;
        transition: 0.12s ease-out;
        transition-property: color, background;
        color: rgba(var(--on-surface-primary-rgb), .5);
        font-size: 20px;
        display: grid;
        place-items: center;
        aspect-ratio: 1;

        &:hover, &:focus-visible {
            background: rgba(var(--surface-invert-rgb), .08);
            color: rgba(var(--on-surface-primary-rgb), .9);
        }
    }
}
</style>