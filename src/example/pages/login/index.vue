<template>
    <div class="loginpage">
        <div class="header-mumber">
            <h1 class="login-logo" @click="goUrl('staticIndex')"><img src="./img/DD-CHAIN-logo.png" alt="logo"/></h1>
        </div>
        <div class="login">
            <div class="w1200">
                <div class="login-form">
                    <div class="loginForm">
                        <div class="showinfo">
                            <h4 >会员登录</h4>
                            <strong class="bz" v-if="!errorMsg.length"> <yl-icon iconClass="icon-dingdanzhuangtai-3"></yl-icon> 请在安全网络下登录账户</strong>
                            <div class="errorMsg" v-if="errorMsg.length">
                                <yl-icon iconClass="icon-tongyong-" class="svg"></yl-icon>
                                <p class="error" v-text="errorMsg"></p>
                            </div>
                        </div>
                        <el-form ref="form" :model="form">
                            <el-form-item>
                                <el-input placeholder="请输入用户名/手机号" v-model.trim="form.username" @keyup.enter.native="login">
                                    <yl-icon icon-class="icon-denglu-1" slot="prefix" class="icons"></yl-icon>
                                </el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-input placeholder="请输入密码" v-model.trim="form.password" type="password" @keyup.enter.native="login">
                                    <yl-icon icon-class="icon-denglu-" slot="prefix" class="icons"></yl-icon>
                                </el-input>
                            </el-form-item>
                            <el-form-item class="custom-mgb">
                                <el-col :span="11">
                                    <el-input placeholder="验证码" v-model.trim="form.verifycode" :maxlength="4" @keyup.enter.native="login"></el-input>
                                </el-col>
                                <el-col :span="13" class="verifyimg">
                                    <img id="imageCode" class="textbox" :src="verifyImg" width="80" height="40" alt="验证码" title="点击刷新"/>
                                    <a @click="refreshCode()" href="javascript:void(0)">换一张？</a>
                                </el-col>
                            </el-form-item>
                            <el-form-item class="custom-mgb">
                                <el-col :span="12">
                                    <el-checkbox @change="rememberUser">记住用户名</el-checkbox>
                                </el-col>
                                <el-col :span="12" class="fg-passwd">
                                    <!--<el-button type="text" @click="goUrl('register')">立即注册</el-button>-->
                                    <el-button type="text" @click="showForget = true">忘记密码</el-button>
                                </el-col>
                            </el-form-item>
                            <el-form-item class="submit">
                                <el-button type="warning" @click="login">立即登录</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>


    </div>
</template>
<script type="text/javascript">

import { Tools } from '@/index';
import { mapGetters, mapActions } from 'vuex';


