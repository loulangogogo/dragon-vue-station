<template>
    <i class="d-icon">
        <slot></slot>
    </i>
</template>

<script lang="ts" setup>
</script>

<style  lang="scss">
.d-icon{
    --color: inherit;
    display: inline-flex;
    align-items: center;
    height: 1em;
    justify-content: center;
    line-height: 1em;
    position: relative;
    width: 1em;
    fill: currentColor;
    // color: var(--color);
}

.d-icon > svg {
    height: 1em;
    width: 1em;
}
</style>