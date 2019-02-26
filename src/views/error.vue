<template>
  <div id="error" :class="`err${c_code}`">
    <div class="cont">
        <img :src="imgURL" alt="">
        <div class="des">{{desText}}</div>
        <v-button type="info" size="large" @click="backHome">返回首页</v-button>
    </div>
  </div>
</template>
<script>
    export default {
        data: () => ({
            code: 404,
        }),
        computed: {
            c_code() {
                // if ([403, 404].includes(this.code * 1)) {
                //     return this.code;
                // }
                return 0;
            },
            imgURL() {
                return `../static/${this.c_code}.png`;
            },
            desText() {
                return {
                    403: '抱歉，您没有权限访问',
                    404: '抱歉，您要找的页面已离开地球',
                    0: '该功能正在建设中',
                }[this.c_code];
            },
        },
        beforeRouteEnter(to, from, next) {
            next((vm) => {
                vm.code = to.params.code || 404;
            });
        },
        beforeRouteUpdate(to) {
            this.code = to.params.code || 404;
        },
        methods: {
            backHome() {
                this.$router.push({
                    path: '/index',
                });
            },
        },
    };
</script>
<style lang="less" scoped>
    #error {
        .cont {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
        &.err404 .cont{
            padding-left: 350px;
        }
        &.err403 .cont{
            padding-left: 265px;
        }
        &.err0 .cont{
            padding-left: 410px;
        }

        img{
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
        }
        .des {
            white-space: nowrap;
            color: #4A4A4A;
            font-size: 28px;
            margin-bottom: 40px;
        }
    }
</style>

