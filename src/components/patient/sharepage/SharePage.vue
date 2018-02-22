<template>
    <article class="bgfff h100">
        <header>
            <i></i>
            <span class="small9 fff tcenter" @click="openApp">打开应用</span>
        </header>
        <div class="content">
            <img src="../../../assets/img/sharepage/appsharebg.png">
        </div>
        <p class="big14 pleft">您的好友&emsp;<span class="maincolor">{{ docName }}</span>&emsp;邀请您加入佰医汇！</p>
        <p class="big14 pleft">邀请码 ： <span class="blacklower">{{ code }}</span></p>
        <p class="tcenter small10 maincolor" style="margin-top: 2.9rem;">填写邀请码并完成注册，您将获得10元现金红包</p>
        <footer class="base12">
            <p class="big20 blacklower">详细规则</p>
            <p style="margin-top:2rem;margin-bottom:2.46rem;">为了保障您的合法权益，请在参与邀请注册活动之前，仔细阅读本协议。</p>
            <p>一 参与方式</p>
            <p>1. 通过好友邀请，在本页面打开或下载“佰医汇”APP,在注册页面填写邀请人提供的邀请码并完成注册，邀请者和受邀者将各获得10元现金红包。</p>
            <p>2. 完成注册后需要及时进行执业认证，认证通过后可在账户内完成金额提现。</p>
        </footer>
    </article>
</template>
<script>
    export default {
        data () {
            return {
                id: this.$route.params.id,
                docName:'',
                code: ''
            }
        },
        created(){
            this.$http.get(this.$urls.GETCODE,{
                doctorId: this.id
            }).then(d=>{
                this.code  = d.code;
                this.docName = d.doc.specialName;
            })
        },
        methods: {
            openApp () {
                window.location.href = this.$store.state.android ? '/static/v2/html/app.html' : 'http://a.app.qq.com/o/simple.jsp?pkgname=com.kangxin.doctor';
            }
        }
    }
</script>
<style  scoped lang="less">
  @import '../../../assets/css/var';
  header {
      height: 2.9rem;
      width: 100%;
      background: #eee;
      position: relative;
      i{
          display: inline-block;
          height: 1.67rem;
          width: 5.16rem;
          background:url("../../../assets/img/zjh.png");
          background-size: contain;
          position:absolute;
          top:50%;
          margin-top: -.83rem;
          left: 1.2rem;
      }
      span{
          padding:.2rem 1rem;
          background:#0186d1;
          border-radius: .8rem;
          position: absolute;
          right:1.5rem;
          top:50%;
          transform:translateY(-50%);
      }
  }
  .content {
      padding-top:1.45rem;
      text-align:center;
      img {
          width: 81%;
      }
  }
      .pleft {
          padding-left: 10%;
          color: #9196a1;
          margin-top: 1.25rem;
      }
  footer {
      margin-top: 2.08rem;
      background:#f4f4f4;
      padding:1.58rem 1.83rem 3.9rem;
      color: #5d5d5d;
      p{
        line-height:1.8rem;
      }
  }

</style>
