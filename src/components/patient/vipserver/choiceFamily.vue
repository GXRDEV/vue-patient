<template>
    <div class="bgfff h100">
        <header class="big20">请选择一位联系人进行签约</header>
        <section class="bgfff" style="padding: 0 1rem 3.8rem">
            <div v-for="(item, idx) in family" :key="idx" class="relative" @click="choice(item, idx) " :class="{'choice': selected == idx}">
                <p class="big14" style="padding-bottom: .5rem" :class="{ 'gray':item.status == 1 }">{{item.userName}}&ensp;<span class="base12 gray">{{item.sex}}&ensp;{{item.age}}</span></p>
                <p style="color: #363636" ><i class="iconfont icon-telephone"></i>&ensp;<span :class="{ 'gray':item.status == 1 }">{{item.telphone}}</span></p>
                <p style="padding-top:.5rem;" class="base12" v-if="item.status == 1">该联系人已签约私人医生，需先解约才可签约</p>
                <b class="absolute" v-if="selected == idx"></b>
                <span class="absolute relieve" v-if="item.status == 1">解约</span>
            </div>
            <router-link :to="{ path: '/familyadd', query: {back: -1}}" class="big15 borderbox tcenter" v-if="family.length < 5">
                <i class="iconfont icon-jiahao"></i> 新建
            </router-link>
        </section>
        <footer class="fixedbottom bgfff">
            <div class="fixed left right tcenter nobg" style="bottom: 2.5rem">
                <x-button @click.native="pay" type="primary" class="weui-btn_circle_radius" style="height:3.5rem; width: 13.87rem" :disabled="disabled">确认，并支付</x-button>
            </div>
        </footer>
        <section class="mark fixed" v-if="isMask" @click.self="isMask=false">
            <div class="mark-box bgfff absolute">
                <p class="big15">解约服务将扣除您截止今日之前的服务费用</p>
                <p class="marginT">截止至今日 您已享用服务{{ serverMoney.serverTime }}</p>
                <p>服务费用约：<span class="maincolor">{{ serverMoney.serverMoney }}</span>元</p>
                <p>解约后将返还您约：<span class="maincolor">{{ serverMoney.returnMoney }}</span>元</p>
                <p class="marginT">退款将于3个工作日返还</p>
                <footer class="big15">
                  <span class="tcenter" @click = "isMask = false">不解约</span>
                  <span class="maincolor tcenter" @click="confirmRelieve">确认解约</span>
                </footer>
            </div>
        </section>
    </div>
</template>
<script>
    import { XButton } from 'vux'
    export default {
        components: {
            XButton
        },
        created () {
            this.$http.get(this.$urls.SIGNATORY, {openid: this.$store.state.openid}).then( d => {
                d.users.forEach((u, idx) => {
                    if(!this.disabled || u.status == 1) return;
                    this.selected = idx;
                });
                this.family = d.users;
            })
            this.parameter = JSON.parse(sessionStorage.getItem('pay_parameter'))
        },
        data () {
            return {
                family: [],
                selected: -1,
                parameter: {},
                from: window.location.hash,
                oid:'',
                isMask:false,
                serverMoney:{}
            }
        },
        computed: {
            disabled () {
                return !(this.selected != -1)
            }
        },
        methods: {
            choice (item, idx){
                if(item.status == 1) {
                    this.oid = item.orderUuid;
                    this.isMask = true;
                    this.getServerInfo();
                }else {
                  this.selected = idx
                }
            },
            pay (){
                let parameter = {
                    ...this.parameter,
                    userName: this.family[this.selected].userName,
                    sex: this.family[this.selected].sex,
                    age: this.family[this.selected].age,
                    familyId: this.family[this.selected].id
                }
                sessionStorage.setItem('pay_parameter', JSON.stringify(parameter))
                this.$router.replace('/pay')
            },
            confirmRelieve (){
                this.isMask = false;
                this.$http.get( this.$urls.RELIEVE, { orderUuid: this.oid, orderType: 15 })
                    .then(d=>{
                        if(d.status == 'success'){
                            this.$vux.toast.show({ type: 'text', text: '解约成功', position: 'top' });
                            window.setTimeout(() => {
                              this.$router.push({ path: '/main/my/mysign' });
                            },600)
                        }
                  })

            },
            getServerInfo (){
                this.oid && this.$http.get( this.$urls.GAINSIMPLEORDERINFO, { oid: this.oid, orderType: 15 })
                    .then(d=>{
                        this.serverMoney = d.vipDetail.serverMoneyDto;
                    })
            }
        }
    }
</script>
<style lang="less" scoped>
    @import '../../../assets/css/var.less';
    header{
        padding: 1.67rem 1rem
    }
    section{
        div{
            box-sizing: border-box;
            padding: 1.41rem 1.08rem;
            background: #f4f4f4;
            border-radius: .2rem;
            margin-bottom: 1.125rem;
            border: 1px solid #f4f4f4;
            i{
                color: @main-color
            }
            b{
                width: 0px;
                height: 0px;
                right: 0;
                bottom: 0;
                border-left: 7px solid transparent;
                border-top: 7px solid transparent;
                border-right: 7px solid @main-color;
                border-bottom: 7px solid @main-color;
                border-bottom-right-radius: .15rem;
                &:before{
                    content: '';
                    position: absolute;
                    right: -.3rem;
                    bottom: -.3rem;
                    width: .15rem;
                    height: .3rem;
                    border-right: .5px solid #fff;
                    border-bottom: .5px solid #fff;
                    transform: rotate(30deg)
                }
            }
        }
        .choice{
            background: #fff;
            border: 1px solid @main-color
        }
        a{
            display: block;
            width: 7.45rem;
            height: 0;
            line-height: 0; padding: 1em 0 1.16em;
            border: 1px solid @main-color;
            color: @main-color;
            border-radius: .2rem;
            .iconfont{
                vertical-align: 1px;
            }
        }
        .relieve {
            color:#fff;
            background:#0186d1;
            padding:.2rem 1rem .3rem;
            border-radius:.3rem;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
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
    }
</style>
