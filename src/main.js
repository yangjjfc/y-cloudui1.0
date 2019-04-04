import Vue from 'vue';
import ElementUi from 'element-ui';
import YcloudUi from './index';
import router from './example/router/r-config.js';
import 'element-ui/lib/theme-chalk/index.css';
import  markdown from '@/example/components/markdown';
import App from './example/App.vue';
import store from './example/store/index.js';
import Boxer from '@/directive/boxer/index.js'; // boxer
Vue.component('markdown',markdown);
Vue.config.productionTip = false;
Vue.use(ElementUi);
Vue.use(YcloudUi);
Vue.use(Boxer);
new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app');
