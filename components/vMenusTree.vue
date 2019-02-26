<!--
   desc: 侧边栏菜单树
-->
<template>
    <div class="page">
        <Tree :data="treeData" node-key="path" show-checkbox ref="treeSelect" @check-change="checkChange" :default-expand-all="true"></Tree>
    </div>
</template>

<script type="text/ecmascript-6">
    import {
        mapState,
    } from 'vuex';
    import {
        Tree,
    } from 'element-ui';

    export default {
        components: {
            Tree,
        },
        computed: {
            ...mapState({
                fullMenu: state => state.fullMenu,
            }),
        },
        data() {
            return {
                treeData: [],
            };
        },
        watch: {},
        mounted() {
            this.getTree();
        },
        methods: {
            selectFn() {},
            checkFn() {},
            checkChange(res) {
                this.$emit('check-change', res);
            },
            getTree() {
                const tree = {
                    children: this.fullMenu,
                };
                const getNode = (nodeObj) => {
                    const node = [];
                    const arr = nodeObj.children || [];
                    arr.forEach((item) => {
                        if (item.name !== '首页') {
                            const res = {
                                label: item.name,
                                path: item.link ? item.link.path : item.name,
                                children: item.children,
                            };
                            getNode(res);
                            node.push(res);
                        }
                    });
                    nodeObj.children = node;
                };
                getNode(tree);
                this.treeData = tree.children;
            },
        },
    };
</script>

<style lang="less" type="text/less">

</style>
