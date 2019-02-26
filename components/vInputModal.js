/*
 * @desc: 全局控制导出自定义后缀控件
 */

export default {
    install(Vue) {
        Vue.$comfirmInput = (params) => {
            window.Bus.$emit('active-input-comfirm', params);
            window.Bus.$off('input-comfirm-done').$on('input-comfirm-done', (name) => {
                params.onOk(name);
            });
        };
    },
};
