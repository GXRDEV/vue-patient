<template>
    <article>
        <div class="container bbox bgfff relative">
            <i class="title absolute"></i>
            <p class="price bluecolor absolute">挂号(预约专家) <span class="redcolor">200<i class="md-font">元起</i></span>&nbsp;&nbsp;陪诊服务 <span class="redcolor">300<i class="md-font">元起</i></span></p>
            <img src="../../../assets/img/green/gr-title-bg.png" class="w100">
        </div>
        <div class="bbox help bgfff">
           <div class="bbox help-con big13">
              <p class="maincolor big15" style="margin-bottom: 1rem;">北上广就医绿通申请能帮您做什么?</p>
              <p class="help-text"><img src="../../../assets/img/green/gr-icon-heart.png">帮您快速接受北上广名院专家的治疗服务</p>
              <p class="help-text"><img src="../../../assets/img/green/gr-icon-heart.png">帮您在患病时有专人安排就医、住院及手术服务</p>
              <p class="help-text"><img src="../../../assets/img/green/gr-icon-heart.png">帮您提供完善的专家复诊服务，追踪治疗效果</p>
           </div>
        </div>
        <div class="select bbox bgfff base12">
            <p class="tcenter big17 graycolor s-title">为什么要选择我们的绿通服务？</p>
            <div class="flex big14" style="height: 3rem; line-height: 3rem;">
                <span class="flex_1 tcenter lightblue"></span>
                <span class="flex_3 tcenter lighterblue margin-b">大部分绿通服务</span>
                <span class="flex_3 tcenter moreblue maincolor margin-b">我们的绿通服务</span>
            </div>
            <div class="flex" style="height: 9rem; ">
                <span class="flex_1 tcenter lightblue" style="line-height: 9rem;">诊前</span>
                <span class="flex_3 tcenter lighterblue" style="line-height: 9rem;">体检、导诊、问诊</span>
                <span class="flex_3 tcenter moreblue maincolor" style="padding-top:6%; line-height: 2;">体检、导诊、问诊<br/>辅助检查、基因检查<br/>二次诊疗意见</span>
            </div>
            <div class="flex" style="height: 10.8rem; ">
                <span class="flex_1 tcenter lightblue" style="line-height: 10.8rem;">诊中</span>
                <span class="flex_3 tcenter lighterblue" style="padding-top: 9%; line-height: 2;">专家门诊、专家病房<br/>专家手术、检查加急<br/>靶向检测</span>
                <span class="flex_3 tcenter moreblue maincolor" style="padding-top: 2%; line-height: 2;">远程视频/图文会诊<br/>医生团队VIP服务<br/>送药到家、专家飞到<br/>北上广名院入院治疗<br/>就医陪同/护理</span>
            </div>
            <div class="flex" style="height: 9rem; ">
                <span class="flex_1 tcenter lightblue" style="line-height: 9rem;">诊后</span>
                <span class="flex_3 tcenter lighterblue" style="line-height: 9rem;">复诊、随诊</span>
                <span class="flex_3 tcenter moreblue maincolor" style="padding-top:9%; line-height: 2;">医生团队复诊、专家随访<br/>康复计划、健康管理</span>
            </div>
        </div>
        <div class="facegreen bgfff">
            <p class="flex fa-title"><span class="flex_1 tleft big16" style="color: #343232;">面诊绿通</span><router-link to="/facedetail" class="flex_1 tright big13 maincolor">查看详情</router-link></p>
            <dl class="big14">
                <dd class="clearfix"><span class="fleft">陪诊+挂号</span><span class="fright big15 yellowcolor">300<span class="small11">元起</span></span></dd>
                <dd class="clearfix"><span class="fleft">陪诊+加急挂号</span><span class="fright big15 yellowcolor">500<span class="small11">元起</span></span></dd>
                <dd class="clearfix"><span class="fleft">陪诊+指定专家</span><span class="fright big15 yellowcolor">500<span class="small11">元起</span></span></dd>
                <dd class="clearfix"><span class="fleft">陪诊+指定专家+加急</span><span class="fright big15 yellowcolor">800<span class="small11">元起</span></span></dd>
            </dl>
        </div>
        <div class="hosgreen bgfff facegreen">
            <p class="flex fa-title"><span class="flex_1 tleft big16" style="color: #343232;">住院绿通</span><router-link to="/hosdetail" class="flex_1 tright big13 maincolor">查看详情</router-link></p>
            <dl class="big14">
                <dd class="clearfix"><span class="fleft">挂号+陪诊+住院</span><span class="fright big15 yellowcolor">3000<span class="small11">元起</span></span></dd>
                <dd class="clearfix"><span class="fleft">挂号+陪诊+住院+加急</span><span class="fright big15 yellowcolor">8000<span class="small11">元起</span></span></dd>
                <dd class="clearfix"><span class="fleft"><span class="specail small11">特殊科室</span>挂号+陪诊+住院</span><span class="fright big15 yellowcolor">18000<span class="small11">元起</span></span></dd>
                <dd class="clearfix"><span class="fleft"><span class="specail small11">特殊科室</span>挂号+陪诊+住院+加急</span><span class="fright big15 yellowcolor">28000<span class="small11">元起</span></span></dd>
            </dl>
        </div>
        <div class="tab-main bgfff">
            <header class="tcenter big15 clearfix">
                <p class="selected tabs">
                    <span class="inlineblock">产品特色</span>
                </p>
                <p @click = "toPro" class="tabs">
                    <span class="inlineblock">流程说明</span>
                </p>
            </header>
            <div class="content-item tcenter">
                <p class="big17 item-title">陪诊服务</p>
                <p class="big14 item-sub">专人全程陪同就医，免去奔波，高效省心</p>
                <p class="tcenter w100">
                    <img src="../../../assets/img/green/gr-img1.png" style="width: 76%; margin-bottom: 2.5rem;">
                </p>
            </div>
            <div class="content-item tcenter">
                <p class="big17 item-title">住院绿通</p>
                <p class="big14 item-sub">北上广名院资源全面覆盖，随时住院治疗</p>
                <p class="tcenter w100">
                    <img src="../../../assets/img/green/gr-img2.png" style="width: 76%; margin-bottom: 2.5rem;">
                </p>
            </div>
            <div class="content-item tcenter">
                <p class="big17 item-title">检查绿通</p>
                <p class="big14 item-sub">对医院检查项目进行加急检查，开启绿通</p>
                <p class="tcenter w100">
                    <img src="../../../assets/img/green/gr-img3.png" style="width: 82%; margin-bottom: 2.5rem;">
                </p>
            </div>
            <div class="content-item tcenter">
                <p class="big17 item-title">面诊绿通</p>
                <p class="big14 item-sub">轻松预约北上广名院专家，接受治疗</p>
                <p class="tcenter w100">
                    <img src="../../../assets/img/green/gr-img4.png" style="width: 74%; margin-bottom: 2.5rem;">
                </p>
            </div>
            <div class="content-item tcenter">
                <p class="big17 item-title">专家复诊</p>
                <p class="big14 item-sub">快速调动专业资源、权威医疗体系追踪治疗</p>
                <p class="tcenter w100" style="border-bottom: .8rem solid #eee;">
                    <img src="../../../assets/img/green/gr-img5.png" style="width: 78.4%; margin-bottom: 2.5rem;">
                </p>
            </div>
            <p class="flex fa-title" id="process" style="margin-bottom: 1.25rem;"><span class="flex_1 tleft big16" style="color: #343232;">流程说明</span><router-link to="/servicenotice" class="flex_1 tright big13 maincolor">服务须知</router-link></p>
            <div class="atten-item">
                <span>1.</span>
                <p>咨询准备</p>
                <p>有意向请提前电话沟通客服专员，专线电话为: 400-631-9377（时间为工作时间早9:00--17:00）特殊时段或者特殊情况可电话18311267361安排处理，半小时内确定安排是否可安排业务，确定后请提交业务申请信息表。</p>
            </div>
            <div class="atten-item">
                <span>2.</span>
                <p>提交申请</p>
                <p>申请表发送 kefu@ebaiyihui.com, 负责人收到业务申请表以后，2小时内，我司客服专员会与客户电话联系，核对客户信息，告知需要的就医资料和证件，根据需要提供的具体业务，按时间安排服务。</p>
            </div>
            <div class="atten-item">
                <span>3.</span>
                <p>确认下单</p>
                <p>如果您选择的就诊日期，医生停诊或者其他原因无法完成就医预约，我们会第一时间跟您协商最近的就诊日期。</p>
            </div>
            <div class="atten-item">
                <span>4.</span>
                <p>门诊预约</p>
                <p>完成约定面诊时间后，客服专员会电话告知客户。</p>
            </div>
            <div class="atten-item">
                <span>5.</span>
                <p>医院就诊</p>
                <p>就医安排成功后，就医专员再次致电患者，安排就诊交接，就诊服务分为两种情况：</p>
                <p>
                    <i class="abstyle">A、需要陪诊：</i>
                    陪诊专员在约定地点跟患者见面陪同患者完成就医全程（4个小时），包括陪同候诊当次取结果，取药等，如须延长陪诊时间需要另行收费。
                </p>
                <p>
                    <i class="abstyle">B、患者自行就诊：</i>
                    提供轻陪诊，陪诊专员在约定地点跟患者见面，把证件和就诊号条交接给患者，带患者到诊室门口，患者自行就医，服务结束。
                </p>
            </div>
            <div class="atten-item">
                <span>6.</span>
                <p>服务追踪</p>
                <p>完成面诊以后，客服回访客户，了解整个服务质量，每月底反馈给客户渠道。</p>
            </div>
        </div>
        <footer class="fixed bottom left right flex big15 bgfff">
              <span class="flex_2 tcenter"><img src="../../../assets/img/green/gr-kefu.png"><a href="tel:400-631-9377">咨询客服</a></span>
              <span class="flex_3 tcenter buy big17" @click="toBuy">购买服务</span>
        </footer>
    </article>
