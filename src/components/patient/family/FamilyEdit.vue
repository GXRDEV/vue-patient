<template>
    <article class="group-cell-right bgfff h100">
        <heading :title="title" content="请您务必填写真实信息，以便我们提供更好的服务" style="padding-top: .7rem"></heading>
        <section class="formStyle form_000_ccc">
            <div>
                <div class="form-group" style="padding-right: 1rem">
                    <heads @success="uploadok" class="form-group" :list="list"></heads>
                </div>
                <div class="form-group relative">
                    <x-input title="姓名" is-type="china-name" placeholder="请填写真实姓名（必填）" v-model="form.contactName" :show-clear="false" placeholder-align="right"></x-input>
                    <span class="red-star">*</span>
                </div>
                <div class="form-group">
                    <x-input title="身份证" placeholder="一经填写，无法修改！" v-model="form.idCard" :readonly="hasIdCard" :disabled="hasIdCard"
                        @on-blur="validateI('form.idCard')" :show-clear="false" placeholder-align="right"></x-input>
                </div>
                <div class="form-group relative">
                    <x-input title="手机号" is-type="china-mobile" placeholder="用于接收短信通知（必填）" v-model="form.telphone"
                        @on-blur="validateI('form.telphone')" :show-clear="false" placeholder-align="right"></x-input>
                    <span class="red-star">*</span>
                </div>
                <div class="form-group relative">
                    <popup-picker title="性别" :data="[$store.state.sex]" placeholder="必填" v-model="form.sex" show-name></popup-picker>
                    <span class="red-star">*</span>
                </div>
                <div class="form-group relative">
                    <popup-picker title="年龄" :data="[$store.state.age]" placeholder="必填" v-model="form.age" show-name></popup-picker>
                    <span class="red-star">*</span>
                </div>
                <div class="form-group relative">
                    <x-address title="地址" v-model="distCode" :list="$store.state.distcodes" placeholder="必填"></x-address>
                    <span class="red-star">*</span>
                </div>
            </div>
        </section>
        <section>
            <label class="flex checkbox" @click="form.isDefault=!form.isDefault">
                <span class="flex_1" style="color: #f4c82d">是否设为常用联系人？</span>
                <span class="input"><input type="checkbox" v-model="form.isDefault" value="true"><i></i></span>
            </label>
        </section>
        <footer class="fixedbottom bgfff">
            <div class="fixed left right bottom tcenter nobg" :class="{'db-button': form.id}">
                <x-button @click.native="confirmDel" type="primary" class="weui-btn_circle weui-btn_del" v-if="form.id">删除就诊人</x-button>
                <x-button @click.native="submitForm" :disabled="disabled" type="primary" class="weui-btn_circle">保存</x-button>
            </div>
        </footer>
    </article>
</template>

