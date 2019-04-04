import { SET_ROUTERS } from '../mutation-types.js';
import routerMap from '@/example/router/router';

const permission = {
    state: {
        roles: null, // 用户权限
        routers: null // 路由
    },
    mutations: {
        // 设置路由
        [SET_ROUTERS] (state, routers) {
            // state.addRouters = routers;
            state.addRouters = routers;
            state.routers = routerMap.map.concat(routers); // 保存全部路由
            // sessionStorage.setItem('route', JSON.stringify(state.routers));
        }
    },
    actions: {
        // 生成路由生成路由
        async generateRouters ({ commit, state }, menus) {
            return new Promise(resolve => {
                let accessedRouters = filterAsyncRouter(menus);
                commit('SET_ROUTERS', accessedRouters);
                resolve(accessedRouters);
            });
        }
    }
};

export default permission;
