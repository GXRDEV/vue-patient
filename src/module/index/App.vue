<template>
  <div id="app">
    <img src="../../assets/logo.png">
    <hello :title="'欢迎您'"></hello>
    <a class="routerlink" href="patient.html">患者管理系统</a>
    <router-view></router-view>
  </div>
</template>

<script>
  import Hello from '@components/Hello'
  export default {
    name: 'app',
    components: {
      Hello
    },
    data () {
      return {
        isLoading: true
      }
    }
  }
</script>

<style scoped lang="less">
  @import "../../assets/css/reset";
  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
    .routerlink{
      font-size: 20px;
      color: #41B883
    }
  }
</style>
