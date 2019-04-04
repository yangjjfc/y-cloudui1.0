<template>
    <div class="app-wrapper" >
        <level-header></level-header>
        <sidebar class="sidebar-container"></sidebar>
        <div class="main-container" ref="mainContainer">
            <transition name="fade-transform" mode="out-in">
                <router-view ></router-view>
            </transition>
        </div>
    </div>
</template>

<script>
    import {LevelHeader, Sidebar} from './index';
    export default {
        name: 'layout',
        data () {
            return {
                pageTips: '',
                isPageTips: false
            };
        },
        components: {
            LevelHeader,
            Sidebar,
        },
        methods: {

        },
        watch: {

        },
        computed: {

        },
        mounted () {

        }
    };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "@/example/styles/_variable.scss";
    .app-wrapper {
        position: relative;
        height: 100%;
        width: 100%;

        .sidebar-container {
            //transition: all 0.28s ease-in;
            width: $menuWidth;
            position: fixed;
            top: $menuHeight;
            bottom: 0;
            left: 0;
            z-index: 1001;
            overflow-y: auto;
            overflow-x: hidden;
            &::-webkit-scrollbar {
                display: none
            }
        }
        .main-nav {
            min-height: 50px;
            margin-bottom: 10px;
            .main-tips {
                padding: 0 10px;
                position: relative;
                top: 0px;
            }
        }
        .main-container {
            transition: all 0.28s ease;
            margin-left: $menuWidth;
            padding: 90px 10px 10px 10px;
            overflow-y: auto;
        }
    }
</style>
