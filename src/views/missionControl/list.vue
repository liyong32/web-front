<!--
   desc: 后端任务控制
-->
<template>
    <div class="mission-list-page normal-contain" v-if="pagePass">
        <div class="search-form">
            <v-form>
                <v-form-item label="任务">
                    <v-input v-model="searchForm.missionName"></v-input>
                </v-form-item>
                <v-form-item label="状态">
                    <v-select 
                        style="min-width: 120px;"
                        :allowClear="true"
                        :multiple="false"
                        :popupContainer="getContain"
                        v-model="searchForm.type"
                        :data="typeArr">
                    </v-select>
                </v-form-item>
                <v-form-item label="类型">
                    <v-select 
                        style="min-width: 120px;"
                        :allowClear="true"
                        :multiple="true"
                        :popupContainer="getContain"
                        v-model="searchForm.taskType"
                        :data="taskTypeArr">
                    </v-select>
                </v-form-item>
                <vDatePicker v-model="searchForm.datePickerValue" title="报修时间" :isLimit="false" type="daterange"></vDatePicker>
                <v-form-item>
                    <v-button type="primary" :loading="searching" @click="search">查询</v-button>
                </v-form-item>
            </v-form>
        </div>
        <div class="search-list-body">
            <div class="search-list-content">
                <v-data-table
                        ref="dataTable"
                        size="middle"
                        :data='getList'
                        @dataloaded="dataTableDone"
                        :columns='columns'
                        :bordered="true"
                        :stripe="true"
                        :pagination="true"
                        class="mossion-table"
                        :pageNo="pageNo"
                        :pageSize="pageSize">
                    <template slot="emptytext">
                        <v-tag color="orange">没有数据</v-tag>
                    </template>
                    <template slot="td" scope="props">
                        <template v-if="props.column.field === 'option'">
                            <!-- <span class="option-btn config-btn" @click="handleStart(props.item)">start</span> -->
                            <v-button size="small" :loading="props.item.starting" @click="handleStart(props.item)">
                                start
                            </v-button>
                        </template>
                        <!-- <template v-if="props.column.field === 'runtime'">
                            {{parseFloat(props.content) | getLeveTime}}
                        </template> -->
                        <template v-else-if="props.column.field === 'status'">
                            <span :class="getStatus(props.content).className">{{getStatus(props.content).text}}</span>
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
        mission,
    } from '@/services/api';
    import vDatePicker from '../../../components/vDatePicker';

    const columns = [
        {
            title: '任务名称',
            field: 'task_name',
        },
        {
            title: '状态',
            field: 'status',
        },
        {
            title: '开始时间',
            field: 'startdate',
        },
        {
            title: '结束时间',
            field: 'enddate',
        },
        {
            title: '类型',
            field: 'task_type',
        },
        {
            title: '运行时长',
            field: 'runtime',
        },
        {
            title: '运行结束时间',
            field: 'endtime',
        },
        {
            title: '操作',
            field: 'option',
            width: '150px',
        },
    ];

    export default {
        components: {
            vDatePicker,
        },
        props: {
        },
        data() {
            return {
                columns,
                pageNo: 1,
                pageSize: 10,
                searching: false,
                pagePass: false,
                searchForm: {
                    type: '',
                    taskType: [],
                    missionName: '',
                    datePickerValue: [
                        this.dateFormater(new Date(new Date().getTime() - 3600 * 1000 * 24 * 6), 'YYYY-MM-DD HH:mm:ss'),
                        this.dateFormater(new Date(), 'YYYY-MM-DD HH:mm:ss'),
                    ],
                },
                taskTypeArr: [
                    {
                        value: 'day',
                        label: 'day',
                    },
                    {
                        value: 'week',
                        label: 'week',
                    },
                    {
                        value: 'month',
                        label: 'month',
                    },
                ],
                typeArr: [
                    {
                        value: 1,
                        label: 'running',
                    },
                    {
                        value: 2,
                        label: 'success',
                    },
                ],
            };
        },
        watch: {
        },
        filters: {
        },
        mounted() {
            this.$nextTick(() => {
                window.Vue.$comfirmInput({
                    title: '暗号',
                    label: '暗号',
                    defaultName: '',
                    elseName: '',
                    onOk: (res) => {
                        this.pagePass = res === '1878';
                    },
                    onCancel: () => {
                        this.exporting = false;
                    },
                });
            });
        },
        methods: {
            search() {
                this.$refs.dataTable.reload();
            },
            dataTableDone() {
                this.searching = false;
            },
            getList(r) {
                this.searching = true;
                const param = {
                    title: this.searchForm.missionName,
                    statustype: this.searchForm.type,
                    in_date: `${this.searchForm.datePickerValue[0]} - ${this.searchForm.datePickerValue[1]}`,
                    task_type: this.searchForm.taskType.join(','),
                };
                param.pageNo = r.pageNo;
                param.pageSize = r.pageSize;
                return mission.missionList(param);
            },
            handleStart(item) {
                this.$set(item, 'starting', true);
                mission.missionStart({ id: item.id }).then(() => {
                    this.$notification.success({
                        message: item.type,
                        description: '任务已开始',
                        duration: 3,
                    });
                    this.$set(item, 'starting', false);
                }).catch(() => {
                    this.$set(item, 'starting', false);
                });
            },
            getStatus(r) {
                const status = parseFloat(r);
                let text = '';
                let className = '';
                if (status === 1) {
                    text = 'running';
                    className = 'running';
                }
                if (status === 2) {
                    text = 'success';
                    className = 'success';
                }
                return {
                    text,
                    className,
                };
            },
        },
    };
</script>

<style lang="less" type="text/less">
    @import "../../assets/css/base";
    .mossion-table {
        .running {
            color: #00a854;
        }
        .success {
            color: #ffbf00;
        }
    }
</style>
