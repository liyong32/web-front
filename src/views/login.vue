<template>
    <v-layout id="login" style="height:100%">
        <header>
            <div class="wrapper">
                <div class="left-box">
                    <i class="iconfont  logo"></i>
                    <!-- <img src="../assets/img/logo.png" alt="" class="logo pull-left"> -->
                    <span class="channel-title">{{websiteTitle}}</span>
                </div>
                <span class="phoneNum pull-right">联系邮箱：<span>reasearch-bi@126.com</span></span>
            </div>
        </header>
        <v-content class="content">
            <div class="main">
                <img class="pic" src="../assets/img/login_banner.png" alt="">
                <v-card title="账号密码登录" id="login-panel">
                    <v-form direction="horizontal" :model="form" :rules="rules" ref="form">
                        <v-form-item label="用户名" :label-col="labelCol" :wrapper-col="wrapperCol" prop="username" has-feedback>
                            <v-input placeholder="请输入用户名" size="large" v-model="form.username"></v-input>
                        </v-form-item>
                        <v-form-item label="密码" :label-col="labelCol" :wrapper-col="wrapperCol" prop="password" has-feedback>
                            <v-input type="password" placeholder="请输入密码" size="large" v-model="form.password"></v-input>
                        </v-form-item>
                        <v-form-item label="验证码" :label-col="labelCol" :wrapper-col="wrapperCol" v-if="login_fail_count > 2" prop="captcha" has-feedback>
                            <v-input placeholder="请输入验证码" size="large" style="width:144px;display:inline-block" v-model="form.captcha"></v-input>
                            <img class="yzm pull-right" :src="grape+'/site/captcha?g_token='+g_token+'&refresh='+time" alt="验证码"  title="点击刷新" @click="changeCaptcha">
                        </v-form-item>
                        <v-form-item :wrapper-col="{span:17,offset:5}">
                            <v-button html-type="submit" type="primary" size="large" class="submit" @click.prevent="submit" :loading="loging">登录</v-button>
                        </v-form-item>
                    </v-form>
                    <a class="forgetPw" href="" v-if="false">找回密码</a>
                </v-card>
            </div>
        </v-content>
        <footer>
            <div class="wrapper">
                <div class="item copyright pull-left">
                    <div class="title">BI部门</div>
                    <div class="cont">Copyright © {{new Date().getFullYear()}} www.bi.com All Rights Reserved</div>
                </div>
                <div class="item links pull-right">
                    <div class="title">友情链接</div>
                    <ul class="cont">
                        <li><a target="_blank" href="https://www.google.com/">Google</a></li>
                        <li><a target="_blank" href="https://www.aol.com/">AOL</a></li>
                        <li><a target="_blank" href="http://www.bing.com/">Bing</a></li>
                    </ul>
                </div>
            </div>
        </footer>
    </v-layout>
</template>
<script lang="babel">
    import {
        account,
    } from '@/services/api';
    import Cookie from 'js-cookie';

    export default {
        data() {
            return {
                labelCol: { span: 5 },
                wrapperCol: { span: 17 },
                form: {
                    username: '',
                    password: '',
                    captcha: '',
                },
                rules: {
                    username: [{
                        required: true,
                        message: '请输入用户名',
                    }],
                    password: [{
                        required: true,
                        message: '请输入密码',
                    }],
                    captcha: [{
                        required: true,
                        message: '请输入验证码',
                    }],
                },
                login_fail_count: 0,
                loging: false,
                g_token: '',
                time: '',
                grape: 'test',
            };
        },
        beforeRouteEnter(to, from, next) {
            const token = Cookie.get('token');
            if (token) {
                next('/');
            } else {
                next();
            }
        },
        mounted() {
            // qq浏览器记住密码，但是却取不到值，干脆直接置为空
            setTimeout(() => {
                if (!this.username) {
                    this.username = this.password = '';
                }
            }, 500);
        },
        methods: {
            submit() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.loging = true;
                        const p = {
                            account: this.form.username,
                            password: this.form.password,
                        };
                        account.login(p).then((r) => {
                            if (r.status - 0 === 1) {
                                // const userInfoString = JSON.stringify(r.user);
                                // Cookie.set('userInfo', userInfoString, { expires: this.cookieExpires });
                                Cookie.set('token', r.user.token, { expires: this.cookieExpires });
                                this.$store.dispatch('getUser');
                                this.$router.push({
                                    path: '/index',
                                });
                            } else {
                                this.$message.error('用户名或密码错误', 3);
                            }
                            this.loging = false;
                        }).catch(() => {
                            this.$message.error('系统错误，请稍后重试', 3);
                            this.loging = false;
                        });
                    }
                });
            },
            changeCaptcha() {
                this.time = Date.now();
            },
        },
    };
</script>
<style scoped lang="less">
    .wrapper{
        width: 1000px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    #login{
        header{
            background-color: #fff;
            .wrapper{
                height: 84px;
                .logo{
                    margin-right: 15px;
                    font-size: 37px;
                    background-image: -webkit-gradient(linear, left 0, right 0, from(#4B1ABD), to(#A213C9));
                    -webkit-background-clip: text; /*必需加前缀 -webkit- 才支持这个text值 */
                    -webkit-text-fill-color: transparent; /*text-fill-color会覆盖color所定义的字体颜色： */
                }
                .channel-title {
                    font-size: 20px;
                    // font-weight: bold;
                    color: rgba(0,0,0,0.65);
                }
                .phoneNum{
                    margin-top: 30px;
                    color:#000;

                    span{
                        font-size: 20px;
                    }
                }
                .left-box {
                    display: flex;
                    align-items: center;
                }
            }
        }
        .content{
            min-height: 434px;
            background-color: #6b69b4;
            position: relative;

            .main{
                width: 1000px;
                position: absolute;
                top: 50%;
                left:50%;
                transform: translate(-50%,-50%);

                .pic{
                    width: 580px;
                }
            }
            #login-panel{
                width: 400px;
                border-radius: 6px;
                position: absolute;
                right: 0;
                bottom: 0;

                .submit{
                    width:100%;
                    height:48px;
                    font-size: 18px;
                    letter-spacing: 8px;
                }
                .yzm{
                    width:100px;
                    height:40px;
                    cursor: pointer;
                }
                .forgetPw{
                    font-size: 14px;
                    position: absolute;
                    right:0;
                    bottom:0;
                }
            }
        }
        footer{
            background-color:#363F44;
            .item{
                margin: 20px 0;
                border-left: 2px solid #96A1A7;
                padding-left: 17px;
                .title{
                    font-size: 16px;
                    color: #ECF0F2;
                    line-height: 16px;
                }
                .cont{
                    font-size: 13px;
                    line-height:13px;
                    margin-top:12px;
                    color: #96A1A7;
                }
            }
            .links .cont li{
                float: left;
                border-right: 1px solid #96A1A7;
                padding-right:10px;
                margin-right:10px;

                &:last-child{
                    border-right: none;
                }

                a{
                    color: #96A1A7;
                }
            }
        }
    }
</style>
<style lang="less">
    #login-panel{
        .ant-card-head-title{
            font-size:16px;
            font-weight: normal;
            color: #363F44
        }
        .ant-form-item-label {
            line-height: 38px;
        }
        .ant-form-item-label label{
            font-size: 16px;
            color: #4A4A4A
        }
        .ant-input{
            height:40px;
            font-size:16px;
        }
        .has-success.has-feedback:after,.has-error.has-feedback:after {
            line-height: 41px;
        }
    }
</style>
