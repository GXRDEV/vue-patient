<template>
    <div>
        <div v-for="(arrList, arrInd) in arr" :key="arrInd" class="server">
            <p class="title big15">{{arrList.name}}&ensp;<span class="small9">{{arrList.english}}</span></p>
            <div v-for="(conList, conInd) in arrList.content" :key="conInd" class="content">
                <p class="flex">
                    <span class="number fff small10">{{conInd+1}}</span><span class="flex_1" style="line-height: 1.5rem">{{conList.title}}</span>
                </p>
                <div v-if="conList.value && conList.value.length">
                    <p v-for="(valList, valInd) in conList.value" :key="valInd" class="value">
                        <span v-if="conList.value.length != 1">{{valInd+1}}、</span><span>{{valList}}</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            type: String
        },
        data (){
            return{
                arr: [],
                doc: [
                    {
                        name: '服务介绍',
                        english: 'SERVIC INTRODUCTIOW',
                        content: [
                            {
                                title: '专属医生一站式健康管家服务',
                                value: []
                            },
                            {
                                title: '提升您的就诊质量和效率',
                                value: []
                            },
                            {
                                title: '疾病随时就医，不拖延病情',
                                value: []
                            },
                            {
                                title: '医疗领域您也有自己的贴心熟人',
                                value: []
                            },
                            {
                                title: '体检预防、咨询、就诊、诊后全程关怀',
                                value: []
                            },
                        ]
                    },
                    {
                        name: '服务内容',
                        english: 'SERVIC CONTENT',
                        content: [
                            {
                                title: '体检计划',
                                value: ['制定针对性的体检方案，到指定体检机构，享受体检折扣，给予保健和诊疗建议。']
                            },
                            {
                                title: '健康咨询',
                                value: ['日常问题随时线上沟通，不限次数；', '复杂病情可申请医生电话回拨；']
                            },
                            {
                                title: '对症分诊',
                                value: ['医生专业外的问题，引导至其他科室内具体医生诊疗，您的私人分诊中心。']
                            },
                            {
                                title: '诊后随访',
                                value: ['门诊结束后，可随时向私人医生发起用药指导、治疗方案分析咨询。']
                            },
                            {
                                title: '就医复诊',
                                value: ['可要求联系北上广大三甲医院专家进行复诊（可享受一定折扣），解除就诊疑虑。']
                            },
                        ]
                    },
                    {
                        name: '服务提示',
                        english: 'SERVIC INTRODUCTIOW',
                        content: [
                            {
                                title: '8:00-22:00（其中18:00-22:00仅提供线上问诊），次数不限。'
                            }
                        ]
                    }
                ],
                team: [
                    {
                        name: '服务介绍',
                        english: 'SERVIC INTRODUCTIOW',
                        content: [
                            {
                                title: '专属团队服务',
                                value: ['一个为您服务的医疗团队']
                            },
                            {
                                title: '专属健康管理服务',
                                value: ['提供健康咨询、问诊开药、就医咨询、康复指导的专业医疗服务']
                            },
                            {
                                title: '专属医师服务',
                                value: ['提供健康预警、监控、预防']
                            }
                        ]
                    },
                    {
                        name: '服务内容',
                        english: 'SERVIC CONTENT',
                        content: [
                            {
                                title: '陪同就医',
                                value: ['医院内所有就医程序的引导及陪同，协助就医。']
                            },
                            {
                                title: '上、下转诊',
                                value: ['线上或线下转诊公立三甲医院专家，恢复期返回当地医院康复治疗。']
                            },
                            {
                                title: '就医复诊',
                                value: ['集团内负责人免费复诊；', '也可申请北上广大三甲医院专家进行复诊（可享受一定折扣）。']
                            },
                            {
                                title: '影像复诊',
                                value: ['可申请联系公立大三甲医院放射科、B超等科室的专家对影像结果复核。']
                            },
                            {
                                title: '诊后随访',
                                value: ['与北上广专家会诊结束后1周内，可享受一次5折图文会诊随访。']
                            },
                            {
                                title: '住院、手术绿通',
                                value: ['享受当地医院住院、手术优先预约，可安排一次/月北上广大三甲医院手术预约。']
                            },
                            {
                                title: '体检计划',
                                value: ['制定针对性的体检方案，到指定体检机构，享受体检折扣，给予保健和诊疗建议。']
                            },
                            {
                                title: '基因检测',
                                value: ['肿瘤易感基因位点筛查。']
                            },
                            {
                                title: '健康档案',
                                value: ['建立家庭成员私密、完整的电子健康档案，并持续更新。']
                            },
                            {
                                title: '慢性病管理',
                                value: ['建立长期完善的康复、检测计划，定期随访，随时沟通。']
                            },
                            {
                                title: '健康咨询',
                                value: ['日常问题随时线上沟通，不限次数', '复杂病情可申请医生电话回拨']
                            },
                            {
                                title: '对症分诊',
                                value: ['集团内分诊中心为您导诊至集团内各医院相关科室就诊，并内部会诊。']
                            },
                        ]
                    },
                    {
                        name: '服务提示',
                        english: 'SERVIC INTRODUCTIOW',
                        content: [
                            {
                                title: '8:00-22:00（其中18:00-22:00仅提供图文服务），次数不限。'
                            }
                        ]
                    }
                ]
            }
        },
        created (){
            this.arr = (this.type == 'doc'||this.type == '15') ? this.doc : this.team
        }
    }
</script>
<style lang="less" scoped>
    @import '../../assets/css/var.less';
    .server{
        background: #f3f8fb;
        color: #303437;
        padding: 1.33rem 1rem;
        margin-bottom: .75rem;
        .title{
            color: #9296a1;
            line-height: 1;
            padding-bottom: 1.33rem
        }
        .number{
            height: 1rem;
            width: 1rem;
            text-align: center;
            line-height: 1rem;
            padding: .05rem;
            border-radius: 50%;
            background: @main-color;
            box-sizing: border-box;
            margin-right: .5rem;
            margin-top: .2rem;
        }
        .value{
            line-height: 1.5rem;
            padding-left: 1.5rem
        }
        .content{
            margin-bottom: 1rem
        }
        .content:last-child{
            margin: 0
        }
    }
    .server:last-child{
        margin: 0
    }
</style>
