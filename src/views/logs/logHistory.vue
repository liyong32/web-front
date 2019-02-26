<!--
   desc: 操作日志
-->
<template>
    <div class="logs-page normal-contain">
        <div class="search-form">
            <v-form>
                <vSearchUser v-model="searchForm.userValue" title="操作人员"></vSearchUser>
                <v-form-item label="开始时间">
                    <DatePicker
                            size="small"
                            ref="datePicker"
                            v-model="searchForm.startDate"
                            align="left"
                            class="user-date-picker"
                            placeholder="开始日期"
                            :clearable="false"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd">
                    </DatePicker>
                    <v-time-picker v-model="searchForm.startTime"></v-time-picker>
                </v-form-item>
                <v-form-item label="结束时间">
                    <DatePicker
                            size="small"
                            ref="datePicker"
                            v-model="searchForm.endDate"
                            align="left"
                            class="user-date-picker"
                            placeholder="结束日期"
                            :clearable="false"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd">
                    </DatePicker>
                    <v-time-picker v-model="searchForm.endTime"></v-time-picker>
                </v-form-item>
                <v-form-item>
                    <v-button :loading="searching" type="primary" @click="search">查询</v-button>
                </v-form-item>
            </v-form>
        </div>
        <div class="search-list-body">
            <!-- <div class="options-contain">
                <v-button class="export-btn" :loading="delLoading" @click="delLogs('select')">
                    <v-icon type="delete"></v-icon>
                    批量删除
                </v-button>
                <div class="clear-log-box">
                    <div>按时间删除:</div>
                    <v-select 
                        class="clear-select" 
                        :popupContainer="getContain"
                        style="width: 120px;"
                        v-model="clearTime"
                        :data="clearDateArr">
                    </v-select>
                    <v-button :loading="searching" type="primary" @click="delLogs('time')">删除</v-button>
                </div>
            </div> -->
            <div class="search-list-content">
                <v-data-table
                        ref="dataTable"
                        size="middle"
                        :data='getList'
                        :columns='columns'
                        :bordered="true"
                        :stripe="true"
                        :pagination="true"
                        :pageNo="pageNo"
                        :pageSize="pageSize">
                    <template slot="emptytext" scope="props">
                        <v-tag color="orange">没有数据</v-tag>
                    </template>
                    <template slot="td" scope="props">
                        <template v-if="props.column.field === 'content'">
                            <div class="log-text">
                                {{props.content}}
                            </div>
                        </template>
                        <template v-else>
                            {{props.content || '--'}}
                        </template>
                    </template>
                </v-data-table>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {
        DatePicker,
    } from 'element-ui';
    import {
        logs,
    } from '@/services/api';
    import vSearchUser from '../../../components/vSearchUser';

    const columns = [
        {
            title: '操作者',
            field: 'nick_name',
        },
        {
            title: '操作日期',
            field: 'create_time',
        },
        {
            title: 'IP地址',
            field: 'ip',
        },
        {
            title: '操作记录',
            field: 'content',
        },
    ];
    export default {
        components: {
            vSearchUser,
            DatePicker,
        },
        data() {
            return {
                pageNo: 1,
                pageSize: 10,
                searching: false,
                delLoading: false,
                searchForm: {
                    userValue: '',
                    date: '',
                    startDate: this.dateFormater(new Date(new Date().getTime() - 3600 * 1000 * 24 * 7), 'YYYY-MM-DD'),
                    startTime: '00:00:00',
                    endDate: this.dateFormater(new Date(), 'YYYY-MM-DD'),
                    endTime: '23:59:59',
                },
                columns,
                clearTime: '1',
                clearDateArr: [
                    {
                        value: '1',
                        label: '一周之前',
                    },
                    {
                        value: '2',
                        label: '一个月之前',
                    },
                    {
                        value: '3',
                        label: '三个月之前',
                    },
                    {
                        value: '4',
                        label: '半年之前',
                    },
                    {
                        value: '5',
                        label: '一年之前',
                    },
                ],
            };
        },
        mounted() {
            window.Bus.$on('service-error', () => {
                this.searching = false;
                this.delLoading = false;
            });
        },
        destroyed() {
            window.Bus.$off('service-error');
        },
        methods: {
            search() {
                this.$refs.dataTable.reload();
            },
            validate() {
                const serviceStarttime = `${this.searchForm.startDate} ${this.searchForm.startTime}`;
                const serviceEndtime = `${this.searchForm.endDate} ${this.searchForm.endTime}`;
                if (new Date(serviceStarttime) - new Date(serviceEndtime) >= 0) {
                    this.$message.error('开始时间必须大于结束时间');
                    return false;
                }
                return true;
            },
            getList(r) {
                if (!this.validate()) {
                    return new Promise((resolve) => {
                        resolve({
                            result: [],
                        });
                    });
                }
                const p = {
                    pageNo: r.pageNo,
                    pageSize: r.pageSize,
                    user_id: this.searchForm.userValue,
                    from: `${this.searchForm.startDate} ${this.searchForm.startTime}`,
                    to: `${this.searchForm.endDate} ${this.searchForm.endTime}`,
                };
                return logs.getLogs(p);
            },
            getDelTime() {
                let from = '';
                let to = '';
                switch (this.clearTime) {
                    case '1': // 一周
                        break;
                    default:
                        break;
                }
                return {
                    from,
                    to,
                };
            },
            delLogs(type) {
                let checkedArr = [];
                if (type === 'select') { // 按选择删除
                    checkedArr = this.$refs.dataTable.getCheckedData();
                    if (checkedArr.length === 0) {
                        this.$message.error('请先勾选需要删除的项');
                        return;
                    }
                }
                const text = type === 'time' ? '确定删除这段时间的日志？' : `确定删除这${checkedArr.length}条日志？`;
                this.$modal.confirm({
                    iconType: 'exclamation-circle',
                    title: '删除',
                    content: text,
                    okText: '确定',
                    onOk: () => {
                        const ids = checkedArr.map(item => item.id).join(',');
                        let p = {};
                        if (type === 'time') {
                            p = {
                                id: '',
                                from: this.getDelTime().from,
                                to: this.getDelTime().to,
                            };
                        } else {
                            p = {
                                id: ids,
                                from: '',
                                to: '',
                            };
                        }
                        logs.deletelog(p).then((r) => {
                            if (r.status === 1) {
                                this.$message.info('删除成功');
                                this.search();
                            } else {
                                this.$message.info('删除失败');
                            }
                        });
                    },
                    onCancel: () => {},
                });
            },
        },
    };
</script>

<style lang="less" type="text/less">
    @import "../../assets/css/base";
    .logs-page {
        .user-date-picker.el-input.el-input--small {
            width: 150px;
        }
        .log-text {
            word-wrap: break-word;
            word-break: normal;
            overflow: hidden;
            white-space: normal;
            width: 500px;
            // max-width: 700px;
            margin: 0 auto;
        }
        .options-contain {
            display: flex;
            justify-content: space-between;
            align-content: center;
        }
        .clear-log-box {
            display: flex;
            align-items: center;
        }
        .clear-select {
            margin: 0 10px;
        }
    }
</style>
