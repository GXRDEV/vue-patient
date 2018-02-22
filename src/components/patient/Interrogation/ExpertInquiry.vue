<template>
    <div class="expertinquiry bgfff" style="min-height: 100vh;">
        <heading :title="typaName[severId]">
            <div style="color: #878d99">
                <p v-if="severId=='5'">
                    专家图文会诊是由当地医生协助问诊，专家提供权威、精准诊疗意见的问诊服务。患者无法直接向专家发起问诊申请，需要联系所报到的医生（尚未与医生建立联系的请提前进行患者报到）向医生发送相关病历资料或检查检验信息资料，由医生协助向专家发起图文会诊，会诊结束后专家将给出会诊意见报告。
                </p>
                <p v-else>
                    专家视频会诊是由当地医生协助问诊，患者在线下医院全程参与，专家提供权威、精准诊疗意见的远程医疗服务。患者无法直接向专家发起视频会诊申请，需联系所报到的医生或向医生发起患者报到申请，报到成功后与医生建立联系，由医生向专家发起视频会诊，会诊结束后专家给出会诊意见报告。
                </p>
            </div>
        </heading>
        <well-know-doc :depId="depId" :gpsCode="gpsCode" :serviceId="severId" title="匹配医生推荐" subtitle="" :img="false" :islink="false" :docId="docId"></well-know-doc>
        <well-know-team :depId="depId" :docId="docId" :serviceId="severId" title="专家所在团队" subtitle="" :img="false" :islink="false" :showall="false"></well-know-team>
    </div>
</template>
<script>
    import { Group, Swiper, SwiperItem } from 'vux'
    import { imgsrc } from '@filters'
    import { mapGetters } from 'vuex'
    import { WellKnowTeam, WellKnowDoc, Heading } from '@components/share'
    export default{
        components: {
            Group,
            Swiper,
            SwiperItem,
            WellKnowTeam, WellKnowDoc, Heading
        },
        computed: {
            ...mapGetters(['gpsName', 'gpsCode'])
        },
        data () {
            return {
                severId: this.$route.query.sever,
                typaName: {'4': '视频咨询', '5': '图文会诊'},
                depId: this.$route.query.depId,
                timer: new Date().getTime(),
                docId: this.$route.query.docid
            }
        },
        methods: {
            imgsrc
        }
    }
</script>
