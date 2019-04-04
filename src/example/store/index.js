import Vue from 'vue';
import Vuex from 'vuex';
// import app from './modules/app'
import user from './modules/user.js';
import permission from './modules/permission.js';
import app from './modules/app.js';
import getters from './getters.js';

Vue.use(Vuex);
const store = new Vuex.Store({
    modules: {
        user,
        permission,
        app
    },
    getters
});

export default store;
