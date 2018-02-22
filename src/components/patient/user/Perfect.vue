<template>
    <div class="h100 bgfff">
        <heading title="完善资料" content="请您完善相关资料，以便我们为您更好的匹配适合的医生" router="#"></heading>
        <section class="formStyle form_000_ccc" style="overflow: hidden">
            <div class="form-group" style="padding-right: 1rem">
                <heads @success="uploadok" class="form-group" :list="list"></heads>
            </div>
            <div class="form-group minWdth relative">
                <x-input title="姓名" placeholder="请填写真实姓名（必填）" :show-clear="false" v-model="form.userName"></x-input>
                <span class="red-star">*</span>
            </div>
            <div class="form-group relative" style="padding: .9rem 1.625rem">
                <span class="red-star">*</span><span class="weui-label" style="width: 4rem; display:inline-block">性别</span>
                <choice :states="state" v-model="form.sex" styles="2rem" margin="0" style="display: inline-block" size="1rem"></choice>
            </div>
            <div class="form-group minWdth">
                <x-input title="身份证" placeholder="建议填写" v-model="form.idCard" @on-blur="validateItem('idCard')" :show-clear="false"></x-input>
            </div>
            <div class="form-group minWdth relative">
                <x-input title="手机号" placeholder="常用的手机号码，方便联系（必填）" :show-clear="false" v-model="form.tel"></x-input>
                <span class="red-star">*</span>
            </div>
            <div class="form-group minWdth relative">
                <popup-picker title="年龄" :data="[$store.state.age]" v-model="age" class="age" show-name placeholder="必填"></popup-picker>
                <span class="red-star">*</span>
            </div>
            <div class="form-group minWdth relative">
                <x-address title="常驻地" v-model="distCode" :list="$store.state.distcodes" placeholder="必填"></x-address>
                <span class="red-star">*</span>
            </div>
            <x-button :disabled="validate" type="primary" class="button" @click.native="jumpTo">完成</x-button>
        </section>
    </div>
</template>
<script>
    import { Heading, Choice, Heads } from '@components/share'
    import { XInput, PopupPicker, XButton } from 'vux'
    import { ValideTel, ValideCard } from '@plugins/api'
    import address from '@mixins/address'
    export default {
        mixins: [address],
        components: {
            Heading, Choice, XInput, PopupPicker, XButton, Heads
        },
        created () {
            let form = JSON.parse(sessionStorage.getItem('_cache_bind_') || '{}')
            this.form.userId = form.id
            this.form.userName = form.displayName
            this.form.tel = form.telephone
            this.form.sex = form.sex
            this.form.idCard = form.idCard
            this.form.headImageUrl = form.headImageUrl
            this.distCode = [].concat(form.distCode || [])
            this.list = [{ id: form.id, url: form.headImageUrl }]
            this.age = [].concat(form.birthDay || [])
        },
        data () {
            return {
                form: {
                    userId: '',
                    userName: '',
                    tel: '',
                    sex: 1,
                    idCard: '',
                    headImageUrl: ''
                },
                age: [],
                distCode: [],
                state: this.$store.state.sex,
                list: [{ id: '', url:'' }],
            }
        },
        methods: {
            uploadok (ids, urls){
                this.form.headImageUrl = urls
            },
            validateItem (item) {
                if(!this.vidCard){
                    this.$vux.toast.show({
                        position: 'top',
                        type: 'text',
                        width: '10em',
                        text: '身份证格式有误'
                    })
                }
            },
            jumpTo () {
                let hisUrl = sessionStorage.getItem('_cache_bind_from_') || '';
                sessionStorage.removeItem('_cache_bind_from_')
                this.$vux.loading.show({text: '正在保存'})
                this.$http.post(this.$urls.COMPLETEUSERINFO, {
                    ...this.form,
                    openid: this.$store.state.openid,
                    age: this.age[0],
                    distCode: this.dist
                }, this).then(d => {
                    this.$store.commit("SET_WXINFO", {
                        uinfo: {
                            mobileNumber: this.form.tel
                        },
                        uwr: {
                            headImageUrl: this.form.headImageUrl,
                            displayName: this.form.userName,
                            sex: this.form.sex,
                            age: this.age[0]
                        }
                    });
                    this.$vux.loading.hide()
                    this.$router.replace(hisUrl)
                })
            }
        },
        computed: {
            validate () {
                return !(this.form.userName && this.vage && this.form.sex && this.tels && this.vidCard && this.dist)
            },
            vage () {
                return parseInt(this.age[0], 10) > 0
            },
            tels () {
                return !!ValideTel(this.form.tel)
            },
            dist () {
                return this.distCode.slice(-1).join('')
            },
            vidCard (){
                return !this.form.idCard || ValideCard(this.form.idCard)
            }
        }
    }
</script>
