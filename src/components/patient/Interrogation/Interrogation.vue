<template>
    <div class="formSub">
        <header class="bgfff formcell" style="margin: 0 0 .6rem 0;">
            <div class="ask-title flex" v-if="hasAsk" @click="jumppage">
                <p class="flex_1">
                    <i class="iconfont icon-gantanhao mark"></i>&ensp;您当前有<span class="title-color"> {{type}} </span>正在进行...
                </p>
                <span class="title-color go-page">前往</span>
            </div>
            <div class="form-group">
                <family-items :title="title" placeholder="请选择" @on-change="selectFamily" v-model="form.familyId" :bigSize="true"></family-items>
            </div>
            <template v-if="this.severId == 7">
                <div class="relative">
                    <span class="red-star" style="left:.5rem;">*</span>
                    <x-input class="distance" title="接听电话" is-type="china-mobile" placeholder="用于接收短信通知，请谨慎填写！"
                           :show-clear="false" @on-blur="phone" v-model="form.answerTelephone" placeholder-align="right"></x-input>
                </div>
                <div class="timer flex acenter relative">
                    <span class="weui-label" style="width: 4.5em">接听时间</span>
                    <span class="flex_1 tright">
                        <label v-for="(times, timeInd) in timer" :key="timeInd">
                            {{times}}&ensp;
                            <input type="radio" v-model="form.orderTime" name="orderTime" :value="times">
                            <i></i>
                        </label>
                    </span>
                    <span class="red-star" style="left:-.5rem;">*</span>
                </div>
            </template>
        </header>
        <group gutter="0" class="formcell formSub" label-width="4.5em">
            <div v-if="form.familyId" class="title flex acenter">
                <span class="form-title big21">病情资料</span>
                <router-link :to="{ path: '/import/'+form.familyId, query: { from: hash, actived: actived} }" class="maincolor g_exportdb small10" replaced>导入</router-link>
            </div>
            <template>
                <div class="form-group flex horizontal" v-if="severId == 9">
                    <x-input title="疾病" class="flex_1 w45" :show-clear="false" placeholder="例如“头痛”" v-model="form.caseName"></x-input>
                    <full-depart title="科室" class="flex_1 borderleft choice-dep" v-model="form.depId" show-name placeholder="建议填选" valueTextAlign="left"></full-depart>
                </div>
                <div class="form-group" v-else>
                    <x-input title="疾病" placeholder="例如“头痛”" v-model="form.caseName" :show-clear="false"></x-input>
                </div>
            </template>

            <div class="form-group">
                <x-textarea placeholder="详细描述您的病情，症状，治疗经过等(最少输入10个字)" :rows="3" :max="1000" @on-blur="validateItem('mainSuit')" v-model="form.mainSuit"></x-textarea>
                <x-textarea placeholder="想获得什么样的帮助" :rows="3" v-model="form.askProblem"></x-textarea>
            </div>
            <show-enclosure :name="actived" :attachments="form.attachments" color="#777b82"></show-enclosure>
            <x-switch title="是否保存到资料库，方便下次使用" v-model="form.toDb"></x-switch>
        </group>
        <footer class="fixedbottom">
            <div class="fixed bottom left right nopadding">
                <x-button @click.native="submitForm" :disabled="disabled" type="primary" style="height: 3.75rem">提问</x-button>
            </div>
        </footer>
    </div>
