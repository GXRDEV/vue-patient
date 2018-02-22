<template>
  <article class="flex column h100vh">
    <header>
        <p class="whitespace">
            <span class="big14 strong">{{ cinfo.contactName }}</span>&ensp;
            <span class="big13 gray">{{ cinfo.sex | sex }}&ensp;{{ cinfo.age | age }}</span>
        </p>
        <p class="whitespace">
            <span class="big13">提问：</span>
            <span class="big13 gray">{{ cinfo.askProblem }}</span>
        </p>
    </header>
    <section class="scroll flex_1">
        <div class="finding flex h100">
            <div class="outer flex">
                <div class="inner tcenter">
                    <h2><count-down v-model="timeleave" format="mm′ ss″" @on-finish="nodoc" :start="start"></count-down></h2>
                    <h3>正在通知医生...</h3>
                    <p>{{totalTime}}分钟内无应答为您优先安排</p>
                </div>
            </div>
        </div>
    </section>
    <footer>
        <x-button class="cancel noborder" @click.native="cancelOrder">取消问诊</x-button>
    </footer>
  </article>
</template>
<script>
    import { XButton  } from 'vux'
    import { CountDown, ItemFlexImg} from '@components/share'
    import { WxJsPay } from '@plugins/api'
    import { sex, age } from '@filters'
    import goeasy from '@mixins/goeasy'

    export default {
        components: {
            XButton, CountDown, ItemFlexImg
        },
        filters: {
            sex, age
        },
        mixins: [goeasy],
        data () {
            return {
                id: this.$route.params.id,
                orderState: this.$store.state.orderState,
                timeleave: 0,
                totalTime: 5,
                start: false,
                cinfo: {},
                hasdoc: false,
                timer: new Date().getTime()
            }
        },
        created () {
            this.initData()
        },
        mounted () {
            document.addEventListener("visibilitychange", this.pageIn, false)
        },
        destroyed () {
            document.removeEventListener("visibilitychange", this.pageIn, false)
        },
        methods: {
            refresh (key) {
                key.indexOf(':') != -1 && this.initData(true)
            },
            pageIn () {
                if (document.visibilityState == 'hidden') {
                    this.initData()
                }
            },
            initData (type) {
                let that = this;
                this.$http.get(this.$urls.GAINFASTDOCSEL, { oid: this.id }).then(d => {
                    this.cinfo = d.cinfo ? JSON.parse(d.cinfo) : {}
                    this.totalTime = d.timeDual || 5
                    this.timeleave = parseInt(this.totalTime, 10) * 60
                    this.start = d.payStatus != 4
                    this.hasdoc = d.status == 20
                    //去支付
                    if(!this.start){
                        return this.$vux.alert.show({
                            title: '未支付',
                            content: '当前订单未支付，医生将无法为您服务，请尽快支付。如果在规定时间内没有医生接单，我们将全额退还。',
                            onHide () {
                                that.toPay()
                            }
                        })
                    }
                    this.$nextTick(() => {
                        let ct = ((+new Date) - d.ctime) / 1000
                        this.timeleave = ct > this.timeleave ? 0 : this.timeleave - ct
                    })
                    // 已经有医生接单去聊天
                    if (this.hasdoc && this.start) {
                        return this.gotoChat()
                    }
                    // 已取消或者已退款
                    if(d.status > 20 && !type){
                        this.$vux.alert.show({
                            title: '订单' + that.orderState[d.status || '20'],
                            content: '您的订单状态为' + that.orderState[d.status || '20'] + '，请在我的订单里查看。',
                            onHide () {
                                let itype = (d.status + '0').slice(0, 1)
                                itype = ['1', '2', '3', '4'].indexOf(itype) != -1 ? itype : '4'
                                that.$router.replace(that.$route.query.from || '/inquirylist/' + itype)
                            }
                        })
                    }
                })
            },
            nodoc () {
                if (!this.hasdoc) {
                    let that = this
                    this.$vux.alert.show({
                        title: '医生无应答',
                        content: '当前订单已自动取消，如仍有问诊需求，请重新下单',
                        onHide () {
                            that.$router.replace( that.$route.query.from || '/interrogation'+this.timer+'?sever=9' )
                        }
                    })
                }
            },
            gotoChat () {
                this.$vux.loading.show({text: '正在跳转'})
                setTimeout(() => {
                    this.$vux.loading.hide()
                    this.$router.replace({ path: '/chat', query: { oid: this.id, otype: '9' } })
                }, 500)
            },
            toPay () {
                this.$router.replace({path: '/pay', query: { oid: this.id, otype: '9' }})
            },
            cancelOrder () {
                let that = this
                this.$vux.confirm.show({
                    title: '取消问诊？',
                    content: '正在努力通知医生，确认要取消当次问诊？',
                    cancelText: '再等等',
                    onCancel () {},
                    onConfirm () {
                        that.$vux.loading.show({text:'正在取消'})
                        that.$http.post(that.$urls.CANCELFAST, { oid: that.id }).then(d => {
                            that.$vux.loading.hide()
                            that.$router.replace(that.$route.query.from || '/interrogation/'+this.timer+'?sever=9')
                        })
                    }
                })
            }
        }
    }
