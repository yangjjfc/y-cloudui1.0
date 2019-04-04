<template>
    <el-menu mode="vertical" unique-opened  background-color="#545c64"
             text-color="#fff"
             active-text-color="#ffd04b">
        <div class='menu-title'>
            <sidebar-item :routes='menuList'></sidebar-item>
        </div>
    </el-menu>
</template>
<script>
    import RouterMap from '../router/router';
    import SidebarItem from './SidebarItem';
    export default {
        data () {
            return {
                menuList: []
            };
        },
        components: {SidebarItem},
        methods: {
            toggleSideBar () {
                this.$store.dispatch('ToggleSideBar');
            }
        },
        created () { 
            this.menuList = RouterMap.Menu;
        },
        computed: {

        }
    };
</script>

     
