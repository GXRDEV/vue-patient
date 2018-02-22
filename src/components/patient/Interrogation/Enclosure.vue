<template>
    <div style="overflow: hidden">
        <div class="form-group bgfff enclosures">
            <cell :title="title" class="cell"></cell>
            <popup-picker title="类型" :data="dictionaries" v-model="types" show-name placeholder="请选择类型"></popup-picker>
            <span class="red-star" style="left:.5rem;top:6.5rem;">*</span>
            <datetime v-model="form.reportTime" title="就诊时间" confirm-text="确认" cancel-text="取消" :start-date="startDate" :end-date="endDate" placeholder="请选择时间" ref="datatime"></datetime>
            <span class="red-star" style="left:.5rem;top:10.5rem;">*</span>
            <x-textarea v-model="form.remark" placeholder="请对此份病历进行简单描述" :show-counter="false" :rows="4"></x-textarea>
            <file @success="uploadok" class="g_margin" :list="form.files" ref="file">
                <p class="gray">(请添加图片，必填项)</p>
            </file>
        </div>
        <footer class="fixed left right bottom enclosure-btn">
            <div :class="{'db-button': id}">
                <x-button type="primary" class="weui-btn_circle weui-btn_del" v-if="id" @click.native="delSessionAttach">删除</x-button>
                <x-button type="primary" :disabled="validate" @click.native="keep" class="weui-btn_circle">保存</x-button>
            </div>
        </footer>
    </div>
</template>
<script>
    import { PopupPicker, Datetime, XTextarea, XButton, Cell } from 'vux'
    import { format } from '@filters'
    import { File } from '@components/share'
    export default {
        components: {
            PopupPicker, Datetime, XTextarea, File, XButton, Cell
        },
        beforeRouteLeave (to, from, next) {
            if (this.$refs.file.prevId > -1) {
                this.$refs.file.$refs.previewer.close()
                next(false)
            } else {
                next()
            }
        },
        created () {
            let that = this
            this.$http.get(this.$urls.GETDICTIONARY + '3').then( d => {
                this.dictionaries = [d.dictionaries.map( item => {
                    return {
                        name: item.displayName,
                        value: item.code
                    }
                })]
            })
            this.title = this.id ? '修改病例附件' : '添加病例附件'
        },
        mounted () {
            this.getSession()
        },
        data () {
            return {
                title: '',
                actived: '',
                sessionForm: {},
                dictionaries: [],
                id: this.$route.query.id || '',
                idx: +this.$route.query.idx,
                startDate: '2000-01-01',
                endDate: format(new Date(), 'yyyy-MM-dd', false),
                types: [],
                form: {
                    id: this.$route.query.id || '',
                    type: '',
                    reportTime: '',
                    remark: '',
                    files: [],
                    attachmentIds: ''
                }
            }
        },
        methods: {
            uploadok (ids, urls) {
                this.form.attachmentIds = ids
            },
            getSession () {
                // 读取sessionStorage
                this.actived = sessionStorage.getItem('__cache_data_id_actived__')
                this.sessionForm = JSON.parse(sessionStorage.getItem(this.actived)) || {}
                //编辑状态
                if (this.id && this.sessionForm.attachments) {
                    this.form = this.sessionForm.attachments[this.idx] || this.form
                    this.types = [].concat((this.form.type + '') || [])
                    let currTime = format(this.form.reportTime, 'yyyy-MM-dd', false)
                    this.form.reportTime = currTime
                    this.$refs.datatime.currentValue = currTime
                }
            },
            // 保存
            keep () {
                this.form.type = this.types[0]
                this.form.files = this.$refs.file.items.filter(i => !i.add).map(item => {
                    return {
                        id: item._id || item.id,
                        url: item._url || item.url
                    }
                })
                // 更新缓存
                if (!this.id) {
                    this.sessionForm.attachments = [].concat(this.sessionForm.attachments || []).concat(this.form)
                }
                sessionStorage.setItem(this.actived, JSON.stringify(this.sessionForm));
                this.$router.back()
            },
            // 删除
            delSessionAttach () {
                let that = this
                this.$vux.confirm.show({
                    title: '删除确认',
                    content: '确定删除病例附件',
                    onConfirm () {
                        that.sessionForm.attachments.splice(that.idx, 1)
                        sessionStorage.setItem(that.actived, JSON.stringify(that.sessionForm));
                        that.$router.back()
                    }
                })
            }
        },
        computed: {
            validate () {
                return !(this.types.length && this.form.reportTime && this.form.attachmentIds)
            }
        }
    }
</script>
<style lang="less">
    @import '../../../assets/css/var';
    .enclosures{
        padding-bottom: .5rem;
        margin-bottom: 3.8rem;
        .vux-label{
            font-size: 1.7rem
        }
        .weui-cell{
            padding: 1.2rem 1rem !important;
            .weui-label{
                color: @font-color;
                font-size: 1.08rem
            }
            .vux-popup-picker-value{
                color: @main-color;
                font-size: 1.2rem
            }
        }
        .vux-datetime{
            p{
                color: @font-color
            }
            .weui-cell__ft{
                font-size: 1rem
            }
        }
        .cell{
            padding: 1.4rem 1rem !important
        }
    }
</style>
