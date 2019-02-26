<!--
   desc: 角色选择插件
-->
<template>
    <v-select
            v-if="single"
            search
            :loading="loading"
            :remote-method="remoteMethod"
            :data="remoteOption"
            @search="searchChange"
            size="lg"
            :optionOnChange="true"
            @change="selectChange"
            clue="id"
            label="name"
            placeholder="请输入角色"
            v-model="selectId"
    ></v-select>
    <v-form-item label="角色名称" v-else>
        <v-select
                style="width: 120px"
                search
                :loading="loading"
                :remote-method="remoteMethod"
                :data="remoteOption"
                @search="searchChange"
                clue="id"
                label="name"
                placeholder="请输入角色"
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
            value: {
                type: [String, Number],
                default: '',
            },
            single: {
                type: Boolean,
                default: false,
            },
            defaultData: {
                type: Array,
                default: () => [],
            },
        },
        data() {
            return {
                loading: false,
                remoteOption: this.defaultData,
                selectId: this.value,
            };
        },
        watch: {
            defaultData(r) {
                // this.remoteOption = r;
                this.selectId = r[0].id;
            },
            selectId(r) {
                this.$emit('input', r);
            },
            value(r) {
                this.selectId = r;
            },
        },
        mounted() {
            this.loadlist();
        },
        methods: {
            searchChange() {
                this.loading = true;
            },
            selectChange(r) {
                this.$emit('selectChange', r);
            },
            loadlist() {
                const param = {
                    name: '',
                    pageNo: 1,
                    pageSize: 20,
                };
                account.getRoleList(param).then((r) => {
                    // 重新组装数据
                    this.loading = false;
                    this.remoteOption = r.result;
                });
            },
            remoteMethod: _.debounce(function search(q) {
                let query = q;
                if (query.length >= 20) {
                    query = query.substr(0, 20);
                }
                this.loading = true;
                const param = {
                    name: query,
                    pageNo: 1,
                    pageSize: 10,
                };
                account.getRoleList(param).then((r) => {
                    // 重新组装数据
                    this.loading = false;
                    this.remoteOption = r.result;
                });
            }, 500),
        },
    };
</script>

<style lang="less" type="text/less">

</style>
