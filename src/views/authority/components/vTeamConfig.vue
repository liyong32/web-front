
<template>
    <v-modal :title="title"
             :visible="visible"
             :width="300"
             class="v-scheduling-config"
             @cancel="handleCancel">
        <div class="config-box">
            <v-form direction="horizontal" :model="customForm" :rules="customRules" ref="searchForm">
                <v-form-item label="Team名称" :label-col="labelCol" :wrapper-col="wrapperCol" required prop="name">
                    <v-input style="width: 100px;" v-model="customForm.name"/>
                </v-form-item>
            </v-form>
        </div>
        <div slot="footer">
            <v-button @click="handleCancel">关闭</v-button>
            <v-button type="primary" @click="handleOk" :loading="loading">确定</v-button>
        </div>
    </v-modal>
</template>

<script type="text/ecmascript-6">
    import {
        account,
    } from '@/services/api';

    export default {
        components: {
        },
        props: {
            value: {
                type: Boolean,
                default: false,
            },
            data: {
                type: Object,
                default: {},
            },
        },
        data() {
            return {
                loading: false,
                labelCol: {
                    span: 10,
                },
                wrapperCol: {
                    span: 12,
                },
                visible: this.value,
                customForm: {
                    name: '',
                },
                customRules: {
                    name: [
                        {
                            required: true,
                            message: '请输入Team',
                        },
                        {
                            validator: this.validateName,
                        },
                    ],
                },
            };
        },
        watch: {
            value(r) {
                this.visible = r;
            },
            visible(r) {
                this.$emit('input', r);
                if (r && Object.keys(this.data).length) {
                    this.customForm.name = this.data.team_name;
                } else {
                    this.customForm.name = '';
                }
            },
        },
        computed: {
            title() {
                return this.data.carmun ? `Team配置（${this.data.carmun}）` : 'Team配置';
            },
        },
        filters: {
        },
        mounted() {
        },
        methods: {
            validateName(rule, value, callback) {
                const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]{2,16}$/;
                if (!reg.test(value)) {
                    callback(new Error('名称长度2-16位，不允许包含特殊字符和空格'));
                } else {
                    callback();
                }
            },
            handleCancel() {
                this.visible = false;
            },
            handleOk() {
                this.$refs.searchForm.validate((valid) => {
                    if (!valid) {
                        return;
                    }
                    const p = {
                        team_name: this.customForm.name,
                    };
                    if (this.data.id) {
                        p.team_id = this.data.id;
                    }
                    this.loading = true;
                    account.setteam(p).then((r) => {
                        if (r.status === 1) {
                            this.$message.info(`${this.data.id ? '编辑' : '添加'}成功`);
                            this.$emit('update-done');
                            this.visible = false;
                        }
                        this.loading = false;
                    }).catch(() => {
                        this.loading = false;
                    });
                });
            },
        },
    };
</script>

<style lang="less" type="text/less" scoped>

</style>
