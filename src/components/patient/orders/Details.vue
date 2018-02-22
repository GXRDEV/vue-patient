<template>
    <div class="flex column h100">
        <div class="flex_1 scroll">
            <div class="flex orderstates relative">
                <span class="flex_1 whitespace">
                    <span class="big14">{{ allStatus[ostate] }}</span>&emsp;
                    <span class="small11 fff" v-if="ostate==20 && leaveTime">
                        <span v-if="!askIsBegin && otype=='4'">
                            距离视频问诊开始时间还有
                            <count-down class="bluecolor" v-model="leaveTime" format="hh小时mm分"></count-down>
                        </span>
                    </span>
                </span>
                <span class="fff whitespace">
                    <span v-if="ostate==30">{{refusalReason}}<span v-if="!nopay && otype!='11'">诊费将在3个工作日内退还</span></span>
                    <span v-else-if="ostate==50">已取消问诊<span v-if="!nopay && otype!='11'">，诊费将在3个工作日内退还</span></span>
                </span>
            </div>
            <section v-if="otype=='4'||(otype=='11'&& relativeType=='4')">
                <p>会诊时间</p>
                <p class="big18 strong">{{patient.time || '暂无'}}</p>
                <div style="padding-top:1rem;">会诊地点</div>
                <div class="whitespace big13">{{patient.position || '暂无'}}</div>
                <div class="maincolor big13">提示:请提前2小时到达会诊现场</div>
            </section>
            <div class="exphead">
                <div style="padding:1rem 0;">会诊信息</div>
                <div class="flex" style="padding:0 1rem 1rem 0;">
                    <div @click="expLink" class="exprouter flex_1">
                        <span>会诊专家</span>
                        <item-flex-img class="acenter" :img="exp.headImage" style="padding: 1.125rem 1.25rem 1.125rem .8rem;background:#f9fafa;height:3.5rem;" radius="50%" size="2rem">
                            <p>
                                <span class="big13 whitespace">
                                    <span class="big16" v-if="exp.docName">{{exp.docName}}</span>
                                    <span class="big16" v-else>待分配</span>
                                    <span class="duty small11">{{ exp.duty }}</span>
                                </span>
                                <span v-if="exp.hosName || exp.depName" class="small11 whitespace">{{exp.hosName}} &ensp; {{exp.depName}}</span>
                            </p>
                        </item-flex-img>
                    </div>
                    <div  @click="docLink" class="exprouter flex_1">
                        <span class="applydoc">申请医生</span>
                        <item-flex-img class="acenter" :img="doc.headImage" style="padding: 1.125rem 1.25rem 1.125rem .8rem;background:#f9fafa;height:3.5rem;" radius="50%" size="2rem">
                            <p>
                                <span class="big13 whitespace">
                                    <span class="big16" v-if="doc.docName">{{doc.docName}}</span>
                                    <span class="big16" v-else>待分配</span>
                                    <span class="duty small11">{{ doc.duty }}</span>
                                </span>
                                <span v-if="doc.hosName || doc.depName" class="small11 whitespace">{{doc.hosName}} &ensp; {{doc.depName}}</span>
                            </p>
                        </item-flex-img>
                    </div>
                </div>
                <div class="money" v-if="ostate<30 && nopay && exp.docId">
                    <p>费用</p>
                    <span class="maincolor">{{ price }} </span>元
                    <span @click="toPay" class="gotopay">去支付</span>
                </div>
            </div>
            <section>
                <p>就诊人</p>
                <p>
                    <i class="patientthumb bgcove radius50" :style="`background-image:url(${imgsrc(cinfo.headImageUrl)})`"></i>
                    &ensp;{{cinfo.contactName}}&ensp;{{cinfo.sex | sex}}&ensp;{{cinfo.age | age}}
                </p>
                <div style="padding-top:1rem;">病历信息</div>
                <p class="whitespace graycolor">
                    {{ mainSuit ||'暂无描述' }}
                </p>
                <div class="tright" @click="toLook">
                    <span class="records big13">查看完整病历</span>
                </div>
            </section>
            <section class="tright applydetail" v-if="relativeId" @click="toChat">
                <span class="maincolor base12">查看会诊申请详情<i class="arrow"></i></span>
            </section>
        </div>
        <footer v-if="ostate==40">
            <router-link class="showteaminfo" :to="{ path: '/opinion/' + oid + '/' + otype }">
                <span class="infoleft">会诊结束后，专家将给出详细的会诊报告</span>
                <span class="inforight">查看报告<i class="arrow"></i></span>
            </router-link>
        </footer>
        <footer class="tcenter tipforstaus" v-if="ostate==30 || ostate==50">
            <span>当前订单{{ ostate==30 ? '已退诊' : '已取消' }}</span>
        </footer>
    </div>
