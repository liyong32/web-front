<!--
   desc: 平台用户搜索
-->
<template>
    <v-form-item :label="title">
        <v-select
                style="width: 120px"
                search
                :loading="loading"
                :remote-method="remoteMethod"
                :data="remoteOption"
                clue="id"
                @search="searchChange"
                label="nick_name"
                :popupContainer="getContain"
                :placeholder="placeholder"
                v-model="selectId"
        ></v-select>
    </v-form-item>
</template>

<script type="text/ecmascript-6">
    import {
        account,
    } from '@/services/api';
    import _ from 'lodash';

    export default {
        components: {
        },
        props: {
            title: {
                type: String,
                default: '负责人',
            },
            value: {
                type: [String, Number],
                default: '',
            },
        },
        data() {
            return {
                loading: false,
                remoteOption: [],
                selectId: this.value,
            };
        },
        watch: {
            selectId(r) {
                this.$emit('input', r);
            },
        },
        computed: {
            placeholder() {
                return `请输入${this.title}`;
            },
        },
        mounted() {
        },
        methods: {
            searchChange() {
                this.loading = true;
            },
            remoteMethod: _.debounce(function search(q) {
                let query = q;
                if (query.length >= 20) {
                    query = query.substr(0, 20);
                }
                if (query !== '') {
                    this.loading = true;
                    const param = {
                        keyword: query,
                    };
                    account.searchuser(param).then((r) => {
                        // 重新组装数据
                        this.remoteOption = r;
                        this.loading = false;
                    });
                } else {
                    this.remoteOption = [];
                    this.loading = false;
                }
            }, 500),
        },
    };
</script>

<style lang="less" type="text/less">

</style>
