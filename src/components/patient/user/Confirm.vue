<template>
  <div class="bindDiv">
      <header>
          <h3 class="big15">您的手机号已注册过佰医汇帐号。</h3>
          <p class="big13">账号：<span>{{ username }}</span></p>
      </header>
      <section class="g_margin">
          <dl>
              <dt>
                  <x-button type="primary" @click.native="bindto" class="button">确认绑定帐号</x-button>
                  <label>绑定后，您的微信平台帐号与佰医汇帐号互通，并可以直接登录</label>
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
                username: this.$route.query.tel,
                openid: this.$store.state.openid,
                islogin: false
            }
        },
        created () {
            !(this.username && this.openid) && this.$router.replace({ 
                path: '/fllow'
            })
        },
        methods: {
            bindto() {
                this.$vux.loading.show()
                this.$http.post(this.$urls.SURETOBIND, {
                    openid: this.openid,
                    tel: this.username
                }).then(res => {
                    let that = this
                    this.$vux.loading.hide()
                    this.$vux.toast.show({
                        text: '绑定成功',
                        time: '1000',
                        onHide () {
                            debugger
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
            padding: 1rem 0;
            font-weight: 400;
        }
        p{
            padding: 1rem 0;
            span{color: #007EC3;}
        }
    }
    section{
        dt{
            label{
                display:block;
                font-size: .8rem;
                color: #aaa;
                line-height: 1.6rem;
                padding: 1rem 0;
            }
        }
    }
    .button{
        height: 3.2rem;
        border-radius: .2rem
    }
</style>
