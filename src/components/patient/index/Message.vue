<template>
    <div class="scroll flex_1 latelyPage bgfff">
        <item-flex-img radius="50%" class="relative acenter systeminfo msgitem"
            link="/systeminfolist"
            size="3.07rem">
            <span class="newtip_count" slot="thumb" v-if="systemMsg.count && systemMsg.count!=0">{{systemMsg.count}}</span>
            <div class="mainboxcopy">
                <p class="flex relative">
                    <span class="whitespace docname">系统消息</span>
                    <span class="small11 absolute right time" v-if="systemMsg.timeStr">{{systemMsg.timeStr}}</span>
                </p>
                <p class="ask whitespace big14" v-if="systemMsg.content">{{systemMsg.content}}</p>
                <p class="ask whitespace big14" v-else>暂无系统消息</p>
            </div>
        </item-flex-img>
        <item-flex-img radius="50%" class="relative acenter orderinfo msgitem"
            link="/orderinfolist"
            size="3.07rem">
            <span class="newtip_count" slot="thumb" v-if="orderMsg.isRead==0 && orderMsg.newCount">{{orderMsg.newCount}}</span>
            <div class="mainboxcopy">
                <p class="flex relative">
                    <span class="whitespace docname">订单消息</span>
                    <span class="small11 absolute right time" v-if="orderMsg.timeStr">{{orderMsg.timeStr}}</span>
                </p>
                <p class="ask whitespace big14" v-if="orderMsg.content">{{orderMsg.content}}</p>
                <p class="ask whitespace big14" v-else>暂无订单消息</p>
            </div>
        </item-flex-img>
        <item-flex-img
            v-for="(item, index) in message" :key="index"
            :img="item.headImage" radius="50%" class="relative msgitem acenter"
            :link="{ path: '/chat', query: { id: item.doctorId, uid: item.subUserUuid, oid: item.orderUuid, otype: item.orderType }}"
            size="3.07rem">
            <span v-if="item.isRead==0" class="g_newtip" slot="thumb"></span>
            <div class="mainboxcopy">
                <p class="relative" style="margin-right: 2rem;">
                    <span class="docname">{{item.docName}}</span>
                    <span class="tcenter big14" :class="orderTypeColor(item.orderType)" v-html="`[${orderTypeName(item)}]`"></span>
                </p>
                <span class="small11 absolute infotime">{{item.timeStr}}</span>
                <p class="ask whitespace big14">{{item.msgContent}}</p>
            </div>
        </item-flex-img>
    </div>
</template>
<script>
    import { ItemFlexImg } from '@components/share'
    import debounce from 'vux/src/tools/debounce'
    import goeasy from '@mixins/goeasy'
    export default{
        components: {
            ItemFlexImg
        },
        mixins: [goeasy],
        created () {
            this.$vux.loading.show()
            this.message = JSON.parse(localStorage.getItem('_cache_message_') || '[]')
            this.initData()
        },
        data () {
            return {
                orderType: this.$store.state.orderType,
                message: [],
                orderMsg: {},
                systemMsg: {}
            }
        },
        methods: {
            refresh: debounce(function(key){
                key.indexOf('rongCloudNotify') != -1 && this.initData()
            }, 2000),
            initData () {
                this.$http.get(this.$urls.MYMESSAGELIST, { 
                    openid: this.$store.state.openid 
                }, this).then(d => {
                    this.$vux.loading.hide()
                    localStorage.setItem('_cache_message_', JSON.stringify(this.message = d.messages || []))
                    this.orderMsg = d.orderMsg || {};
                    this.systemMsg = d.systemMessage || {};
                })
            },
            orderTypeName (item) {
                let type = item.orderType
                if (!type || type == '8' || type == '15' || type == '99') {
                    return '对就诊人 <span class="maincolor">' + item.userName +'</span> 的随访'
                } else {
                    return this.orderType[type]
                }
            },
            orderTypeColor (type) {
                if (type == 6 || type == 7 || type == 9 || type == 12) {
                    return 'maincolor'
                } else if (!type || type == '8' || type == '15' || type == '99') {
                    return 'time'
                } else if (type == 11) {
                    return 'applycolor'
                }
            }
        }
    }
</script>
<style lang="less">
    @import "../../../assets/css/var";
    .latelyPage{
        .msgitem{
            margin: 0!important;
            padding: 1.167rem .8rem!important;
            & + .msgitem:after{
              .setTopLine(#e5e5e5, 1px);
              left: 1rem;
            }
        }
        .mainboxcopy {
            p:first-child {
                margin-bottom:.5rem;
            }
            .docname {
                margin-right:.5rem;
                font-size:1.25rem;
                color:#222;
            }
        }
        .ask{
            .alignItem(flex-end);
            color:#9196a1;
        }
        .time {
            color:#9196a1;
        }
        .infotime {
            color:#9196a1;
            right:.8rem;
            top:1.3rem;
        }
        .reportcolor {
            color:#ef6666;
        }
        .applycolor {
            color:#f6ab00;
        }
        .outerthumb{ position: relative; }
        .g_newtip{ position: absolute; top: -5px;right: -5px;}
        .orderinfo {
            .thumb {
                background-image: url(../../../assets/img/message/orderinfo.png) !important;
            }
        }
        .systeminfo {
              .thumb {
                  background-image: url(../../../assets/img/message/systeminfo.png) !important;
              }
        }
        .newtip_count {
            position :absolute;
            display:inline-block;
            min-width: 1.2rem;
            height: 1.2rem;
            line-height: 1.1rem;
            border-radius: 50%;
            text-align: center;
            color: #fff;
            background: #e60012;
            top: -4px;
            right: -3px;
            font-size: .6rem;
        }
    }
</style>


