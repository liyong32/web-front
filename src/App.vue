<template>
  <div class="view">
    <router-view></router-view>
  </div>
</template>
<script>
    import store from './store';

    export default {
        store,
        mounted() {
            this.$message.config({
                top: 200,
                duration: 2,
            });
        },
    };
</script>
<style scoped lang="less">
  .view{
    min-height:100%;
    height:100%
  }
</style>
<style lang="less">
  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  ::-webkit-scrollbar{
    width: 6px;
    height: 6px
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb{
    border-radius: 3px;
    background-color: rgba(0,0,0,.3);
  }

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.1);
  }
  .nowrap{
      white-space: nowrap;
  }
</style>
