<template>
  <div id="patientApp" class="h100vh" :class="{'androidcls':$store.state.android }">
      <!-- <navigation> -->
        <router-view />
      <!-- </navigation> -->
      <loading v-model="loading"></loading>
  </div>
</template>
<script>
  import { Loading } from 'vux'
  import { mapState } from 'vuex'

  export default {
    components: {
      Loading
    },
    watch: {
      isLoading () {
        this.loading = this.isLoading
      }
    },
    beforeCreate () {
      (function () {
          function o() {
              document.documentElement.style.fontSize = parseInt((document.documentElement.clientWidth > 414 ? 414 : document.documentElement.clientWidth) * 13 / 375) + "px"
          }
          var e = null;
          window.addEventListener("resize", function () {
              clearTimeout(e), e = setTimeout(o, 100)
          }, !1), o()
      })(window);
    },
    mounted () {
      this.loading = this.isLoading
    },
    computed: {
      ...mapState({
        isLoading: state => state.vux.isLoading
      })
    },
    data () {
      return {
        loading: true
      }
    }
  }
</script>
<style lang="less">
  @import "../../assets/font/iconfont.css";
  @import "../../assets/css/reset";
  @import "../../assets/css/main";
</style>
