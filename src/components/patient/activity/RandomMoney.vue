<template>
    <article class="randommoney">
        <span class="money-btn" @click="getRed"></span>
        <div class="moneyinfo" v-if="datas.length">
            <p class="title big16 tcenter">中奖信息</p>
            <dl>
                <dd class="flex acenter" v-for="(item,ind) in datas" :key="ind">
                    <i class="bgcove" :style="`background-image:url(${imgsrc(item.headImageUrl,'user')})`"></i>
                    <div class="flex_1 ohidden relative">
                        <p class="username blacklower whitespace big14">{{ item.userName }}</p>
                        <p class="small10 gray">{{ item.timeStr | formatDT('yyyy年MM月dd日 hh:mm:ss') }}</p>
                    </div>
                    <span class="redcolor big14">{{ item.grapMoney }}元</span>
                </dd>
            </dl>
        </div>
        <section class="mark w100vw h100vh fixed top left" v-if="isMask">
            <div class="maskmain">
                <div class="main w100">
                    <img class="w100" src="../../../assets/img/activity/redpacket.png">
                    <p class="message big18 tcenter redcolor">
                        <template v-if="code == '001'">
                            <span class="common">恭喜您抢到</span><br>
                            <span class="big21">{{ money }}<span class="base12">元</span></span>
                        </template>
                        <template v-if="code =='002'">
                            <span class="common">您已领取过红包</span><br>
                            <span class="big16">不能重复领取</span>
                        </template>
                        <template v-if="code == '003'">
                          <span class="common">很遗憾</span><br>
                          <span class="big16">您没有抢到红包</span>
                        </template>
                    </p>
                </div>
                <span class="maskbtn" @click="isMask=false"></span>
            </div>
        </section>
    </article>
</template>
<script>
    import { imgsrc, formatDT } from '@filters'
    export default {
        data () {
            return {
                datas: [],
                openid: this.$store.state.openid,
                money: '',
                code: '',
                isMask: false,
                uuid: this.$route.params.uuid
            }
        },
        filters: {
            formatDT
        },
        created () {
            this.getDatas();
        },
        methods: {
            imgsrc,
            getDatas (){
                this.$http.get(this.$urls.GETREDPACKETLIST,{
                    uuid: this.uuid
                }).then(d=>{
                    this.datas = d.packets;
                });
            },
            getRed (){
                this.$vux.loading.show({text: '马上就有...'})
                this.$http.post(this.$urls.ISGETREDPACKET,{
                    uuid: this.uuid,
                    openid: this.openid
                }, this).then(d=>{
                    this.$vux.loading.hide()
                    this.isMask = true;
                    this.code = d.code;
                    if (d.status == 'success') {
                        this.money = d.money
                        this.getDatas()
                    }
                })
            }
        }
    }
</script>
<style lang="less" scoped>
    @import "../../../assets/css/var";
    .randommoney{
        background: #ff4c59 url("../../../assets/img/activity/moneybg.png") no-repeat 0 0;
        background-size: 100% auto;
        padding: 1px 0 2em;
        min-height: 100vh; box-sizing: border-box;
        .redcolor { color:#ff4c59;}
        .money-btn{
            display:block;
            width: 60%;
            background-image: url("../../../assets/img/activity/moneybtn.png");
            background-size: 100% 100%;
            background-repeat: no-repeat;
            margin: 85% auto 15%;
            &:after {
               content:"";
               display:block;
               padding:13%;
             }
        }
        .moneyinfo {
            background:#fffaf5;
            width:90%;
            margin:0 auto;
            border-radius:.5rem .5rem;
            box-sizing:border-box;
            padding: 0 1.2rem;
        }
        .title {
            height:3.33rem;
            line-height:3.33rem;
            font-weight:600;
            position:relative;
        }
        .title:before,.title:after {
            content:'';
            display:block;
            width: 1rem;
            height:1rem;
            background-image: url(../../../assets/img/activity/moneypoint.png);
            background-size: cover;
            position:absolute;
            top:50%;
            transform:translateY(-50%);
        }
        .title:after { right: 0; }
        dd {
            position: relative;
            height:4.5rem; box-sizing:border-box; padding: .85rem 0;
            &+dd:after{
                content: "";
                .setTopLine(#c9c3b4);
            }
            .username { margin-bottom:.4rem;}
            i { display:inline-block; width:3rem; height:3rem; border-radius:50%; margin-right:1rem; }
        }
        .mark {
            background: rgba(0, 0, 0, 0.8);
            z-index: 10;
            .maskmain { position:fixed;top: 50%; left: 50%; width: 24.2rem; max-width: 80%; transform:translate(-50%,-50%);}
            .main { position:relative; }
            .message { position:absolute; top:20%; left:50%; transform:translateX(-50%);}
            .common{ color:#c1982a;display:inline-block;margin-bottom:1rem;}
        }
        .maskbtn {
            display:block;
            width: 12.5rem;
            height: 3.33rem;
            background-image: url("../../../assets/img/activity/maskbtn.png");
            background-size: 100% 100%;
            background-repeat: no-repeat;
            margin: 2rem auto 0;
        }
    }
</style>
