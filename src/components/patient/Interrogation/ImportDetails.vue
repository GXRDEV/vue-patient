<template>
    <div>
        <header class="fff" @click="back">
            返回之前列表
        </header>
        <section class="bgfff">
            <template v-if="ind == 0">
                <p class="height color big14">
                    <span class="title">疾病</span> <span>{{details.caseName || '暂无'}}</span>
                </p>
                <p class="height color big14">
                    <span class="title">科室</span> <span>{{details.depName || '暂无'}}</span>
                </p>
            </template>
            <template v-else-if="details.caseName">
                <p class="height color big14">
                    <span class="title">类型</span> <span class="visit" :class="{'visits': form.record.firstVisit == 1}">{{form.record.firstVisit | visit}}</span>
                </p>
                <p class="height color big14">
                    <span class="title padding">就诊时间</span> <span>{{format(form.record.createTime, 'yyyy-MM-dd', false )}}</span>
                </p>
                <p class="height color big14">
                    <span class="title padding">就诊医院</span> <span>{{form.record.hosName}}</span>
                </p>
                <p class="height color big14">
                    <span class="title padding">就诊科室</span> <span>{{form.record.depName}}</span>
                </p>
                <p class="height color big14">
                    <span class="title padding">就诊医生</span> <span>{{form.record.doctorName}}</span>
                </p>
            </template>
            <p class="color big14" style="padding: 1.417rem 0 2.625rem">
                {{details.caseDesc || details.mainSuit}}
            </p>
            <p class="color big14" v-if="details.askProblem" style="padding: 1.417rem 0 2.625rem">
                {{details.askProblem}}
            </p>
        </section>
        <div class="bgfff" v-if="details.attachments">
            <show-enclosures :attachments="details.attachments" :hasTitle="false" width="5.417rem" modal="muilt"></show-enclosures>
        </div>
        <footer class="fixedbottom">
            <div class="fixed bottom left right nopadding">
                <x-button type="primary" @click.native="imported"><i class="iconfont icon-import-copy"></i> 导入</x-button>
            </div>
        </footer>
    </div>
</template>
<script>
    import { XButton } from 'vux'
    import { ShowEnclosures } from '@components/share'
    import { visit, format } from '@filters'
    export default {
        components: {
            XButton, ShowEnclosures
        },
        filters: {
            visit
        },
        created () {
            this.getDetails()
        },
        data () {
            return {
                ind: this.$route.params.ind,
                caseId: this.$route.query.caseId || '',
                details: {},
                form: {},
                actived: this.$route.query.actived
            }
        },
        created (){
            this.getDetails()
        },
        methods: {
            format,
            getDetails () {
                if(this.ind == 0){
                    this.$http.get(this.$urls.LOADCASEINFO, {
                        caseId: this.caseId
                    }).then( d => {
                        this.details = d.caseDto
                    })
                } else {
                    this.$http.get(this.$urls.GAINRECORDINFO, { 
                        recordId: this.caseId
                    }).then( d => {
                        this.details = d.caseInfo
                        this.form = d
                    })
                }
            },
            imported (){
                if (sessionStorage.getItem(this.actived)) {
                    let cacheForm = JSON.parse(sessionStorage.getItem(this.actived))
                    this.details = {
                        ...cacheForm,
                        ...this.details
                    }
                }
                this.details.mainSuit = this.details.caseDesc || this.details.mainSuit
                this.details.toDb = false
                this.details.attachments && this.details.attachments.forEach( atta => {
                    atta.id = ''
                })
                sessionStorage.setItem(this.actived, JSON.stringify(this.details))
                this.$router.go(-2)
            },
            back (){
                this.$router.back()
            }
        }
    }
</script>
<style lang="less" scoped>
    @import '../../../assets/css/var';
    header{
        background: #9296a1;
        line-height: 2.83rem;
        position: relative;
        padding-left: 1.8rem;
        &:after{
            content: '';
            position: absolute;
            width: 7px;
            height: 7px;
            border-left: 1px solid #fff;
            border-bottom: 1px solid #fff;
            transform: rotate(45deg);
            top: 50%;
            left: .95rem;
            margin-top: -3.5px;
        }
    }
    .height{
        line-height: 4.5rem;
    }
    .color{
        color: #969aa3;
        border-bottom: 0.5px solid #e5e5e5
    }
    .title{
        color: #000;
        min-width: 3.917rem;
        display: inline-block
    }
    .padding{
        padding-right: 1.5rem
    }
    section{
        padding-left: 1rem
    }
    .visit{
        border-radius: 1rem;
        padding: .3rem .8rem;
        background: #cce7f6;
        color: @main-color
    }
    .visits{
        background: #fef6e5;
        color: #fdbe27;
    }
    .weui-btn{
        height: 3.83rem !important
    }
</style>
