<template>
    <div class="menu-list">
        <!--//有下拉-->
        <div v-for="(item,index) in routes" v-if="!item.hidden" :class="{'menu-title':item.meta.leval == 1}" :key="index">
            <el-submenu  :index="item.name" v-if="item.children && item.children.length">
                <template slot="title">
                    <icon-svg v-if='item.funcIcon' :icon-class="item.funcIcon"></icon-svg>
                    <i class="menu-icon" v-else></i>
                    <span :class="{'menu-padding':item.meta.leval == 1}">{{item.meta.name}}</span>
                </template>
                <sidebar-item class='menu-child nest-menu' :routes='item.children'></sidebar-item>
            </el-submenu>
            <!--//第一层单独element-->
            <el-menu-item  :index="item.name" v-else @click="goUrl(item)" class="el-submenu">
                <icon-svg v-if='item.funcIcon' :icon-class="item.funcIcon"></icon-svg>
                <i class="menu-icon" v-else></i>
                <span :class="{'menu-padding':item.meta.leval == 1}" slot="title">{{item.meta.name}}</span>
            </el-menu-item>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'SidebarItem',
        props: {
            routes: {
                type: Array
            }
        },
        methods: {
            goUrl (item) {
                if (item.name) {
                    this.$router.push({
                        name: item.name
                    });
                }
            }
        }
    };
</script>

