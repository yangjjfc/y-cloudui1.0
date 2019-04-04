/**
 * router配置文件
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import RouterMap from './router.js';
import store from '@/example/store/index';
/**
 * router
 */
Vue.use(VueRouter);
const router = new VueRouter({
    routes: RouterMap.map,
    mode: 'history',
    strict: process.env.NODE_ENV !== 'production',
    scrollBehavior (to, from, savedPosition) {
        return { x: 0, y: 0 };
    }
});
// register global progress.
router.beforeEach((to, from, next) => {
    if (['/login', '/register'].includes(to.path) || /^\/static/g.test(to.path)) {
        next();
    } else {
        if (!store.getters.menuList) {
            // 判断当前用户是否登陆
            store.dispatch('currentUser').then(() => {
                // 没有登陆 跳到登陆页 what
                let user = store.getters.userInfo;
                if (!user || !user.enterpriseNo) {
                    next('/login');
                    return;
                }
                next();
            });
        } else if (to.matched.length) {
            next();
        } else {
            next('/app/hello');
        }
    }
});
export default router;
