<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    title?: string,
    subtitle?: string,
    modelValue?: string,
    hideSeparator?: boolean,
}>(), {
    modelValue: '#000000',
    hideSeparator: false,
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: typeof props.modelValue): void
}>()

const value = computed({
    get() { return props.modelValue },
    set(value) { emit('update:modelValue', value) },
})
</script>

<template>
    <div class="color-input" :class="{'color-input--with-separator': !hideSeparator}">
        <div class="color-input__label" v-if="title || subtitle">
            <div class="color-input__title" v-if="title">{{title}}</div>
            <div class="color-input__subtitle" v-if="subtitle">{{subtitle}}</div>
        </div>
        <label class="color-input__control">
            <div class="color-input__value">{{ value }}</div>
            <input
                class="color-input__native"
                type="color" 
                v-model.number="value" 
            />
        </label>
    </div>
</template>

<style lang="postcss" scoped>
.color-input {
    box-sizing: border-box;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    touch-action: none;

    &--with-separator {
        border-bottom: 1px solid var(--kr-separator);
    }

    &__label {
        flex: 1;
        cursor: default;
    }

    &__title {
        font-size: 14px;
        color: var(--kr-text-primary-color);
    }

    &__subtitle {
        font-size: 12px;
        color: var(--kr-text-secondary-color);
    }

    &__control {
        border-radius: 2px;
        font-size: 12px;
        color: var(--kr-text-secondary-color);
        display: flex;
        align-items: center;
        gap: var(--spacing-1);
        padding: var(--spacing-1);
        cursor: pointer;
        
        &:hover, &:focus-visible {
            outline: 1px solid var(--kr-separator);
        }
    }

    &__native {
        padding: 0;
        border: 0;
        height: 18px;
        width: 18px;

        &::-webkit-color-swatch-wrapper {
            padding: 0;
        }

        &::-webkit-color-swatch {
            border: 0;
            border-radius: 2px;
        }
    }
}
</style>