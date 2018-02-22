<template>
    <div style="padding-bottom: 3.8rem">
        <div class="head flex bgfff g_padding">
            <span class="flex_1 big13">订单状态</span>
            <span class="big16 maincolor">{{$store.state.drugState[status]}}</span>
        </div>
        <div class="head flex bgfff g_padding big13">
            <span class="flex_1">供应商</span>
            <span>爱心大药房</span>
        </div>
        <div class="big13 flex bgfff" style="padding: 1rem" v-if="detail.trackingNumber">
            <span class="flex_1">订单号</span>{{detail.trackingNumber}}
        </div>
        <div class="bgfff big13" style="margin: 1rem 0; padding: 1rem">
            <p class="flex"><span class="flex_1">收货人：{{detail.userName}}</span>{{detail.telNumber}}</p>
            <p style="margin-top: 0.3rem">收货地址：{{detail.provinceName}}&ensp;{{ detail.cityName }}&ensp;{{detail.countryName}}&ensp;{{detail.detailInfo}}</p>
        </div>
        <section class="bgfff big13">
            <p class="main-title g_padding" style="line-height: 3rem">订单详情</p>
            <div class="drugs" v-for="(item, ind) in detail.drugs" :key="ind">
                <div class="flex drugs-main">
                    <img :src="`${imgsrc(imgUrl[ind], 'nodrug', '300')}`" alt="">
                    <div class="flex_1">
                        <p style="padding-bottom: 0.5rem">{{item.drug.drugName}}</p>
                        <p class="flex" style="align-items: baseline"><span class="flex_1">{{item.drug.drugSpec}}</span><span class="warncolor big15">￥{{item.drug.price}}</span></p>
                    </div>
                </div>
                <p class="flex" style="line-height: 2.91rem; padding-right: 1.58rem">
                    <span class="flex_1">购买数量</span>
                    <span class="big15">{{item.number}}</span>
                </p>
            </div>
        </section>
        <footer class="fixed left right bottom bgfff g_padding flex">
            <p class="flex_1" v-if="status != 30">共计：<span class="warncolor big20">{{money}}</span>元</p>
            <template>
                <span class="cancel btns" v-if="status == 10" @click="operation('cancel')">取消订单</span>
                <p v-else-if="status == 20">如您已收到药品，请点击&ensp;<span class="receipt maincolor btns" @click="operation('complete')">确认收货</span></p>
                <p v-else-if="status == 50" class="gray">您已成功取消本订单</p>
                <p v-else-if="status == 30" class="flex_1 tright gray">{{detail.refulseReason}}</p>
            </template>  
        </footer>
    </div>
</template>
<script>
    import { imgsrc } from '@filters'
    export default {
        data () {
            return {
                status: '',
                money: '',
                detail: {},
                imgUrl: []
            }
        },
        created () {
            this.$http.get(this.$urls.DRUGORDERDETAIL, { orderUuid: this.$route.params.uuid }).then( d => {
                this.status = d.order.status
                this.detail = d.order
                this.money = d.payMoney
                this.imgUrl = d.order.drugs.map( item => {
                    if (item.drug.pics[0]) return item.drug.pics[0].picUrl
                    return ''
                })
            })  
        },
        methods: {
            imgsrc,
            operation (val){
                let text = val == 'cancel' ? '您确定取消本次订单' : '您确定已收到药品'
                let that = this
                this.$vux.confirm.show({
                    title: text,
                    cancelText: '取消',
                    confirmText: '确定',
                    onConfirm(){
                        that.$http.post(that.$urls.DRUGORDEROPERATE, { orderUuid: that.$route.params.uuid, action: val }).then( d => {
                            val == 'cancel' && (that.status = '50')
                            val == 'complete' && (that.status = '40')
                        })
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .head{
        height: 4.08rem;
        align-items: center;
        margin-bottom: 1rem;
    }
    section{
        .drugs{
            padding-left: 1rem;
            border-top: .5px solid #eee;
            .drugs-main{
                border-bottom: 0.5px solid #eee;
                padding: 0.83rem 1.58rem 0.83rem 0;
                align-items: center;
                img{
                    width: 4.6rem;
                    object-fit: contain
                }
                div{
                    padding-left: 1rem;
                }
            }
        }
    }
    footer{
        height: 3.8rem;
        line-height: 3.8rem;
        align-items: center;
        border-top: 0.5px solid #eee;
        .btns{
            display: inline-block;
            height: 2.08rem;
            line-height: 2.08rem;
            padding: 0 0.5rem;
            box-sizing: border-box;
            border-radius: .2rem;
        }
        .cancel{
            border: .5px solid #ccc;
            color: #ccc
        }
        .receipt{
            background: #e5f3fa
        }
    }
</style>