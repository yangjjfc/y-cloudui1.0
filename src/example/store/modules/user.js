// / tian
import {
    CHANGEUSER,
    REFRESH,
    CLEARSTATE,
    HEIGHTRESIZE,
    GETROLES,
    DEFAULTOPEN,
    SETBUTTONS
} from '../mutation-types.js';
import { Http } from '@/index';

let URL = {
    MENULIST: 'brp.user.getCurrentUserMenuRights' // 获取员工的功能权限
};
const user = {
    state: {
        userInfo: {
            avator: '',
            userName: ''
        }, // 用户信息
        menuList: null, // 用户权限菜单
        routers: null, // 路由
        buttons: null // 按钮权限
    },
    mutations: {
        // 用户登入
        [CHANGEUSER] (state, data) {
            Object.assign(state.userInfo, data);
            sessionStorage.setItem('user', JSON.stringify(state.userInfo));
        },
        // 用户刷新,重新赋值
        [REFRESH] (state, data) {
            let user = JSON.parse(sessionStorage.getItem('user'));
            state.userInfo = user || null;
        },
        // 用户退出,清除数据
        [CLEARSTATE] (state, data) {
            for (let item in state) {
                delete state[item];
            }
            sessionStorage.clear();
        },
        // 获取窗口高度
        [HEIGHTRESIZE] (state, data) {
            state.windowHeight = data;
        },
        // 获取权限
        [GETROLES] (state, data) {
            state.menuList = data;
        },
        // 按钮权限
        [SETBUTTONS] (state, data) {
            state.buttons = data;
        },
        // 默认打开
        [DEFAULTOPEN] (state, data) {
            if (!state.defaultOpen) {
                state.defaultOpen = [];
                state.defaultOpen.push(data);
            } else if (state.defaultOpen.indexOf(data) === -1) {
                state.defaultOpen.push(data);
            }
        }
    },
    actions: {
        // 登录
        login (context, data) {
            return new Promise((resolve, reject) => {
                Http('login', data).then(
                    result => {
                        let userinfo = result || {};
                        if (userinfo.data) {
                            context.commit('CHANGEUSER', userinfo.data);
                            resolve(userinfo);
                        } else {
                            reject(userinfo);
                        }
                    },
                    err => {
                        reject(err);
                    }
                );
            });
        },
        // 退出
        async logout (context, data) {
            return new Promise((resolve, reject) => {
                Http('logout', data).then(
                    result => {
                        let data = result.data || {};
                        if (data) {
                            context.commit('CLEARSTATE');
                            resolve(true);
                        } else {
                            reject(false);
                        }
                    },
                    err => {
                        reject(err);
                    }
                );
            });
        },
        // 当前用户信息
        currentUser ({ commit, state }) {
            // console.log(Http);
            return new Promise((resolve, reject) => {
                state.userInfo && state.userInfo.enterpriseNo
                    ? resolve(state.userInfo) // 判断是否需要去请求
                    : Http('currentUser', {
                        token: state.userInfo ? state.userInfo.token : ''
                    }).then(
                        result => {
                        // 获取token 获取登录信息
                            let user = result.data || {};
                            commit('CHANGEUSER', user);
                            resolve(user);
                        },
                        err => {
                            reject(err);
                        }
                    );
            });
        },
        // 获取用户菜单
        getUserMenus ({ commit, state }) {
            return new Promise((resolve, reject) => {
                state.menuList ? resolve(state.menuList) : Http(URL.MENULIST).then(res => {
                    if (res.data) {
                        let munuList = res.data.menuTree;
                        commit('GETROLES', munuList);
                        commit('SETBUTTONS', res.data.permissionList);
                        resolve(state.menuList);
                    } else {
                        reject('获取用户菜单失败');
                    }
                }).catch(err => {
                    reject(err);
                });
            });
        }
    }
};

export default user;
