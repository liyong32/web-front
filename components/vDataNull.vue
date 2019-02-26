
<template>
    <div v-if="type === 'text'" class="v-data-null">
        <div class="v-text-div">
            <span class="ant-tag-text">暂无数据</span> 
        </div>
    </div>
    <div v-else class="v-data-null">
        <i class="iconfont icon-kong"></i>
        <p>暂无数据</p>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        components: {
        },
        props: {
            type: {
                type: String,
                default: '',
            },
        },
        data() {
            return {
            };
        },
        watch: {
        },
        filters: {
        },
        mounted() {
        },
        methods: {
        },
    };
</script>

<style lang="less" type="text/less">
    .v-data-null {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        i {
            font-size: 25px;
            color: #666;
        }
        > p {
            font-size: 14px;
        }
        .v-text-div {
            color: #f56a00;
            background: #fde3cf;
            border-color: #fde3cf;
            line-height: 20px;
            height: 22px;
            padding: 0 8px;
            border-radius: 4px;
            border: 1px solid #e9e9e9;
        }
    }
</style>
