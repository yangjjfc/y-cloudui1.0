<template>
    <svg class="icon" aria-hidden="true">
        <use :xlink:href="iconName"></use>
    </svg>
</template>

<script>
    export default {
        name: 'yl-icon',
        props: {
            className:{
                type: String,
                required: false
            }
        },
        computed: {
            iconName () {
                return `#${this.className}`;
            }
        }
    };
</script>
<style lang="scss">
    .icon {
        width: 1em;
        height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
    }
</style>