/**
 * 全局mixin
 */
import dateFormat from 'date-fns/format';
import {
    mapState,
} from 'vuex';

const TWEEN = require('@tweenjs/tween.js');
const humanizeDuration = require('humanize-duration');

export default {
    data() {
        return {
            textReg: /^[\u4e00-\u9fa5_a-zA-Z0-9]{2,16}$/,
            textMsgReg: /^[\u4e00-\u9fa5_a-zA-Z0-9，。！？,.!?]{1,60}$/,
            msgReg: /^[\u4e00-\u9fa5_a-zA-Z0-9，。！？,.!?]{1,100}$/,
            textFilenameReg: /^[\u4e00-\u9fa5_a-zA-Z0-9-]{0,15}$/,
            noReg: /\d{2,16}$/,
            phoneReg: /^1[3456789]\d{9}$/,
            websiteTitle: 'Management System',
            cookieExpires: 1,
        };
    },
    computed: {
        ...mapState({
            userInfo: state => state.userInfo,
        }),
    },
    filters: {
        dateFormatter(timeStr, format) {
            if (!timeStr) {
                return '--';
            }
            if (typeof timeStr === 'string') {
                timeStr = timeStr.replace(/-/g, '/');
            }
            const date = new Date(timeStr - 0);

            format = format || 'MM/DD';
            return dateFormat(date, format);
        },
    },
    methods: {
        dateFormater: dateFormat,
        getContain() {
            return document.getElementsByClassName('iframeContain')[0];
        },
        dateLimit(dateRange, limit) {
            const left = new Date(dateRange[1]).getTime() - new Date(dateRange[0]).getTime();
            if (left / (24 * 60 * 60 * 1000) >= (limit || 31)) {
                this.$message.error(`日期不能超过${limit || 31}天`, 3);
                return false;
            }
            return true;
        },
        // 根据文字在html中渲染结果获取宽度
        getTextWidth(arr) {
            if (arr.length === 0) {
                return '';
            }
            try {
                const newArr = [...arr, ...[]];
                let ele = document.getElementById('sbWidth');
                if (!ele) {
                    const span = document.createElement('span');
                    span.id = 'sbWidth';
                    span.style.cssText = 'opacity: 0; position: fixed; z-index: -1000; pointer-events: none; left: 0; top: 0;';
                    document.body.appendChild(span);
                    ele = span;
                }
                const sortRes = newArr.sort((a, b) => (b.orgname.length - a.orgname.length));
                const text = sortRes[0].orgname;
                ele.innerText = text;
                const width = ele.offsetWidth < 150 ? '' : ele.offsetWidth + 30;
                return `${width > 400 ? 400 : width}px`;
            } catch (e) {
                return '';
            }
        },
        /**
         * 用户名验证
         * @param {*} rule // 规则
         * @param {*} value  // 值
         * @param {*} callback // 回调
         */
        validateUserName(rule, value, callback) {
            const reg = this.textReg;
            if (!reg.test(value)) {
                callback(new Error('用户名长度2-16位，不含空格等特殊字符'));
            } else {
                callback();
            }
        },
        /**
         * 数字验证
         * @param {*} rule // 规则
         * @param {*} value  // 值
         * @param {*} callback // 回调
         */
        validateNo(rule, value, callback) {
            const reg = this.noReg;
            if (!reg.test(value)) {
                callback(new Error('请输入2-16位数字'));
            } else {
                callback();
            }
        },
        /**
         * 文件名验证
         * @param {*} rule // 规则
         * @param {*} value  // 值
         * @param {*} callback // 回调
         */
        validateFilename(rule, value, callback) {
            const reg = this.textFilenameReg;
            if (value.length > 15) {
                callback(new Error('必须小于15个字符'));
            } else if (!reg.test(value)) {
                callback(new Error('不能包含空格等特殊字符，可包含下划线和中划线'));
            } else {
                callback();
            }
        },
        /**
         * 文字描述验证
         * @param {*} rule // 规则
         * @param {*} value  // 值
         * @param {*} callback // 回调
         */
        validateDesc(rule, value, callback) {
            const reg = this.textMsgReg;
            if (!reg.test(value)) {
                callback(new Error('内容小于60个字符且不能为空，不包含特殊字符'));
            } else {
                callback();
            }
        },
        /**
         * 手机号验证
         * @param {*} rule // 规则
         * @param {*} value  // 值
         * @param {*} callback // 回调
         */
        validatePhone(rule, value, callback) {
            const reg = this.phoneReg;
            if (!reg.test(value)) {
                callback(new Error('手机号码格式有误'));
            } else {
                callback();
            }
        },
        // 更新数字跳动动画
        updateNoAnimation(obj, key, newNo) {
            if (parseInt(newNo, 10) !== (newNo - 0)) {
                obj[key] = newNo.toFixed(2);
                return;
            }
            newNo = parseInt(newNo, 10);
            const initAnimate = function () {
                if (TWEEN.update()) {
                    requestAnimationFrame(initAnimate);
                }
            };
            setTimeout(() => {
                const to = {};
                to[key] = newNo;
                const tween = new TWEEN.Tween(obj);
                // const t = parseInt((newNo - obj[key]) / 0.13, 10);
                const t = 1000;
                tween.to(to, t);
                tween.start();
                tween.onUpdate(function () {
                    obj[key] = this._object[key].toFixed(0);
                });
                tween.onComplete(() => {
                });
                initAnimate();
            }, 600);
        },
        // 获取上周开始日期，结束日期
        getLastWeek() {
            const nowDate = new Date().getTime(); // 今天
            let weekday = new Date().getDay(); // 今天周几
            weekday = weekday === 0 ? 7 : weekday;
            const oneDay = 24 * 3600 * 1000;
            const firstDay = nowDate - (weekday + 7 - 1) * oneDay;
            const lastDay = nowDate - weekday * oneDay;
            return {
                firstDay,
                lastDay,
            };
        },
        // 获取本周开始日期
        getThisWeek(time) {
            let date = new Date(); // 今天
            if (time) {
                date = new Date(time); // 今天
            }
            const nowDate = date.getTime(); // 今天
            let weekday = date.getDay(); // 今天周几
            weekday = weekday === 0 ? 7 : weekday;
            const oneDay = 24 * 3600 * 1000;
            const firstDay = nowDate - (weekday - 1) * oneDay;
            return firstDay;
        },
        // 近一周
        nearWeek() {
            let end = new Date();
            end = end.setTime(end.getTime());
            end = new Date(end);
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
            return {
                start,
                end,
            };
        },
        // 上一周
        lastWeek() {
            const end = new Date(this.getLastWeek().lastDay);
            const start = new Date(this.getLastWeek().firstDay);
            return {
                start,
                end,
            };
        },
        // 近一月
        nearMonth() {
            let end = new Date();
            end = end.setTime(end.getTime());
            end = new Date(end);
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
            return {
                start,
                end,
            };
        },
        // 上一月
        lastMonth() {
            let m = new Date().getMonth();
            m = m < 10 ? `0${m}` : m;
            let y = new Date().getFullYear();
            y = m === 0 ? y - 1 : y;
            const lastDay = new Date(y, m, 0).getDate();
            const start = this.dateFormater(new Date(`${y}-${m}-1`), 'YYYY-MM-DD');
            const end = this.dateFormater(new Date(new Date(start).getTime() + 3600 * 1000 * 24 * (lastDay - 1)), 'YYYY-MM-DD');
            return {
                start,
                end,
            };
        },
    },
};
