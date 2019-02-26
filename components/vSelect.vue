<!--
   desc: 通用选择器
-->
<template>
    <v-select
            v-if="single"
            style="min-width: 150px; max-width: 720px;"
            :dropdownWidth="getTextWidth(remoteOption)"
            search
            :loading="loading"
            :clue="config.clue"
            :allowClear="config.clear"
            :label="config.label"
            :remote-method="remoteMethod"
            :data="remoteOption"
            @focus="onFocus"
            @search="searchChange"
            @change="selectChange"
            :optionOnChange="true"
            :placeholder="placeholder"
            :popupContainer="getContain"
            :multiple="multiple"
            v-model="selectValue"
    ></v-select>
    <v-form-item v-else :label="config.title" class="org-select-item" :class="getClass" :label-col="labelCol" :wrapper-col="wrapperCol">
        <v-select
                style="min-width: 150px; max-width: 720px;"
                :dropdownWidth="getTextWidth(remoteOption)"
                search
                :loading="loading"
                :clue="config.clue"
                :allowClear="config.clear"
                :label="config.label"
                :remote-method="remoteMethod"
                :data="remoteOption"
                @focus="onFocus"
                @search="searchChange"
                @change="selectChange"
                :optionOnChange="true"
                :placeholder="placeholder"
                :popupContainer="getContain"
                :multiple="multiple"
                v-model="selectValue"
        ></v-select>
    </v-form-item>
</template>

<script type="text/ecmascript-6">
    import _ from 'lodash';

    const tempArr = [];
    const defaultConfig = { // 配置
        title: '标题',
        clue: 'id',
        label: 'label',
        clear: true,
        required: false,
        isPass: true,
        autoSearch: false,
        func: '',
        method: '',
        keyword: 'keyword',
    };

    export default {
        components: {
        },
        props: {
            value: {
                type: [String, Array, Number],
                default: '',
            },
            userConfig: { // 配置
                type: Object,
                default: {},
            },
            multiple: { // 配置
                type: Boolean,
                default: false,
            },
            single: { // 配置
                type: Boolean,
                default: false,
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
                config: { ...defaultConfig, ...this.userConfig },
                loading: false,
                remoteOption: [],
                selectValue: '',
                hasGetFocus: false,
                selectArr: [],
            };
        },
        mounted() {},
        computed: {
            getClass() {
                return [{ error: !this.config.isPass }, { required: this.config.required }];
            },
            placeholder() {
                return `请输入${this.config.title}`;
            },
        },
        watch: {
            selectValue(r) {
                this.$emit('input', r);
            },
        },
        methods: {
            searchChange() {
                this.loading = true;
            },
            selectChange(r) {
                if (this.multiple) { // 多选，将所有选中的值暂存（此处为修复当用户手动输入查询时，组件返回的已选项不包含之前的选项的bug）
                    r.forEach((item) => {
                        const key = item[this.config.clue];
                        const index = tempArr.findIndex(ele => key === ele[this.config.clue]);
                        if (index < 0) {
                            tempArr.push(item);
                        }
                    });
                    const arr = tempArr.filter(item => this.selectValue.includes(item[this.config.clue]));
                    this.selectArr = arr; // 用户已选择的所有值
                    this.$emit('select-change', arr);
                } else {
                    this.$emit('select-change', r);
                }
            },
            // 加载默认的选项
            initDefault(data) {
                console.log(data);
                this.remoteOption = data.remoteOption;
                this.selectValue = data.selectArr;
            },
            getData(p, callback) {
                this.loading = true;
                this.config.func[this.config.method](p).then((r) => {
                    if (callback) {
                        let res = r;
                        if (r.result) {
                            res = r.result;
                        }
                        callback(res);
                    }
                    this.loading = false;
                }).catch(() => {
                    this.remoteOption = [];
                    this.loading = false;
                });
            },
            onFocus() {
                if (!this.config.autoSearch || (this.hasGetFocus && this.remoteOption.length !== 0)) {
                    // 将选中的值加入默认待选项中
                    this.selectArr.forEach((item) => {
                        const key = item[this.config.clue];
                        const index = this.remoteOption.findIndex(ele => ele[this.config.clue] === key);
                        if (index < 0) {
                            this.remoteOption.push(item);
                        }
                    });
                    return;
                }
                const p = {};
                if (this.config.keyword) {
                    p[this.config.keyword] = '';
                }
                this.getData(p, (r) => {
                    const newArr = [];
                    if (r.constructor === Array) {
                        r.forEach((item) => {
                            const index = this.remoteOption.findIndex(ele => ele.id === item.id);
                            if (index < 0) {
                                newArr.push(item);
                            }
                        });
                    }
                    this.remoteOption = this.remoteOption.concat(newArr);
                    this.loading = false;
                    this.hasGetFocus = true;
                });
            },
            // 查询
            remoteMethod: _.debounce(function search(q) {
                let query = q;
                if (query.length >= 20) {
                    query = query.substr(0, 20);
                }
                this.loading = true;
                let p = {};
                if (this.config.keyword) {
                    p[this.config.keyword] = query;
                }
                if (this.config.params) {
                    p = { ...p, ...this.config.params };
                }
                if (this.config.func === '' || this.config.method === '') {
                    this.remoteOption = [];
                    this.loading = false;
                    return;
                }
                this.getData(p, (r) => {
                    this.remoteOption = r;
                    this.loading = false;
                });
            }, 500),
        },
    };
</script>

<style lang="less" type="text/less">
    .org-select-item {
        &.required {
            .ant-form-item-label > label {
                &::before {
                    display: inline-block;
                    margin-right: 4px;
                    content: "*";
                    font-family: SimSun;
                    line-height: 1;
                    font-size: 12px;
                    color: #f04134;
                }
            }
        }
    }
</style>
