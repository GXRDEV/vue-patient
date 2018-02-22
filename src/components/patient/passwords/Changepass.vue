<template>
    <div class="changeMain h100vh">
        <ul class="password">
            <li class="flex">
                <label class="big13">旧密码：&emsp;</label>
                <input type="password" class="flex_1" 
                    placeholder="请输入旧密码"
                    v-model="form.oldpassword">
            </li>
            <li class="flex">
                <label class="big13">新密码：&emsp;</label>
                <input type="password" class="flex_1" 
                    placeholder="请输入6-18位字母和数字"
                    v-model="form.newpassword">
            </li>
            <li class="flex">
                <label class="big13">确认密码：</label>
                <input type="password" class="flex_1" 
                    placeholder="请输入验证密码"
                    v-model="form.confirmpassword" >
            </li>
        </ul>
        <x-button type="primary" class="changePass" :disabled="disabled" @click.native="changePass">确认修改</x-button>
    </div>
</template>
<script>
    import { Group, XButton } from 'vux'
    import { Password } from '@plugins/api'

    export default{
        components: {
            Group,
            XButton
        },
        data () {
            return {
                form:{
                    openid: this.$store.state.openid,
                    oldpassword: '',
                    newpassword: '',
                    confirmpassword: ''
                },
                Shadow: true,
                confirmS: false
            }
        },
        methods: {
            initToast (text) {
                this.$vux.toast.show({ type: 'text', text: text, position: 'top', width:'auto' })               
            },
            changePass () {
                if (this.form.oldpassword == this.form.newpassword) {
                    this.form.newpassword = this.form.confirmpassword = ''
                    return this.initToast('不能使用旧密码')
                }
                if ( this.form.newpassword !== this.form.confirmpassword) {
                    this.form.newpassword = this.form.confirmpassword = ''
                    return this.initToast('两次密码不一致')
                }
                this.$vux.loading.show({text: '正在修改密码'})
                this.$http.post(this.$urls.MODIFYUSERPASSWARD, this.form, this).then(d => {
                    this.$vux.loading.hide()
                    if( d.status == 'succes' ){
                        this.initToast('修改成功')
                        this.$router.push('/main/info')
                    } else if ( d.status == 'error' ){
                        this.initToast('请输入正确密码')
                    } 
                })
            }
        },
        computed: {
            disabled () {
                return !( this.form.oldpassword && this.password && this.confirm) 
            },
            password () {
                return Password(this.form.newpassword)
            },
            confirm () {
                return Password(this.form.confirmpassword)
            }
        }
    }
</script>
<style lang="less" scoped>
    @import '../../../assets/css/var';
    .changeMain{
        background: #fff;
        overflow: hidden
    }
    .password{
        margin: .769rem auto 3.46rem;
        width: 80%;
        list-style: none;
        overflow: hidden;
        li{
             margin-top: .769rem;
             line-height: 2.46rem;
             label{
                margin-right: 1rem
            }
            input{
                line-height: 1.4rem;
                padding: .8rem .7rem;
                margin: 0 0.5rem;
                border-radius: .2rem;
                border: 1px solid #ccc;
                -webkit-appearance: none
            }
        }
        li:last-child{
            margin-bottom: .769rem
        }
        
    }
    .changePass{
        width: 90%;
        margin: 3.46rem auto 0;
        border-radius: .2rem;
        line-height: 3.15rem
    }
</style>