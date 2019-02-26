<template>
    <div class="team-page normal-contain">
        <div class="search-form">
            <v-form>
                <v-form-item label="组名">
                    <v-input type="text" size="large" v-model="searchForm.teamName" placeholder="请输入组名称"></v-input>
                </v-form-item>
                <v-form-item>
                    <v-button :loading="searching" type="primary" @click="search">查询</v-button>
                </v-form-item>
            </v-form>
        </div>
        <div class="search-list-body">
            <div class="options-contain">
                <v-button class="export-btn" @click="add">
                    <v-icon type="plus"></v-icon>
                    添加
                </v-button>
            </div>
            <div class="search-list-content">
                <v-data-table
                        ref="dataTable"
                        size="middle"
                        :data='getList'
                        :columns='columns'
                        :bordered="true"
                        :stripe="true"
                        @dataloaded="dataTableDone"
                        :pagination="true"
                        :pageNo="pageNo"
                        :pageSize="pageSize">
                    <template slot="emptytext">
                        <v-tag color="orange">没有数据</v-tag>
                    </template>
                    <template slot="td" scope="props">
                        <template v-if="props.column.field === 'deleted'">
                            <span>
                                {{props.content === 0 ? '启用' : '禁用'}}
                            </span>
                        </template>
                        <template v-else-if="props.column.field === 'option'">
                            <span class="option-btn edit-btn" @click="handleEdit(props.item)">编辑</span>
                            <span class="option-btn del-btn" @click="handleDel(props.item)">删除</span>
                        </template>
                        <template v-else>
                            {{props.content || '--'}}
                        </template>
                    </template>
                </v-data-table>
            </div>
        </div>
        <vTeamConfig v-model="showConfig" :data="activeItem"  @update-done="search"></vTeamConfig>
    </div>
</template>
<script type="text/ecmascript-6">
    import {
        account,
    } from '@/services/api';
    import vTeamConfig from '../components/vTeamConfig';
    const columns = [
        {
            title: '名称',
            field: 'team_name',
        },
        {
            title: '状态',
            field: 'deleted',
        },
        {
            title: '添加时间',
            field: 'createtime',
        },
        {
            title: '操作',
            field: 'option',
        },
    ];
    export default {
        components: {
            vTeamConfig,
        },
        props: {
        },
        data() {
            return {
                columns,
                searching: false,
                pageNo: 1,
                pageSize: 10,
                showConfig: false,
                showOrgList: false,
                activeItem: {},
                searchForm: {
                    teamName: '',
                },
            };
        },
        computed: {
        },
        watch: {
        },
        filters: {
        },
        mounted() {
        },
        methods: {
            search() {
                this.$refs.dataTable.reload();
            },
            add() {
                this.activeItem = {};
                this.showConfig = true;
            },
            dataTableDone() {
                this.searching = false;
            },
            getList(r) {
                this.searching = true;
                const param = {
                    pageNo: r.pageNo,
                    pageSize: r.pageSize,
                    team_name: this.searchForm.teamName,
                };
                return account.teampage(param);
            },
            handleEdit(item) {
                this.activeItem = item;
                this.showConfig = true;
            },
            handleDel(item) {
                const id = item.id;
                this.$modal.confirm({
                    iconType: 'exclamation-circle',
                    title: '删除 ?',
                    content: '您确定要删除本条数据吗？',
                    onOk: () => {
                        const p = {
                            team_id: id,
                            deleted: 1,
                        };
                        account.setteam(p).then((r) => {
                            if (r.status === 1) {
                                this.$message.info('删除成功');
                                this.search();
                            }
                        });
                    },
                    onCancel: () => {},
                });
            },
            checkUser(item) {
                this.activeItem = item;
                this.showOrgList = true;
            },
        },
    };
</script>
<style lang="less" type="text/less">
    @import "../../../assets/css/base";
</style>