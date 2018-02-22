<template>
  <router-link to="/msgcenter" class="centerImg">
    <label>
        <img src="../../assets/img/notify3x.png" alt="">
        <span v-if="count" class="small10 vux-badge" :class="{'single': count < 10}">{{count}}</span>
    </label>
  </router-link>
</template>
<script>
    export default {
        name: 'msgcount',
        created () {
            this.initData()
        },
        methods: {
            initData () {
                this.$http.get(this.$urls.GAINUNREADMSGCOUNT, {
                    openid: this.$store.state.openid
                }).then(d => {
                    this.count = d.count || 0
                })
            }
        },
        data () {
            return {
                count: 0
            }
        }
    }
</script>
<style scoped lang="less">
    @import '../../assets/css/var';
    .centerImg{
        display: inline-block;
        img{
            width: 2.2rem;
            float: left; margin-top: 3px;
        }
        .vux-badge{
            display: inline-block; font-size: 12px; text-align: center;
            margin-left: -.5rem; box-sizing: border-box;
            background: @error-color; color: #fff; height: 16px; line-height: 16px;
            border-radius: 8px; padding: 0 6px;
            background-clip: padding-box;
            vertical-align: middle;
            border-radius: .85rem;
            &.single{
                width: 16px;
                padding: 0;
            }
        }
    }
</style>
