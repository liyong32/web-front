import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './actions';
import * as getters from './getters';
import menu from './menuStore';
import blackListStore from './blackListStore';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        userInfo: null,
        homeMenu: menu.homeMenu,
        fullMenu: menu.fullMenu,
        blackListStore: blackListStore.apis,
    },
    mutations,
    actions,
    getters,
    modules: {
    },
});

window.store = store;
export default store;
