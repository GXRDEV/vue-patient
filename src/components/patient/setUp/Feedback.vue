<template>
    <div>
        <group class="textarea noborder">
            <x-textarea :placeholder="placeholder" :rows="10" v-model="textarea"></x-textarea>
            <file class="g_margin" @success="uploadok"></file>
        </group>
        <x-button text="提交" type="primary" :disabled="!textarea" class="submit" @click.native="submit"></x-button>
    </div>
</template>
<script>
    import { Group, XTextarea, XButton } from 'vux'
    import { File } from '@components/share'

    export default {
        components :{
            Group,
            XTextarea,
            File,
            XButton
        },
        data () {
            return {
                textarea: '',
                placeholder: '请在此处填写您对产品的意见与建议，我们知错就改，努力完善产品，让您有更好的体验！'
            }
        },
        methods: {
            uploadok (ids) {
                this.form.normalImages = ids
            },
            submit () {
                this.$vux.loading.show({text: '正在提交'})
                this.$http.post(this.$urls.SUBMITUSERADVICE, { 
                    openid: this.$store.state.openid, content: this.textarea 
                }, this).then(d => {
                    this.$vux.loading.hide()
                    this.$vux.toast.show({
                        type: 'text',
                        text: '提交成功',
                        position: 'top'
                    })
                    'from' in this.$route.query ? this.$router.go(-1) : this.$wechat.closeWindow()
                })
            }
        }
    }
</script>
<style lang="less" scoped>
    .textarea{
        overflow: hidden;
        width: 90%;
        margin: 0 5%;
    }
    .submit{
        width: 90%;
        margin-top: 3em;
    }
</style>