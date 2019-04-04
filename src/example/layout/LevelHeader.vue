<template>
    <el-row class="container">
        <el-col :span="24" class="header">
            <el-col :span="10" class="logo">
            </el-col>
            <el-col :span="10" class="userinfo">
                <div class="userinfo-inner">
                    欢迎您 ! {{user.name}}
                </div>
                <yl-icon class-name="icon-tuichufffpx" @click.native="loginOut" class="icons"></yl-icon>
            </el-col>
        </el-col>
    </el-row>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex';
    import {Tools} from '@/index'; // 文件格式
    export default {
        data() {
            return {
                user: {
                    logo: '',
                    name: ''
                },
                company: '', // 公司名称
                sysName: '', // title
                sysUserName: '' // 客户名称
            };
        },
        watch:{
            userInfo: {
                deep: true,
                handler: function (val) {
                    this.setUser();
                }
            }
        },
        computed: {
            ...mapGetters([
                'userInfo',
                'routers'
            ])
        },
        methods: {
            ...mapActions({
                'userLoginout': 'logout'
            }),
            setUser(){
                let data = this.userInfo,
                    avator = data.avator || data.extInfo.avator || '';
                this.user = {
                    logo: avator ? Tools.formatFile(avator) : avator,   // 头像
                    name: data.userName
                };
            },
            loginOut() {
                this.$confirm('确认退出该系统吗？', '提示', {
                    cancelButtonText: '取消',
                    confirmButtonText: '确定',
                    type: 'warning'
                }).then(() => {
                    this.userLoginout().then(result => {
                        localStorage.removeItem('vuex');
                        // location.reload();// 为了重新实例化vue-router对象 避免bug
                        window.location.href = '/login';
                    });
                });
            }
        },
        mounted() {
            this.setUser();
        },
        components: {}

    };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "@/example/styles/_variable.scss";
    .header {
        line-height: $menuHeight;
        color: #fff;
        position: fixed;
        z-index: 333;
        background-color: cornflowerblue;
        .userinfo {
            text-align: right;
            padding-right: 20px;
            float: right;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            .el-badge__content.is-fixed {
                transform: translateY(-50%) translateX(100%) scale(0.8);
            }
            .icons {
                margin-left: 25px;
                cursor: pointer;
                width: 20px;
                height: 20px;
                display: flex;
            }
            .userinfo-inner {
                cursor: pointer;
                color: #fff;
            }
        }
        .logo {
            margin-left: 20px;
            background: url("./img/logo_1.png") no-repeat ;
            background-size: contain;
            margin-top: 8px;
            height: $menuHeight - 16px;
        }
    }
</style>