</template>
<script>
    import { Group, XInput, XTextarea, XButton } from 'vux'
    import { FamilyItems, ShowEnclosure, FullDepart } from '@components/share'
    import { ValideTel, WxJsPay } from '@plugins/api'
    import form from '@mixins/form'
    import { mapState } from 'vuex'
    export default{
        components: {
            Group,
            XInput,
            XTextarea,
            XButton,
            FamilyItems,
            ShowEnclosure,
            FullDepart
        },
        mixins: [form],
        data () {
            return {
                price: this.$route.query.price,
                severId: this.$route.query.sever || '',
                timer: ['24小时内','三日内','一周内'],
                showremark: false,
                actived: this.$route.params.timer,
                type: '',
                title: '',
                hasAsk: false,
                uuid: '',
                status: '',
                needCache: true,
                hash: window.location.hash,
                openid: this.$store.state.openid,
                docid: this.$route.query.docid || 0,
                teamUuid: this.$route.query.teamUuid || '',
                form: {
                    distCode: this.$store.getters.gpsCode,
                    familyId: '',
                    depId: '',
                    orderTime: '',
                    answerTelephone: '',
                    caseName: this.$route.query.caseName || '',
                    consultationType: this.$route.query.apply || '',
                    mainSuit:'',
                    askProblem: '',
                    attachments: []
                }
            }
        },
        created () {
            let that = this;
            this.title = this.severId != 11 ? '就诊人' : '申请人';
            sessionStorage.setItem('__cache_data_id_actived__', this.actived)
            switch (this.severId) {
                case '6': this.type = '图文问诊'; break;
                case '7': this.type = '电话问诊'; break;
                case '9': this.type = '快速问诊'; break;
                case '11': this.type = '会诊申请'; break;
                case '12': this.type = '团队问诊'; break;
            }
            if (this.severId == 7 && !this.price) {
                this.$http.get(this.$urls.DOCSERVICEINFO, {
                    docid: this.docid,
                    serviceId: this.severId
                }).then( d => {
                    if (d.service.isOpen == 1 ){
                        this.price = d.service.amount
                    } else {
                        let that = this
                        that.$vux.confirm.show({
                            content: '医生并未开通电话问诊',
                            cancelText: '返回聊天界面',
                            confirmText: '前往医生详情',
                            onCancel () {
                                that.$router.go(-1)
                            },
                            onConfirm () {
                                that.$router.replace('/docinfo/' + that.docid)
                            }
                        })
                    }
                })
            }
            // 是否有正在进行的订单
            this.getAsk();
        },
        mounted () {
            if (sessionStorage.getItem(this.actived)) {
                this.form = JSON.parse(sessionStorage.getItem(this.actived))
            }
            // 显示转换
            this.form.attachments && this.form.attachments.map(item => {
                item.files = item.files.map(file => {
                    return {
                        id: file.id,
                        url: file.fileUrl || file.url
                    }
                })
            })
        },
        computed: {
            vtel () {
                return ValideTel(this.form.answerTelephone)
            },
            disabled () {
                return !(this.form.familyId && this.mainSuit && this.askProblem && (this.severId == 7 ? (this.form.orderTime && this.vtel) : true))
            },
            ...mapState({
                userid: state => state.userid
            })
        },
        watch: {
            userid (v) {
                v && this.getAsk()
            }
        },
        methods: {
            toast (text) {
                this.$vux.toast.show({
                    position: 'top',
                    type: 'text',
                    width: 'auto',
                    text: text
                })
            },
            getAsk () {
                this.userid && this.$http.get(this.$urls.QUERYFASTCOUNT, {
                    userId: this.userid, orderType: this.severId
                }).then(d => {
                    this.askLen = d.count
                    if (d.count > 0) {
                        this.hasAsk = true
                        this.uuid = d.list[0].uuid
                        this.status = d.list[0].status
                        this.id = d.list[0].id
                    }
                })
            },
            pay (d) {
                if (d.status == 'success'){
                    this.$router.replace({ path: '/pay', query: { oid: d.uuid, otype: d.orderType } })
                } else if (d.status == 'error'){
                    this.toast('下单失败，请重新下单')
                }
            },
            submitForm () {
                this.$vux.loading.show({
                    text: '下单中'
                })
                this.$http.post(this.$urls.SUBMITORDER, {
                    ...this.form,
                    attachments: JSON.stringify({'attachments': this.form.attachments}),
                    docid: this.docid,
                    teamUuid: this.teamUuid,
                    orderType: this.severId,
                    toDb: this.form.toDb == true ? 1 : 0,
                    openid: this.openid
                }, this).then( d => {
                    sessionStorage.removeItem(this.actived)
                    this.needCache = false
                    this.$vux.loading.hide()
                    if (d.needpay == 'true' ) {
                        this.pay(d)
                    } else {
                        this.toast('提交成功')
                        setTimeout(() => {
                            this.$router.replace("/inquirylist/2")
                        },300)
                    }
                })
            },
            phone (){
                !this.vtel && this.toast('手机号格式有误')
            },
            selectFamily (item) {
                this.form.answerTelephone = item.telphone || this.form.answerTelephone
            },
            // 问诊跳转
            jumppage (){
                let router = this.askLen > 1 ? { path: '/inquirylist/2' } :
                    this.status == 10 && this.severId == 9  ? { path: '/fastfind/' + this.uuid, query: { from: this.$route.fullPath } } :
                    { path: '/chat', query: { id: this.id, oid: this.uuid, otype: this.severId } }
                this.$router.replace(router)
            }
        },
        beforeDestroy () {
           this.needCache && sessionStorage.setItem(this.actived, JSON.stringify(this.form))
        }
    }
</script>
<style lang="less" scoped>
    @import '../../../assets/css/var';
    .timer{
        padding: 1rem 1rem 1rem 0;
        margin-left: 1rem;
        border-top: .5px solid #e5e5e5;
        label{
            margin-left: 1rem;
            input[type="radio"]{
                display: none;
                &+i{
                    height: 15px;
                    width: 15px;
                    background: #e3e5e9;
                    border-radius: 50%;
                    display: inline-block;
                    vertical-align: bottom;
                }
                &:checked+i:before{
                    content: '';
                    height: 9px;
                    width: 9px;
                    background: @main-color;
                    border-radius: 50%;
                    display: inline-block;
                    margin: 3px;
                }
            }
        }

    }
</style>
<style lang="less">
    .choice-dep{
        .vux-popup-picker-select{
            color: #ccc !important
        }
    }
    .horizontal{
        .vux-cell-box:before{
            display: none
        }
    }
    .distance .vux-x-input-placeholder-right input{
        text-align: right;
        &:focus{
            text-align:left;
        }
    }
</style>
