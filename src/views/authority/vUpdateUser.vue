<!--
   desc: 添加用户
-->
<template>
    <v-modal :title="title"
             :visible="visible"
             @cancel="handleCancel">
        <div>
            <v-form direction="horizontal" :model="customForm" :rules="customRules" ref="userForm">
                <v-form-item label="昵称" :label-col="labelCol" :wrapper-col="wrapperCol" prop="nick_name">
                    <input style="display:none" type="text" autocomplete="new-password">
                    <v-input type="text" size="large" v-model="customForm.nick_name" placeholder="请输入昵称" autocomplete="new-password"></v-input>
                </v-form-item>
                <v-form-item label="角色" :label-col="labelCol" :wrapper-col="wrapperCol" prop="role_ids">
                    <v-input v-show="false" type="text" size="large" v-model="customForm.role_ids"></v-input>
                    <vRoleSearch :single="true" v-model="customForm.role_ids" :defaultData="defaultData"></vRoleSearch>
                </v-form-item>
                <v-form-item label="所属Team" :label-col="labelCol" :wrapper-col="wrapperCol" prop="teamValue">
                    <v-input v-show="false" type="text" size="large" v-model="customForm.teamValue"></v-input>
                    <vSelectSingle :single="true" v-model="customForm.teamValue" :userConfig="teamConfig" ref="teamSelect"></vSelectSingle>
                </v-form-item>
                <v-form-item label="登录账号" :label-col="labelCol" :wrapper-col="wrapperCol" prop="account_name">
                    <v-input type="text" placeholder="请输入登录账号" size="large" v-model="customForm.account_name" :disabled="isUpdate ? true : false"></v-input>
                </v-form-item>
                <v-form-item label="登录密码" :label-col="labelCol" :wrapper-col="wrapperCol" prop="password">
                    <input style="display:none" type="password" autocomplete="new-password">
                    <v-input type="password" placeholder="请输入登录密码" size="large" v-model="customForm.password" autocomplete="new-password"></v-input>
                </v-form-item>
                <v-form-item label="开启" :label-col="labelCol" :wrapper-col="wrapperCol" prop="status">
                    <v-switch v-model="customForm.status" :true-value="1" :false-value="-1">
                        <span slot="checkedChildren">开</span>
                        <span slot="unCheckedChildren">关</span>
                    </v-switch>
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
    import vRoleSearch from '../../../components/vRoleSearch';
    import vSelectSingle from '../../../components/vSelect';

    export default {
        components: {
            vRoleSearch,
            vSelectSingle,
        },
        props: {
            value: {
                type: Boolean,
                default: false,
            },
            title: {
                type: String,
                default: '',
            },
            updateData: {
                type: Object,
                default: {},
            },
        },
        data() {
            return {
                visible: this.value,
                loading: false,
                labelCol: {
                    span: 6,
                },
                wrapperCol: {
                    span: 16,
                },
                defaultData: [],
                updateInfo: this.updateData,
                customForm: {
                    nick_name: '',
                    password: '',
                    account_name: '',
                    role_ids: '',
                    status: -1,
                    teamValue: '',
                    classes_id: '',
                },
                teamConfig: {
                    title: '所属Team',
                    clue: 'id',
                    label: 'team_name',
                    func: account,
                    method: 'teampage',
                    autoSearch: true,
                    keyword: 'team_name',
                },
                customRules: {
                    nick_name: [
                        {
                            required: true,
                            message: '请输入昵称',
                        },
                        {
                            validator: this.validateNickName,
                        },
                    ],
                    password: [
                        {
                            required: true,
                            message: '请输入密码',
                        },
                        {
                            validator: this.validatePassword,
                        },
                    ],
                    account_name: [
                        {
                            required: true,
                            message: '请输入登录账号',
                        },
                        {
                            validator: this.validateUserName,
                        },
                    ],
                    role_ids: [
                        {
                            required: true,
                            message: '请选择角色',
                        },
                    ],
                    teamValue: [
                        {
                            required: true,
                            message: '请选择team',
                        },
                    ],
                    classes_id: [
                        {
                            required: true,
                            message: '请选择班次',
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
                if (r) {
                    this.initTeamSelect();
                    this.initSchedulSelect();
                }
            },
            updateData(r) {
                this.updateInfo = r;
                if (this.isUpdate) {
                    this.defaultData = [
                        {
                            id: r.role_id,
                            name: r.role_name,
                        },
                    ];
                    this.customForm = {
                        nick_name: r.nick_name,
                        password: '______',
                        account_name: r.account_name,
                        role_ids: r.role_id,
                        status: r.status,
                    };
                } else {
                    this.customForm = {
                        nick_name: '',
                        password: '',
                        account_name: '',
                        role_ids: '',
                        status: -1,
                    };
                }
            },
        },
        computed: {
            isUpdate() {
                return Object.keys(this.updateData).length;
            },
        },
        mounted() {
        },
        methods: {
            validateNickName(rule, value, callback) {
                const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]{2,16}$/;
                if (!reg.test(value)) {
                    callback(new Error('昵称长度2-16位，不含空格'));
                } else {
                    callback();
                }
            },
            validatePassword(rule, value, callback) {
                const reg = /^(?!\s)((?=.*[a-zA-Z])(?=.*[a-z])(?=.*[A-Z])(?=.*[\d]).\S{6,16})$/;
                if (this.isUpdate && this.customForm.password === '______') {
                    callback();
                    return;
                }
                if (!reg.test(value)) {
                    callback(new Error('请输入6-16位密码，必须包含大写字母、小写字母和数字'));
                } else {
                    callback();
                }
            },
            validateUserName(rule, value, callback) {
                const reg = /^[a-zA-Z0-9_-]{4,16}$/;
                if (!reg.test(value)) {
                    callback(new Error('用户名长度4-16位，可包含 字母，数字，下划线，减号'));
                } else {
                    callback();
                }
            },
            handleOk() {
                this.$refs.userForm.validate((valid) => {
                    if (valid) {
                        const p = {
                            account_name: this.customForm.account_name,
                            nick_name: this.customForm.nick_name,
                            role_ids: this.customForm.role_ids,
                            status: this.customForm.status,
                            id: this.updateInfo.id,
                            team_id: this.customForm.teamValue,
                            classes_id: this.customForm.classes_id,
                        };
                        if (this.isUpdate) {
                            if (this.customForm.password !== '______') {
                                p.password = this.customForm.password;
                            }
                            for (const key in p) {
                                if (!p[key]) {
                                    delete p[key];
                                }
                            }
                        } else {
                            p.password = this.customForm.password;
                        }
                        this.loading = true;
                        account.setuser(p).then(() => {
                            this.visible = false;
                            // window.Bus.$emit(`${this.isUpdate ? 'update-user' : 'add-user'}-done`, p);
                            window.Bus.$emit('add-user-done');
                            this.$message.info(`${this.isUpdate ? '更新' : '添加'}成功`);
                            this.loading = false;
                        }).catch(() => {
                            this.loading = false;
                        });
                    } else {
                        return false;
                    }
                });
            },
            handleCancel() {
                this.visible = false;
            },
            // 更新时填充默认的team
            initTeamSelect() {
                const remoteOption = [];
                remoteOption.push({
                    id: this.updateData.team_id,
                    team_name: this.updateData.team_name,
                });
                this.$nextTick(() => {
                    this.$refs.teamSelect.initDefault({
                        remoteOption,
                        selectArr: this.updateData.team_id,
                    });
                });
            },
            // 更新时填充默认排班
            initSchedulSelect() {
                const remoteOption = [];
                remoteOption.push({
                    id: this.updateData.classes_id,
                    classes_name: this.updateData.classes_name,
                });
                this.$nextTick(() => {
                    this.$refs.schedulSelect.initDefault({
                        remoteOption,
                        selectArr: this.updateData.classes_id,
                    });
                });
            },
        },
    };
</script>

<style lang="less" type="text/less">

</style>
