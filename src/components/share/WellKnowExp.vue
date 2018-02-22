<template>
    <section class="noborder itemtitle wellknowexp">
        <group gutter="0">
            <cell class="cell-title" is-link :link="{ path: '/libs/exp/all', query:{ distCode: distcode } }" value-align="left">
                <img slot="icon" style="height: 1.167rem; margin-right: .25rem; vertical-align: -2.5px;" src="../../assets/img/main/expicon.png">
                <label slot="title" class="big13 blacklower whitespace ohidden">{{title}}</label>
                <label class="small10 gray whitespace ohidden">&emsp;远程、图文会诊 精准权威</label>
                <label class="small10 blacklower whitespace ohidden fright">查看全部<img class="arrow" src="../../assets/img/main/toall.png"></label>
            </cell>
        </group>
        <div class="sctionblock scroll" v-if="exps.length">
            <dl class="list-container ohidden clearfix" :style="`width: ${exps.length * 13.5}rem`">
                <dd class="list-item fleft relative" v-for="(exp, key) in exps" :key="key">
                    <router-link :to="'/docinfo/' + exp.specialId" class="itemlink ohidden">
                        <span class="hasimg">
                            <i class="thumb bgcove" :style="`background-image:url(${imgsrc(exp.listSpecialPicture)})`"></i>
                        </span>
                        <div>
                            <span class="block whitespace big14 blacklower">{{ exp.specialName }}
                                <label class="base12">&ensp;{{ exp.duty }}</label>
                            </span>
                            <label class="block base12 gray whitespace">{{ exp.hosName }} {{ exp.depName }}</label>
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
    name: 'wellknowexp',
    components: {
        Scroller, Group, Cell
    },
    props: {
        distcode: [String, Number],
        title: String
    },
    watch: {
        distcode() {
            this.initData()
        }
    },
    created() {
        this.exps = JSON.parse(localStorage.getItem('_cache_home_exps') || '[]')
    },
    mounted() {
        this.initData()
    },
    data() {
        return {
            exps: []
        }
    },
    methods: {
        imgsrc,
        initData() {
            // 区域优秀专家
            this.$http.get(this.$urls.GAINDOCTORS, {
                dtype: 2,
                isoptimal: 1,
                distCode: this.distcode,
                pageNo: 1,
                pageSize: 5
            }).then((d) => {
                localStorage.setItem('_cache_home_exps', JSON.stringify(this.exps = JSON.parse(d.docs)))
            })
        }
    }
}
</script>
<style lang="less" scoped>
    @import "../../assets/css/view/wellknow.less";
</style>
