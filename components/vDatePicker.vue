<!--
   desc: 日期选择控件
-->
<template>
    <v-form-item label="日期" :label-col="labelCol" :wrapper-col="wrapperCol">
        <DatePicker
            size="small"
            ref="datePicker"
            v-model="date"
            :type="type"
            align="right"
            unlink-panels
            range-separator="至"
            :clearable="false"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="el-date-picker-box"
            @focus="onFocus"
            :picker-options="pickerOptions">
        </DatePicker>
    </v-form-item>
</template>

<script type="text/ecmascript-6">
    import {
        DatePicker,
        Button,
    } from 'element-ui';

    const shortcuts = [
        {
            text: '昨天',
            key: 'day',
            rangeDayNo: 0,
            onClick(picker) {
                let end = new Date();
                end = end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                end = new Date(end);
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                picker.$emit('pick', [start, end]);
            },
        },
        {
            text: '最近3天',
            key: '3days',
            rangeDayNo: 2,
            onClick(picker) {
                let end = new Date();
                end = end.setTime(end.getTime());
                end = new Date(end);
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
                picker.$emit('pick', [start, end]);
            },
        },
        {
            text: '最近7天',
            key: 'week',
            rangeDayNo: 6,
            onClick(picker) {
                let end = new Date();
                end = end.setTime(end.getTime());
                end = new Date(end);
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
                picker.$emit('pick', [start, end]);
            },
        },
        {
            text: '最近30天',
            key: 'month',
            rangeDayNo: 29,
            onClick(picker) {
                let end = new Date();
                end = end.setTime(end.getTime());
                end = new Date(end);
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
                picker.$emit('pick', [start, end]);
            },
        },
        {
            text: '最近3个月',
            key: '3month',
            rangeDayNo: 89,
            onClick(picker) {
                let end = new Date();
                end = end.setTime(end.getTime());
                end = new Date(end);
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * (30 * 3 - 1));
                picker.$emit('pick', [start, end]);
            },
        },
        {
            text: '最近一年',
            key: 'year',
            rangeDayNo: 30 * 12 - 1,
            onClick(picker) {
                let end = new Date();
                end = end.setTime(end.getTime());
                end = new Date(end);
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * (30 * 12 - 1));
                picker.$emit('pick', [start, end]);
            },
        },
    ];

    export default {
        components: {
            DatePicker,
            Button,
        },
        props: {
            value: {
                value: Array,
                default: [],
            },
            isLimit: {
                value: Boolean,
                default: true,
            },
            shortSelect: {
                value: Array,
                default: () => ['day', 'week', 'month'], // 完整的快捷方式 ['day', '3days', 'week', 'month', 'month', 'year']
            },
            userShortCuts: {
                value: Array,
                default: () => [],
            },
            dateText: {
                value: String,
                default: '',
            },
            type: {
                value: String,
                default: 'datetimerange',
            },
            labelCol: {
                type: Object,
                default: () => {},
            },
            wrapperCol: {
                type: Object,
                default: () => {},
            },
        },
        data() {
            return {
                date: [
                    `${this.value[0]}`,
                    `${this.value[1]}`,
                ],
                userPick: false, // 用户是否选择
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: this.userShortCuts.length ? this.userShortCuts : shortcuts.filter(item => (this.shortSelect.indexOf(item.key) >= 0)),
                },
            };
        },
        mounted() {
        },
        watch: {
            date(r) {
                this.userPick = true;
                if (this.isLimit) {
                    this.dateLimit(r);
                }
                this.$emit('input', r);
            },
        },
        methods: {
            onFocus() {
                this.dataPickerFocus();
            },
            // 选择日期快捷方式时呈现激活状态。1:近1周、2:上1周、3:近1月、4:上1月
            dataPickerFocus() {
                const left = (new Date(this.date[1]).getTime() - new Date(this.date[0]).getTime()) / 1000 / (24 * 3600);
                const datePickerEle = document.getElementsByClassName('el-picker-panel__shortcut');
                const index = this.pickerOptions.shortcuts.findIndex(item => (item.rangeDayNo === left));
                const selectColor = (ele, i) => {
                    if (index === i) {
                        ele.style.cssText = 'color: #409EFF';
                    } else {
                        ele.style.cssText = 'color: #606266';
                    }
                };
                for (let i = 0; i < datePickerEle.length; i++) {
                    const ele = datePickerEle[i];
                    if (this.userPick) {
                        selectColor(ele, i);
                    } else if (this.dateText) {
                        if (ele.innerText === this.dateText) {
                            ele.style.cssText = 'color: #409EFF';
                        } else {
                            ele.style.cssText = 'color: #606266';
                        }
                    } else {
                        selectColor(ele, i);
                    }
                }
            },
        },
    };
</script>

<style lang="less" type="text/less">
    .el-date-picker-box {
        .el-range-separator {
            padding: 0 !important;
        }
    }
    .el-picker-panel__footer {
        button:first-child {
            display: none;
        }
    }
</style>
