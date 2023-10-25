<script lang="ts" setup>
import { computed } from 'vue'

export interface SelectItemProps {
    title?: string
    value?: any
    label?: string
    circle?: boolean
    selected?: any
}

const props = defineProps<SelectItemProps>()

const emit = defineEmits<{
    (e: 'update:selected', value?: typeof props.selected): void
}>()

const modelValue = computed({
    get() {
        return props.selected
    },
    set(val) {
        emit('update:selected', val)
    }
})

</script>

<template>
    <label class="select-item" :class="{'select-item--selected': selected === value, 'select-item--circle': circle}" :title="title">
        <input class="select-item__input" type="radio" :value="value" v-model="modelValue" />
        <span class="select-item__content"><slot /></span>
        <span class="select-item__label" v-if="label">{{label}}</span>
    </label>
</template>

<style lang="postcss" scoped>
.select-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--kr-text-primary-color);

    &__content {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        border: 1px solid var(--kr-separator);
        transition: box-shadow 0.1s ease-out, background 0.1s ease-out;
        will-change: box-shadow, background;
    }

    &__label {
        display: flex;
        font-size: 12px;
        padding-top: 4px;
        text-align: center;
    }

    &__input {
        display: none;
    }

    &--circle {
        .select-item__content {
            border-radius: 50%;
        }
    }

    &--selected {
        .select-item__content {
            box-shadow: 0 0 0 2px var(--kr-theme);
            background: var(--kr-ripple);
        }

        .select-item__label {
            font-weight: 500;
            color: var(--kr-theme);
        }
    }
}
</style>