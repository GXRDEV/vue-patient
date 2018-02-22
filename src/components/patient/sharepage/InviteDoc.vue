<template>
    <article class="bgfff flex column h100">
        <header><i></i></header>
        <div class="content flex_1">
            <p class="relative">
                <span class="join">邀请同行加入</span>
                <a class="base12 maincolor" @click="rule = true">查看详细规则></a>
            </p>
            <p class="big18 blacklower" style="margin-top:1rem; margin-bottom:1.6rem;">您将获得<span class="warncolor">10元</span>现金红包</p>
            <p class="big14" style="color:#9196a1;">您的邀请码： <span class="blacklower">{{ code }}</span></p>
        </div>
        <div class="tcenter" style="margin-bottom: 2.6rem;">
            <img class="appword" src="../../../assets/img/sharepage/appword.png">
        </div>
        <rule v-model="rule" title="邀请好友">
            <div class="small11 rule">
                <p style="margin-bottom:2rem;">为了保障您的合法权益，请在参与邀请注册活动之前，仔细阅读本协议。</p>
                <p>一 参与方式</p>
                <p>1. 通过好友邀请，在本页面打开或下载“佰医汇”APP,在注册页面填写邀请人提供的邀请码并完成注册，邀请者和受邀者将各获得10元现金红包。</p>
                <p>2. 完成注册后需要及时进行执业认证，认证通过后可在账户内完成金额提现。</p>
            </div>
        </rule>
    </article>
</template>
<script>
    import { Rule } from '@components/share'
    export default {
        components: {
            Rule
        },
        data () {
            return {
                id:this.$route.params.id,
                code:'',
                rule:false
            }
        },
        created(){
            this.$http.get(this.$urls.GETCODE,{ doctorId: this.id })
                .then(d=>{
                    this.code  = d.code;
                })
        }
    }
</script>
<style scoped lang="less">
  @import '../../../assets/css/var';
  header {
      width: 100%;
      background:url("../../../assets/img/sharepage/appinvitebg.png");
      background-size: 100% 100%;
      position: relative;
      background-repeat: no-repeat;
      &:after {
             content:"";
             display:block;
             padding:44%;
       }
      i {
          display: inline-block;
          width: 6.875rem;
          height: 2.4rem;
          background:url("../../../assets/img/sharepage/invitebglogo.png");
          background-size: contain;
          position:absolute;
          top:.83rem;
          left: 1.25rem;
      }
  }
  .content {
      padding: 0 1rem;
      margin-top: -5rem;
      .join {
          font-size: 2.3rem;
          color: #222;
      }
      a {
          text-decoration: underline;
          position: absolute;
          bottom: .5rem;
          right:1rem;
      }
  }
  .appword {
      width:20.08rem;
  }
  .rule p{
      line-height: 2rem;
  }
</style>
