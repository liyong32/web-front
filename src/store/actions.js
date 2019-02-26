import {
    account,
} from '@/services/api';

import Cookies from 'js-cookie';

export default {
    async getUser(ctx) {
        const token = Cookies.get('token');
        const data = await account.userInfo({ token });
        ctx.commit('updateUserInfo', data);
        return data;
    },
};
