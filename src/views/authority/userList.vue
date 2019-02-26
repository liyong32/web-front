<!--
   desc: 权限管理，用户管理
-->
<template>
    <div class="authority-user-list-page normal-contain">
        <div class="search-form">
            <v-form>
                <v-form-item label="昵称">
                    <v-input placeholder="请输入昵称" v-model="searchForm.userName"></v-input>
                </v-form-item>
                <v-form-item label="角色">
                    <v-input placeholder="请输入角色" v-model="searchForm.roleValue"></v-input>
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
                        :data='getServiceList'
                        :columns='columns'
                        :bordered="true"
                        :stripe="true"
                        :currentData.sync="tableData"
                        @dataloaded="dataTableDone"
                        :pagination="true"
                        :pageNo="pageNo"
                        :pageSize="pageSize">
                    <template slot="emptytext">
                        <v-tag color="orange">没有数据</v-tag>
                    </template>
                    <template slot="td" scope="props">
                        <template v-if="props.column.field === 'status'">
                            <span>
                                {{props.content === 1 ? '启用' : '未启用'}}
                            </span>
                        </template>
                        <template v-else-if="props.column.field === 'orgcount'">
                            <span class="option-btn config-btn" @click="checkUser(props.item)">{{props.content}}</span>
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
        <vUpdateUser v-model="showAdd" :updateData="updateData" :title="updateTitle"></vUpdateUser>
    </div>
</template>

<script type="text/ecmascript-6">
    import {
        account,
    } from '@/services/api';
    import vRoleSearch from '../../../components/vRoleSearch';
    import vUpdateUser from './vUpdateUser';
    const columns = [
        {
            title: '登录账号',
            field: 'account_name',
        },
        {
            title: '昵称',
            field: 'nick_name',
        },
        {
            title: '角色',
            field: 'role_name',
        },
        {
            title: '所属Team',
            field: 'team_name',
        },
        {
            title: '添加时间',
            field: 'create_time',
        },
        {
            title: '最后登录时间',
            field: 'latest_login_time',
        },
        {
            title: '是否启用',
            field: 'status',
        },
        {
            title: '操作',
            field: 'option',
        },
    ];
    export default {
        components: {
            vRoleSearch,
            vUpdateUser,
        },
        data() {
            return {
                columns,
                pageNo: 1,
                pageSize: 10,
                searching: false,
                showOrgList: false,
                searchForm: {
                    userValue: '',
                    roleValue: '',
                },
                tableData: [],
                showAdd: false,
                updateData: {},
                activeData: {},
                updateTitle: '添加用户',
            };
        },
        mounted() {
            window.Bus.$on('add-user-done', () => {
                this.$refs.dataTable.reload();
            });
            window.Bus.$on('service-error', () => {
                this.searching = false;
            });
        },
        destroyed() {
            window.Bus.$off(['add-user-done', 'service-error']);
        },
        methods: {
            search() {
                this.$refs.dataTable.reload();
            },
            add() {
                this.updateData = {};
                this.showAdd = true;
                this.updateTitle = '添加用户';
            },
            handleEdit(item) {
                this.updateData = item;
                this.showAdd = true;
                this.updateTitle = '编辑用户';
            },
            handleDel(ele) {
                const id = ele.id;
                this.$modal.confirm({
                    iconType: 'exclamation-circle',
                    title: '删除 ?',
                    content: '您确定要删除本条数据吗？',
                    onOk: () => {
                        account.deleteuser({ id }).then((r) => {
                            if (r.status === 1) {
                                this.$message.info('删除成功');
                                this.search();
                            }
                        });
                    },
                    onCancel: () => {},
                });
            },
            dataTableDone() {
                this.searching = false;
            },
            getServiceList(r) {
                this.searching = true;
                const param = {
                    pageNo: r.pageNo,
                    pageSize: r.pageSize,
                    user_name: this.searchForm.userName,
                    role_name: this.searchForm.roleValue,
                };
                return account.getUserList(param);
            },
            showModal() {
                this.visible = true;
            },
            handleOk() {
                this.visible = false;
            },
            handleCancel() {
                this.visible = false;
            },
            checkUser(item) {
                this.activeData = item;
                this.showOrgList = true;
            },
        },
    };
</script>

<style lang="less" type="text/less">
     @import "../../assets/css/base";
</style>