</template>
<script>
    import { XButton } from 'vux'
    import { imgsrc, age, sex, link } from '@filters'
    import { ImgList, CountDown, ItemFlexImg } from '@components/share'
    import goeasy from '@mixins/goeasy'

    export default{
        components: {
             XButton, CountDown, ItemFlexImg
        },
        filters: {
            age, sex, link
        },
        data () {
            return {
                oid: this.$route.query.oid,
                otype: this.$route.query.otype,
                allStatus: this.$store.state.orderState,
                nopay: false,
                askIsBegin: false,
                ostate: 0,
                leaveTime: 0,
                exp: {},
                doc: {},
                patient: {},
                cinfo: {},
                price:'',
                timer: +new Date(),
                relativeId:'',
                relativeType:'',
                mainSuit:'',
                refusalReason:''
            }
        },
        mixins: [goeasy],
        created () {
            this.gainOrderInfo()
        },
        methods: {
            imgsrc,
            refresh (key) {
                key.indexOf(':') != -1 && this.gainOrderInfo()
            },
            gainOrderInfo () {
                this.$http.get(this.$urls.GAINSIMPLEORDERINFO, { 
                    oid: this.oid, orderType: this.otype 
                }).then(d => {
                    let currTime = +new Date()
                    let receiveTime = +new Date((d.receiveTime + '') .indexOf('-') != -1 ? d.receiveTime : parseInt(d.receiveTime || 0, 10))
                    let timeDual = d.timeDual || 0
                    let endTime = receiveTime + timeDual * 60000

                    this.ostate = d.status
                    this.nopay = d.payStatus == 4
                    this.refusalReason = d.refusalReason;
                    this.relativeId = d.relativeUuid
                    this.relativeType = d.relativeType

                    if (currTime < receiveTime) {
                        this.askIsBegin = false
                        this.leaveTime = parseInt((receiveTime - currTime) / 1000, 10)
                    }
                })

                this.$http.get( this.$urls.GAINVEDIOINFO, { 
                    oid: this.oid, otype: this.otype 
                }).then((d) => {
                    this.patient = d || {}
                    this.cinfo = d.uinfo || d.cinfo ||{}
                    this.doc = d.doc || {}
                    this.exp = d.exp || {}
                    this.price = d.payMoney
                    this.mainSuit = d.cinfo.mainSuit
                })
            },
            toPay () {
                this.$router.replace({path: '/pay',query: { oid: this.oid, otype: this.otype }})
            },
            toLook(){
               this.$router.push({path: '/supply/'+this.timer,query: { from: this.$route.fullPath, oid:this.oid, otype:this.otype, ostate:this.ostate }})
            },
            toChat(){
                this.$router.push({path: '/chat',query: { oid: this.relativeId, otype: this.relativeType }})
            },
            docLink(){
                this.$router.push(this.doc.docId ? { path: '/docinfo/'+ this.doc.docId }: this.$route.fullPath)
            },
            expLink(){
                this.$router.push(this.exp.docId ? { path: '/docinfo/'+ this.exp.docId }: this.$route.fullPath)
            }
        }
    }
</script>
<style lang="less" scoped>
    @import '../../../assets/css/var';
    .graycolor {
        color: #9196a1;
    }
    .arrow {
      display: inline-block;
      width: .5rem;
      height: .5rem;
      border-top: 1px solid #0086d1;
      border-right: 1px solid #0086d1;
      transform: rotate(45deg);
    }
    .showteaminfo{
        display: block;
        background: #fff;
        border-top: 1px solid #eee;
        .infoleft {
            display: inline-block;
            width: 75%;
            height: 3rem;
            background: @main-color;
            color: #fff;
            text-align: center;
            line-height: 3rem;
        }
        .inforight{
            display: inline-block;
            color: #222;
            margin-left: 1rem;
        }

    }
    .orderstates{
        background: #9196a1;
        color: #fff;
        padding: 0.7rem @body-margin;
        &:before {
            .setBottomLine(#ddd);
        }
    }
    .exphead{
        padding-left: 1rem;
        background: #fff;
        margin-bottom: 0.5rem;
        box-sizing: border-box;
        .exprouter {
            box-sizing: border-box;
            background: #f9fafa;
            position: relative;
            color: #222;
            width: 48%;
            display: inline-block;
            border-radius: .2rem;
            >span {
                 position :absolute;
                 top: -.7rem;
                 right: .3rem;
                 font-size: .9rem;
                 color: #fff;
                 background: @main-color;
                 padding: .1rem .4rem;
                 border-radius: .3rem;
                 z-index: 10;
             }
            p{
              line-height: 1.5rem;
            & > span{
                  display: block;
                }
            }
            .duty{
                color: #9196a1;
            }
           .applydoc {
                background: #9196a1;
           }
            & + .exprouter {
                  margin-left: .6rem;
            }
        }

        .money {
            min-height: 2rem;
            border-top: 1px solid #eee;
            margin-top: 1rem;
            padding: 1rem 1rem 1rem 0;
            p {
                padding-bottom: 1rem;
            }
            .gotopay {
                float: right;
                border: 1px solid @warn-color;
                color: @warn-color;
                padding: .1rem .6rem;
                border-radius: 1rem;
            }
        }
    }
    .records {
        color: @main-color;
        border: 1px solid @main-color;
        border-radius: 1rem;
        padding: .2rem .7rem;
    }
    .patientthumb {
        display: inline-block;
        height: 2rem;
        width: 2rem;
        vertical-align: middle;
    }
    section{
        margin-bottom: 0.5rem;
        background: #fff;
        padding:  .5rem 1rem 1.25rem;
        font-size:  1rem;
        div {
            padding: .3rem 0;
        }
        p{
            position: relative;
            line-height: 1;
            padding: 1rem 0;
            box-sizing: border-box;
            word-wrap: break-word;
            word-break: break-all;
            .small11{ margin-right: 1.6rem; display: inline-block; min-width: 4.6em;}
            & + p{
                  padding-top:0;
                &:after{
                    .setBottomLine(#eee)
                }
            }
        }
    }
    .tipforstaus{
        height: 3rem;
        background: @main-color;;
        line-height: 3rem;
        color: #fff;
    }
    .applydetail {
        box-sizing: border-box;
        line-height: 4.4rem;
        height: 4.4rem;
        padding: 0;
        padding-right: 1rem;
    }
</style>
