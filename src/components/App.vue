<template>
  <div id="app">
    <section>
      <img class="logo" src="../assets/img/zjh.png">
      <hello :title="title" :subtitle="subtitle"></hello>
    </section>
    <p>
      版权归北京佰医汇信息技术有限公司所有
    </p>
  </div>
</template>

<script>
  import Hello from '@components/Hello'

  export default {
    data () {
      return {
        title: this.$route.query.title || '404 / 500',
        subtitle: this.$route.query.subtitle || '页面异常！请重试或者联系管理员。'
      }
    },
    components: {
      Hello
    }
  }

</script>

<style scoped>
  #app {
    display: -webkit-box; display: -webkit-flex; display: flex;
    -webkit-box-align: center;-webkit-align-items: center;align-items: center;
    -webkit-justify-content:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;
    height: 100%;
    color: #2c3e50;
    text-align: center;
  }
  #app section{
    margin-top: -120px;
  }
  #app a {
    color: #42b983;
    text-decoration: none;
  }

  #app p {
    position: absolute;
    bottom: 1em;
    left: 0;
    width: 100%;
  }

  .logo {
    width: 140px;
    margin: 1.5em auto;
  }
</style>