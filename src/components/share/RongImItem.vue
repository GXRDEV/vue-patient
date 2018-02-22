<template>
    <div class="msgouter">
        <div class="dt msgsystem tcenter" v-if="['RC:WarmMsg', 'RC:SysMsg'].indexOf(item.msgType) != -1">
            <slot name="remarktop"></slot>
            <span v-if="item.msgType=='RC:WarmMsg'" class="borderbox sysmind">
                <router-link to="/mysendminds" class="flex acenter tleft">
                    <img src="../../assets/img/chat/mymind.png">
                    <span class="flex_1">您送出了&ensp;
                        <label class="pf-medium">“{{ item.msgContent }}”</label>，和谐医患，你我共筑</span>
                </router-link>
            </span>
            <span v-if="item.msgType=='RC:SysMsg'" class="small10" v-html="item.msgContent"></span>
        </div>
        <div class="flex msgitem" v-else-if="item.sendType" :class="item.sendType == '1' ? 'me' : 'you'">
            <label class="thumb radius50">
                <img :src="item.sendType == '1' ? imgsrc(uwr.headImageUrl, 'user') : imgsrc($parent.doc.listSpecialPicture, 'doc')" class="img-circle" alt="">
            </label>
            <span class="flex_1 msgcontext relative big14" v-if="item.msgType"
                :class="{'nopadding img': item.msgType=='RC:ImgMsg', 'nopadding audio': item.msgType=='RC:VcMsg'}"
                :style="item.msgType=='RC:VcMsg' ? `width:${width}%;` : ''">
                <template v-if="item.msgType=='RC:TxtMsg'">
                    <label class="txtmsg" v-html="toemjc(item.msgContent)"></label>
                    <b v-if="state=='saving'">
                        <i class="weui-loading"></i>
                    </b>
                    <b v-if="state=='error'" @click="resend">
                        <icon type="warn" style="font-size:18px"></icon>
                    </b>
                </template>
                <template v-if="item.msgType=='RC:ImgMsg'">
                    <img @click="$emit('play')" :src="imgsrc(item.msgContent || item.fileUrl, 'nopic@2x', '100', 'm_lfit')" :style="{'height': imgheight}" alt="图片占位">
                    <b v-if="state=='saving' || state=='loading'">
                        <i class="weui-loading"></i>
                    </b>
                    <b v-if="state=='error'" @click="resend">
                        <icon type="warn" style="font-size:18px"></icon>
                    </b>
                </template>
                <template v-if="item.msgType=='RC:VcMsg'">
                    <button @click="$emit('play')" class="flex acenter" :class="{'playing': state=='play'}">
                        <span class="flex_1"><i class="iconfont icon-yuyin1"></i></span>
                        <i class="seconds" v-if="!state">{{ length }} ″</i>
                    </button>
                    <b v-if="state=='saving' || state=='loading'">
                        <i class="weui-loading"></i>
                    </b>
                    <b v-if="state=='error'" @click="resend">
                        <icon type="warn" style="font-size:18px"></icon>
                    </b>
                </template>
            </span>
            <slot></slot>
        </div>
        <div class="dt msgsystem small11 tcenter">
            <label class="msgtime" v-if="msgTime">{{ msgTime | formatDT }}</label>
            <slot name="remarkbottom"></slot>
        </div>
    </div>
