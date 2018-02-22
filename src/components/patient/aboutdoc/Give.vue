<template name="fade">
    <div>
        <div class="give">
            <div class="send g_padding bgfff">
                <header class="sendHead">
                    <i class="thumb bgcove" :style="`background-image:url(${imgsrc(doc.listSpecialPicture, 'user-head')})`"></i>
                    <p class="big14">向{{doc.specialName}}医生送心意</p>
                </header>
                <section>
                    <ul class="moneyUl flex">
                        <li v-for="(item, ind) in warms" :key="ind" class="relative mindlist flex_1" @click="MoneyNum(item)" :class="{'selected': item.money == form.warmthMoney}">
                            <b :class="'img'+ind" class="thumb"></b>
                            <p class="small11 label">{{item.name}}</p>
                            <p><span style="color: #F6AB00;">{{item.money}}</span>元</p>
                            <i class="iconfont icon-yuanxingweixuanzhong"></i>
                        </li>
                        <li class="flex_1 mindlist" @click="isMark = true" :class="{'selected': (MoneyNumOther == form.warmthMoney) && (MoneyNumOther > 0) }">
                            <b class="thumb img4"></b>
                            <p class="small11 label">华佗在世</p>
                            <p>
                                <template v-if="MoneyNumOther"><span class="moneyNumOther">{{MoneyNumOther}}</span>元</template>
                                <span v-else style="color: #d22432">自定义</span>
                            </p>
                            <i class="iconfont icon-yuanxingxuanzhongfill" v-if="(MoneyNumOther == form.warmthMoney) && (MoneyNumOther != 0) "></i>
                        </li>
                    </ul>
                </section>
                <section>
                    <p class="title big13">赠言：</p>
                    <textarea v-model="form.content" placeholder="感谢您的帮助，祝您事业顺利，万事如意。"></textarea>
                </section>
            </div>
            <warm-wall :docid="form.docid" :pageSize="5" style="padding-bottom: 3.9rem; margin-top: 0.769rem" :more="true"></warm-wall>
        </div>
        <footer class="fixed">
            <label>
                <input type="checkbox" v-model="understand">
                <i class="iconfont icon-yuanxingweixuanzhong big14"></i>&ensp;我已了解
            </label>
            <span class="maincolor" @click="rule = true">《心意赠送规则》</span>
            <x-button type="primary" class="submit" @click.native="submit" :disabled="disabled">立即付款</x-button>
        </footer>
        <div class="mark" v-if="isMark" @click.self="isMark=false">
            <div class="custom">
                <p class="iconfont icon-x" @click="isMark=false"></p>
                <p class="mark-img thumb"></p>
                <div class="money">
                    <input type="number" class="customMoney" v-model.number="MoneyNumOther" /><span class="big13" style="color: #9196a1">元</span>
                </div>
                <div class="remark small10 grayccc">请输入大于10元的金额</div>
                <x-button @click.native="preCustom()" type="primary" class="xButton" :disabled="MoneyNumOther <= 10">确认</x-button>
            </div>
        </div>
        <rule v-model="rule" title="心意赠送">
            <div class="small11">
                <p class="p-margin">送心意是由“佰医汇”平台为患者提供表达心意的电子礼物，分别为一点心意（10元）、白衣天使（20元）、医德高尚（50元）、德艺双馨（100元）、华佗再世（自定义金额）锦旗5种。</p>
                <p class="p-margin">您所赠送的心意将用于感谢医生，在您选好心意并完成支付后，礼物会即可送达到医生处，医生可立即查看您赠送的心意。完成心意赠送后，您与医生的沟通界面皮肤将发生变化，维持时间以您送心意的种类而定。</p>
                <p style="color: #b9b9c1; line-height: 1.5rem">温馨提示</p>
                <div>
                    <p style="line-height: 1.5rem">心意赠送是您承载着一份对医生对支持与关怀，</p>
                    <p style="line-height: 1.5rem">一旦送出将不接受退款申请。</p>
                    <p style="line-height: 1.5rem">和谐医患，你我共筑。</p>
                </div>
            </div>
        </rule>
    </div>