const URL = {
    VERIFY_CODE: '/verifyCode'
};
export default {
    data () {
        return {
            defaultPath: '/app/hello',
            isusedNames: [ // 本地显示可用账号
                {
                    username: 'gong001',
                    password: '123456'
                }, {
                    username: 'hzgjmygs',
                    password: '123456'
                }
            ],
            evs: process.env.NODE_ENV, // 环境
            showUpdatebrowser: false,
            showForget: false,
            verifyImg: '',
            errorMsg: '',
            form: {
                username: 'admin',
                password: '123456',
                verifycode: '1111'
            }
        };
    },
    computed: {
        ...mapGetters(['userInfo', 'routers'])
    },
    methods: {
        ...mapActions({
            'userLogin': 'login',
            'currentUser': 'currentUser',
            'getroles': 'getroles'
        }),
        // 检测浏览器的版本
        checkBrowserVersion () {
            let ua = navigator.userAgent;
            let isIE = ua.indexOf('compatible') > -1 && ua.indexOf('MSIE') > -1; // 判断是否ie浏览器 除(ie11和edge)
            if (isIE) {
                let reIE = new RegExp('MSIE (\\d+\\.\\d+);');
                reIE.test(ua);
                let fIEVersion = parseFloat(RegExp.$1);
                    
                console.log(fIEVersion);
                if (fIEVersion < 10) {
                    this.showUpdatebrowser = true;
                }
            }
        },
        // 记住用户名
        rememberUser (val) {
            if (val && this.form.username) {
                localStorage.setItem('name', this.form.username);
            }
        },
        // 获取用户名
        getUser () {
            let name = localStorage.getItem('name');
            name && (this.form.username = name.trim());
        },
        // 刷新验证码
        getRandomImg () {
            this.form.verifycode = '';
            this.verifyImg = '/gateway' + URL.VERIFY_CODE + '?t=' + Math.round(Math.random() * 1000000);
        },
        // 获取用户信息
        refreshCode () {
            if (this.userInfo && this.userInfo.token) {
                this.getRandomImg(); // 通过验证码获取token
            } else {
                this.currentUser().then(() => {
                    this.getRandomImg();
                }, () => {
                    this.getRandomImg();
                });
            }
        },
        // 登录
        login () {
            let xflag = false;
            let clientId = this.userInfo ? this.userInfo.clientId : null;
            let token = this.userInfo ? this.userInfo.token : null;
            let password = this.form.password;
            if (!/^[a-zA-Z0-9_-]{3,20}$/.test(this.form.username)) {
                xflag = true;
                this.errorMsg = this.form.username === '' ? '请输入用户名' : '用户名格式不正确';
                return;
            }

            if (this.form.password === '') {
                xflag = true;
                this.errorMsg = '请输入密码';
                return;
            }
            if (!/^[a-zA-Z0-9]{4}$/.test(this.form.verifycode)) {
                xflag = true;
                this.errorMsg = this.form.verifycode === '' ? '请输入验证码' : '验证码格式不正确';
                return;
            }
            let param = Object.assign({ platform: 'OMS' }, this.form, {
                password: Tools.encryption(password, clientId, token)
            });
            if (!xflag) {
                this.errorMsg = '';
                this.userLogin(param).then(msg => {
                    this.$router.push(this.defaultPath);
                }, err => {
                    console.log(err);
                    // 记录错误信息
                    this.refreshCode();
                });
            }
        },
        goUrl (name) {
            this.$router.push({
                name
            });
        }
    },
    mounted () {
        this.checkBrowserVersion();
        this.getUser();
        this.refreshCode();
    },
    components: {
    }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .w1200 {
        width: 1200px;
        margin: 0 auto;
    }
    .loginpage {
        background: url(img/bg.jpg) no-repeat center top;
        background-size: 100% 100%;
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top:0;
        .login-form {
            width: 366px;
            height: 370px;
            position: absolute;
            top: 50%;
            right: 100px;
            background: #fff;
            border: 1px #e7f0f4 solid;
            margin-top: -185px;
            .loginForm {
                padding: 25px;
                .showinfo {
                    height: 60px;
                    overflow: hidden;
                    h4 {
                        color: #44667f;
                        font-size: 15px;
                        margin-bottom: 5px;
                    }
                    .bz{
                        display: block;
                        height: 26px;
                        padding-left: 10px;
                        background: #fefcee;
                        border: 1px solid #f3d995;
                        line-height: 26px;
                        color: #df9c1f;
                    }
                    .errorMsg {
                        background-color: #fef2f2;
                        color: #6C6C6C;
                        line-height: 16px;
                        padding: 6px 10px;
                        border: #ffb4a8 1px solid;
                        clear: both;
                        overflow: hidden;
                        .svg {
                            color: #f40;
                            padding-right: 10px;
                            float: left;
                            width: 16px;
                            height: 16px;
                        }
                        .error {
                            float: left;
                            white-space: normal;
                            word-wrap: break-word;
                            word-break: break-all;
                            width: 250px;
                        }
                    }
                }
                .icons {
                    width: 15px;
                    height: 15px;
                    padding-left: 2px;
                }

                .el-form-item {
                    margin-bottom: 15px;
                }
                .custom-mgb {
                    margin-bottom: 12px;
                }
                .verifyimg {
                    float: right;
                    display: flex;
                    align-items: center;
                    padding-left: 10px;
                    img {
                        margin-right: 8px;
                    }
                }
                .fg-passwd {
                    display: flex;
                    justify-content: flex-end;
                    padding-right: 3px;
                }
                .submit {
                    button {
                        width: 100%;
                    }
                }
            }
        }
        .header-mumber {
            position: absolute;
            left: 50px;
            top: 50px;
            .nav {
                float: right;
                overflow: hidden;
                zoom: 1;
                padding-top: 20px;
                li {
                    float: left;
                    margin-left: 36px;
                    font-size: 16px;
                }
            }
            .login-logo {
                float: left;
                img {
                    // height: 43px;
                    width: auto;
                }
            }
        }
    }
    .login-footer{
        text-align: center;
        padding: 20px;
        font-size: 14px;
    }
</style>
