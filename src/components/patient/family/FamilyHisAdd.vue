<template>
    <article class="formcell">
        <p class="prompt" v-show="showpro">请填写详细就诊信息<span @click="prompt" class="iconfont icon-x"></span></p>
        <group gutter="0" class="noborder group-cell-right">
            <div class="form-group addType flex acenter">
                <span class="weui-label">就诊类型&emsp;&ensp;</span> 
                <label class="checkbox">
                    <span>初诊</span> 
                    <span class="input"><input type="radio" name="radio" v-model="form.firstVisit" value="1"><i></i></span>
                </label>
                <label class="checkbox">
                    <span>复诊</span> 
                    <span class="input"><input type="radio" name="radio" v-model="form.firstVisit" value="0"><i></i></span>
                </label>
            </div>
            <div class="form-group">
                <datetime v-model="form.visitDate" title="就诊时间" confirm-text="确认" cancel-text="取消" :start-date="startDate" :end-date="endDate"></datetime>
            </div>
            <div class="form-group">
                <x-input title="医院" v-model="form.hosName" :show-clear="false"></x-input>
            </div>
            <div class="form-group flex">
                <full-depart title="就诊科室" class="flex_1" v-model="form.depId" show-name @show-name="full"></full-depart>
                <x-input title="主治医师" class="flex_1 borderleft w45" v-model="form.doctorName" is-type="china-name" :show-clear="false"></x-input>
            </div>
            <div class="form-group">
                <x-textarea placeholder="请详细填写就诊记录，主要诊断描述等..." v-model="form.presentIll" :show-counter="false" :rows="5"></x-textarea>
                <file @success="uploadok" :list="imglist" class="g_margin">
                    <p class="big13">病例与检查图片</p>
                    <p class="small11 gray">方便医生更好的为您服务</p>
                </file>
            </div>
        </group>
        <footer class="fixedbottom">
            <div class="fixed bottom left right flex">
                <div class="flex_1" v-if="this.form.recordId" style="margin-right: 1rem;"><x-button @click.native="deleteRecord" type="custom">删除</x-button></div>
                <div class="flex_1"><x-button @click.native="submitForm" :disabled="disabled" type="primary">保存</x-button></div>
            </div>
        </footer>
    </article>
</template>

<script>
    import { Datetime, Group, XTextarea, XButton, XInput  } from 'vux'
    import { File, FullDepart } from '@components/share'
    import { value2name, format } from '@filters'
    export default {
        components: {
          Datetime, Group, XTextarea, File, XButton, FullDepart, XInput
        },
        data() {
            return {
                showpro: true,
                startDate: '2000-01-01',
                endDate: format(new Date(), 'yyyy-MM-dd', false),
                imglist: [],
                form: {
                    recordId: this.$route.query.rid || '',
                    familyid: this.$route.params.id,
                    openid: this.$store.state.openid,
                    visitDate: '',
                    hosId: '',
                    hosName: '',
                    firstVisit: '',
                    presentIll: '',
                    normalImages: '',
                    depId: '',
                    depName: '',
                    doctorName: ''
                }
            }
        },
        computed: {
            disabled () {
                return !(this.form.visitDate && (this.form.hosId || this.form.hosName) && this.form.firstVisit)
            }
        },
        created () {
            this.form.recordId && this.$http.get(this.$urls.GAINRECORDINFO, { recordId: this.form.recordId }).then(d => {
                let form = d.record || {}
                let caseinfo = d.caseInfo || {}
                this.form.visitDate = format(form.visitDate || new Date(), 'yyyy-MM-dd', false)
                this.form.hosId = form.hosId
                this.form.hosName = form.hosName
                this.form.firstVisit = form.firstVisit + ''
                this.form.depId = form.depId + ''
                this.form.depName = form.depName
                this.form.doctorName = form.doctorName

                this.form.presentIll = caseinfo.presentIll
                this.form.normalImages = caseinfo.normalImages
                this.imglist = caseinfo.caseImages.map(i => {
                    return {
                        id: i.id,
                        url: i.fileUrl,
                        _id: i.id,
                        _url: i.fileUrl,
                        add: false
                    }
                })
            })
        },
        methods: {
            uploadok (ids) {
                this.form.normalImages = ids
            },
            full (name) {
                this.form.depName = name
                //console.log(this.form.depName)
            },
            submitForm () {
                this.$vux.loading.show({text: '正在保存'})
                this.$http.post(this.$urls.ADNEWRECORD, this.form).then(() => {
                    this.$vux.loading.hide()
                    this.$vux.toast.show({ type: 'text', text: '保存成功', position: 'top' })
                    window.setTimeout(() => {
                       this.$router.replace(`/familydetail/${this.form.familyid}`)
                    }, 600)
                })
            },
            deleteRecord () {
                let that = this
                this.$vux.confirm.show({
                    title: '删除确认',
                    content: '确定要删除当前记录？',
                    onConfirm () {
                        that.$vux.loading.show({text: '正在删除'})
                        that.$http.post(that.$urls.DELETERECORD, { recordId: that.form.recordId, familyid: that.form.familyid }).then(() => {
                            that.$vux.loading.hide()
                            that.$vux.toast.show({ type: 'text', text: '删除成功', position: 'top' })
                            window.setTimeout(() => {
                                that.$router.replace(`/familydetail/${that.form.familyid}`)
                            }, 600)
                        })
                    }
                })
            },
            prompt () {
                this.showpro = false
            }          
        }
    }
</script>
<style lang="less" scoped>
    @import '../../../assets/css/var';
    .prompt{
        background: @main-color;
        color: #fff;
        font-size: .8rem;
        padding-left: 1rem;
        padding: .5rem 0 .5rem 1rem;
        span{
            float: right;
            padding-right: 1rem;
        }
    }
    .addType{
        background: #fff;
        padding: 1rem @body-margin;
        .checkbox{
            line-height: 18px;
            .input{
                margin: 0 3rem 0 .5rem;
            }
            input[type="radio"]{
                display: none;
                & ~ i{
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: #ccc;
                    vertical-align: bottom
                }
                &:checked ~ i{
                    &:after{
                        content: "";
                        display: inline-block;
                        width: 10px;
                        height: 10px;
                        background: @main-color;
                        border-radius: 50%;
                        margin: 4px
                    }
                }
            }
        }
    }
</style>