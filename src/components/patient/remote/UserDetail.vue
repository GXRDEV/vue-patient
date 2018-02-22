<template>
    <div class="bgfff user-detail">
        <header class="fff">请填写疾病信息，方便我们更好的为您服务</header>
        <section class="formStyle">
            <div class="form-group">
                <x-input title="姓名" v-model="form.caseName" :show-clear="false" placeholder="请输入您的姓名（必填项）"></x-input>
            </div>
            <div class="form-group minWdth">
                <popup-picker title="年龄" :data="[$store.state.age]" v-model="form.age" class="age" show-name placeholder="必填"></popup-picker>
            </div>
            <div class="form-group" style="padding: .9rem 1.625rem">
                <span style="min-width: 4rem; display:inline-block">性别</span>
                <choice :states="state" v-model="form.sex" styles="2rem" margin="0" style="display: inline-block" size="1rem"></choice>
            </div>
            <div class="form-group minWdth">
                <x-input title="身份证" placeholder="建议填写" v-model="form.idCard" @on-blur="validateItem('idCard')" :show-clear="false"></x-input>  
            </div>
            <div class="form-group minWdth">
                <x-input title="手机号" placeholder="常用的手机号码，方便联系（必填项）" @on-blur="validateItem('telphone')" :show-clear="false" v-model="form.tel" type="tel"></x-input>
            </div>
            <div class="form-group">
                <p class="titles">病情描述</p>
                <x-textarea placeholder="请详细描述体检报告、身体情况、查体等，以便专家更好的给出意见" v-model="form.mainSuit" :show-counter="false" :rows="5" :height="53"></x-textarea>
                <file @success="uploadok" style="margin: 1rem 0 1rem 1.5rem"></file>
            </div>
            <div class="form-group">
                <p class="titles">咨询目的</p>
                <x-textarea v-model="form.askProblem" placeholder="请填写您的咨询目的" :show-counter="false" :rows="5" :height="53"></x-textarea>
            </div>
            <div class="form-group">
                <p class="titles">检查报告<span class="gray small10">病历报告、手术记录、生化检查单等...</span></p>   
                <file @success="reportok" style="margin: 1rem 0 1rem 1.5rem" id="reportfile"></file>     
            </div>
            <div class="form-group">
                <p class="titles">影像胶片<span class="gray small10">使用相机拍摄的B超、CT/MR等...</span></p>
                <file @success="photook" style="margin: 1rem 0 1rem 1.5rem" id="photofile"></file>     
            </div>
        </section>
        <footer class="fixedbottom" style="height: 3.4rem">
            <div class="fixed left right bottom tcenter nobg">
                <x-button type="primary" class="weui-btn_circle" style="height: 3.4rem" :disabled="validate" @click.native="submits">提交并支付</x-button>
            </div>
        </footer>
    </div>
</template>
<script>
    import { XInput, PopupPicker, XTextarea, XButton } from 'vux';
    import { Choice, File } from '@components/share';
    import { ValideTel, ValideCard, WxJsPay } from '@plugins/api';

    export default {
        components: {
            XInput, PopupPicker, Choice, XTextarea, File, XButton
        },
        created () {
            sessionStorage.removeItem('_catch_oldgps_')
            sessionStorage.removeItem('_catch_remote_')
            sessionStorage.getItem('_catch_exps_') && (this.exps = JSON.parse(sessionStorage.getItem('_catch_exps_')))  
        },
        data () {
            return {
                state: this.$store.state.sex,
                form: {
                    contactName: '',
                    age: [],
                    sex: '',
                    idCard: '',
                    tel: '',
                    mainSuit: '',
                    normalImages: '',
                    askProblem: '',
                    checkReportImages: '',
                    radiographFilmImags: ''
                },
                exps: {},
                from: this.$route.query.from || ''
            }
        },
        methods: {
            validateItem (val) {
                switch (val){
                    case 'idCard':
                        if(!this.vidCard){
                            this.$vux.toast.show({
                                position: 'top',
                                type: 'text',
                                width: '10em',
                                text: '身份证格式有误'
                            })
                        }
                        break;
                    case 'telphone':
                        if(!this.tels){
                            this.$vux.toast.show({
                                position: 'top',
                                type: 'text',
                                width: '10em',
                                text: '手机号格式有误'
                            })
                        }
                        break;
                }
                
            },
            uploadok (ids){
                this.form.normalImages = ids
            },
            reportok (ids){
                this.form.checkReportImages = ids
            },
            photook (ids){
                this.form.radiographFilmImags = ids
            },
            submits (){
                this.$vux.loading.show({
                    text: '正在提交'
                });         
                this.$http.get(this.$urls.SUBREMOTECASE, { 
                    openid: this.$store.state.openid, 
                    ...this.form, 
                    ...this.exps, 
                    age: this.form.age[0] 
                }, this).then( d => {
                    this.$vux.loading.hide()
                    this.$vux.toast.show({
                        position: 'top',
                        type: 'text',
                        width: 'auto',
                        text: '提交成功'
                    })
                    WxJsPay(this, d, this.redirect.bind(this))
                })
            },
            redirect (){
                let that = this
                sessionStorage.removeItem('_catch_exps_')
                this.$vux.confirm.show({
                    title: '支付成功',
                    cancelText: '返回',
                    confirmText: '退出',
                    onCancel () {
                        let url = !that.from ? '/remote' : '/explibs'
                        that.$router.push(url)
                    },
                    onConfirm () {
                        WeixinJSBridge.call('closeWindow')
                    }
                })
            }
        },
        computed: {
            vidCard (){
                return !this.form.idCard || ValideCard(this.form.idCard)
            },
            tels (){
                return !this.form.tel || !!ValideTel(this.form.tel)
            },
            validate (){
                return !(this.form.caseName && this.form.age[0] && this.form.sex && this.tels && this.form.mainSuit && this.form.askProblem)
            }
        }
    }
    
</script>
<style lang="less" scoped>
    @import '../../../assets/css/var';
    .titles{
        margin: 1rem 0 0 1.5rem
    }
    header{
        background: @main-color;
        padding: 0 1.5rem;
        line-height: 2rem
    }
</style>
<style lang="less">
    .user-detail{
        .vux-x-textarea{
            padding-top: .5rem 
        }
        .weui-cell:before{
            display: none
        }
    }
</style>