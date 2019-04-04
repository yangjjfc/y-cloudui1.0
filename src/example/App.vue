<template>
    <div id="app">
        <transition name="router-fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>
<script>

    export default {
        name: 'app',
        data() {
            return {
            }
        },
        methods: {

        },
        created() {
        }
    }
</script>

<style lang="scss">
    @import "./styles/index.scss";
</style>
