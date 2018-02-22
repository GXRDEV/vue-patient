<template>
    <div>
        <header class="bgfff">
            <div @click="$router.go(-1)" class="fff big13 back">快速问诊 / 图文问诊 / 电话问诊...</div>
            <div class="tab flex borderbox">
                <p v-for="(item, tabind) in tab" :key="tabind" class="flex_1" @click="choice(item)"><span class="big15 borderbox" :class="{'choice': ind == tabind}">{{item.text}}</span></p>
            </div>
        </header>
        <section>
            <div class="import-main bgfff relative" v-for="(caseList, caseInd) in result" :key="caseInd">
                <router-link :to="{ path: '/importDetails/' + ind, query: { actived, caseId: caseList.id }}" class="import-router">
                    <p class="big13" v-if="caseList.caseName" style="color: #000">{{caseList.caseName}}</p>
                    <p class="base12 font-color space">{{caseList.caseDesc || caseList.mainSuit}}</p>
                    <show-enclosures :attachments="caseList.attachments" :hasTitle="false" width="5.417rem" style="padding: 0" v-if="caseList.attachments" :stopEvent="true" :isSpace="true"></show-enclosures>
                    <p class="base12 font-color space" v-if="caseList.askProblem" style="padding-bottom: 1rem">{{caseList.askProblem}}</p>
                </router-link>
                <span v-if="ind==1" class="visit big13 absolute" :class="{'visits': caseList.firstVisit == 1}">{{caseList.firstVisit | visit}}</span>
                <div class="import">
                    <span class="font-color small11" :class="{'padding': ind==1}">{{caseList.timeStr}}</span>
                    <x-button type="primary" class="big13" @click.native="imported(caseList)"><i class="iconfont icon-import-copy"></i> 导入</x-button>
                </div>
            </div>
        </section>
        <no-order v-if="!result.length" :haslink="false" text="暂无记录"></no-order>
    </div>
</template>
<script>
    import { XButton } from 'vux'
    import { NoOrder, ShowEnclosures } from '@components/share'
    import { visit } from '@filters'
    export default {
        components: {
            XButton, NoOrder, ShowEnclosures
        },
        filters: {
            visit
        },
        created () {
            this.case()
        },
        data () {
            return {
                familyId: this.$route.params.familyId,
                actived: this.$route.query.actived || '',
                tab: [{ id: 0, text: '病历资料'}, { id: 1, text: '就诊记录'}],
                ind: this.$route.query.ind || 0,
                result: []
            }
        },
        methods: {
            // 病历资料
            case(){
                this.$http.get(this.$urls.LOADHISTORYCASES, { familyId: this.familyId }).then(d => {
                    this.result = d.cases || []
                    sessionStorage.setItem('case', JSON.stringify(this.result))
                })
            },
            // 就诊记录
            record (){
                this.$http.get(this.$urls.GAINFAMRECORDS, { 
                    familyid: this.familyId 
                }).then((d) => {
                    this.result = [].concat(d.records.map( record => {
                        record.caseInfo.id = record.id
                        return record.caseInfo
                    }))
                    sessionStorage.setItem('record', JSON.stringify(this.result))
                })
            },
            choice (item){
                this.ind = item.id
                this.ind == 0 ?
                    ( sessionStorage.getItem('case') ? this.result = JSON.parse(sessionStorage.getItem('case')) : this.case()) :
                    ( sessionStorage.getItem('record') ? this.result = JSON.parse(sessionStorage.getItem('record')) : this.record() )
            },
            imported (item){
                if (sessionStorage.getItem(this.actived)) {
                    let cacheForm = JSON.parse(sessionStorage.getItem(this.actived))
                    item = {
                        ...cacheForm,
                        ...item
                    }
                }
                item.attachments && item.attachments.forEach( atta => {
                    atta.id = ''
                })
                item.toDb = false
                item.mainSuit = item.caseDesc || item.mainSuit
                sessionStorage.setItem(this.actived, JSON.stringify(item))
                this.$router.go(-1)
            }
        },
        beforeDestroy () {
            sessionStorage.getItem('case') && sessionStorage.removeItem('case')
            sessionStorage.getItem('record') && sessionStorage.removeItem('record')
        }
    }
</script>
<style lang="less" scoped>
    @import '../../../assets/css/var';
    .padding{
         padding: 0 .83rem
    }
    header{
        .back{
            display: block;
            background: #9296a1;
            line-height: 2.83rem;
            height: 2.83rem;
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
                margin-top: -4px;
            }
        }
        .tab{
            border-bottom: 1px solid #e5e5e5;
            p{
                text-align: center;
                line-height: 3.75rem;
                span{
                    display: inline-block;
                    line-height: 3.3rem
                }
                .choice{
                    border-bottom: 4px solid @main-color;
                    color: @main-color
                }
            }
        }
    }
    section{
        .import-main{
            padding: 1.458rem 0 0;
            margin-bottom: 0.708rem;
            .import-router{
                display: block;
                margin: 0 .83rem
            }
            .font-color{
                color: #8a8e97
            }
            p:first-child{
                margin-bottom: .5rem
            }
            p:nth-child(2){
                margin-bottom: 1rem
            }
            p:nth-child(4){
                margin-bottom: 1rem
            }
            .space{
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap
            }
            .img{
                width: 5.417rem;
                height: 5.417rem;
                margin-bottom: 1.75rem;
                border: 1px solid #ccc;
                span{
                    bottom: 0;
                    width: 100%;
                    text-align: center;
                    background: rgba(0, 0, 0, 0.5);
                    line-height: 1.67rem
                }
            }
            .import{
                overflow: hidden;
                line-height: 3.67rem;
                border-top: .5px solid #e6e6e6;
                margin-left: .83rem;
                padding-right: .83rem;
                button{
                    float: right;
                    width: 6.08rem;
                    height: 2.04rem;
                    line-height: 2.04rem;
                    border-radius: 1rem;
                    font-size: 1.083rem !important;
                    margin-top: .81rem;
                    padding: 0
                }
                .padding{
                    padding-left: 4.5rem
                }
            }
        }
    }
    .visit{
        border-radius: 1rem;
        padding: .2rem .8rem;
        background: #cce7f6;
        color: @main-color;
        bottom: 1rem;
        left: .83rem
    }
    .visits{
        background: #fef6e5;
        color: #fdbe27;
    }
</style>
