<script lang="ts" setup>
import { provide } from 'vue'

const props = defineProps<{
    title?: string
    subtitle?: string
    items?: any[]
    hideSeparator?: boolean
    modelValue: any
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: any): void
}>()

function setSelected(val: any) {
    emit('update:modelValue', val)
}

provide('setSelected', setSelected)
</script>

<template>
    <div class="select-group" :class="{'select-group--with-separator': !hideSeparator}">

        <div class="select-group__header" v-if="title || subtitle">
            <div class="select-group__header__title" v-if="title">{{title}}</div>
            <div class="select-group__header__subtitle" v-if="subtitle">{{subtitle}}</div>
        </div>

        <div class="select-group__items">
            <template v-for="item in items" :key="item.value">
                <slot name="items" :item="item" :setSelected="setSelected" :selected="modelValue"></slot>
            </template>
        </div>
        
    </div>
</template>

<style lang="postcss" scoped>
.select-group {

    &--with-separator {
        border-bottom: 1px solid var(--kr-separator);
    }

    &__header {
        box-sizing: border-box;
        padding: 12px 20px 6px;
        display: flex;
        align-items: center;

        &__title {
            font-size: 14px;
            color: var(--kr-text-primary-color);
        }

        &__subtitle {
            font-size: 12px;
            color: var(--kr-text-secondary-color);
        }
    }

    &__items {
        padding: 6px 20px 12px;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: center;
        gap: 8px;
    }
}
</style>