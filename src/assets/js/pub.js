import axios from 'axios';
import Cookies from 'js-cookie';
import qs from 'qs';
import store from '@/store';

const blackApiList = store.state.blackListStore;
window.axios = axios;

axios.defaults.timeout = 60000;

export default {
    install(Vue) {
        // pub共用模块
        Vue.$pub = Vue.prototype.$pub = {
            env: location.hostname.split('.')[0],
            toLogin() {
                const logouturl = Cookies.get('logouturl');
                if (logouturl) {
                    location.href = logouturl;
                } else {
                    window.router.push('/login');
                }
            },
            logout() {
                Cookies.remove('token');
                Cookies.remove('userInfo');
                this.toLogin();
            },
        };

        axios.defaults.transformRequest = [data => qs.stringify(data)];
        axios.interceptors.request.use((config) => {
            const token = store.state.userInfo ? store.state.userInfo.token : '';
            // console.log(config.url);
            const blackKeys = Object.keys(blackApiList);
            let isBlack = false;
            for (let i = 0; i < blackKeys.length; i++) {
                if (config.url.match(blackKeys[i])) {
                    isBlack = true;
                    break;
                }
            }
            // console.log(isBlack);
            if (token && !isBlack) { // 不在黑名单中的接口需要添加token
                // console.log('添加token');
                // 请结合具体业务变更
                if (config.method === 'get') {
                    if (config.isFms) {
                        config.params = Object.assign({ token }, config.params);
                    } else {
                        config.params = Object.assign({ token }, config.params);
                    }
                } else {
                    config.data = Object.assign({ token }, config.data);
                }
            } else {
                config.data = Object.assign({ usertoken: token }, config.data);
            }
            return config;
        }, error => Promise.reject(error));
        axios.interceptors.response.use((response) => {
            const code = response.data.code * 1;
            if (code === 0) {
                return response.data.data;
            }
            const message = response.data.message || response.data.msg;
            switch (code) {
                case 401:
                    Vue.$pub.logout();
                    break;
                default:
            }
            // 统一提示接口业务错误
            if (message) Vue.$message.error(message, 4);
            const err = new Error(message);
            err.code = code;
            window.Bus.$emit('service-error');
            return Promise.reject(err);
        }, (error) => {
            let message = error.message || error.msg;
            if (message === 'timeout of 30000ms exceeded') {
                message = '请求超时，请稍后重试';
            }
            if (error.response) {
                const msg = error.response.data.message || error.response.data.msg;
                if (msg) {
                    message = msg;
                }
                const status = error.response.status;

                switch (status) {
                    // 未登录
                    case 401:
                        Vue.$pub.logout();
                        break;
                    default:
                }
            }
            // 统一提示接口业务错误
            if (message) Vue.$message.error(message, 4);
            window.Bus.$emit('service-error');
            return Promise.reject(error);
        });
    },
};
