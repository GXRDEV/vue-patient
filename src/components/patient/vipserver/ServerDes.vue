<template>
    <div class="bgfff">
        <div style="width:100%;height:10rem;background:#eee;"></div>
        <div style="padding: 0 1rem">
            <div class="signdetail bgfff bbox relative">
                <h3 class="big18 pf-regular">签约详情</h3>
                <span class="surrender small11" @click="isMask = true">我要解约</span>
                <template v-if="type==15">
                    <p class="whitespace">
                        签约医生&ensp;
                        <i class="bgcove" :style="`background-image:url(${imgsrc(doc.listSpecialPicture)})`"></i>
                        <span class="big13">{{ doc.specialName }} </span>
                        <span>{{ doc.hosName }} {{ doc.depName }}</span>
                    </p>
                    <p>
                        签约患者&ensp;{{user.contactName}}&ensp;&ensp;{{ user.sex | sex }}&ensp;{{ user.age | age }}
                    </p>
                </template>
                <template v-if="type==14">
                    <p class="whitespace">
                        签约团队&ensp;
                        <i class="bgcove" :style="`background-image:url(${imgsrc(team.logoUrl)})`"></i>
                        <span class="big13">{{ team.teamName }}</span>
                        <span class="gray">{{ team.depName }}</span>
                    </p>
                </template>
                <p>签约时间&ensp;{{ vipDetail.signTime }}</p>
                <p>签约内容&ensp;{{ vipDetail.signType }}&ensp;<span class="gray">({{ vipDetail.packageName }} / {{ vipDetail.packageMoney }})</span></p>
                <p>服务期限&ensp;<span class="maincolor">{{ vipDetail.startTime }} 至 {{ vipDetail.endTime }}</span></p>
            </div>
            <header>
                <span v-if="type==15"> 私人医生服务说明</span>
                <span v-else>医生团队服务说明</span>
            </header>
            <Server :type="type"></Server>
        </div>
        <section class="mark fixed" v-if="isMask" @click.self="isMask=false">
            <div class="mark-box bgfff absolute">
                <p class="big15">解约服务将扣除您截止今日之前的服务费用</p>
                <p class="marginT">截止至今日 您已享用服务{{ serverMoney.serverTime }}</p>
                <p>服务费用约：<span class="maincolor">{{ serverMoney.serverMoney }}</span>元</p>
                <p>解约后将返还您约：<span class="maincolor">{{ serverMoney.returnMoney }}</span>元</p>
                <p class="marginT">退款将于3个工作日返还</p>
                <footer class="big15">
                    <span class="tcenter" @click="isMask=false">不解约</span>
                    <span class="maincolor tcenter" @click="confirmRelieve">确认解约</span>
                </footer>
            </div>
        </section>
    </div>
</template>
<script>
    import { Server } from '@components/share'
    import { sex, age, imgsrc } from '@filters'
    export default{
        components: {
            Server
        },
        filters: {
            sex,
            age
        },
        data () {
            return {
                type: this.$route.query.type,
                oid: this.$route.query.oid,
                vipDetail: {},
                doc: {},
                user: {},
                team: {},
                serverMoney: {},
                isMask: false
            }
        },
        methods : {
            imgsrc,
            confirmRelieve (){
                this.$http.get( this.$urls.RELIEVE, { orderUuid: this.oid, orderType: this.type })
                    .then(d=>{
                        if(d.status == 'success'){
                            this.$vux.toast.show({ type: 'text', text: '解约成功', position: 'top' });
                            window.setTimeout(() => {
                              this.$router.go(-1)
                            },600)
                        }
                    })

            }
        },
        created () {
            this.$http.get( this.$urls.GAINSIMPLEORDERINFO, { oid: this.oid, orderType: this.type })
                .then(d=>{
                    this.vipDetail = d.vipDetail;
                    this.doc = d.vipDetail.doc;
                    this.user = d.vipDetail.user;
                    this.team = d.vipDetail.team;
                    this.serverMoney = d.vipDetail.serverMoneyDto;
                })
        }
    }
</script>
<style lang="less" scoped>
    h3 {
        margin-bottom:1.8rem;
    }
    .surrender {
        position:absolute;
        top:1rem;
        right:1rem;
        background:#fef2f4;
        color: #d04a44;
        padding:.2rem .4rem;
    }
    .signdetail {
        width:100%;
        border-radius:.3rem;
        box-shadow:0 0 30px #ddd;
        margin-top:-8rem;
        padding: 1rem 1.5rem;
        color: #222;
        i {
            display: inline-block;
            width: 2.25rem;
            height: 2.25rem;
            border-radius: 50%;
            vertical-align: middle;
            margin-right: .8rem;
        }
        p {
            margin-bottom:1.8rem;
        }
    }
    header{
        padding: 2.3rem 0 1rem;
        text-align: center;
        span {
            display: inline-block;
            height:2.3rem;
            width:11rem;
            line-height: 2.3rem;
            color: #fff;
            background: #0186d1;
            border-radius: .3rem;
            position: relative;
            &:before ,&:after {
                   content:'';
                   position:absolute;
                   width:.4rem;
                   height:.4rem;
                   top:50%;
                   margin-top:-.2rem;
                   background: #0186d1;
                   border-radius: 9999px;
             }
            &:before{
               left:-1rem;
             }
            &:after{
               right: -1rem;
             }

        }
    }



    .mark{
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          top: 0;
          z-index: 10;
          .mark-box{
              width: 26rem;
              height: 20rem;
              box-sizing: border-box;
              border-radius: .5rem;
              top: 50%;
              margin-top: -16rem;
              left: 50%;
              margin-left: -13rem;
              padding: 2rem 1rem;
          }
          p{
              margin-bottom: .5rem;
          }
    }
    .marginT {
        margin-top: 1.2rem;
    }
    footer {
        width: 100%;
        margin-top: 2.5rem;
        span {
            float: left;
            width: 50%;
        }
    }
</style>
