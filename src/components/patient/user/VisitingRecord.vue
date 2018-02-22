<template>
    <div class="bgfff h100">
        <heading :title="title" content="建立您就诊记录，以便您的医生可以随时关注您的健康情况" router="#" code="3"></heading>
        <section class="formStyle bgfff form_000_ccc">
            <choice :states="state" v-model="form.firstVisit"></choice>
            <div class="form-group noMargin relative">
                <x-input title="疾病名称" v-model="form.caseName" :show-clear="false" placeholder="请填写疾病名称"></x-input>
                <span class="red-star red-star-left">*</span>
            </div>
            <div class="form-group noMargin relative">
                <datetime v-model="form.visitDate" title="就诊时间" confirm-text="确认" cancel-text="取消" :start-date="startDate" :end-date="endDate"></datetime>
                <span class="red-star red-star-left">*</span>
            </div>
            <div class="form-group noMargin relative">
                <x-input title="就诊医院" v-model="form.hosName" :show-clear="false" placeholder="例如“北京协和医院”"></x-input>
                <span class="red-star red-star-left">*</span>
            </div>
            <div class="form-group noMargin">
                <full-depart title="就诊科室" v-model="form.depId" show-name @show-name="full"></full-depart>
            </div>
            <div class="form-group noMargin relative">
                <x-input title="主治医师" v-model="form.doctorName" :show-clear="false" placeholder="本次就诊的医师姓名，例如“张春华”"></x-input>
                <span class="red-star red-star-left">*</span>
            </div>
            <div class="form-group noMargin relative">
                <x-textarea placeholder="请详细填写就诊记录，主要诊断等相关信息" v-model="form.mainSuit" :show-counter="false" :rows="5" :height="53"></x-textarea>
                <span class="red-star red-star-left">*</span>
            </div>
            <show-enclosure :attachments="form.attachments" :describe="form.attachments.length ? true : false"></show-enclosure>
        </section>
        <footer class="fixedbottom bgfff formStyle" :style="getToLink() ? `padding-top: 3rem` : ''">
            <div class="fixed left right bottom tcenter nobg" :class="{'db-button': form.recordId}">
                <template v-if="getToLink()">
                    <x-button :disabled="validate" type="primary" class="button" @click.native="keep" style="margin:0 auto 2rem">提交</x-button>
                </template>
                <template v-else>
                    <x-button type="primary" class="weui-btn_circle weui-btn_del" v-if="form.recordId" @click.native="del">删除</x-button>
                    <x-button type="primary" class="weui-btn_circle" :disabled="validate"  @click.native="keep">提交</x-button>
                </template>
            </div>
        </footer>
    </div>
</template>
<script>
    import { Datetime, XInput, XTextarea, XButton } from 'vux'
    import { Heading, Choice, FullDepart, File, ShowEnclosure } from '@components/share'
    import { format } from '@filters'
    export default {
        components: {
            Heading, Choice, Datetime, XInput, FullDepart, XTextarea, File, XButton, ShowEnclosure
        },
        created () {
            let form = JSON.parse(sessionStorage.getItem('_cache_bind_') || '{}')
            this.form.familyid = this.$route.query.id || form.mainUserContactId
            sessionStorage.setItem('__cache_data_id_actived__', this.timer);
            if(sessionStorage.getItem(this.timer)) {
                this.form = JSON.parse(sessionStorage.getItem(this.timer))
            } else if (this.form.recordId) {
                this.title = "编辑就诊记录"
                this.$http.get(this.$urls.GAINRECORDINFO, {
                    recordId: this.form.recordId
                }).then(d => {
                    this.form.firstVisit = d.record.firstVisit + '';
                    this.form.caseName = d.caseInfo.caseName || '',
                    this.form.hosName = d.record.hosName;
                    this.form.depId = d.record.depId + '';
                    this.form.depName = d.record.depName;
                    this.form.doctorName = d.record.doctorName;
                    this.form.visitDate = format( d.record.visitDate, 'yyyy-MM-dd', false);
                    this.form.mainSuit = d.caseInfo.mainSuit;
                    this.form.attachments = d.caseInfo.attachments || []
                    this.form.attachments.forEach(item => {
                        item.files = item.files.map(file => {
                            return {
                                id: file.id,
                                url: file.fileUrl || file.url
                            }
                        })
                    })
                })
            }
        },
        mounted () {
            this.hisUrl = sessionStorage.getItem('_cache_bind_from_') || '';
            sessionStorage.removeItem('_cache_bind_from_')
        },
        data () {
            return {
                state: this.$store.state.diagnosis,
                title: '新增就诊记录',
                timer: this.$route.params.timer,
                hisUrl: '',
                form: {
                    caseName: '',
                    recordId: this.$route.query.rid || '',
                    familyid: '',
                    firstVisit: '1',
                    visitDate: '',
                    hosName: '',
                    depName: '',
                    depId: '',
                    doctorName: '',
                    mainSuit: '',
                    attachments: []
                },
                startDate: '2000-01-01',
                endDate: format(new Date(), 'yyyy-MM-dd', false)
            }
        },
        methods: {
            full (name) {
                this.form.depName = name
            },
            // 保存
            keep () {
                this.$vux.loading.show({text: '正在提交'})
                this.$http.post(this.$urls.ADNEWRECORD, {
                    ...this.form,
                    attachments: JSON.stringify({'attachments': this.form.attachments})
                }, this).then( d => {
                    this.$vux.loading.hide()
                    this.$vux.toast.show({ type: 'text', text: '保存成功', position: 'top' })
                    this.redirect()
                })
                this.clearCache();
            },
            clearCache () {
                localStorage.removeItem('_cache_familys_' + this.form.familyid + '_')
            },
            // 删除
            del () {
                let that = this
                this.$vux.confirm.show({
                    title: '删除确认',
                    content: '确定要删除当前记录？',
                    onConfirm () {
                        that.$vux.loading.show({text: '正在删除'})
                        that.$http.post(that.$urls.DELETERECORD, {
                            recordId: that.form.recordId, familyid: that.form.familyid
                        }).then(() => {
                            that.$vux.loading.hide()
                            that.$vux.toast.show({ type: 'text', text: '删除成功', position: 'top' })
                            that.redirect()
                        })
                        that.clearCache()
                    }
                })
            },
            redirect () {
                window.setTimeout(() => {
                    if('index' in this.$route.query) {
                        this.$router.go(-1)
                    } else {
                        this.$router.replace(this.hisUrl || '/main/family?index=0')
                    }
                }, 400)
            },
            getToLink () { 
                return 'index' in this.$route.query ? '' : (this.hisUrl || '/main/family')
            }
        },
        computed: {
            validate () {
                return !( this.form.caseName && this.form.firstVisit && this.form.visitDate && this.form.hosName && this.form.doctorName && this.form.mainSuit)
            }
        },
        beforeDestroy () {
            sessionStorage.setItem(this.timer, JSON.stringify(this.form))
        }
    }
</script>
