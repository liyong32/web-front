import Vue from 'vue';
import Router from 'vue-router';
import Cookies from 'js-cookie';
import routes from './routes';

Vue.use(Router);
window.router = new Router({
    routes,
});

window.router.beforeEach(async (to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title;
    }
    if (to.path === '/login') {
        next();
        return;
    }
    if (!Cookies.get('token')) {
        window.Vue.$pub.toLogin();
        return;
    }
    window.Bus.$emit('page-entry', true);
    window.store.dispatch('getUser').then(() => {
        next();
    });
});

window.router.afterEach((to) => {
    window.Bus.$emit('page-entry', false);
    window.Vue.nextTick(() => {
        window.Bus.$emit('router-change'); // 通知主框架切换菜单栏选中状态
    });
    if (to.path === '/login') {
        return;
    };
});

export default window.router;
