<template>
    <section class="">
        <p class="title relative bgfff big16"><i @click="goback"></i>住院绿通详情<router-link to="/specialdep" class="check big13">查看特殊科室</router-link></p>
        <div class="dep bgfff">
            <header class="tcenter big15 clearfix">
                <p @click = "clickTab(1)" :class="{'selected': tabValue == 1}" class="tabs">
                    <span class="inlineblock">普通科室</span>
                </p>
                <p @click = "clickTab(2)" :class="{'selected': tabValue == 2}" class="tabs">
                    <span class="inlineblock">特殊科室</span>
                </p>
            </header>
            <template v-if="tabValue == 1">
                <dl class="bbox">
                    <dd class="relative big15">
                        <p>住院+陪诊+挂号</p>
                        <p class="big13 time">时效 <span>3-5个工作日</span></p>
                        <span class="price absolute big18">3000元</span>
                    </dd>
                    <dd class="relative big15">
                        <p>住院+陪诊+挂号<span class="common urgent small9">加急</span></p>
                        <p class="big13 time">时效 <span>1-3个工作日</span></p>
                        <span class="price absolute big18">8000元</span>
                    </dd>
                </dl>
            </template>
            <template v-else>
                <dl class="bbox">
                    <dd class="relative big15">
                        <p>住院+陪诊+挂号</p>
                        <p class="big13 time">时效 <span>5-10个工作日</span></p>
                        <span class="price absolute big18">18000元</span>
                    </dd>
                    <dd class="relative big15">
                        <p>住院+陪诊+挂号<span class="common urgent small9">加急</span></p>
                        <p class="big13 time">时效 <span>1-5个工作日</span></p>
                        <span class="price absolute big18">28000元</span>
                    </dd>
                </dl>
            </template>
        </div>
        <div class="insta bgfff big14">
            <p class="big16 ins-title">服务说明</p>
            <p class="tcenter big15 maincolor faceins">住院绿通服务说明</p>
            <div class="atten-item">
                <span>1.</span>
                <p>陪同办理诊疗及住院卡。</p>
            </div>
            <div class="atten-item">
                <span>2.</span>
                <p>预约挂号、陪同面诊、缴费、检查等院内相关就医服务，院内的挂号等收费项目客户自付。</p>
            </div>
            <div class="atten-item">
                <span>3.</span>
                <p>陪诊时间为4个小时，特殊情况再议原则是超出服务时间后80元/小时收取。</p>
            </div>
            <div class="atten-item">
                <span>4.</span>
                <p>预约时间以开出住院条为准。</p>
            </div>
            <div class="atten-item">
                <span>5.</span>
                <p>检查、化验需要按医院流程办理，如病情紧急需要加急，费用另议。</p>
            </div>
            <div class="atten-item">
                <span>6.</span>
                <p>特殊指定专家费用，根据情况另行商议。</p>
            </div>
        </div>
        <footer class="fixed bottom left right flex big15 bgfff">
            <span class="flex_2 tcenter"><img src="../../../assets/img/green/gr-kefu.png"><a href="tel:400-631-9377">咨询客服</a></span>
            <span class="flex_3 tcenter buy big17" @click="toBuy">购买服务</span>
        </footer>
    </section>
</template>
<script>
  export default {
      data (){
          return {
              tabValue: 1
          }
      },
      created (){
          this.$nextTick(() => {
              document.documentElement.scrollTop = window.pageYOffset = document.body.scrollTop = 0
          })
      },
      methods: {
          goback (){
              this.$router.go(-1);
          },
          clickTab (ind) {
              this.tabValue = ind;
          },
          toBuy (){
              this.$router.push({ path:'/buygreen' })
          }
      }
  }
</script>
<style lang="less" scoped>
    @import "../../../assets/css/var";
    .title {
        height: 3.6rem;
        line-height: 3.6rem;
        text-align: center;
        color:rgba(1,1,1,1);
        border-bottom: 1px solid #eee;
        i{
            display: inline-block;
            width: .7rem;
            height: .7rem;
            border-left: 2px solid #ccc;
            border-bottom: 2px solid #ccc;
            transform: rotate(45deg);
            position: absolute;
            left: 1.25rem;
            top: 50%;
            margin-top: -.35rem;
        }
    }
    .check {
        position: absolute;
        right: 1.25rem;
        top: 50%;
        transform: translateY(-50%);
        color: RGBA(153, 153, 153, 1);
    }
    .dep {
        header {
          color: rgba(153,153,153,1);
          border-bottom: 1px solid RGBA(238, 238, 238, 1);
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
        dl {
            padding: 0 1.2rem;
            .price { top: 50%; transform: translateY(-50%); right: 0; color: rgba(255,185,63,1); }
        }
        dd {
            padding: 1.5rem 0; color: RGBA(51, 51, 51, 1);
            & + dd {  border-top: 1px solid RGBA(229, 229, 229, 1); }
            .common { margin-left: .5rem; padding: .1rem .6rem; border-radius: .2rem;}
            .commnum { background: #f5f5f5; color: RGBA(102, 102, 102, 1); }
            .time {color:rgba(153,153,153,1); margin-top: 1.2rem;}
            .expnum { background: #cce7f6; color: @main-color; }
            .urgent { background: #ffecec; color:rgba(255,159,159,1); padding: .1rem 1rem;}
        }
    }
    .insta {
        margin-top: .83rem; padding-bottom: 8rem;
        .ins-title { border-bottom: 1px solid rgba(221,221,221,1); color:#333; height: 3.8rem; line-height: 3.8rem; padding-left: 1.25rem; }
        .faceins { margin: 1.5rem 0;}
    }
    .atten-item {
        position: relative;padding: 0 1.2rem 2rem 3rem; color: #666;
        p { line-height: 1.6; }
        span {
            position:absolute; left: 1.5rem; top:2px; color: @main-color;
            &:after {
               content: ""; display: block; position:absolute;width: .25rem; height: .9rem; background: @main-color; left:-6px; top: 2px;
             }
        }
    }
    footer {
        height: 4rem;
        line-height: 4rem;
        border-top: 1px solid #eee;
        a { color: #999; }
        .buy { background: @main-color; color: #fff; }
        img { width: 1.5rem; height: 1.625rem; margin-right: .9rem; vertical-align: middle;}
    }
</style>
