<template>
    <div class="h100vh flex column orderPage">
        <header>
            <tab custom-bar-width="3.8rem">
                <tab-item v-for="(item, index) in tabs" :selected="form.ltype == index" @click.native="orders(index)" :key="index">
                    {{item}}
                </tab-item>
            </tab>
        </header>
        <scroller class="flex_1" :prevent-default="false" v-model="scroll" height="100%" lock-x scrollbar-y use-pullup :pullup-config="pullupConfig" @on-pullup-loading="loadPullUp" ref="scroller">
            <div class="scrollMain">
                <no-order v-if="noresult" text="暂无订单"></no-order>
                <div v-else class="minbox relative" v-for="(item, index) in order" :key="index">
                    <div class="doc" @click="jumppage(item, true)" :class="{'paddingBot':item.type==4||item.type==5}">
                        <p v-if="['4'].indexOf(item.type) != -1" class="whitespace">
                            <span class="big14 blacklower label">会诊时间：</span>
                            <span class="big14 blacklower">{{item.orderTime}}</span>
                        </p>
                        <div v-if="[ '4', '5'].indexOf(item.type) != -1" class="flex">
                            <div class="applyitem flex_1">
                                <item-flex-img class="acenter" :img="item.experHeadImageUrl" style="padding: 1.125rem 1.25rem 1.125rem .83rem;background:#f9fafa;" radius="50%" size="2rem">
                                    <div>
                                        <p class="whitespace big16">
                                            <span v-if="item.expertName">{{ item.expertName }}</span>
                                            <span v-else>待分配专家</span>
                                            <span class="base12" style="color:#9196a1;"> {{item.expertDep}} </span>
                                        </p>
                                        <p class="whitespace big">{{item.expertHos}}&ensp;</p>
                                    </div>
                                </item-flex-img>
                                <span class="common">专家</span>
                            </div>
                            <div class="applyitem flex_1">
                                <item-flex-img class="acenter" :img="item.docHeadImageUrl" style="padding: 1.125rem 1.25rem 1.125rem .8rem;background:#f9fafa;" radius="50%" size="2rem">
                                    <div>
                                        <p class="whitespace big16">{{item.docName ||'待分配'}}
                                            <span class="base12" style="color:#9196a1;"> {{item.depName}}</span>
                                        </p>
                                        <p class="whitespace big">{{item.hosName}}&ensp;</p>
                                    </div>
                                </item-flex-img>
                                <span class="docicon common">医生</span>
                            </div>
                        </div>
                        <template v-else-if="['11', '12'].indexOf(item.type) != -1 && item.teamName">
                            <div class="teamleader whitespace">
                                <i class="bgcove" :style="`background-image:url(${imgsrc(item.logoUrl)})`"></i>
                                <span class="teamname">{{item.teamName}}</span>
                            </div>
                            <div class="teammember whitespace" v-if="form.ltype!=4">
                                <span class="maincolor first">{{ item.type=='12' ? '首诊': '申请' }}</span>
                                <i class="bgcove" :style="`background-image:url(${imgsrc(item.docHeadImageUrl)})`"></i>
                                <span class="big14">{{ item.docName }} </span>
                                <span class="big13" style="color:#9196a1;">{{ item.hosName }}</span>
                            </div>
                        </template>
                        <template v-else>
                            <p class="whitespace" style="margin-right:5rem;">
                                <span class="big16 blacklower docName" v-if="item.docName">
                                    <i class="bgcove" :style="`background-image:url(${imgsrc(item.docHeadImageUrl)})`"></i>{{item.docName}}</span>
                                <span class="big16 blacklower" v-else>{{ item.type == '9' ? '等待医生接诊...' : '待分配医生...' }}</span>
                                <span class="big14 blacklower">&ensp;{{item.hosName}}&ensp;{{item.depName}}</span>
                            </p>
                        </template>
                        <p class="ask big14 whitespace" v-if="['4', '5'].indexOf(item.type) == -1 && item.mainSuit">{{item.mainSuit}}</p>
                        <span class="absolute big16 sign" :class="{'endorder': item.status=='40' ||item.status=='30'||item.status=='50'}">
                            {{ form.ltype == 1 ? tabs[form.ltype] : allStatus[item.status] }}
                        </span>
                    </div>
                    <div class="order_foot">
                        <span class="ordertype" :class="{'applyorder':item.type=='4'||item.type=='5'||item.type=='11'}">{{ orderask[[item.type].concat(item.ctype || []).join('-')] }}</span>
                        <span class="timer">{{item.timeStr}}</span>
                        <span class="righticon warncolor" v-if="form.ltype==1" @click="toPay(item)">去支付</span>
                        <span class="" v-if="form.ltype==3" @click="toEvaluate(item)">
                            <span v-if="!(item.expertId && item.doctorId) && (item.type=='4'||item.type=='5')"></span>
                            <span v-else-if="!item.doctorId"></span>
                            <span class="righticon toapri" v-else>去评价</span>
                        </span>
                        <span class="righticon warncolor" v-if="form.ltype==2 && item.type=='12'" @click="jumppage(item)">查看复诊回复</span>
                        <span class="righticon warncolor" v-if="form.ltype==2 && item.type=='4'||item.type=='5'" @click="jumppage(item)">查看申请详情</span>
                        <span class="righticon warncolor" v-if="form.ltype==2 && item.type=='11'&& item.relativeOrderUuid !=null" @click="toDetails(item)">查看会诊详情</span>
                    </div>
                </div>
            </div>
        </scroller>
    </div>
