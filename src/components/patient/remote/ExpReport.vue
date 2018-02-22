<template>
    <div>
        <div class="head big12">
            患者信息
        </div>
        <div class="formStyle bgfff">
            <div class="form-group">
                <x-input title="姓名" v-model="form.username" :show-clear="false" placeholder="请输入您的姓名（必填项）"></x-input>
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
                <x-input title="手机号" placeholder="常用的手机号码，方便联系（必填项）" @on-blur="validateItem('telphone')" :show-clear="false" v-model="form.telphone" type="tel"></x-input>
            </div>
        </div>
        <div class="head big12">
            疾病信息
        </div>
        <div class="formStyle bgfff">
            <x-input v-model="form.caseName" :show-clear="false" placeholder="请输入疾病名称"></x-input>
            <x-textarea placeholder="请详细描述您的病情，症状，治疗经过以及需要获得的帮助" v-model="form.mainSuit" :show-counter="false" :rows="5" :height="53"></x-textarea>
        </div>        
        <div class="head big12">
            咨询目的
        </div>
        <div class="formStyle bgfff">
            <x-textarea v-model="form.askProblem" placeholder="请详细描述您要咨询的问题" :show-counter="false" :rows="5" :height="53"></x-textarea>
        </div>
        <div class="head big12">
            上传影像资料
        </div>
        <div class="formStyle bgfff" style="padding: 1rem 1.5rem">
            <file @success="uploadok"></file>
            <p class="grayccc">症状部位、检查报告或者其他病情资料</p>
        </div>
        <footer class="fixedbottom" style="height: 3.4rem">
            <div class="fixed left right bottom tcenter nobg">
                <x-button type="primary" class="weui-btn_circle" style="height: 3.4rem" :disabled="validate" @click.native="submits">提交并支付</x-button>
            </div>
        </footer>
    </div>
</template>
<script>
    import { Choice, File } from '@components/share';
    import { XInput, PopupPicker, XTextarea, XButton } from 'vux';
    import { ValideTel, ValideCard, WxJsPay } from '@plugins/api';
    export default {
        components: {
            Choice, File, XInput, PopupPicker, XTextarea, XButton
        },
        data () {
            return {
                state: this.$store.state.sex,
                form: {
                    openid: this.$store.state.openid,
                    docid: this.$route.query.docid,
                    ltype: this.$route.query.ltype,
                    username: '',
                    caseName: '',
                    age: [],
                    sex: '',
                    idCard: '',
                    telphone: '',
                    mainSuit: '',
                    askProblem: '',
                    normalImages: ''
                }
            }
        },
        methods: {
            uploadok (ids){
                this.form.normalImages = ids
            },
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
            submits (){
                this.$vux.loading.show({
                    text: '正在提交'
                });      
                this.$http.post(this.$urls.SUBONLINEORDER, { ...this.form, age: this.form.age[0] }, this).then(d => {
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
    .head{
        padding: .5rem 1.5rem
    }
</style>