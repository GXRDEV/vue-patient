<template>
    <div class="flex column h100">
        <header class="tcenter bgfff big13">
            <p @click="tab(1)" :class="{'selected': tabValue == 1}">
                <span class="inlineblock">药品</span>
            </p>
            <p @click="tab(2)" :class="{'selected': tabValue == 2}">
                <span class="inlineblock">定制服务</span>
            </p>
        </header>
        <section class="flex_1 scroll">
            <div class="h100 w100 scroll" id="resultScroll" v-scroll="onScroll">
                <div class="main bgfff" v-for="(item, ind) in orderList" :key="ind">
                    <p class="show-head flex" @click="detail(item.uuid)">
                        <span class="flex_1">爱心大药房</span>
                        <span class="big16 maincolor" style="padding-right: 1rem">{{$store.state.drugState[item.status]}}</span>
                    </p>
                    <div class="show-main relative" @click="detail(item.uuid)">
                        <p class="big13" v-for="(drugList, drugInd) in item.drugs" :key="drugInd" v-if="drugInd < 3" style="padding-bottom: 0.3rem">
                            <span class="drugName">{{drugList.drug.drugName}}</span>
                            <span class="maincolor">x{{drugList.number}}</span>
                        </p>
                        <p v-if="item.drugs.length>3" class="maincolor" style="line-height: 0.5rem; padding-top: 0.3rem">···</p>
                        <b></b>
                    </div>
                    <p class="show-foot flex">
                        <span class="flex_1">{{ format(item.createTime, 'yyyy-MM-dd hh:mm', false)}}</span>
                        <x-button v-if="item.status == 20" @click.native="operation(item)">确认收货</x-button>
                    </p>
                </div>
                <no-order v-if="tabValue == 2 || noresult" :haslink="isLink" text="暂无订单" linkText="去购药" link="/drugs"></no-order>
                <div class="loadingdiv" style="height: 2.6rem;" v-if="scroll.pullupStatus!='disabled'">
                    <div class="weui-loadmore tcenter" style="margin: 0 auto; line-height: 2.6rem; color: #666;">
                        <i class="weui-loading" v-if="scroll.pullupStatus=='loading'"></i>
                        <span v-else>上拉加载更多</span>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
<script>
    import { XButton } from 'vux'
    import { NoOrder } from '@components/share'
    import { format } from '@filters'
    import Scroll from '@/directives/scroll'
    import debounce from 'vux/src/tools/debounce'
    export default {
        directives: {
            Scroll
        },
        components: {
            XButton, NoOrder 
        },
        created () {
            this.loadPullUp()
        },
        data () {
            return {
                isLink: true,
                tabValue: 1,
                scroll: {
                    pullupStatus: 'default',
                    bottom: 2
                },
                query: {
                    openid: this.$store.state.openid,
                    pageNo: 1,
                    pageSize: 10
                },
                orderList: [],
                noresult: false
            }
        },
        methods: {
            format,
            operation (item){
                let that = this
                this.$vux.confirm.show({
                    title: '您确定已收到药品',
                    cancelText: '取消',
                    confirmText: '确定',
                    onConfirm(){
                        that.$http.post(that.$urls.DRUGORDEROPERATE, { orderUuid: item.uuid, action: 'complete' }).then( d => {
                            item.status = '40'
                        })
                    }
                })
            },
            tab (ind){
                this.query.pageNo = 1
                this.tabValue = ind
                this.isLink = ind == 1 ? true : false;
                this.orderList = []
                this.loadPullUp()
            },
            onScroll: debounce( function ( e, position ){
                let clientHeight = e.clientHeight;
                let scrollHeight = e.scrollHeight;
                let scrollH = clientHeight + position.scrollTop + this.scroll.bottom
                if( scrollH >= scrollHeight && this.scroll.pullupStatus == 'default'){
                    this.loadPullUp()
                }
            }, 100),
            loadPullUp (){
                this.noresult = false
                if( this.tabValue == 1){
                    this.scroll.pullupStatus = 'loading'
                    this.$http.get(this.$urls.DRUGORDERLIST, { ...this.query }).then( d => {
                        !d.orders.length && (this.noresult = true)
                        let orderList = d.orders || []
                        this.orderList = this.orderList.concat(orderList)
                        this.timeOut(orderList)
                    })
                }
                
            },
            timeOut (orderList){
                setTimeout(() => {
                    if( orderList.length == this.query.pageSize ){
                        this.query.pageNo ++
                        this.scroll.pullupStatus = 'default'
                    } else {
                        this.scroll.pullupStatus = 'disabled'
                    }
                }, 100);
            },
            detail (id) {
                this.$router.push('/orderdetail/'+id)
            }
        }
    }
</script>

<style lang="less" scoped>
    @import '../../../assets/css/var';
    header{
        height: 4rem;
        border-bottom: 1px solid #eee;
        p{
            width: 50%;
            float: left;
        }
        span{
            line-height: 3.85rem;
            padding: 0 0.8rem
        }
        .selected{
            span{
                color: @main-color;
                border-bottom: 2px solid @main-color
            }
        }
    }
    section{
        .main{
            padding-left: 1rem;
            margin-top: 0.83rem;
            .show-head{
                line-height: 3.41rem
            }
            .show-main{
                padding: .8rem 0;
                border-bottom: 0.5px solid #eee;
                border-top: 0.5px solid #eee;
                .drugName{
                    display: inline-block;
                    width: 40%;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                    vertical-align: bottom
                }
                b{
                    content: '';
                    position: absolute;
                    width: .5rem;
                    height: .5rem;
                    border-right: 1px solid #bfbfbf;
                    border-top: 1px solid #bfbfbf;
                    right: 1.8rem;
                    top: 50%;
                    transform: rotate(45deg) translate(-50%)
                }
            }
            .show-foot{
                line-height: 3.08rem;
                align-items: center;
                padding-right: 1rem;
                span{
                    color: @font-color
                }
                button{
                    height: 1.91rem;
                    line-height: 1.91rem;
                    font-size: 0.91rem;
                    width: 5.5rem;
                    padding: 0;
                    color: @warn-color;
                    background: @warn-color-lower;
                    border-radius: 3px
                }
            }
        }
    }
</style>


