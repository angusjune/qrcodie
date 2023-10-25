<script lang="ts" setup>

const props = withDefaults(defineProps<{
    type?: 'primary' | 'secondary' | 'link'
}>(), {
    type: 'primary',
})
</script>

<template>
    <button class="button" :class="'button--' + type">
        <slot />
    </button>
</template>

<style scoped lang="postcss">
.button {
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    padding: 6px 16px;
    margin: 0;

    &--primary {
        background: var(--kr-theme);
        color: var(--kr-text-primary-color);
        border: 0;

        &:hover {
            background: var(--kr-button-primary-hover-background);
        }

        &:active {
            opacity: var(--kr-theme);
            box-shadow: 0 1px 2px rgba(var(--kr-button-primary-active-box-shadow-rgb), 0.3), 0 3px 6px 2px rgba(var(--kr-button-primary-active-box-shadow-rgb), 0.15);
        }
    }

    &--secondary {
        background: transparent;
        color: var(--kr-theme);
        border: 1px solid var(--kr-button-secondary-border-color);

        &:hover {
            background: var(--kr-button-secondary-hover-background);
        }

        &:active {
            background: var(--kr-ripple);
        }
    }
}
</style>