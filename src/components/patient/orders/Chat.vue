<template>
    <article class="h100vh flex column normaltheme" :class="{ 'hearttheme': themeHeart }">
        <media ref="media" @on-ended="endPlayAudio"></media>
        <rong-im-lib :token="rong.token" :appkey="rong.appkey" :receiveId="rong.receiveId" :type="rong.type" @on-recive-msg="reciveMsg" ref="rong"></rong-im-lib>
        <div @click="chooseemj=false" class="flex acenter jcenter orderstates relative" v-if="!singModel">
            <span class="flex_1 whitespace">
                <span class="big15">{{ allStatus[ostate] }}</span>
            </span>
            <span class="big13" v-if="ostate==20 && leaveTime">
                <span v-if="askIsBegin">
                    <count-down v-model="leaveTime" format="hh小时mm分"></count-down>后问诊结束
                </span>
                <span v-if="!askIsBegin && otype=='7'">
                    距离电话接通时间还有<count-down v-model="leaveTime" format="hh小时mm分"></count-down>
                </span>
                &emsp;
            </span>
            <span class="big13">
                <span v-if="ostate==10" class="button" @click="confirmCancel(50)">取消</span>
                <span v-else-if="ostate==20 || ostate==25" class="button" @click="confirmCancel(40)">结束</span>
                <span v-else-if="ostate==30" class="whitespace">
                    {{refusalReason}}
                    <span v-if="refusalReason && haspay">，</span>
                    <span v-if="haspay">诊费将在3个工作日内退还</span>
                </span>
                <span v-else-if="noappries" class="whitespace">本次问诊已结束，请及时评价</span>
                <span v-else-if="ostate==50" class="whitespace">问诊已取消<span v-if="haspay">，诊费将在3个工作日内退还</span></span>
            </span>
        </div>
        <header>
            <router-link v-if="id" :to="'/docinfo/' + id" class="docinfo bgfff flex acenter jcenter">
                <img :src="imgsrc(doc.listSpecialPicture, 'doc', '80')" alt="" class="thumb">
                <div class="flex_1 ohidden">
                    <p class="big14 pf-light whitespace" style="color: #9196a1;">{{doc.hosName}}&ensp;{{doc.depName}}&ensp;{{doc.duty}}</p>
                    <p class="big16" style="color: #222;">{{doc.specialName}}</p>
                </div>
                <i class="iconfont icon-arrright h100 flex acenter gray" style="padding:0 .6rem;"></i>
            </router-link>
            <div v-if="!id && ['11', '12'].indexOf(otype) != -1 && ostate < 30" style="background:#fff; padding: 1.4rem 1rem;" class="whitespace">
                团队正在为您分配问诊医生，请您稍后...
            </div>
        </header>
        <section id="bodyScroll" v-scroll="onScroll" @click="chooseemj=false" class="flex_1 messagelist scroll relative">
            <div class="absolute top w100 flex column acenter jcenter msg_tioptips g_padding">
                <span v-if="telTime">电话问诊接听时间&ensp;<label class="maincolor">{{telTime}}</label>&ensp;请保持通话畅通</span>
                <div v-if="relativeId" class="flex w100">
                    <span class="flex_1">您的会诊申请已成功生成正式会诊</span>
                    <router-link class="maincolor" :to="{ path: '/details', query: { id, oid: relativeId, otype: relativeType}}">
                        查看会诊详情&ensp;
                    </router-link>
                    <i class="iconfont icon-arrright small10 maincolor"></i>
                </div>
                <div v-if="scroll.pulldownStatus!='disabled'" class="weui-loadmore tcenter absolute top w100" style="margin: 4px auto;"><i class="weui-loading"></i></div>
            </div>
            <dl>
                <dd v-if="sickill.contactName" class="sillinfo">
                    <rong-im-item :item="{ sendType: '1' }">
                        <router-link :to="{ path: '/supply/'+this.timer, query: { from: $route.fullPath, oid, otype, ostate } }" class="msgcontext flex_1 fullline relative" style="padding: .5em 1.5em 0;">
                            <p class="big15">{{ sickill.contactName }}&ensp;{{ sickill.sex | sex }}&ensp;{{ sickill.age | age }}</p>
                            <p class="big14" v-if="sickill.mainSuit" v-html="sickill.mainSuit"></p>
                            <p class="imglists" v-if="sickimg.length">
                                <img-list class="inlineblock" v-for="(img, idx) in sickimg" :key="idx" :list="img.files" :stopEvent="true" width="4rem" height="4rem" modal="single" margin-right="8px" margin-bottom="8px"></img-list>
                            </p>
                            <p class="userinfo big14 flex"><span class="flex_1">完善病例信息</span><i class="iconfont icon-arrright small11"></i></p>
                        </router-link>
                        <label slot="remarkbottom" class="msgtime" v-if="sickill.createTime" v-html="sickill.createTime"></label>
                    </rong-im-item>
                </dd>
                <template v-if="ostate < 30 && otype != 99">
                    <dd v-if="ostate > 0 && otype != 15">
                        <rong-im-item :item="{ msgContent: '温馨提示：完善病历信息，以便医生快速准确的为您诊断', msgType: 'RC:SysMsg' }"></rong-im-item>
                    </dd>
                    <dd v-if="needpay">
                        <rong-im-item :item="{ msgContent: '支付提示：请尽快支付此次问诊~', msgType: 'RC:SysMsg' }"></rong-im-item>
                    </dd>
                </template>
                <dd v-for="(dd, idx) in msgs" :key="dd.id">
                    <rong-im-item :item="dd" v-model="dd.state" :type="rong.type" :token="rong.token" :targetId="rong.targetId" @on-ready="scrollToView" @play="rongEvent(idx)"></rong-im-item>
                </dd>
                <dd v-if="teamdoc.doctorId" class="msgouter teamreplay relative">
                    <div class="msgitem you msgcontext" style="padding: 1.2em 1.4em">
                        <div class="flex acenter jcenter">
                            <img :src="imgsrc(teamdoc.headImageUrl, 'doc', '80')" alt="" class="thumb">
                            <div class="flex_1 ohidden">
                                <p class="whitespace">
                                    <span class="big14">团队首席&ensp;{{teamdoc.docName}}</span>
                                    &emsp;<span class="big13 gray">({{[teamdoc.duty].concat(teamdoc.profession || []).join(' / ')}})</span>
                                </p>
                                <p class="whitespace gray">{{ teamdoc.hosName }}&ensp;{{teamdoc.hosDepart}}</p>
                            </div>
                        </div>
                        <div class="teamreplaycontent">
                            <label class="signitem absolute top right">复诊回复</label> {{teamdoc.teamresult}}
                        </div>
                    </div>
                    <div class="dt msgsystem small11 tcenter" v-if="teamdoc.createTime">
                        <label class="msgtime">{{teamdoc.createTime}}</label>
                    </div>
                </dd>
            </dl>
            <div id="lastElement" style="height: 4rem;"></div>
            <router-link :to="{ path: '/buyservice/'+ id, query: {otype, uid, back: -3} }" class="buyservice big14" v-if="ostate==20 || ostate==25">
              <img src="../../../assets/img/chat/chat-buy.png">
            </router-link>
        </section>
        <footer v-if="ostate==20 || ostate==25">
            <dl class="otherinput flex acenter jcenter tcenter">
                <dd class="flex_1" @click="showSpeak=!showSpeak, chooseemj=false">
                    <i v-if="showSpeak" class="iconfont icon-iconzhenghe26"></i>
                    <i v-else class="iconfont icon-yuyin2"></i>
                </dd>
                <dd class="flex_1" @click="chooseemj=false">
                    <wx-choose-img
                        @on-choose-end="beforeSendIMG"
                        @on-choose-ok="sendIMG">
                        <i class="iconfont icon-tupian2"></i>
                    </wx-choose-img>
                </dd>
                <dd class="flex_1" @click="chooseemj=!chooseemj, showSpeak=false">
                    <i class="iconfont icon-biaoqing1"></i>
                </dd>
            </dl>
            <form class="textinput" id="msgform" @submit.prevent="sendMSG" @click="chooseemj=false">
                <wx-speaking v-show="showSpeak"
                    @on-record-end="beforeSendRecord"
                    @on-record-ok="sendRecord"></wx-speaking>
                <texting v-show="!showSpeak" v-model="text" ref="texting"></texting>
            </form>
            <wx-choose-emj :show="chooseemj" @on-choose="fillEmj"></wx-choose-emj>
            <div v-if="!canInput" class="absolute left top flex acenter jcenter tcenter bbox w100 h100 disabledModel">
              您已连续输入6条了，请等待医生回复，或者赠送给医生一点小心意。
            </div>
        </footer>
        <footer v-else class="actionbtn tcenter">
            <router-link tag="p" v-if="ostate < 30 && needpay" :to="{ path: '/pay', query: { oid, otype, back: -1 }}" class="maincolor big16">
                去支付<i class="iconfont icon-arrright big13"></i>
            </router-link>
            <router-link tag="p" v-else-if="noappries" :to="{ path: '/evaluate', query: { id, oid, otype, back: -1 } }" class="maincolor big16">
                去评价<i class="iconfont icon-arrright big13"></i>
            </router-link>
            <router-link v-else-if="ostate==30" class="gray big16">
                医生{{ allStatus[ostate] }}
            </router-link>
            <p v-else-if="ostate==50" class="gray big16">
                {{ allStatus[ostate] }}问诊
            </p>
        </footer>
    </article>