</template>
<script>
import { Icon } from 'vux'
import { imgsrc, formatDT } from '@filters'
import { mapState } from 'vuex'
export default {
    name: 'rongimitem',
    props: {
        value: String,
        item: Object,
        targetId: String,
        token: String,
        type: {
            type: String,
            default: 'PRIVATE' // GROUP, PRIVATE
        }
    },
    components: {
        Icon
    },
    filters: {
        formatDT
    },
    computed: {
        ...mapState({
            uwr: state => state.uwr || {}
        }),
        length () {
            return Math.floor(this.item.msgContent.length / 1024)
        },
        width () {
            return this.length / 60 * 100
        }
    },
    created() {
        let that = this
        this.state = this.item.state
        this.msgTime = this.item.msgTime
        this.initVoice()
        if (this.item.msgType == 'RC:ImgMsg') {
            let im = new Image()
            im.onload = function() {
                let h = Math.round(100 / this.width * this.height)
                that.imgheight = h + 'px'
                that.$emit('on-ready', that.item.autoscroll)
            }
            im.src = imgsrc(this.item.msgContent || this.item.fileUrl, 'nopic@2x', '100', 'm_lfit')
        } else {
            that.$emit('on-ready', that.item.autoscroll)
        }
    },
    watch: {
        value(v) {
            this.state = v
        },
        state(v) {
            if (v == 'saving') {
                let Rtype = ''
                let content = { ...this.item.content }
                if (this.item.msgType == 'RC:TxtMsg') {
                    Rtype = 'TextMessage'
                } else if (this.item.msgType == 'RC:ImgMsg') {
                    Rtype = 'ImageMessage'
                    content.content = content.content.split(';base64,')[1];
                } else if (this.item.msgType == 'RC:VcMsg') {
                    Rtype = 'VoiceMessage'
                }
                this.send(Rtype, content).then(msg => {
                    this.state = ''
                    this.msgTime = msg.sentTime
                    this.$vux.toast.show({
                        type: 'text',
                        text: '发送成功',
                        position: 'top'
                    })
                })
            }
            this.$emit('input', v)
        }
    },
    methods: {
        imgsrc,
        toemjc(text) {
            if (typeof RongIMLib != 'undefined' && 'RongIMEmoji' in RongIMLib) {
                return RongIMLib.RongIMEmoji.symbolToEmoji(RongIMLib.RongIMEmoji.emojiToSymbol(text))
            } else {
                return text
            }
        },
        info(errorCode, message) {
            let info = ''
            /*global RongIMLib */
            switch (errorCode) {
                case RongIMLib.ErrorCode.TIMEOUT:
                    info = '超时'
                    break
                case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                    info = '未知错误'
                    break
                case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                    info = '在黑名单中，无法向对方发送/接收消息'
                    break
                case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                    info = '不在讨论组中'
                    break
                case RongIMLib.ErrorCode.NOT_IN_GROUP:
                    info = '不在群组中'
                    break
                case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                    info = '不在聊天室中'
                    break
                case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
                    info = '不可接受的协议版本'
                    break
                case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
                    info = 'appkey不正确'
                    break
                case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
                    info = '服务器不可用'
                    break
                default:
                    info = '未知错误'
                    break
            }
            this.state = 'error'
            alert('发送失败:' + info)
        },
        checkSend() {
            /*
            * 0: 连接成功，1：连接中，2：断开连接，6：在其他设备登录，-1：网络不可用
            */
            let that = this
            return new Promise((resolve, reject) => {
                let connectStatus = RongIMClient.getInstance().getCurrentConnectionStatus()
                switch (connectStatus) {
                    case 2:
                    case 6:
                        RongIMClient.reconnect({
                            onSuccess: function(userId) {
                                resolve()
                                console.log('reConnect successfully.' + userId)
                            },
                            onError: function(errorCode, message) {
                                that.info(errorCode, message)
                                reject()
                            }
                        })
                        break
                    case -1:
                    case 3:
                        RongIMClient.connect(that.token, {
                            onSuccess: function(userId) {
                                resolve()
                                console.info('reLogin successfully：' + userId);
                            },
                            onTokenIncorrect: function() {
                                alert('token无效，请刷新重试')
                                reject()
                            },
                            onError: function(errorCode, message) {
                                that.info(errorCode, message)
                                reject()
                            }
                        })
                        break
                    case 1:
                        console.log('连接中...')
                    case 0:
                    default:
                        resolve()
                }
            })
        },
        send(TYPE, content) {
            /*
                type枚举：TextMessage，ImageMessage，RichContentMessage，VoiceMessage
            */
            let that = this
            return new Promise((resolve, reject) => {
                if (typeof RongIMClient == 'undefined') {
                    reject('融云未准备就绪')
                } else {
                    that.checkSend().then(() => {
                        RongIMClient.getInstance().sendMessage(
                            RongIMLib.ConversationType[that.type],
                            that.targetId,
                            new RongIMLib[TYPE](content), {
                                onSuccess: resolve,
                                onError: function(errorCode, message) {
                                    that.info(errorCode, message)
                                }
                            })
                    })
                }
            })
        },
        resend() {
            let that = this
            this.$vux.confirm.show({
                title: '是否重新发送？',
                content: '可能由于网络原因或者融云服务限制导致，请重试或者压缩图片。',
                onConfirm() {
                    that.state = 'saving'
                }
            })
        },
        initVoice () {
            let that = this
            if (this.item.msgContent && this.item.msgType == 'RC:VcMsg') {
                if (typeof RongIMLib != 'undefined' && 'RongIMVoice' in RongIMLib) {
                    this.state = 'loading'
                    RongIMLib.RongIMVoice.preLoaded(this.item.msgContent, () => {
                        that.state = ''
                        that.$emit('on-ready', that.item.autoscroll)
                    })
                } else {
                    window.setTimeout(this.initVoice)
                }
            }
        }
    },
    data() {
        return {
            state: '',
            msgTime: '',
            imgheight: '178px'
        }
    }
}
</script>
<style lang="less">
@import '../../assets/css/var';
@left-bg: #fff;
@left-txt: #000;
@left-border: #E5E5E5;
@left-border-bg: #fff;