</template>
<script>
    import { Group, Scroller, XButton } from 'vux'
    import { Rule } from '@components/share'
    import { imgsrc } from '@filters'
    import WarmWall from './WarmWall'
    export default{
        components: {
            Group,
            Scroller,
            XButton,
            WarmWall,
            Rule
        },
        data () {
            return{
                doc: {
                    listSpecialPicture: '',
                    specialName: '■■■'
                },
                warms: [],
                MoneyNumOther: 0,
                isMark: false,
                understand: true,
                form: {
                    openid: this.$store.state.openid,
                    docid: this.$route.query.docid,
                    subUserUuid: this.$route.query.uid,
                    warmthName: '',
                    warmthMoney: '',
                    content: '',
                    oid: this.$route.query.oid,
                    otype: this.$route.query.otype || 13,
                    type: 'give'
                },
                rule: false
            }
        },
        created () {
            this.warms = JSON.parse(localStorage.getItem('_cache_home_warms') || '[]')

            let cache_form = JSON.parse(sessionStorage.getItem('pay_parameter') || '{}')
            if (cache_form.form && cache_form.form.docid == this.form.docid) {
                this.form = { ...cache_form.form }
                this.doc = { ...cache_form.doc }
                this.setCustom()
            }
        },
        watch: {
            isMark (v) {
                v && this.$nextTick(() => {
                    document.querySelector('.customMoney').focus()
                })
            }
        },
        mounted() {
            // 系统暖意
            this.$http.get(this.$urls.GAINSYSWARMS).then(d => {
                localStorage.setItem('_cache_home_warms', JSON.stringify(this.warms = d.warms))
                this.setCustom()
            })
            // 医生信息
            this.$http.get(this.$urls.DOCMAIN ,{docid: this.form.docid}).then(d => {
                this.doc = d.doc
            })
        },
        methods: {
            imgsrc,
            // 选择心意
            MoneyNum (item) {
                this.form.warmthMoney = item.money
                this.form.warmthName = item.name
            },
            setCustom () {
                this.MoneyNumOther = this.form.warmthMoney
                this.preCustom()
            },
            // 保存自定义价格
            preCustom () {
                let selected = this.warms.find(item => this.MoneyNumOther == item.money)
                if (selected) {
                    this.MoneyNum(selected)
                    this.MoneyNumOther = ''
                } else {
                    this.MoneyNum({
                        money: this.MoneyNumOther,
                        name: '华佗在世'
                    })
                }
                this.isMark = false
            },
            // 提交，跳转支付
            submit (){
                sessionStorage.setItem('pay_parameter', JSON.stringify({
                    form: this.form,
                    doc: this.doc
                }))
                this.$router.push({ path: '/pay', query: { back: this.$route.query.back || -2 } })
            }
        },
        computed: {
            disabled () {
               return this.form.warmthMoney && this.form.warmthName && !this.understand
            }
        }
    }
</script>
<style scoped lang="less">
    @import '../../../assets/css/var';
    .send{
        .sendHead{
            text-align: center;
            padding: 1.9rem 0 1.1rem;
            .thumb{
                display: block;
                width: 3.1rem;
                height: 3.1rem;
                margin: 0 auto;
                background: contain;
                border-radius: 100%;
                margin-bottom: .3rem;
            }
            p{
                padding-top: 1.3rem
            }
        }
        .moneyUl{
            text-align: center;
            list-style: none;
            li{
                padding: .6rem 0;
                margin-bottom: 1.5rem;
                i{
                    color: #ced0d5
                }
            }
            .mindlist(@navicon) when (@navicon < 5){
                .img@{navicon}{
                    background: url('../../../assets/img/sendMind/send_@{navicon}.png') no-repeat center;
                    background-size: cover !important;
                    width: 2rem;
                    height: 2.6rem
                }
                .mindlist((@navicon+1))
            }
            .mindlist(0);
            .label{
                color: #9196a1;
                margin: 1.15rem 0 0.7rem;
                &+p{
                    padding-bottom: .5rem
                }
            }
            .selected{
                background: rgba(0, 0, 0, 0.05);
                i{
                    color: #f6ab00;
                }
                i:before{
                    content: "\E730",
                }
            }
        }
        .title{
            border-top: 1px solid #f1f1f1;
            padding: 1.31rem 0 1rem
        }
        textarea{
            width: 100%;
            height: 4rem;
            resize: none;
            box-sizing:border-box;
            border: 0;
            margin-bottom: .6rem
        }
    }
    .mark {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        background: rgba(0, 0, 0, 0.5);
        .remark{
            line-height: 2.6;
        }
        .custom{
            position: fixed;
            top: 50%;
            left: 50%;
            width: 23.4rem;
            height: 23.4rem;
            margin: -11.7rem 0 0 -11.7rem;
            background: #fff;
            border-radius: .3rem;
            text-align: center;
            .icon-x{
                font-size: 3rem;
                margin-top: -5px;
                color: @font-color;
                text-align: right
            }
            .mark-img{
                width: 5.8rem;
                height: 5rem;
                background: url("../../../assets/img/sendMind/mark-img.png") no-repeat center;
                background-size: cover
            }
            .money{
                 border-bottom: 1px solid #ccc;
                 padding: 3rem 0 .8rem;
                 width: 17.3rem;
                 margin: 0 auto;
                 input[type="number"]{
                    border: none;
                    outline: none;
                    text-align: center;
                    font-size: 2.83rem;
                    width: 90%;

                }
            }

            .xButton{
                margin-top: 1.6rem;
                width: 60%;
                border-radius: 2rem
            }
        }
    }
    .moneyNumOther{
        max-width: 4rem;
        color: @warn-color;
        display: inline-block;
        vertical-align: bottom;
        overflow:hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    footer{
        width: 100%;
        height: 3.9rem;
        background:#fff;
        bottom:0;
        border-top: 1px solid #e5e5e5;
        line-height: 3.9rem;
        label{
            color: #9196a1;
            padding-left: 1rem;
            input[type="checkbox"]{
                display: none;
                &:checked + i{
                    color: @main-color
                }
                &:checked + i:before{
                    content: '\E730'
                }
            }
        }
        .submit{
            width: 9.2rem;
            height: 2.8rem;
            line-height: 2.8rem;
            float: right;
            border-radius: 3rem;
            margin: .55rem 1rem 0 0;
        }
    }
    .p-margin{
        margin-bottom: 1.8rem
    }
</style>
