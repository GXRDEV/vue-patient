<template>
    <div class="formcell formSub reportPage">
        <header class="bgfff">
            <div class="form-group">
                <family-items title="报到人" placeholder="请选择" v-model="form.familyId" @on-change="selectFamily" :bigSize="true"></family-items>
            </div>
        </header>
        <group gutter=".62rem">
            <div v-if="form.familyId" class="title flex acenter">
                <span class="form-title big21">病情资料</span>
                <router-link :to="{ path: '/import/' + form.familyId, query: { from: hash, actived: active_id } }" class="maincolor g_exportdb small10" v-if="!checker" replaced>导入</router-link>
                <span class="flex_1 choosetype tright">
                    <label class="maincolor big13">暂不填写，稍后补充
                        <input type="checkbox" v-model="checker">
                        <i class="iconfont icon-yuanxingweixuanzhong maincolor"></i>
                    </label>
                </span>
            </div>
            <template v-if="!checker">
                <div class="form-group">
                    <x-input title="疾病" placeholder="例如“头痛”" v-model="form.caseName"></x-input>
                </div>
                <div class="form-group">
                    <x-textarea placeholder="详细描述您的病情，症状，治疗经过等(最少输入10个字)" @on-blur="validateItem('mainSuit')" v-model="form.mainSuit" :rows="3" :max="1000"></x-textarea>
                    <x-textarea placeholder="想获得什么样的帮助？" :rows="3" v-model="form.askProblem" style="padding: 1.458rem 1rem"></x-textarea>
                </div>
                <show-enclosure :name="active_id" :attachments="form.attachments || []" color="#777b82"></show-enclosure>
                <x-switch title="是否保存到资料库，方便下次使用" v-model="form.toDb"></x-switch>
                <x-switch title="是否同意医生查看您的就诊记录？" v-model="form.checkAll"></x-switch>
            </template>
        </group>
        <footer class="fixedbottom">
            <div class="footerButton fixed bottom left right nopadding">
                <x-button :disabled="disabled" @click.native="sendReport" type="primary" style="height: 3.75rem">提交申请</x-button>
            </div>
        </footer>
    </div>
</template>
<script>
    import { FamilyItems, ShowEnclosure } from '@components/share'
    import { Group, XInput, XTextarea, XButton } from 'vux'
    import form from '@mixins/form'

    export default{
        components: {
            Group,
            XInput,
            XTextarea,
            XButton,
            FamilyItems,
            ShowEnclosure
        },
        mixins: [form],
        created () {
            sessionStorage.setItem('__cache_data_id_actived__', this.active_id)
            sessionStorage.getItem(this.active_id) && (this.form = JSON.parse(sessionStorage.getItem(this.active_id)))
            // 显示转换
            this.form.attachments && this.form.attachments.forEach(item => {
                item.files = item.files.map(file => {
                    return {
                        id: file.id,
                        url: file.fileUrl || file.url
                    }
                })
            })
        },
        data () {
            return {
                report: 'false',
                checker: false,
                active_id: this.$route.params.timer,
                needCache: true,
                docid: this.$route.params.id,
                teamUuid:this.$route.params.uuid,
                hash: window.location.hash,
                openid: this.$store.state.openid,
                form:{
                    familyId: '',
                    caseName: '',
                    mainSuit: '',
                    checkAll: true,
                    askProblem: '',
                    attachments: []
                }
            }
        },
        methods: {
            toast (text) {
                this.$vux.toast.show({
                    position: 'top',
                    type: 'text',
                    width: 'auto',
                    text: text
                })
            },
            sendReport () {
                let that = this
                this.$vux.loading.show({ text: '正在提交' })
                this.$http.post(this.$urls.PATIENTREPORT, {
                    ...this.form,
                    checkAll: +this.form.checkAll,
                    docid: this.docid,
                    teamUuid: this.teamUuid,
                    attachments: JSON.stringify({'attachments': this.form.attachments}),
                    toDb: +this.form.toDb,
                    openid: this.openid
                }, this).then(d => {
                    this.$vux.loading.hide()
                    if(d.status == "success" ){
                        sessionStorage.removeItem(that.active_id)
                        that.needCache = false
                        that.toast('提交成功')
                        setTimeout(() => {
                            that.$router.replace("/main/my/mydoc")
                        },300)
                    }
                })
            },
            selectFamily (item) {
                this.$http.get(this.$urls.TELLREPORT, {
                    familyid: this.form.familyId,
                    docid: this.docid,
                    teamUuid: this.teamUuid
                }).then(data => {
                    this.report = data.report
                    if(data.report != 'true'){
                        this.$vux.alert.show({
                            title: '报到失败',
                            content: `问诊人${item.label}已报到过当前医生。`
                        })
                    }
                })
            }
        },
        computed: {
            disabled () {
                return !(this.form.familyId && this.report == 'true' && (this.checker ? true : this.mainSuit))
            }
        },
        beforeDestroy () {
            this.needCache && sessionStorage.setItem(this.active_id, JSON.stringify(this.form))
        }
    }
</script>
<style lang="less">
    @import '../../../assets/css/var';
    .reportPage{
        .choosetype{
            label{
                .justifyContent(flex-end);
                input{
                    zoom: .4;
                    display: none;
                    &:checked ~ i:before{
                        content: "\e730" !important;
                    }
                }
                .iconfont{
                    font-size: 1rem;
                    line-height: 1;
                }
            }
        }
        .demo5-item {
            line-height: 1; padding: 6px 0; white-space: nowrap;
            text-align: center;
            margin: -6px 0;
            input{ margin-right: 4px;}
        }
    }
</style>