@right-bg: @main-color;
@right-txt: #fff;
@right-border: @main-color;
@right-border-bg: @main-color;
.msgouter {
    label.thumb {
        .flex(0 0 40px);
        height: 40px;
        margin: 2px 1px 0 0;
        img {
            width: 40px;
            height: 40px;
        }
    }
    .dt {
        padding: 0 .5em;
        &>span {
            display: inline-block;
            padding: 1em 1.5em;
            margin: 1em 0;
            background: #C9CBCF;
            color: #fff;
            border-radius: 2em;
        }
        .sysmind {
            padding: .5em 1em;
            background: #E0E1E3;
            font-size: 1rem;
            border-radius: 4px;
            img {
                width: 1rem;
                margin-right: .5rem;
            }
            label {
                color: #ff757d;
            }
            span {
                color: #9196a1;
            }
        }
        .msgtime {
            color: #C1C3C8;
        }
    }
    .msgitem {
        padding: 2em 0 .6em;
        .justifyContent(flex-start);
        .alignItem(flex-start);
    }
    .msgcontext {
        position: relative;
        box-sizing: border-box;
        .flex(0 1 auto);
        color: @left-txt;
        margin: 0 .5em;
        border: 1px solid @left-border;
        background: @left-bg;
        border-radius: 0 1em 1em 1em;
        padding: 1em 1.5em;
        line-height: 1.6;
        min-height: 50px;
        min-width: 80px;
        word-wrap: break-word;
        word-break: break-all;
        .txtmsg {
            white-space: pre-wrap;
        }
        &.fullline {
            .flex(1 1 auto);
        }
        img {
            position: relative;
            z-index: 2;
            width: 100px;
            border-radius: 0 1em 1em 1em;
        }
        p {
            line-height: 1.4;
        }
        &.nopadding {
            line-height: 0!important;
            padding: 0!important;
        }
        b {
            position: absolute;
            right: -30px;
            top: 50%;
            font-size: 0.85em;
            -webkit-transform: translateY(-50%);
            transform: translateY(-50%);
            color: #888;
            font-weight: 400;
        }
        &.audio {
            button {
                width: 100%;
                height: 50px;
                text-align: left;
                padding-left: 0.8em;
                border: 0;
                background: transparent;
                color: inherit;
                .iconfont {
                    font-size: 1.6em;
                    display: inline-block;
                    overflow: hidden;
                    line-height: 1.2em;
                    height: 1.2em;
                    width: 1.2em;
                    border-radius: 50%;
                    vertical-align: -3px;
                }
                .seconds{
                    font-style: normal;
                    padding: 0 1em;
                    white-space: nowrap;
                }
            }
            button.playing {
                .iconfont {
                    opacity: .5;
                    -webkit-animation-duration: 0.9s;
                    animation-duration: 0.9s;
                    -webkit-animation-fill-mode: both;
                    animation-fill-mode: both;
                    animation-iteration-count: infinite;
                    -webkit-animation-iteration-count: infinite;
                    -webkit-animation-name: widthFadeIn;
                    animation-name: widthFadeIn;
                }
            }
        }
        .innerTime {
            transform: translateY(100%);
            -webkit-transform: translateY(100%);
            line-height: 2.6;
            white-space: nowrap;
        }
    }
    .me {
        .justifyContent(flex-end);
        .msgcontext {
            .orderFlex(0);
            background: @right-bg;
            color: @right-txt;
            border-color: @right-border;
            border-radius: 1em 0 1em 1em;
            &.audio {
                button {
                    transform: scaleX(-1);
                }
                .seconds{
                    font-style: normal;
                    transform: scaleX(-1);
                }
            }
            img {
                border-radius: 1em 0 1em 1em;
            }
            b {
                right: auto;
                left: -30px;
            }
        }
        label.thumb {
            .orderFlex(1);
            margin: 2px 0 0 1px;
        }
    }
}

@-webkit-keyframes widthFadeIn {
    from {
        width: 4px;
    }
    to {
        width: 1.2em;
    }
}

@keyframes widthFadeIn {
    from {
        width: 4px;
    }
    to {
        width: 1.2em;
    }
}
</style>