</template>
<script>
    import { LoadMore, XButton } from 'vux'
    import { ItemFlexImg, Media, WxSpeaking, Texting, RongImLib, RongImItem, WxChooseImg, WxChooseEmj, ImgList, CountDown } from '@components/share'
    import Scroll from '@/directives/scroll'
    import { imgsrc, sex, age } from '@filters'
    import { WxJsPay, IsWxUrl } from '@plugins/api'
    import debounce from 'vux/src/tools/debounce'
    import goeasy from '@mixins/goeasy'

    export default {
        name: 'chat',
        components: {
            ItemFlexImg, Media, WxSpeaking, Texting, RongImLib, RongImItem,
            WxChooseImg, LoadMore, XButton, ImgList, CountDown, WxChooseEmj
        },
        directives: {
            Scroll
        },
        filters: {
            sex, age
        },
        mixins: [goeasy],
        beforeRouteLeave (to, from, next) {
            // 更新消息为已读
            let that = this
            this.$vux.loading.show()
            this.$http.post(this.$urls.MODIFYMSGTOREADED, {
                orderUuid: this.oid,
                orderType: this.singModel ? 99 : this.otype,
                doctorId: this.id,
                subUserUuid: this.uid
            }, this).then(hidenext).catch(hidenext)
            function hidenext() {
                that.$vux.loading.hide()
                next()
            }
        },
        created () {
            this.setRongCfg() //设置融去参数
            if (this.otype != 99) {
                this.gainOrderInfo().then(this.initPage)
                this.gainCaseInfo()
                this.gainTeamInfo()
            } else {
                this.ostate = 20
                this.initPage()
            }
        },
        mounted () {
            this.loadPullDown(this.scrollToView)
        },
        watch: {
            userid (v) {
                v && this.gainByUserId()
            }
        },
        methods: {
            imgsrc,
            refresh (key) {
                key.indexOf(':') != -1 && this.otype != 99 && this.gainOrderInfo()
            },
            initPage () {
                //连接融云
                (this.ostate == 20 || this.ostate==25) && this.connectRong()
                // 获取医生基本信息
                this.id && this.getDocInfo();
                // 获取是否送过心意
                this.id && this.gainByUserId()
            },
            connectRong () {
                // 患者报到中的单聊参数获取:GAINIMTOKEND2PSINGLE,oid
                // 订单聊天中的群聊参数获取:GAINIMTOKEND2PGROUP,oid,otype
                this.$http.get(this.$urls[this.rong.type == 'GROUP' ? 'GAINIMTOKEND2PGROUP' : 'GAINIMTOKEND2PSINGLE'], {
                    oid: this.oid,
                    otype: this.otype,
                    doctorId: this.id,
                    subUserUuid: this.uid
                }).then(d => {
                    this.rong.token = d.token
                    this.rong.appkey = d.appkey
                    this.rong.receiveId = d.targetId
                    this.rong.targetId = d.targetId
                })
            },
            setRongCfg () {
                if (this.singModel) {
                    this.rong.type = 'PRIVATE'
                    this.rong.extra[1] = 99
                    this.rong.extra[3] = 1
                } else {
                    this.rong.type = 'GROUP'
                    this.rong.extra[1] = this.otype
                    this.rong.extra[3] = 3
                }
            },
            gainCaseInfo () {
                // 订单中家庭成员病例信息
                this.otype != 15 && this.$http.get( this.$urls.GAINFAMILYCASEINFO, { oid: this.oid, otype: this.otype }).then(d => {
                    this.sickill = d.cinfo || {}
                    this.sickimg = d.attachments || []
                    this.rong.extra[2] = this.sickill.contactName || ''
                    this.scrollToView(true)
                })
            },
            gainTeamInfo () {
                //如果是团队获取团队复诊意见
                this.otype == '12' && this.$http.get(this.$urls.GAINREVISITINFO, {
                    orderId: this.oid, orderType: this.otype
                }).then(d => {
                    d.hasresult == 'true' && (this.teamdoc = d.doc || {}, this.teamdoc.teamresult = d.result)
                })
            },
            async gainOrderInfo () {
                await this.$http.get(this.$urls.GAINSIMPLEORDERINFO, {
                    oid: this.oid, orderType: this.otype
                }).then(d => {
                    this.id = d.doctorId || this.id
                    let currTime = +new Date()
                    let receiveTime = +new Date((d.receiveTime + '') .indexOf('-') != -1 ? d.receiveTime : parseInt(d.receiveTime || 0, 10))
                    let timeDual = d.timeDual || 0
                    let endTime = receiveTime + timeDual * 60000
                    this.ostate = d.status
                    this.haspay = this.id && d.payStatus == 1
                    this.needpay = this.id && d.payStatus == 4
                    this.noappries = this.ostate == 40 && !d.isAppraisal
                    this.refusalReason = d.refusalReason
                    this.telTime = d.telphoneTime || ''
                    this.relativeId = d.relativeUuid
                    this.relativeType = d.relativeType

                    if (currTime < receiveTime) {
                        this.askIsBegin = false
                        this.leaveTime = parseInt((receiveTime - currTime) / 1000, 10)
                    } else if (currTime >= receiveTime && currTime < endTime) {
                        this.askIsBegin = true
                        this.leaveTime = parseInt((endTime - currTime) / 1000, 10)
                    }
                    this.rong.extra[0] = d.uuid
                })
            },
            gainByUserId () {
                this.userid && this.$http.get(this.$urls.GAINWARMTIME, {
                    userId: this.userid, doctorId: this.id
                }).then(d => {
                    this.themeHeart = d.warmTime && d.warmTime.deadLine > (+new Date())
                })
            },
            getDocInfo () {
                this.$http.get(this.$urls.GAINDOCBASEINFO, { docid: this.id }).then(d => {
                    if(!d.doc || d.doc == 'null') return
                    this.doc = JSON.parse(d.doc)
                })
            },
            onScroll: debounce(function(e, position) {
                if (position.scrollTop < 5 && this.scroll.pulldownStatus == 'default') {
                    this.loadPullDown(this.scrollToTop)
                }
            }, 150),
            scrollToView (autoscroll) {
                autoscroll && this.$nextTick(() => {
                    document.getElementById('lastElement').scrollIntoView()
                })
            },
            scrollToTop () {
                let section = document.getElementById('bodyScroll')
                let resetBeforeHeight = section.scrollHeight
                this.$nextTick(() => {
                    let resetAfterHeight = section.scrollHeight
                    let offsetTop = resetAfterHeight - resetBeforeHeight
                    offsetTop > 0 && (section.scrollTop = offsetTop)
                })
            },
            loadPullDown (callback) {
                this.scroll.pulldownStatus = 'loading'
                this.$http.get( this.$urls.GAINCHATDATAS, {
                    oid: this.oid,
                    otype: this.singModel ? 99 : this.otype,
                    doctorId: this.id,
                    subUserUuid: this.uid,
                    pageSize: this.pageSize,
                    pageNo: this.pageNo
                }).then(d => {
                    let cur = d.messages || []
                    cur.length > 0 && (this.msgs = cur.map(item => {
                        return { ...item, state: '', autoscroll: this.pageNo == 1 }
                    }).concat(this.msgs))
                    setTimeout(() => {
                        if (cur.length == this.pageSize) {
                            this.pageNo++
                            this.scroll.pulldownStatus = 'default'
                        } else {
                            this.scroll.pulldownStatus = 'disabled'
                        }
                    }, 100)
                    typeof callback == 'function' && callback(true)
                })
            },
            playAudio (idx) {
                let msg = this.msgs[idx]
                if(!msg) return
                this.mediaId = idx
                msg.state = 'play'
                this.$refs.media.play(IsWxUrl(msg.fileUrl) ? msg.fileUrl : (msg.msgContent || msg.fileUrl))
            },
            endPlayAudio () {
                if(this.mediaId < 0) return
                this.msgs[this.mediaId].state = ''
                this.$refs.media.stop()
                this.mediaId = -1
            },
            rongEvent (idx) {
                let msg = this.msgs[idx]
                if (msg.msgType == 'RC:VcMsg'){
                    let bol = this.mediaId != idx
                    this.endPlayAudio()
                    bol && this.playAudio(idx)
                } else if (msg.msgType == 'RC:ImgMsg'){
                    this.$refs.media.show(this.msgs.filter(item => item.msgType == 'RC:ImgMsg').map((item, index) => {
                        return {
                            id: index,
                            src: item.fileUrl
                        }
                    }), msg.fileUrl)
                }
            },
            fillEmj (emj) {
                this.$refs.texting.insert(emj)
            },
            sendMSG () {
                let content = this.text
                if(!content || !this.canInput) return
                if (typeof RongIMLib != 'undefined' && 'RongIMEmoji' in RongIMLib) {
                    content = RongIMLib.RongIMEmoji.symbolToEmoji(content)
                }
                this.pushToMsgs('RC:TxtMsg', {
                    state: 'saving',
                    content: {
                        content: content,
                        extra: this.rong.extra.join(',')
                    }
                }, '1')
                this.text = ''
                this.chooseemj = false
            },
            beforeSendRecord (localId) {
                if(!this.canInput) return
                this.pushToMsgs('RC:VcMsg', {
                    state: 'loading',
                    content: {
                        content: '',
                        imageUri: localId
                    }
                }, '1')
            },
            sendRecord (base64, audioUrl, localId) {
                let item = this.msgs.find(item => item.fileUrl == localId)
                item.content = {
                    content: base64,
                    imageUri: audioUrl,
                    duration: base64.length / 1024,
                    extra: this.rong.extra.join(',')
                }
                item.msgContent = base64
                item.state = 'saving'
            },
            beforeSendIMG (localId, base64) {
                if(!this.canInput) return
                this.pushToMsgs('RC:ImgMsg', {
                    state: 'loading',
                    content: {
                        content: base64 || '',
                        imageUri: localId
                    }
                }, '1')
            },
            sendIMG (base64, imgUrl, localId) {
                let item = this.msgs.find(item => item.fileUrl == localId)
                item.content = {
                    content: base64,
                    imageUri: imgUrl,
                    extra: this.rong.extra.join(',')
                }
                item.state = 'saving'
            },
            reciveMsg (type, msg) {
                if (type == 'RC:ImgMsg') {
                    msg.content.content = 'data:image/'+ (msg.content.content.slice(0, 1) == '/' ? 'jpeg' : 'png') +';base64,' + msg.content.content
                }
                this.pushToMsgs(type, msg, '2')
            },
            pushToMsgs (msgType, msg, sendType = '') {
                this.msgs.push({
                    msgType,
                    autoscroll: true ,
                    state: msg.state || '',
                    content: msg.content,
                    msgContent: msg.content.content,
                    fileUrl: msg.content.imageUri,
                    sendType,
                    msgTime: msg.sentTime
                })
            },
            confirmCancel (sval) {
                let that = this
                let title = `${sval == '50' ? '取消' : '结束'}问诊？`
                let content = sval == '50' ? '您确定要取消此次问诊？' : '感谢您的使用，稍后请给我们的服务一个评价。'
                if (this.otype == '12' && !this.teamdoc.doctorId && sval == 40) {
                    content = '您的此次问诊还未得到复诊意见，确定要结束订单吗？'
                }
                if (this.otype == '9' && sval == 40) {
                    content = '您是否确定要结束此次问诊？结束后将无法与医生交流。'
                }
                this.$vux.confirm.show({
                    title,
                    content,
                    cancelText: '再等等',
                    onCancel () {},
                    onConfirm () {
                        that.completeOrder(sval)
                    }
                })
            },
            completeOrder (sval) {
                this.$http.post(this.$urls.COMPLETEDORDER, {
                    orderId: this.oid,
                    orderType: this.otype,
                    sval
                }).then(d => {
                    d.status == 'success' ? this.$vux.toast.show({
                        type: 'text',
                        width: '9em',
                        text: `${sval == '50' ? '取消' : '结束'}问诊成功`,
                        position: 'top'
                    }) : this.$vux.toast.show({
                        type: 'text',
                        width: '12em',
                        text: `${sval == '50' ? '取消' : '结束'}问诊失败，请重试`,
                        position: 'top'
                    })
                    this.gainOrderInfo()
                })
            }
        },
        data () {
            return {
                iswechat: this.$store.state.wechat,
                android: this.$store.state.android,
                allStatus: this.$store.state.orderState,
                id: this.$route.query.id, //聊天医生id
                uid: this.$route.query.uid, // 随访对象id
                oid: this.$route.query.oid, // 订单id
                otype: this.$route.query.otype, // 订单类型, 患者报到8
                showReplay: false,
                haspay: false,
                needpay: false,
                noappries: false,
                askIsBegin: false,
                leaveTime: 0,
                refusalReason: '',
                telTime: '',
                ostate: 0,
                pageSize: 10,
                pageNo: 1,
                doc: {},
                sickill: {},
                sickimg: [],
                mediaId: -1,
                showSpeak: false,
                chooseemj: false,
                themeHeart: false,
                text: '',
                timer: new Date().getTime(),
                scroll: {
                    pulldownStatus: 'default'
                },
                teamdoc: {},
                relativeId: '',
                relativeType: '',
                msgs: [],
                rong: {
                    type: '',
                    token: '',
                    appkey: '',
                    targetId: '',
                    receiveId: '',
                    extra: ['', '', '', '']
                }
            }
        },
        computed: {
            userid () {
                return this.$store.state.userid;
            },
            singModel () {
                return [8, 15, 99].indexOf(+this.otype) != -1
            },
            canInput () {
              return this.msgs.length >= 6 ? this.msgs.slice(-6).some(item => {
                return item.sendType != '1' || item.msgType=='RC:WarmMsg'
              }) : true
            }
        }
    }
