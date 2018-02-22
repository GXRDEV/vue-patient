<template>
    <div class="maxmydoc h100 scroll relative" v-if="!nodoc">
        <div class="minmydoc relative" v-for="(item, index) in mydoc" :key="index">
            <div v-if="item.orderType == '15'">
                <item-flex-img class="itemFlex blacklower" :link="'/docinfo/' + item.doctorId" :img="item.docInfo.headImage" radius="9999px" size="3.42rem" thumb="right">
                    <p class="flex docteamname">
                        <span class="big20 whitespace">{{item.docInfo.docName}}&ensp;</span>
                        <span class="small10"><label class="duty" :data-txt="item.docInfo.duty">{{item.docInfo.duty}}</label></span>
                    </p>
                    <p class="big12">{{item.docInfo.hosName}}&ensp;｜ {{item.docInfo.depName}}</p>
                </item-flex-img>
                <router-link style="padding: .65rem 1.2rem;" :to="'/docdetail/' + item.doctorId" class="maincolor small10 sendcolor flex acenter">
                    <span>简介</span>
                    <i class="iconfont icon-arrright small8 gray"></i>
                </router-link>
            </div>
            <div v-if="item.orderType == '14'">
                <item-flex-img class="relative itemFlex blacklower" :link="'/teaminfo/' + item.team.id" :img="item.team.logoUrl" radius="9999px" size="3.42rem" logo="teamlogo" thumb="right">
                    <p class="flex docteamname">
                        <span class="big20 whitespace">{{ item.team.teamName }}&ensp; </span>
                        <span class="small10" v-if="item.depName"><label class="duty" :data-txt="item.depName">{{item.depName}}</label></span>
                    </p>
                    <p class="base12 whitespace team-color">擅长：{{ item.team.speciality || '暂无' }}</p>
                    <p class="username">
                        <i class="thumb bgcove" v-for="(m,index) in item.team.members" :key="index" :style="`background-image:url(${imgsrc(m.headImageUrl,'user-head')})`"></i>
                        <span class="big12"> &nbsp;等{{ item.team.memberCount }}位医生</span>
                    </p>
                </item-flex-img>
            </div>
            <footer class="clearfix">
                <div class="nodoc flex" v-if="item.status == 10 ">
                    <span class="flex_1 big12">您的签约信息已发送成功，请耐心等待医生通过...</span>
                </div>
                <div v-else>
                    <template v-if="item.orderType == '15'">
                        <router-link :to="{ path: '/chat', query: { id: item.doctorId, oid: item.orderUuid, otype: item.orderType, uid: item.subUserUuid }}">
                            <section class="msg base12 flex acenter" v-if="item.newMsg">
                                <span class="small10 maincolor sendcolor">最新消息&emsp;</span>
                                <span class="flex_1 whitespace base12 msgcolor ohidden">{{item.newMsg}}</span>
                                <i class="iconfont icon-arrright small9 gray"></i>
                            </section>
                        </router-link>
                        <div class="jumps small10 flex jend">
                            <router-link :to="{ path: '/evaluate', query: { id: item.doctorId, oid: item.orderUuid, otype: item.orderType }}">
                                <span class="toeva">去评价</span>
                            </router-link>
                            <router-link :to="{ path: '/give', query: { docid: item.doctorId, oid: item.orderUuid, otype: item.orderType, uid: item.subUserUuid }}">
                                <span class="togive">送心意</span>
                            </router-link>
                            <router-link :to="{ path: '/chat', query: { id: item.doctorId, oid: item.orderUuid, otype: item.orderType, uid: item.subUserUuid }}">
                                <span class="tochat"><i class="icon iconfont icon-liaotian"></i> 发起沟通</span>
                            </router-link>
                        </div>
                    </template>
                    <div v-if="item.orderType == '14' && item.telphone" class="maincolor small10 teamline">
                        如想履行团队VIP服务，请点击拨打团队助理热线
                        <a class="phone" rel="nofollow" :href="`tel:${item.telphone}`" target="_blank">点击拔打</a>
                    </div>
                    <router-link :to="'/serverdes?type='+ item.orderType +'&oid='+ item.orderUuid" tag="div" class="server small10 relative">
                        <p>
                            <template v-if="item.orderType == '15'">
                                <span class="privatetitle">私人医生</span>
                                <span class="privatetext">签约患者&ensp;<span class="blacklower">{{ item.userName }}</span></span>
                            </template>
                            <span class="servertitle" v-if="item.orderType == '14'">团队VIP服务</span>
                            <i class="iconfont icon-arrright small8 gray"></i>
                        </p>
                        <p class="timeabled">
                            有效期限&ensp;<span class="blacklower">{{item.startDate.split('-').join('/')}}&ensp;至&ensp;{{item.endDate.split('-').join('/')}}</span>
                        </p>
                    </router-link>
                </div>
            </footer>
        </div>
    </div>
    <no-doctor v-else title="您还没有签约医生或团队" subtitle="您签约过的医生或团队将会在这里显示" linktitle="去签约" to="/libs/doc/all?serviceId=15"></no-doctor>
