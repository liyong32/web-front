<!--
   desc: 角色配置-添加/编辑角色
-->
<template>
    <v-modal :title="title"
             :visible="visible"
             @ok="handleOk"
             :width="500"
             @cancel="handleCancel">
        <div class="role-update-box">
            <v-form direction="horizontal" :model="customForm" :rules="customRules" ref="userForm">
                <v-form-item label="角色名称" :label-col="labelCol" :wrapper-col="wrapperCol" prop="name">
                    <v-input placeholder="请输入角色名称" type="text" size="large" v-model="customForm.name"></v-input>
                </v-form-item>
                <v-form-item class="menu-select-box" :class="{error: !menuPass}" label="权限菜单" :label-col="labelCol" :wrapper-col="wrapperCol">
                    <div class="menu-list" @click="handleMenus">
                        <vMenus ref="menuTree" :default-checked-keys="selectTree" @check-change="checkChange"></vMenus>
                    </div>
                    <div class="error-tip" v-show="!menuPass">请选择权限菜单</div>
                </v-form-item>
            </v-form>
        </div>
    </v-modal>
</template>

<script type="text/ecmascript-6">
    import {
        // customer,
        account,
    } from '@/services/api';
    import vMenus from '../../../components/vMenusTree';

    export default {
        components: {
            vMenus,
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
                labelCol: {
                    span: 4,
                },
                wrapperCol: {
                    span: 18,
                },
                menuPass: true,
                selectTree: [],
                visible: this.value,
                customForm: {
                    name: '',
                    privilege_menus: '',
                },
                customRules: {
                    name: [
                        {
                            required: true,
                            message: '请输入角色名称',
                        },
                        {
                            validator: this.validateName,
                        },
                    ],
                },
            };
        },
        computed: {
            isUpdate() {
                return Object.keys(this.updateData).length;
            },
        },
        watch: {
            value(r) {
                this.visible = r;
            },
            visible(r) {
                this.$emit('input', r);
                if (!r) {
                    return;
                }
                if (this.isUpdate) {
                    const data = this.updateData;
                    this.customForm = {
                        name: data.name,
                        privilege_menus: data.privilege_menus,
                    };
                    const treeArr = JSON.parse(data.privilege_menus);
                    const arr = [];
                    setTimeout(() => {
                        treeArr.forEach((item) => {
                            if (item.indexOf('/') >= 0) {
                                arr.push(item);
                            }
                        });
                        this.$refs.menuTree.$refs.treeSelect.setCheckedKeys(arr);
                    }, 200);
                } else {
                    this.customForm = {};
                }
            },
            updateData(r) {
                this.updateData = r;
            },
        },
        mounted() {
        },
        methods: {
            validateName(rule, value, callback) {
                const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]{2,16}$/;
                if (!reg.test(value)) {
                    callback(new Error('角色名称长度2-16位，可包含 中文, 字母，数字，下划线，减号'));
                } else {
                    callback();
                }
            },
            handleOk() {
                const selectTree = this.$refs.menuTree.$refs.treeSelect.getCheckedKeys();
                this.$refs.userForm.validate((valid) => {
                    if (valid) {
                        if (selectTree.length === 0) {
                            this.menuPass = false;
                            // this.$message.error('请勾选菜单');
                            return false;
                        }
                        this.menuPass = true;
                        const p = {
                            name: this.customForm.name,
                            privilege_menus: selectTree ? JSON.stringify(selectTree) : '',
                        };
                        if (this.isUpdate) {
                            p.id = this.updateData.id;
                        }
                        account.setrole(p).then(() => {
                            this.visible = false;
                            // window.Bus.$emit(`${this.isUpdate ? 'update-role' : 'add-role'}-done`, p);
                            window.Bus.$emit('add-role-done');
                            this.$message.info(`${this.isUpdate ? '更新' : '添加'}成功`);
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            handleCancel() {
                this.visible = false;
            },
            handleMenus() {},
            checkChange() {
                const selectTree = this.$refs.menuTree.$refs.treeSelect.getCheckedKeys();
                this.menuPass = selectTree.length !== 0;
            },
        },
    };
</script>

<style lang="less" type="text/less">
    .role-update-box {
        .menu-list {
            border: 1px solid #d9d9d9;
            min-height: 150px;
            max-height: 250px;
            overflow: auto;
            cursor: pointer;
        }
        .menu-select-box {
            margin-bottom: 0;
            &.error {
                .menu-list {
                    border-color: red;
                }
            }
            .error-tip {
                color: red;
                margin-top: 5px;
            }
            .ant-form-item-label {
                > label {
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
    }
</style>
