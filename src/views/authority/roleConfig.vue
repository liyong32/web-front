<!--
   desc: 权限管理，角色管理
-->
<template>
    <div class="authority-role-list-page normal-contain">
        <div class="search-form">
            <v-form>
                <v-form-item label="角色名称">
                    <v-input v-model="name" placeholder="请输入角色名称"></v-input>
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
                        <template v-else-if="props.column.field === 'option'">
                            <!-- <span class="option-btn config-btn" @click="handleConfig">服务配置</span> -->
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
        <vUpdateRole v-model="showAdd" :title="updateTitle" :updateData="updateData"></vUpdateRole>
    </div>
</template>

<script type="text/ecmascript-6">
    import {
        account,
    } from '@/services/api';
    import vUpdateRole from './vUpdateRole';

    const columns = [
        {
            title: '角色名称',
            field: 'name',
        },
        {
            title: '创建时间',
            field: 'create_time',
        },
        {
            title: '操作',
            field: 'option',
        },
    ];
    export default {
        components: {
            vUpdateRole,
        },
        data() {
            return {
                columns,
                pageNo: 1,
                pageSize: 10,
                searching: false,
                name: '',
                tableData: [],
                showAdd: false,
                updateData: {},
                updateTitle: '添加角色',
            };
        },
        mounted() {
            window.Bus.$on('add-role-done', () => {
                this.search();
            });
            window.Bus.$on('service-error', () => {
                this.searching = false;
            });
        },
        destroyed() {
            window.Bus.$off(['service-error', 'add-role-done']);
        },
        methods: {
            search() {
                this.$refs.dataTable.reload();
            },
            add() {
                this.updateData = {};
                this.showAdd = true;
                this.updateTitle = '添加角色';
            },
            handleEdit(item) {
                this.updateData = item;
                this.showAdd = true;
                this.updateTitle = '编辑角色';
                // window.Bus.$on('update-role-done', (r) => {
                //     for (const key in r) {
                //         item[key] = r[key];
                //     }
                //     this.updateData = {};
                // });
            },
            handleDel(ele) {
                const id = ele.id;
                this.$modal.confirm({
                    iconType: 'exclamation-circle',
                    title: '删除 ?',
                    content: '您确定要删除本条数据吗？',
                    onOk: () => {
                        account.deleterole({ id }).then((r) => {
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
            getList(r) {
                this.searching = true;
                const param = {
                    pageNo: r.pageNo,
                    pageSize: r.pageSize,
                    name: this.name,
                };
                return account.getRoleList(param);
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
        },
    };
</script>

<style lang="less" type="text/less">
     @import "../../assets/css/base";
</style>
