<template>
    <article class="">
        <p class="title relative bgfff big16" @click="goback"><i></i>购买服务</p>
        <dl class="bbox bgfff">
            <dd class="relative big15" v-for="(item,ind) in data">
                <div class="selectradio absolute">
                    <input type="radio" v-model="buyId" :value="item.id" :id="item.id"/>
                    <label :for="item.id"></label>
                </div>
                <p>{{ item.name }}<span class="common small9" v-for="(d, inx) in item.numType" :class="{ 'commnum':d.type == 1,'expnum': d.type == 2, 'urgent': d.type == 3 }">{{ d.numName }}</span></p>
                <p class="big13 time">时效 <span>{{ item.time }}</span></p>
                <span class="price absolute big18">{{ item.price }}元</span>
            </dd>
        </dl>
        <div class="selectdep bgfff">
            <p class="flex deptitle">
                <span class="flex_1 tleft big16 gray">科室选择</span>
                <span class="flex_1 tright big13 maincolor" @click="lookDep">查看特殊科室</span>
            </p>
            <p class="big15 grayer special">
                特殊科室<span @click="isSelected(1)" :class="{'selected': selected == 1}">是</span><span @click="isSelected(0)" :class="{'selected': selected == 0}">否</span>
            </p>
        </div>
        <div class="insta bgfff big14">
            <p class="big16 ins-title">服务说明</p>
            <p class="tcenter big15 maincolor faceins">面诊绿通服务说明</p>
            <div class="atten-item">
              <span>1.</span>
              <p>陪同办理就诊卡。</p>
            </div>
            <div class="atten-item">
              <span>2.</span>
              <p>陪同面诊、缴费、检查等院内相关就医服务，院内的挂号等收费项目客户自付。</p>
            </div>
            <div class="atten-item">
              <span>3.</span>
              <p>陪诊时间为4个小时，特殊情况再议原则是超出服务时间后80元/小时收取。</p>
            </div>
            <div class="atten-item">
              <span>4.</span>
              <p>预约时间以收到客户资料开始计时。(以医院要求资料为准)。</p>
            </div>
            <div class="atten-item">
              <span>5.</span>
              <p>指定专家服务需要按照专家在医院正常出诊时间进行预约挂号。</p>
            </div>
            <div class="atten-item">
              <span>6.</span>
              <p>检查、化验需要按医院流程办理，如病情紧急需要加急，费用另议。</p>
            </div>
            <div class="atten-item">
              <span>7.</span>
              <p>特殊指定专家费用，根据情况另行商议。</p>
            </div>
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
        <footer class="fixed bottom left flex right big20 bgfff">
            <span class="tcenter small9 flex w52">
                <div class="flex_1" style="margin-left: .5rem;">
                    <label><img src="../../../assets/img/green/gr-kefu.png"></label>
                    <span><a href="tel:400-631-9377">咨询客服</a></span>
                </div>
                <span class="flex_2 big20" style="line-height: 4rem; color: rgba(255,162,0,1);">
                    ￥{{ selectPrice }}
                </span>
            </span>
            <span class="tcenter buy big16" style="display: inline-block;width: 48%; line-height: 4rem;">立即支付</span>
        </footer>
    </article>
</template>
<script>
    export default {
        data (){
            return {
                selected: 1,
                buyId: '1',
                data: [
                    {
                        name: '陪诊+挂号',
                        id: '1',
                        time: '1-2个工作日',
                        price: '300',
                        numType: [{ type: '1', numName: '普通号'}]
                    },
                    {
                        name: '陪诊+挂号',
                        id: '2',
                        time: '5个工作日后',
                        price: '500',
                        numType: [{ type: '2', numName: '专家号'}]
                    },
                    {
                        name: '陪诊+挂号',
                        id: '3',
                        time: '1-3个工作日',
                        price: '800',
                        numType: [{ type: '2', numName: '专家号'},{ type: '3', numName: '加急'}]
                    }
                ]
            }
        },
        created (){
            this.$nextTick(() => {
                document.documentElement.scrollTop = window.pageYOffset = document.body.scrollTop = 0
            })
        },
        computed :{
            selectPrice (){
                return this.data.filter(item=>{
                      return item.id == this.buyId
                })[0].price
            }
        },
        methods: {
            goback (){
                this.$router.go(-1)
            },
            lookDep (){
                this.$router.push({ path: '/specialdep'})
            },
            isSelected (ind){
                this.selected = ind
            }
        }
    }
</script>
<style lang="less" scoped>
    @import "../../../assets/css/var";
    .gray { color: #333; }
    .grayer { color: rgba(102,102,102,1);}
    .w52 { width: 52%;}
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
    dl {
        padding: 0 1.2rem; margin-bottom: .8rem;
        .price { top: 50%; transform: translateY(-50%); right: 0; color: rgba(255,185,63,1);}
    }
    dd {
        padding: 1.5rem 0; color: RGBA(51, 51, 51, 1);
        padding-left: 2.8rem;
        & + dd {  border-top: 1px solid RGBA(229, 229, 229, 1); }
        .common { margin-left: .5rem; padding: .1rem .6rem; border-radius: .2rem;}
        .commnum { background: #f5f5f5; color: RGBA(102, 102, 102, 1); }
        .time {color:rgba(153,153,153,1); margin-top: 1.2rem;}
        .expnum { background: #cce7f6; color: @main-color; }
        .urgent { background: #ffecec; color:rgba(255,159,159,1); padding: .1rem 1rem;}
    }
    .selectradio {
        top: 50%;
        left: -1.2rem;
        margin-top: -.75rem;
    }
    input[type="radio"]{
      opacity:0;
    & ~ label{
          display: inline-block;
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          background: url('../../../assets/img/team/checkteam.png') center no-repeat;
          background-size: cover
        }
    &:checked ~ label{
       display: inline-block;
       width: 1.5rem;
       height: 1.5rem;
       background: url('../../../assets/img/team/checkedteam.png') center no-repeat;
       background-size: cover;
       border-radius: 50%;
     }
    }
    .selectdep {
        margin-bottom: .8rem;
      .deptitle { padding: 1.2rem; border-bottom: 1px solid #eee; }
    }
    .special {
        height: 5rem; line-height: 5rem; padding-left: 1.2rem;
        span { border: 1px solid #999; color: #999; padding: .6rem 1.2rem; border-radius: 2rem; font-size: 1.167rem; margin-left: 2rem;}
        .selected { border: 1px solid @main-color; color: #fff; background: @main-color;}
    }
    .insta {
        padding-bottom: 5rem;
        .ins-title { border-bottom: 1px solid rgba(221,221,221,1); color:#333; height: 3.8rem; line-height: 3.8rem; padding-left: 1.25rem; }
        .faceins { margin: 1.5rem 0;}
    }
    .atten-item {
        position: relative; padding: 0 1.2rem 2rem 3rem; color: #666;
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
        label { .dflex();}
        img {
          width: 1.33rem;
          height: 1.33rem;
          margin:.5rem auto;
        }
        span {
            line-height:1;
            display:block;
        }
    }
</style>