</script>
<style scoped lang="less">
    @import '../../../assets/css/var';
    @innerWidth: 16.5rem;
    header{
        color: #222;
        background:#fff;
        padding: 1rem;
        line-height: 2em;
    }
    .finding{
        background: #DBE8EF;
        padding-top: 2rem;
        overflow: hidden;
        .outer{
            position: relative;
            width: 100vw;
            height: 100vw;
            border-radius: 50%;
            &:before,
            &:after{
                position: absolute;
                top: 0; bottom: 0; left: 0; right: 0;
                content: "";
                margin: auto;
                width: @innerWidth;
                height: @innerWidth;
                border-radius: 50%;
            }
            &:before{
                z-index: 2;
                background: #9FCDE7;
                animation:widthFillScale1 1s ease-out infinite;
                -webkit-animation:widthFillScale1 1s ease-out infinite;
            }
            &:after{
                background: #C7DFEC;
                z-index: 1;
                animation:widthFillScale2 1s ease-out infinite;
                -webkit-animation:widthFillScale2 1s ease-out infinite;
            }
        }
        .inner{
            position: relative;
            z-index: 3;
            line-height: 1;
            margin: auto;
            width: @innerWidth;
            height: @innerWidth;
            background: #6BB6E0;
            color: #fff;
            border-radius: 50%;
            h2{ 
                font-size: 2.08rem;
                font-style: italic;
                padding-top: 4.25rem;
            }
            h3{ 
                font-size: 1.42rem;
                padding-top: 2.08rem;
            }
            p{ 
                font-size: 0.92rem;
                padding-top: 0.875rem;
                color: #cbcbcb; 
            }
        }
    }
    .doclist{
        dt{
            background: @main-color;font-size: 1rem;
            color: #fff; line-height: 3rem; text-align: center;
        }
        .docitem{
            background: #fff; 
            p{
                line-height: 1;
                &:nth-child(2){
                    padding: 0.75rem 0 0.92rem;
                }
            }
            & + .docitem{
                margin-top: 0.75rem;
            }
            .footer{
                border-top: 1px dashed @main-bg-color;
                padding: 0.58rem 1rem 0.58rem 5.283rem;
                margin-left: 0.8rem;
                color: @warn-color;
                .payto{
                    height: auto;
                    padding: 0 1.2rem;
                    border-radius: 3px;
                    font-size: 1.08rem;
                }
            }
        }
    }
    footer{
        .cancel{
            background: #dcdcdc;
            border-radius: 0;
            color: #9a9a9a;
            padding: .8em 0;
        }
    }


    @-webkit-keyframes widthFillScale1 {
        98% {
            transform: scale(1.3) rotate(360deg);
        }
        100% {
            transform: scale(1);
        }
    }
    @keyframes widthFillScale1 {
        98% {
            transform: scale(1.3) rotate(360deg);
        }
        100% {
            transform: scale(1);
        }
    }
    @-webkit-keyframes widthFillScale2 {
        98% {
            transform: scale(1.6) rotate(360deg);
        }
        100% {
            transform: scale(1);
        }
    }
    @keyframes widthFillScale2 {
        98% {
            transform: scale(1.6) rotate(360deg);
        }
        100% {
            transform: scale(1);
        }
    }
</style>