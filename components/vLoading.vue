<!--
   desc: css3 loading动画集合
-->
<template>
    <div class="v-loading-page" v-if="type === 'dot'">
        <div class="spinner1" v-if="type === 'dot'">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
        </div>
    </div>
    <div v-else-if="type === 'roll' && spinning" class="v-roll-loading">
        <v-spin :spinning="type === 'roll' && spinning"></v-spin>
        <div class="v-tips">{{text}}</div>
    </div>
    <i v-else-if="type === 'juhua' && spinning" class="iconfont icon-loading1 v-loading-roll"></i>
</template>

<script type="text/ecmascript-6">
    export default {
        components: {
        },
        props: {
            type: {
                type: String,
                default: 'dot',
            },
            value: {
                type: Boolean,
                default: false,
            },
            text: {
                type: String,
                default: '',
            },
        },
        data() {
            return {
                spinning: this.value,
            };
        },
        watch: {
            value(r) {
                this.spinning = r;
            },
            spinning(r) {
                if (!r) {
                    this.$emit('input', r);
                }
            },
        },
        mounted() {
        },
        methods: {
        },
    };
</script>

<style lang="less" type="text/less">
    @import '../src/assets/css/animations';

    .v-roll-loading {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.5);
        .v-tips {
            font-size: 12px;
            color: #108ee9;
        }
    }
    .v-loading-roll {
        animation: rotate-loading 1000ms infinite linear;
        -moz-animation: rotate-loading 1000ms infinite linear;
        -webkit-animation: rotate-loading 1000ms infinite linear;
    }
    .v-loading-page {
        .spinner1 {
            width: 100%;
            margin: 0 auto;
            text-align: center;
            > div {
                width: 10px;
                height: 10px;
                background-color: #bfbfbf;
                
                border-radius: 100%;
                display: inline-block;
                -webkit-animation: bouncedelay 1.4s infinite ease-in-out;
                animation: bouncedelay 1.4s infinite ease-in-out;
                /* Prevent first frame from flickering when animation starts */
                -webkit-animation-fill-mode: both;
                animation-fill-mode: both;
            }
            .bounce1 {
                -webkit-animation-delay: -0.32s;
                animation-delay: -0.32s;
            }
            .bounce2 {
                -webkit-animation-delay: -0.16s;
                animation-delay: -0.16s;
            }
        }
        
        @-webkit-keyframes bouncedelay {
            0%, 80%, 100% { -webkit-transform: scale(0.0) }
            40% { -webkit-transform: scale(1.0) }
        }
        
        @keyframes bouncedelay {
            0%, 80%, 100% {
                transform: scale(0.0);
                -webkit-transform: scale(0.0);
            } 40% {
                transform: scale(1.0);
                -webkit-transform: scale(1.0);
            }
        }
    }
</style>