</template>
<script>
    export default {
        name: 'greenapply',
        data (){
            return {

            }
        },
        created (){

        },
        methods: {
            toBuy (){
                this.$router.push({ path:'/buygreen' })
            },
            toPro (){
                let proId = document.getElementById('process');
                let proTop = proId.offsetTop;
                return window.scrollTo(0, proTop);
            }

        }
    }
</script>
<style lang="less" scoped>
    @import '../../../assets/css/var';
    .container { padding: 6.085rem 2.915rem 0;}
    .redcolor { color: #ff6060; }
    .bluecolor { color: #7aa0fa; }
    .graycolor { color: #565455;}
    .yellowcolor { color: rgba(255,168,0,1); }
    .lightblue { background-color: #e5f5fd; color: rgba(102,102,102,1);}
    .lighterblue { background-color: #f2fafe; color: rgba(153,153,153,1);}
    .moreblue { background-color: #e5f5fd;}
    .md-font { font-size: 1.04rem; font-style: normal;}
    .margin-b { margin-bottom: 2px; }
    .title {
        top: 2.625rem; left: 50%; display: block; width: 90%; transform: translateX(-50%);
        background-image: url(../../../assets/img/green/gr-banner.png); background-repeat: no-repeat; background-size: 100% 100%;
    }
    .title:after {  content: ""; display: block; padding: 14.2%;  }
    .price {
        width: 90%; top: 11.6rem; font-size: 1.335rem; background: -webkit-linear-gradient(#ffeb67, #ffed76);
        padding: .5rem 0; left:50%; transform: translateX(-50%); text-align: center; border-radius: 4rem;
    }
  .help { padding: .5rem 1rem 2rem;}
  .help-con {
      padding: 1.3rem ; box-shadow: 0 0 20px 0 RGBA(69, 81, 100, 0.2); border-radius: .21rem;
      .help-text {
          color: #565455 ;
          line-height: 2.5rem ;
      }
      img {
          width: .83rem; vertical-align: middle;margin-right: .5rem;
      }
    }
  .select {
      padding: 1.5rem 1rem 4rem;
      .s-title { margin-bottom: 1.5rem;}
  }
  .facegreen {
      margin-top: .83rem;
      dl { padding: 0 1rem; color: rgba(102,102,102,1); }
      dd { padding: 1.16rem 0; border-bottom: 1px solid #eee; }
  }
  .fa-title { padding: 1.2rem 1rem; border-bottom: 1px solid #eee; }
  .hosgreen {
      .specail { background-color: #ffecec; padding: .2rem .5rem; color: rgba(255,159,159,1); border-radius: .3rem; margin-right: .5rem;}
  }
  .tab-main {
      margin-top: .83rem;
      padding-bottom: 4rem;
      header {
        color: rgba(153,153,153,1);
        border-bottom: 1px solid rgba(221,221,221,1);;
      }
      .tabs{
          width: 50%;
          float: left;
          span{
            line-height: 3.33rem;
          }
      }
      .selected{
          span{
              color: @main-color;
              position: relative;
              &:after {
                 content:"";
                 display: block;
                 position: absolute;
                 bottom: 0;
                 left: 6px;
                 width: 4rem;
                 height: 2px;
                 background: @main-color;
               }
          }
      }
  }
  .content-item {
      .item-title {
          margin: 3.125rem 0 1rem; position: relative; color:rgba(85,85,85,1);
          &:before, &:after {
              content: ""; position: absolute; width: 3.75rem; height: 1px; background: rgba(255,200,105,1);opacity: 0.5;display: block; top: 50%;
          }
          &:before { left: 25%; }
          &:after { right: 25%; }
      }
      .item-sub { color:rgba(153,153,153,1); margin-bottom: 3.125rem; }
  }
  footer {
      height: 4rem;
      line-height: 4rem;
      border-top: 1px solid #eee;
      a { color: #999; }
      .buy { background: @main-color; color: #fff; }
      img { width: 1.5rem; height: 1.625rem; margin-right: .9rem; vertical-align: middle;}
  }
  .atten-item {
      padding: 0 2.5rem 3rem 3rem; font-size: 1.165rem; color: #666; position: relative;
      p {
          line-height: 2rem; word-break:break-all;
          &:first-of-type {
             font-size: 1.25rem!important; color: #333 !important;
           }
      }
      span {
          position:absolute; left: 1.5rem; top: .5rem; color: @main-color;
          &:after {
              content: ""; display: block; position:absolute;width: .25rem; height: .9rem; background: @main-color; left:-6px; top: 2px;
           }
      }
      .abstyle { font-style: normal; color: #444; }
  }
</style>
