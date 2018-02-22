<template>
  <article class="group-cell-right formcell">
    <header>
        <h3>{{title}}</h3>
        <p>填写完整版病例，方便医生更好的为您诊断</p>
    </header>
    <group gutter="0" class="noborder supply" label-width="5em" >
        <div class="family-name form-group">
            <span class="big14">问诊人</span>
            <span class="big14" style="color: #9196a1;float: right">{{form.familyName}}</span>
        </div>
        <div class="form-group case-name" @click="toFocus('.case-name')">
            <x-textarea title="疾病名称" v-model="form.cinfo.caseName" :rows="1" :cols="50" autosize :readonly="read_only"></x-textarea>
        </div>
        <div class="form-group main-suit" @click="toFocus('.main-suit')">
            <x-textarea title="主诉" v-model="form.cinfo.mainSuit" :rows="1" :cols="50" autosize :readonly="read_only"></x-textarea>
        </div>
        <div class="form-group ask-problem" @click="toFocus('.ask-problem')">
            <x-textarea title="咨询目的" v-model="form.cinfo.askProblem" :rows="1" :cols="50" autosize :readonly="read_only"></x-textarea>
        </div>
        <div class="form-group current-pre" @click="toFocus('.current-pre')">
            <x-textarea title="现病史" v-model="form.cinfo.presentIll" :rows="1" :cols="50" autosize :readonly="read_only"></x-textarea>
        </div>
        <div class="form-group history-pre" @click="toFocus('.history-pre')">
            <x-textarea title="既往史" v-model="form.cinfo.historyIll" :rows="1" :cols="50" autosize :readonly="read_only"></x-textarea>
        </div>
        <div class="form-group examined" @click="toFocus('.examined')">
            <x-textarea title="体检" v-model="form.cinfo.examined" :rows="1" :cols="50" autosize :readonly="read_only"></x-textarea>
        </div>
        <div class="form-group assistant-result" @click="toFocus('.assistant-result')">
            <x-textarea title="辅检" v-model="form.cinfo.assistantResult" :rows="1" :cols="50" autosize :readonly="read_only"></x-textarea>
        </div>
        <div class="form-group initial-diagnosis" @click="toFocus('.initial-diagnosis')">
            <x-textarea title="诊断" v-model="form.cinfo.initialDiagnosis" :rows="1" :cols="50" autosize :readonly="read_only"></x-textarea>
        </div>
        <div class="form-group treat-advice" @click="toFocus('.treat-advice')">
            <x-textarea title="治疗意见" v-model="form.cinfo.treatAdvice" :rows="1" :cols="50" autosize :readonly="read_only"></x-textarea>
        </div>
        <template>
            <show-enclosure :attachments="form.attachments" :isPerfect="true" v-if="!read_only"></show-enclosure>
            <show-enclosures :attachments="form.attachments" :isPerfect="true" v-else></show-enclosures>
        </template>
    </group>
    <footer class="fixedbottom" v-if="!read_only" style="height: 3.4rem">
        <div class="fixed bottom left right nobg">
            <x-button @click.native="submitForm" type="primary" class="weui-btn_circle" style="height: 3.4rem!important">提交</x-button>
        </div>
    </footer>
  </article>
</template>
<script>
    import { XInput, XTextarea, Group, XButton } from 'vux'
    import { ShowEnclosure, ShowEnclosures } from '@components/share'
    import { sex, age } from '@filters'
    import form from '@mixins/form'
    export default {
        components: {
            XInput, XTextarea, Group, XButton, ShowEnclosure, ShowEnclosures
        },
        mixins: [form],
        data () {
            return {
                oid: this.$route.query.oid,
                otype: this.$route.query.otype,
                active_id: this.$route.params.timer,
                ostate: this.$route.query.ostate,
                needCache: true,
                read_only: true,
                title: '',
                start: '',
                end: '',
                form: {
                    familyName: '',
                    openid: this.$store.state.openid,
                    familyId: '',
                    cinfo: {},
                    attachments: []
                }
            }
        },
        created () {
            this.read_only = this.ostate > 20
            this.title = this.read_only ? "查看病历" : "完善病历"
            sessionStorage.setItem('__cache_data_id_actived__', this.active_id)
            sessionStorage.getItem(this.active_id) ?
                this.form = JSON.parse(sessionStorage.getItem(this.active_id)) :
                this.$http.get( this.$urls.GAINFAMILYCASEINFO, {
                    oid: this.oid, otype: this.otype
                }).then(d => {
                    let form = { ...d.cinfo }
                    this.$set(this.form, 'cinfo', form)
                    this.form.familyName = [form.contactName].concat(form.sex ? sex(form.sex) : []).concat(form.age ? age(form.age) : []).join(' / ')
                    this.form.familyId = d.familyId
                    this.form.attachments = d.attachments || []
                    this.form.attachments.forEach(item => {
                        item.files = item.files.map(file => {
                            return {
                                id: file.id,
                                url: file.fileUrl || file.url
                            }
                        })
                    })
                    this.$nextTick(function(){
                        document.querySelectorAll('.supply textarea').forEach(t => {
                            t.style.height = t.scrollHeight + 'px'
                        })
                    })
                })
        },
        methods: {
            submitForm () {
                let that = this
                this.$vux.loading.show({text: '正在保存'})
                this.$http.post(this.$urls.RESETCASE, {
                    caseId: this.form.cinfo.id,
                    caseName: this.form.cinfo.caseName,
                    familyId: this.form.familyId,
                    mainSuit: this.form.cinfo.mainSuit,
                    presentIll: this.form.cinfo.presentIll,
                    historyIll: this.form.cinfo.historyIll,
                    examined: this.form.cinfo.examined,
                    assistantResult: this.form.cinfo.assistantResult,
                    initialDiagnosis: this.form.cinfo.initialDiagnosis,
                    treatAdvice: this.form.cinfo.treatAdvice,
                    askProblem: this.form.cinfo.askProblem,
                    attachments: JSON.stringify({'attachments': this.form.attachments})
                }, this).then(d => {
                    sessionStorage.removeItem(this.active_id)
                    this.needCache = false
                    this.$vux.loading.hide()
                    this.$vux.toast.show({
                        type: 'text',
                        time: '1000',
                        text: '保存成功',
                        position: 'top',
                        onHide () {
                            that.$router.go(-1)
                        }
                    })
                })
            },
            toFocus (className){
                this.$nextTick(() => {
                  document.querySelector(className+' .weui-textarea').focus();
              })
          }
        },
        beforeDestroy () {
            this.needCache && !this.read_only && sessionStorage.setItem(this.active_id, JSON.stringify(this.form))
        }
    }
</script>
<style lang="less" scoped>
    header {
        height: 6.125rem;
        box-sizing: border-box;
        padding: 1.375rem 1rem 1rem;
        h3 {
            line-height: 1;
            font-size: 1.83rem;
            font-weight: normal
        }
        p{
            line-height: 1;
            padding-top: 1rem;
            color: #9196a1
        }
    }
    .family-name{
        padding: 1rem
    }
</style>
<style lang="less">
    .supply{
        .weui-cell{
            flex-direction: column;
            padding: 1.25rem 1rem .75rem;
            .weui-label{
                color: #000 !important;
                padding-bottom: 1rem;
                font-size: 1.167rem;
                line-height: 1
            }
            .weui-textarea{
                color: #9196a1;
                height: 50px;
            }
        }
    }
</style>
