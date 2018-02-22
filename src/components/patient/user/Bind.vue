<template>
  <div class="h100 bgfff">
      <heading title="验证绑定账号" content="亲爱的微信用户，为了给您更好的服务，请输入您的手机号，并进行身份验证"></heading>
      <section class="formStyle form_000_ccc" style="padding-top: 2rem">
          <div class="form-group relative">
              <x-input title="手机号" placeholder="请输入手机号" v-model="form.tel" type="tel" :show-clear="false" label-width="5rem"></x-input>
              <span class="red-star">*</span>
          </div>
          <div class="flex getcode form-group relative">
            <x-input title="图片码" placeholder="请输入图片码" class="flex_1" type="tel" :show-clear="false" v-model="form.picCode" label-width="5rem"></x-input>
            <x-button style="width: 38%" @click.native="getImgCode">
              <img :src="imgCode" />
            </x-button>
            <span class="red-star">*</span>
          </div>
          <div class="flex getcode form-group relative">
              <x-input title="验证码" placeholder="请输入验证码" class="flex_1" type="tel" :show-clear="false" v-model="form.code" label-width="5rem"></x-input>
              <x-button style="width: 38%"
                    :disabled="tel || lock || !form.picCode" @click.native="getcode">
                    {{ lock ? timer : '获取验证码'}}
              </x-button>
              <span class="red-star">*</span>
          </div>
          <div class="form-group">
              <x-input title="邀请码" v-model="form.invitCode" :show-clear="false" placeholder="请输入邀请码（非必填）" label-width="5rem"></x-input>
          </div>

          <x-button @click.native="bindto" :disabled="validate || islogin" type="primary" class="button">下一步</x-button>
      </section>
  </div>
</template>
<script>
    import { XButton, querystring, XInput } from 'vux'
    import { ValideTel } from '@plugins/api'
    import { Heading } from '@components/share'
    import { FixedUrl } from '@plugins/ajax'
    export default{
        components: {
            XButton, Heading, XInput
        },
        data() {
            return {
                form: {
                    tel: '',
                    code: '',
                    picCode: '',
                    openid: this.$store.state.openid,
                    invitCode: localStorage.getItem('_cache_invitCode_') || ''
                },
                openid: this.$store.state.openid,
                timer: 90,
                islogin: false,
                lock: false,
                timestamp: +new Date(),
                imgCode: ''
            };
        },
        // 未关注公众号跳转
        beforeRouteEnter (to, from, next) {
            let { openid, code } = querystring.parse()
            next((!!openid || !!code) ? vm => {
                openid && (vm.openid = openid)
            } : {
                path: '/auth2',
                query: { from: to.query.from }
            })
        },
        mounted () {
            this.timer = 90
            this.$nextTick(() => {
                document.querySelector('.weui-input').focus()
            })
          this.getImgCode();
        },
        watch:{
            lock: function(n, o){
                this.timer = 90
            }
        },
        computed: {
            validate() {
                return this.tel || this.cod
            },
            tel () {
                return !ValideTel(this.form.tel)
            },
            cod () {
                return !(this.form.code && (this.form.code + '').length == 4)
            }
        },
        methods: {
            toast (text) {
                this.$vux.toast.show({
                    type: 'text',
                    text: text,
                    width: '10em'
                })
            },
            getImgCode(){
                this.timestamp = +new Date()
                this.imgCode = FixedUrl(this.$urls.GETVERIFY) + '?timestamp='+ this.timestamp
            },
            bindto() {
                this.islogin = true;
                this.$http.post(this.$urls.TELLCODENEW, this.form, this).then(d => {
                    this.$store.dispatch('updateUserInfo', this.openid)
                    if (d.status == 'error') {
                        this.toast('验证码输入错误')
                    } else if (d.status == 'success') {
                        localStorage.clear()
                        sessionStorage.setItem('_cache_bind_from_', this.$route.query.from.indexOf('completeinfo') != -1 ? '/main/info' : this.$route.query.from)
                        sessionStorage.setItem('_cache_bind_', JSON.stringify(d.detail))
                        this.$router.replace('/perfect')
                    }
                    this.islogin = false;
                }).catch(() => {
                    this.islogin = false;
                })
            },
            getcode() {
                this.lock = true;
                this.$http.post( this.$urls.GAINVERYCODE, {
                    telphone: this.form.tel,
                    timestamp: this.timestamp,
                    picCode: this.form.picCode
                }, this).then( d => {
                    if(d.status == 'success'){
                        this.toast('验证码发送成功')
                        this.timeleave()
                        this.$nextTick(() => {
                            document.querySelector('.getcode .weui-input').focus()
                        })
                    }else{
                        this.toast(d.message + '验证码发送失败')
                        this.lock = false;
                    }
                }).catch(() => {
                    this.lock = false;
                })
            },
            timeleave () {
                (this.timer -= 1) ? window.setTimeout(this.timeleave, 1000) : (this.lock = false);
            }
        }
    };
</script>
<style lang="less">
    .getcode{
        .vux-x-input{
            padding-right: 0 !important;
            &:after{
                content: " ";
                border-left: 1px solid #eee;
                height: 1.5rem;
                margin-left: 1rem
            }
        }
        .weui-btn_disabled{
            color: #878d99 !important
        }
        .weui-btn{
            color: #0186D1;
            background: #fff !important;
        }
        .weui-input{
            padding-right: 1rem !important;
        }
    }
</style>
