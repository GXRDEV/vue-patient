<template>
    <div class="bindcode">
        <div>
            <input type="text" placeholder="请输入绑定码" v-model="bindcode">
            <x-button type="primary" @click.native="submit" style="border-radius: 0.2rem" :disabled="!bindcode">提交</x-button>
        </div>
    </div>
</template>
<script>
    import { XButton } from 'vux'
    export default{
        components: {
            XButton
        },
        data () {
            return {
                bindcode: ''
            }
        },
        methods: {
            toast (type, text) {
                this.$vux.toast.show({
                    type: type,
                    text: text
                })
            },
            submit () {
                this.$vux.loading.show({text: '正在绑定'})
                this.$http.post(this.$urls.BINDORDERBYCODE, { 
                    openid: this.$store.state.openid, bindcode: this.bindcode 
                }, this).then( d => {
                    this.$vux.loading.hide()
                    this.bindcode = ''
                    if( d.status == 'success'){
                        this.toast('success', '绑定成功')
                        window.setTimeout(() => {
                            this.$router.replace({
                                path: '/details',
                                query: { oid: d.oid, otype: d.otype }
                            })
                        }, 600);
                    } else {
                        this.toast('warn', '验证码错误')
                    }
                })
            }
        }
    }
</script>
<style lang="less" scoped>
    .bindcode{
        overflow: hidden;
        div{
            width: 90%;
            margin: 3rem auto 0;
        }
    }
    input{
        width: 100%;
        box-sizing: border-box;
        border-radius: .3rem;
        border: 1px solid #ccc;
        line-height: 1.5rem;
        padding: .75rem;
        margin-bottom: 2rem;
        -webkit-appearance: none
    }
</style>