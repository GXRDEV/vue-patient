<template>
    <section class="noborder itemtitle">
        <group gutter="0">
            <cell class="cell-title" :is-link="islink" :link="islink ? { path: '/libs/doc/all', query:{ distCode: gpsCode} } : ''" value-align="left">
                <img v-if="img" slot="icon" style="height: 1.5rem; margin-right: .5rem; vertical-align: -3px;" src="../../assets/img/main/docicon.png">
                <label slot="title" class="big19 blacklower whitespace ohidden">{{title}}</label>
                <label class="small11 gray whitespace ohidden">&emsp;{{subtitle}}</label>
            </cell>
        </group>
        <div class="sctionblock scroll" v-if="docs.length">
            <dl class="list-container ohidden clearfix" :style="`width: ${docs.length * 13.5}rem`">
                <dd class="list-item fleft relative" v-for="(doc, key) in docs" :key="key">
                    <router-link :to="'/docinfo/' + doc.specialId" class="itemlink ohidden blacklower">
                        <span class="hasimg">
                            <i class="thumb bgcove" :style="`background-image:url(${imgsrc(doc.listSpecialPicture)})`"></i>
                        </span>
                        <div>
                            <span class="block whitespace big14">{{ doc.specialName }}
                                <label class="base12">&ensp;{{ doc.duty }}</label>
                            </span>
                            <label class="block base12 gray whitespace">{{ doc.hosName }} {{ doc.depName }}</label>
                        </div>
                    </router-link>
                </dd>
            </dl>
        </div>
    </section>
</template>
<script>
import { Scroller, Group, Cell } from 'vux'
import { imgsrc } from '@filters'
export default {
    /*  gpsCode 区域码
        depId 标准科室id
        ispage 是否分页
        isoptimal 是否推优
        pageNo 当前页码
        pageSize 每页数量
    */
    name: 'wellknowtdoc',
    props: {
        gpsCode: [String, Number],
        title: {
            type: String,
            default: '优质医生推荐'
        },
        subtitle: {
            type: String,
            default: '向医生报到，时刻关注您的健康'
        },
        islink: {
            type: Boolean,
            default: true
        },
        img: {
            type: Boolean,
            default: true
        },
        depId: [String, Number],
        serviceId: [String, Number],
        ispage: {
            type: Number,
            default: 1
        },
        isoptimal: {
            type: Number,
            default: 1
        },
        pageNo: {
            type: Number,
            default: 1
        },
        pageSize: {
            type: Number,
            default: 5
        },
        docId: [String, Number]
    },
    components: {
        Scroller,
        Group,
        Cell
    },
    data() {
        return {
            docs: ''
        }
    },
    watch: {
        gpsCode() {
            this.initData()
        }
    },
    created() {
        this.docs = JSON.parse(localStorage.getItem('_cache_home_docs') || '[]')
    },
    mounted() {
        this.initData()
    },
    methods: {
        imgsrc,
        initData() {
            //区域优秀医生
            this.$http.get(this.$urls.GAINDOCTORS, {
                dtype: 3,
                ispage: this.ispage,
                isoptimal: this.isoptimal,
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                distCode: this.gpsCode,
                depId: this.depId,
                serviceId: this.serviceId,
                doctorId: this.docId
            }).then(d => {
                localStorage.setItem('_cache_home_docs', JSON.stringify(this.docs = JSON.parse(d.docs)))
            })
        }
    }
}
</script>
<style lang="less" scoped>
    @import "../../assets/css/view/wellknow.less";
</style>

