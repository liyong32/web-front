// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import vueBeauty from 'vue-beauty/vb';
import App from './App';
import router from './router';
import pub from './assets/js/pub';
import vInputModal from '../components/vInputModal';
import Mixins from './mixins';

Vue.config.productionTip = false;
window.Vue = Vue;
window.Bus = new Vue();
Vue.use(vueBeauty);
Vue.use(pub);
Vue.use(vInputModal);
Vue.mixin(Mixins);

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App },
});