</template>
<script>
import { Tab, TabItem, Scroller, XButton } from 'vux'
import { NoOrder, ItemFlexImg } from '@components/share'
import goeasy from '@mixins/goeasy'
import { imgsrc } from '@filters'

export default {
    components: {
        Tab,
        TabItem,
        Scroller,
        XButton,
        NoOrder,
        ItemFlexImg
    },
    mixins: [goeasy],
    data() {
        return {
            tabs: { '1': '待付款', '2': '待就诊', '3': '待评价', '4': '历史' },
            allStatus: this.$store.state.orderState,
            orderask: this.$store.state.orderType,
            order: [],
            noresult: false,
            form: {
                openid: this.$store.state.openid,
                pageNo: 1,
                pageSize: 10,
                ltype: this.$route.params.id
            },
            pullupConfig: this.$store.state.pullupConfig,
            scroll: {
                pullupStatus: ''
            },
            currUrl: this.$route.fullPath
        }
    },
    created() {
        this.loadPullUp()
    },
    methods: {
        imgsrc,
        refresh(key) {
            key.indexOf(':') != -1 && this.orders()
        },
        //tab点击
        orders(index) {
            index = index || this.form.ltype || '4'
            this.order = []
            this.form.pageNo = 1
            this.form.ltype = index
            this.scroll.pullupStatus = 'enabled'
            this.$nextTick(() => {
                this.$refs.scroller.reset({ top: 0 })
            })
            this.noresult = false
            this.loadPullUp()
            this.$router.replace('/inquirylist/' + index)
        },
        //页面跳转
        jumppage(item, main) {
            let id = item.doctorId
            let query = { id, oid: item.uuid, otype: item.type }
            let route = { path: '/chat', query }
            if (item.type == 9 && !id) {
                if (item.payStatus == 4 && this.form.ltype < 3 ) return this.toPay(item)
                route = this.form.ltype < 3 ? { path: '/fastfind/' + item.uuid, query: { from: this.currUrl } } : route
            } else if (item.type == 4 || item.type == 5) {
                route = { path: '/details', query: { oid: item.uuid, otype: item.type } }
            } else if (!id && ['11', '12'].indexOf(item.type) == -1) {
                route = null
            }
            route ? this.$router.push(route) : this.$vux.toast.show({
                type: 'text',
                text: `暂无操作`,
                position: 'bottom'
            })
        },
        toPay(item) {
            this.$router.push({ path: '/pay', query: { oid: item.uuid, otype: item.type } })
        },
        toDetails(item) {
            this.$router.push({ path: '/details', query: { oid: item.uuid, otype: item.type } })
        },
        toEvaluate(item){
            this.$router.push({ path: '/evaluate',query:{ oid: item.uuid, otype: item.type, back: -1 }})
        },
        //上拉加载
        loadPullUp() {
            this.$http.get(this.$urls.MYORDERS, this.form, this).then(data => {
                    let orders = data.orders || [];
                    this.order = this.order.concat(orders)
                    this.$nextTick(() => {
                        this.$refs.scroller.reset(this.form.pageNo == 1 ? { top: 0 } : {})
                    })
                    if (this.form.pageNo == 1 && !orders.length) {
                        this.noresult = true
                    }
                    setTimeout(() => {
                        if (orders.length == this.form.pageSize) {
                            this.form.pageNo++;
                            this.scroll.pullupStatus = 'default'
                        } else {
                            this.scroll.pullupStatus = 'disabled'
                        }
                    }, 100)
                })
        }
    }
}
</script>
<style lang="less" scoped>
@import '../../../assets/css/var';
.warncolor {
    color: @warn-color;
}

