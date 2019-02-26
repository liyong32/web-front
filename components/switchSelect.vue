<!--
   desc: 滑动切换选择
-->
<template>
    <div class="v-switch-select">
        <div class="content" :class="{active: active}">
            <div class="bg-block" ref="bgBlock" :style="changeSelect"></div>
            <span :class="{active: item.value === activeValue}" :key="index" v-for="(item, index) in data" @click="activeValue = item.value">{{item.label}}</span>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        components: {
        },
        props: {
            data: {
                type: Array,
                default: () => [],
            },
            value: {
                type: [String, Number],
                default: 0,
            },
        },
        data() {
            return {
                active: false,
                activeValue: this.value,
                style: {
                    left: 0,
                },
            };
        },
        watch: {
            value(r) {
                this.activeValue = r;
            },
        },
        mounted() {
            this.$refs.bgBlock.addEventListener('transitionend', () => {
                this.$emit('input', this.activeValue);
                this.$emit('change');
            });
        },
        computed: {
            changeSelect() {
                const index = this.data.findIndex(item => item.value === this.activeValue);
                const left = index * 70;
                return { left: `${left}px` };
            },
        },
    };
</script>

<style lang="less" type="text/less">
    .v-switch-select {
        display: inline-block;
        vertical-align: middle;
        margin-bottom: 10px;
        .content {
            position: relative;
            display: flex;
            height: 28px;
            line-height: 28px;
            background-color: #fff;
            border-radius: 4px;
            border: 1px solid #d9d9d9;
            justify-content: space-between;
            overflow: hidden;
            .bg-block {
                position: absolute;
                height: 100%;
                width: 70px;
                left: 0;
                top: 0;
                background-color: #108ee9;
                z-index: 1;
                border-radius: 2px;
                transition: all .3s;
            }
            > span {
                width: 70px;
                flex-shrink: 0;
                overflow: hidden;
                text-align: center;
                position: relative;
                z-index: 2;
                font-size: 12px;
                cursor: pointer;
                transition: all .3s;
                &.active {
                    color: #fff;
                }
            }
        }
    }
</style>