<script>
    import { ValideTel, ValideCard, GetCardinfo } from '@plugins/api';
    import { XInput, XButton, PopupPicker } from 'vux'
    import address from '@mixins/address'
    import { Heading, Heads } from '@components/share'
    export default {
        components: {
            XInput, XButton, PopupPicker, Heading, Heads
        },
        mixins: [address],
        data() {
            return {
                distCode: [],
                list: [{ id: '', url:'' }],
                form: {
                    openid: this.$store.state.openid,
                    id: this.$route.params.id,
                    contactName: '',
                    telphone: '',
                    idCard: '',
                    sex: [],
                    age: [],
                    distCode: '',
                    isDefault: false,
                    headImageUrl: ''
                },
                title: '',
                hasIdCard: false
            }
        },
        created () {
            this.title = this.form.id ? '编辑就诊人信息' : '新建就诊人';
            this.form.id && this.$http.get(this.$urls.GAINFAMILERINFO, {
                familyid: this.form.id
            }).then(d => {
                this.form.contactName = d.user.contactName
                this.form.telphone = d.user.telphone
                this.form.idCard = d.user.idCard
                this.hasIdCard = !!d.user.idCard
                this.form.age = [].concat(d.user.age + '' || []);
                this.form.sex = [].concat(d.user.sex + '' || []);
                !!d.user.distCode && (this.distCode = [d.user.distCode.substring(0, 2) + '0000', d.user.distCode.substring(0, 4) + '00', d.user.distCode])
                this.form.isDefault = !!d.user.isDefault;
                this.list = [{
                    url: d.user.headImageUrl
                }],
                this.form.headImageUrl = d.user.headImageUrl

            });
        },
        watch: {
            ['form.idCard'] (v, o) {
                if(v && ValideCard(v)){
                    let cinfo = GetCardinfo(v);
                    this.form.age = [cinfo.age];
                    this.form.sex = [cinfo.sexcode];
                }
            },
            distCode (v) {
                this.form.distCode = v[v.length - 1]
            }
        },
        computed: {
            vidCard () {
                return !this.form.idCard || ValideCard(this.form.idCard)
            },
            vtel () {
                return ValideTel(this.form.telphone)
            },
            vage () {
                return parseInt(this.form.age[0], 10) > 0
            },
            disabled () {
                return !(this.form.contactName && this.form.sex[0] && this.vage && this.vtel && this.vidCard && this.form.distCode)
            }
        },
        methods: {
            validateI (key, ele) {
                let value = this[key];
                switch(key){
                    case 'form.idCard':
                        if(!this.vidCard){
                            this.$vux.toast.show({
                                position: 'top',
                                type: 'text',
                                width: '10em',
                                text: '身份证格式有误'
                            })
                        }
                        break;
                    case 'form.telphone':
                        if(!this.vtel){
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
            submitForm () {
                this.$vux.loading.show({text:'正在保存'})
                this.$http.post(this.$urls.SAVEORUPDATEFAMILER, {
                    ...this.form,
                    isDefault: this.form.isDefault ? 1 : 0,
                    age: this.form.age[0],
                    sex: this.form.sex[0]
                }, this).then(() => {
                    this.$vux.loading.hide()
                    this.$vux.toast.show({ type: 'text', text: '保存成功', position: 'top' })
                    this.redirect()
                })
                this.clearCache();
            },
            // 联系人头像
            uploadok (ids,urls) {
                this.form.headImageUrl = urls
            },
            // 删除联系人
            confirmDel () {
                let that = this;
                this.$vux.confirm.show({
                    title: '删除确认',
                    content: `确定要删除“${this.form.contactName}”联系人？`,
                    onConfirm: that.delDB
                })
            },
            clearCache () {
                localStorage.removeItem('_cache_familys_')
            },
            delDB () {
                this.$http.post(this.$urls.DELFAMILER, {
                    id: this.form.id
                }).then(() => {
                    this.$vux.toast.show({ type: 'text', text: '删除成功', position: 'top' })
                    this.redirect()
                })
                this.clearCache();
            },
            redirect () {
                window.setTimeout(() => {
                    if('index' in this.$route.query || this.$route.query.back) {
                        this.$router.go(-1)
                    } else {
                        this.$router.replace('/main/family?index=0')
                    }
                }, 400)
            }
        }
    }
</script>
<style lang="less" scoped>
    @import '../../../assets/css/var';
    section{
        background: #fff;
        padding: 1px 0;
        & + section{
            padding-top: .5rem;
        }
    }
    .checkbox{
        padding: 10px 15px;
        & > span{ margin: auto; }
        .input{
            position: relative;
        }
        input[type="checkbox"]{
            display: none;
            & ~ i{
                display: inline-block;
                width: 1.5rem;
                height: 1.5rem;
                border-radius: 50%;
                background: url('../../../assets/img/check.png') center no-repeat;
                background-size: cover
            }
            &:checked ~ i{
                display: inline-block;
                width: 1.5rem;
                height: 1.5rem;
                background: url('../../../assets/img/checked.png') center no-repeat;
                background-size: cover;
                border-radius: 50%;
            }
        }
    }
</style>