.minbox {
    background: #fff;
    margin-bottom: .5rem;
    .doc {
        padding: 1.5rem 0 2.16rem;
        margin: 0 .7rem;
        .sign {
            top: .5rem;
            right: .8rem;
            color: @main-color;
            &.endorder {
                color: @gray-color;
            }
        }
    }
    .paddingBot {
        padding-bottom: .83rem;
    }
    .applyitem {
        display: inline-block;
        width: 47%;
        height: 5.6rem;
        background: #f9fafa;
        box-sizing: border-box;
        margin-top: 1.875rem;
        position: relative;
        &+.applyitem {
            margin-left: 3%;
        }
        .common {
            position: absolute;
            top: -.7rem;
            right: .3rem;
            background: @main-color;
            color: #fff;
            font-size: .9rem;
            width: 2.7rem;
            height: 1.5rem;
            line-height: 1.5rem;
            text-align: center;
            border-radius: .3rem;
        }
        .docicon {
            background: #9196a1;
        }
        div {
            color: #222;
        }
    }
    .teamleader {
        margin-bottom: 1.2rem;
        margin-right: 5rem;
        i {
            display: inline-block;
            width: 2.125rem;
            height: 2.125rem;
            border-radius: 50%;
            vertical-align: middle;
            margin-right: .8rem;
        }
        .teamname {
            font-size: 1.4rem;
            color: #222;
        }
    }
    .teammember {
        color: #222;
        .first {
            font-size: .9rem;
        }
        i {
            display: inline-block;
            width: 1.66rem;
            height: 1.66rem;
            border-radius: 50%;
            margin: 0 .4rem;
            vertical-align: middle;
        }
    }
    .ask {
        color: #9196a1;
        margin-top: 1.8rem;
    }
    .docName {
        i {
            display: inline-block;
            width: 2.08rem;
            height: 2.08rem;
            border-radius: 50%;
            vertical-align: middle;
            margin-right: .8rem;
        }
    }
}

.order_foot {
    position: relative;
    padding: 1rem .7rem;
    &:before {
        .setTopLine(#eee);
        left: .7rem;
    }
    .timer {
        padding-left: .83rem;
        font-size: .9rem;
        color: #9196a1;
    }
    i {
        float: right;
        font-size: .7rem;
        color: @gray-color;
        padding-top: .25rem
    }
    .righticon {
        float: right;
        font-size: 1.08rem;
        height: 1.95rem;
        line-height: 1.95rem;
        border: 1px solid #f6ab00;
        padding: 0 .8rem;
        border-radius: 1.5rem;
        margin-top: -.3rem;
    }
    .toapri {
        color: #9196a1;
        border: 1px solid #9196a1;
    }
    .ordertype {
        font-size: .9rem;
        color: @main-color;
        padding: .2rem .4rem;
        background: #e5f3fa;
        border-radius: .1rem;
    }
    .applyorder {
        background: #fef6e5;
        color: @warn-color;
    }
}
</style>
<style lang="less">
@import '../../../assets/css/var';
.orderPage {
    .vux-tab {
        border-bottom: 1px solid #eee;
        .vux-tab-item {
            font-size: 1.167rem;
            color: #222;
        }
        .vux-tab-item.vux-tab-selected {
            color: @main-color;
            font-weight: 600;
            border: 0;
        }
        .vux-tab-bar-inner {
            background-color: @main-color;
        }
    }
}
</style>