</template>
<script>
import { NoDoctor, ItemFlexImg } from '@components/share'
import debounce from 'vux/src/tools/debounce'
import goeasy from '@mixins/goeasy'
import { imgsrc } from '@filters'
export default {
    components: {
        NoDoctor,
        ItemFlexImg
    },
    mixins: [goeasy],
    created () {
        this.$vux.loading.show()
        this.mydoc = JSON.parse(localStorage.getItem('_cache_mysign_') || '[]')
        this.initData()
    },
    data () {
        return {
            mydoc: [],
            nodoc: false,
            hash: this.$route.fullPath
        }
    },
    methods: {
        imgsrc,
        refresh: debounce(function(key){
            this.initData()
        }, 2000),
        initData () {
            this.$http.get(this.$urls.MYPRIVATEDOCS, {
                openid: this.$store.state.openid
            }, this).then(d => {
                localStorage.setItem('_cache_mysign_', JSON.stringify(this.mydoc = d.orders || []))
                this.nodoc = !this.mydoc.length
                this.$vux.loading.hide()
            }).catch(() => {
                this.nodoc = !this.mydoc.length
            })
        }
    }
}
</script>
<style lang="less" scoped>
@import '../../../assets/css/var';
.minmydoc {
    background: #fff;
    margin: .708rem;
    .msgcolor {
        color: #878d99;
    }
    p {
        line-height: 1.4;
        &+p {
            margin-top: .75rem;
        }
    }
    .itemFlex{
        padding: 1rem 1.2rem 0 .2rem
    }
    .docteamname{
        align-items: flex-end;
        line-height: 1;
        .duty {
            color: transparent; white-space: nowrap;
            padding: 1px 4px; vertical-align: 3px;
            margin-right: 1em; background-color: #878d99; border-radius: .2rem;
            position: relative;
            &:after{
                content: attr(data-txt); color: #fff;
                position: absolute;left: 50%; top: 50%; z-index: 1; transform: translate(-50%, -46.5%);
            }
        }
    }
    .msg {
        position: relative;
        margin: 0 1.2rem;
        line-height: normal;
        padding: .5rem 3px .5rem .7rem;
        background: #f2f8fb;
        border-radius: .2rem;
    }
    footer {
        .nodoc {
            color: @main-color;
            line-height: 3.167rem;
            padding: .2rem .8rem .2rem 1.25rem;
            border-top: 1px solid #eee;
        }
        .jumps {
            position: relative;
            line-height: 0;
            height: 4.15rem;
            box-sizing: border-box;
            padding-top: 1.9rem;
            a {
                margin-left: 1.23rem;
                &:last-child {
                  margin-right: 1.2rem;
                }
            }
            .toeva {
                border: 1px solid #f6ab00;
                color:#f6ab00;
                border-radius:2rem;
                padding:.3rem .6rem;
            }
            .togive {
                border: 1px solid #fd6154;
                color:#fd6154;
                border-radius:2rem;
                padding:.3rem .8rem;
            }
            .tochat {
                border: 1px solid @main-color;
                color:@main-color;
                border-radius:2rem;
                padding:.3rem 1.1rem;
            }
        }
    }
}

.username {
    margin: .7rem 0 1rem;
    .thumb {
        display: inline-block;
        vertical-align: middle;
        width: 1.615rem;
        height: 1.615rem;
        border-radius: 50%;
        margin-right: .5rem;
    }
}

.teamline {
    height: 4.1rem;
    box-sizing: border-box;
    padding: 1.5rem 1rem;
    position: relative;
    &:before {
        .setTopLine(#eee);
        left: 1rem;
    }
}

.phone {
    position: absolute;
    right: 1rem;
    top: 1rem;
    background: @main-color;
    color: #fff;
    border-radius: 2rem;
    padding: .2rem .6rem;
    border: 4px solid #e5f3fa;
}
.server {
    background: #f9f9f9;
    box-sizing: border-box;
    padding: 1rem;
    .servertitle {
        color: @warn-color;
        background: #f9f2db;
        border-radius: 0 .6rem 0 .6rem;
        padding: .2rem .5rem;
    }
    .privatetitle {
        color: @main-color;
        background: #e1f0f7;
        border-radius: 0 .6rem 0 .6rem;
        padding: .2rem .5rem;
    }
    .privatetext{
        display:block; color:#878d99; margin-top:1rem;
    }
    .signdetail {
        position:absolute;
        top:50%;
        right:0;
        transform: translateY(-50%);
        display: inline-block;
        width: 4rem;
        height: 4rem;
        z-index: 10;
    }
    i {
        position: absolute;
        top: 50%;
        right: 1rem;
        transform: translateY(-50%);
    }
    .timeabled{
        color:#878d99; letter-spacing: .05rem;
    }
}
.androidcls {
    .jumps a span {
        padding-top:.4rem !important;
    }
}
</style>
<style lang="less">
.maxmydoc {
    .itemlist {
        margin-left: 1rem;
    }
}
</style>
