<template>
  <div class="bindDiv">
      <header>
          <h3 class="big15">手机号验证成功！</h3>
          <p class="big13">请设置您的登录密码。</p>
      </header>
      <section class="g_margin">
          <dl>
              <dd>账号<span>{{ username }}</span></dd>
              <dd><input type="text" v-model="psd" placeholder="请设置密码（6-16位字母数字组合）"></dd>
              <dd>
                  <label style="font-size:0.9rem" class="checkbox">
                      <input type="checkbox" v-model="agree" value="1">
                      <i class="iconfont" :class="agree=='1' ? 'icon-checked' : 'icon-check'"></i>
                      同意<span>《佰医汇用户注册协议》</span>
                  </label>
                </dd>
              <dt>
                  <x-button type="primary" @click.native="bindto" :disabled="validate" class="button">注册并绑定帐号</x-button>
              </dt>
          </dl>
      </section>
  </div>
</template>
<script>
    import { XButton } from 'vux'

    export default{
        components: {
            XButton
        },
        data() {
            return {
                openid: this.$store.state.openid,
                username: this.$route.query.tel,
                psd: '',
                islogin: false,
                agree: '1'
            };
        },
        created () {
            !(this.username && this.openid) && this.$router.replace({ 
                path: '/fllow'
            })
        },
        computed: {
          validate () {
              return !(this.psd.length >=6 && this.psd.length <=16)
          }
        },
        methods: {
            bindto() {
                this.$vux.loading.show();
                this.$http.post( this.$urls.SURETOBIND, {
                    openid: this.openid,
                    tel: this.username,
                    password: this.psd
                }).then(res => {
                    let that = this
                    this.$vux.loading.hide()
                    this.$vux.toast.show({
                        text: '绑定成功',
                        time: '1000',
                        onHide () {
                            that.$route.query.from.indexOf('://') != -1 ? 
                                location.replace(decodeURIComponent(that.$route.query.from)) :
                                that.$router.replace(that.$route.query.from || '/')
                        }
                    })
                })
            }
        }
    };
</script>
<style scoped lang="less">
    header{
        text-align: center;
        padding: 2rem 0;
        h3{
            padding: 1rem 0 0;
            font-weight: 400;
        }
        p{
            padding: 1rem 0 0;
            span{color: #007EC3;}
        }
    }
    section{
        dd{
            padding: 8px 0;
            span{color: #007EC3;}
        }        
        dt{
            padding:1.6rem 0 3rem 0;
        }
        input[type="text"]{
            width: 100%;
            height: 3.2rem;
            box-sizing:border-box;
            padding: .4rem .76rem;
            border: 0;
            border-radius: .2rem;
            font-size: 1.125rem;
            vertical-align: middle;
        }
    }
    .checkbox{
        input{ display:none; }
        .iconfont{
            color: #007EC3;
        }
    }
    .button{
        height: 3.3rem;
        border-radius: .2rem
    }
</style>
