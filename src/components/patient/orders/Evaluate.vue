<template>
    <div class="eval bgfff">
        <evaluate-list v-if="doc" :docType="docTitle" :doctor="doc" v-model="firstDoc"></evaluate-list>
        <evaluate-list v-if="otherDoc" :docType="otherDocTitle" :doctor="otherDoc" v-model="lastDoc" style="padding-top: 1.75rem"></evaluate-list>
        <footer class="fixedbottom">
            <div class="fixed left right tcenter nobg bottom">
                <x-button @click.native="submit" type="primary" class="weui-btn_circle">提交</x-button>
            </div>
        </footer>
    </div>
</template>
<script>
    import { XButton } from 'vux'
    import { EvaluateList } from '@components/share'
    export default{
        components: {
            XButton,
            EvaluateList
        },
        data(){
            return{
                docid: this.$route.query.id,
                form: {
                    oid: this.$route.query.oid,
                    otype: this.$route.query.otype
                },
                doc: {},
                docTitle: '',
                firstDoc: {
                    grade: 5,
                    docTagIds: '',
                    content: ''
                },
                otherDocTitle: '',
                otherDoc: {},
                lastDoc: {
                    grade: 5,
                    docTagIds: '',
                    content: ''
                },
                evaluas: []
            }
        },
        created () {
            let that = this
            this.docTitle = this.form.otype == 12 ? '首诊医生' : '问诊医生';
            this.otherDocTitle = this.form.otype == 12 ? '复诊医生' : '会诊专家'
            this.$http.get( this.$urls.DOCS, {
                orderType: this.form.otype, orderUuid: this.form.oid
            }).then(d => {
                this.doc = d.doc
                this.otherDoc = d.otherDoc
                if (!this.doc && !this.otherDoc) {
                    this.$vux.alert.show({
                        title: '医生评价',
                        content: '当前订单没有可评价的医生。',
                        onHide () {
                            that.$router.back()
                        }
                    })
                }
            })
        },
        methods: {
            //提交
            submit () {
                this.doc && (this.evaluas[0] = this.firstDoc)
                this.otherDoc && (this.evaluas[1] = this.lastDoc)
                let form = {
                    'evaluas': this.evaluas
                }
                this.$vux.loading.show({text: '正在保存'})
                this.$http.post(this.$urls.SAVEESTIMATE, {
                    ...this.form, evaluaStr: JSON.stringify(form)
                }, this).then(() => {
                    let that = this
                    this.$vux.loading.hide()
                    this.$vux.confirm.show({
                        title: '提交成功',
                        content: '您的评价将进入医生的患者评价里，并且医生会看到',
                        cancelText: '送心意',
                        confirmText: '返回',
                        onCancel () {
                            that.$router.replace({
                                path: '/give',
                                query: { docid: that.docid, oid: that.form.oid, otype: that.form.otype, back: -3 }
                            })
                        },
                        onConfirm () {
                            that.$router.go(this.$route.query.back || -1)
                        }
                    })
                })
            }
        }
    }

</script>
<style scoped lang="less">
    @import '../../../assets/css/var';
    .eval{
        padding: 1.75rem .83rem;
    }
</style>