</script>
<style lang="less">
    @import '../../../assets/css/var';
    .normaltheme{
        header{
            position: relative;
            &:after {
                .setBottomLine(#e5e5e5);
            }
            .icon-arrright{
                right: 10px;
                font-size: 0.85em; opacity: .4;
            }
            p{ line-height: 1.6; margin-right: 12px;}
            .sendmind{
                width: 3em;
                padding: 0 2rem 0 1rem; color: #D81E06;
                img{ display: block; margin: 0 auto; }
            }
            .docinfo{
                height: 5.167rem;
                img{
                    width: 3.375rem;
                    height: 3.375rem;
                    object-fit: cover;
                    border-radius: 50%;
                    overflow: hidden;
                    margin: 0 .75rem;
                }
                p{ text-align: center;}
            }
        }
        .orderstates{
            background: #9196A1; color: #fff;
            height: 2.667rem; line-height: 2.267rem;
            padding: 0 @body-margin;
            .button{
                display: inline-block; text-align: center;
                color: #9196A1; width: 3.625rem; height: 1.625rem; line-height: 1.625rem;
                background: #fff; border-radius: 3px;
            }
            &:before {
                .setBottomLine(#ddd);
            }
        }
        .showteaminfo{
            line-height: 2rem; padding: 0 1rem; box-sizing: border-box;
            background: rgba(1, 134, 209, .5);
            color: #fff; z-index: 10;
            -webkit-transform: translateY(100%);
            transform: translateY(100%);
            .iconfont{ font-size: 0.75rem; opacity: .7;}
        }
        .buyservice{
            position: fixed;
            right: .8rem;
            top: 50%;
            margin-top: -2.5rem;
            width: 5rem;
            height: 5rem;
            z-index: 100;
            img{
              width: 100%;
            }
        }
        footer{
            position: relative;
            background: #fff;
            &:before {
                .setTopLine(#ccc);
            }
            .textinput{
                margin: 0 @body-margin @body-margin;
                line-height: 0; min-height: 2.92rem;
            }
            .otherinput{
                height: 3.542rem;
                .iconfont{
                    color: #8B8F9A;
                    font-size: 1.8rem;
                }
            }
            .disabledModel{
              background: rgba(0, 0, 0, .5);
              color: #fff; line-height: 1.6;
              padding: 0 2rem;
            }
        }
        .actionbtn{
            p{
                line-height: 4.4rem; margin: 0;
                .iconfont{
                    vertical-align: 1px;margin-left: .35em;
                }
            }
        }
        .messagelist {
            user-select: none;
            -webkit-user-drag: none;
            dl {
                margin: 1rem .75rem;
            }
        }
        .msg_tioptips{
            line-height: 2.6em; background: #fff; z-index: 10;
            &:before {
                .setBottomLine(#e5e5e5);
            }
        }
        .msgcontext{
            p{
                padding: .45rem 0;
            }
            .userinfo{
                position: relative;
                padding: .6em 0;
                &:before{
                    .setTopLine(#7AB2D2);
                }
            }
            .imglists{
                background: transparent; padding: 0; border-radius: 4px;
                display: inline-block; line-height: 0;
                margin-top: 10px;
            }
        }
        .tipforstaus{
            padding: 1.5em;
            position: relative;
            span{
                position: relative; z-index: 2;
                display: inline-block; padding: 0 0.6em;
                background: #eee; color: #777;
            }
            &:after{
                content: "";
                position: absolute;
                top: 51%; left: 10%;
                width: 80%; border-top: 1px solid #aaa;
            }
        }
        .teamreplay{
            margin: 0 .5em;
            .msgcontext{
                margin: 2em 0 .5em;
                img{ width: 3.5rem; margin-right: 1em;}
                p{ padding: 0; line-height: 1.8;}
            }
            .teamreplaycontent{
                border-top: 1px solid #eee;
                padding: 1em 0 0; margin-top: .6em;
            }
            .signitem{
                background: @main-color; color: #fff;
                border-radius: 2px;
                padding: 3px 8px; transform: translate(-2em, -55%);
            }
        }
    }
    .hearttheme{
        background-color: #0186D1;
        background-image: url("../../../assets/img/chat/clound.png"), linear-gradient(top, #0186D1 0%, #0C8BD3 10%, #1C92D6 20%, #2A98D8 30%, #4FA8E0 40%, #84BFE9 60%, #ADD0F0 100%);
        background-position: bottom left;
        background-repeat: no-repeat;
        background-size: auto 20vh, 100% auto;
        animation: movebg 30s infinite linear;
        .orderstates{
            background: #fff; color: #0E8CD4;
            .button{
                color: #fff; background: #0E8CD4;
            }
            &:before {
                display: none;
            }
        }
        .msg_tioptips{
            background: transparent; color: #fff;
            .maincolor{ color: #FAD78A; }
            &:before {
                display: none;
            }
        }
        header{
            .bgfff{ background-color: transparent; }
            .pf-light, .iconfont{ color: #f1f1f1!important; }
            .big16{ color: #fff!important; }
            &:after {
                display: none;
            }
        }
        footer{
            background: transparent;
            &:before {
                display: none;
            }
            .otherinput .iconfont{ color: #F6AB00; }
            .textarea{ border-color: #FAD78A; background-color: transparent; }
            .submit{ box-shadow: inset 5rem 4rem #F6AB00; background: transparent; }
            .vux-speaking{ border-color: #FAD78A; }
        }
        .msgouter{
            .dt{
                .msgtime{
                    color: #f6f6f6;
                }
                .sysmind{ background: rgba(224, 225, 227, .5); }
                & > span{ background: rgba(201, 203, 207, .5);}
            }
            .msgcontext{
                box-shadow: 0 3px 10px #D6DAE1;
                .userinfo{
                    &:before{
                        .setTopLine(#e6d5af);
                    }
                }
            }
            .me .msgcontext{
                background: #F6AB00;
                border-color: #F6AB00;
            }
        }
        .teamreplay{
            .signitem{
                background: #F6AB00;
            }
        }
    }

    @keyframes movebg {
        0% {
            background-position: bottom left;
        }
        100% {
            background-position: bottom right;
        }
    }
</style>
