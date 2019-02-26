<!--
   desc: 文件导出-自定义后缀名称
-->
<template>
    <v-modal :title="title"
             :visible="visible"
             @ok="handleOk"
             @cancel="handleCancel">
         <v-form direction="horizontal" :model="userForm" :rules="customRules" ref="userForm">
            <v-form-item :label="label" :label-col="labelCol" :wrapper-col="wrapperCol" prop="name">
                <v-input size="large" :placeholder="'请输入'+label+'，非必填'"  v-model="userForm.name">
                    <span v-if="defaultName" slot="before">{{defaultName}}</span>
                </v-input>
            </v-form-item>
         </v-form>
    </v-modal>
</template>

<script type="text/ecmascript-6">
    export default {
        components: {
        },
        props: {
        },
        watch: {
        },
        filters: {
        },
        data() {
            return {
                visible: false,
                title: '标题',
                defaultName: '',
                label: '文件名称',
                userParams: {},
                labelCol: {
                    span: 4,
                },
                wrapperCol: {
                    span: 18,
                },
                customRules: {
                    name: [
                        {
                            required: false,
                            message: `请输入${this.label}`,
                        },
                        {
                            validator: this.validateFilename,
                        },
                    ],
                },
                userForm: {
                    name: '',
                },
            };
        },
        mounted() {
            window.Bus.$on('active-input-comfirm', (params) => {
                this.visible = true;
                this.title = params.title;
                this.userParams = params;
                this.defaultName = params.defaultName;
                if (params.label) {
                    this.label = params.label;
                } else {
                    this.label = '文件名称';
                }
                this.userForm.name = params.elseName ? `-${params.elseName}` : '';
            });
        },
        methods: {
            handleOk() {
                this.$refs.userForm.validate((valid) => {
                    if (valid) {
                        this.visible = false;
                        window.Bus.$emit('input-comfirm-done', `${this.defaultName}${this.userForm.name}`);
                        window.Bus.$off('input-comfirm-done');
                    }
                });
            },
            handleCancel() {
                this.visible = false;
                if (this.userParams) {
                    this.userParams.onCancel();
                }
            },
        },
    };
</script>

<style lang="less" type="text/less">

</style>
