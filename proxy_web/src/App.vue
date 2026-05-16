<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>



<script>
    export default {
        name: 'app'
    }
</script>

<style>
  /* CSS */
  html,body,#app{
    height: 100%;
  }
  .ivu-collapse-header {
    height: 44px!important;
    line-height: 44px!important;
  }

  /*.ivu-form-item{*/
    /*margin-bottom: 5px !important;*/
  /*}*/
</style>
