<template>
    <section class="noborder itemtitle fastbuydrug">
        <group gutter="0">
            <cell class="cell-title" is-link :link="{ path: '/drugs' }" value-align="left">
                <img slot="icon" style="height: 1.167rem; margin-right: .25rem; vertical-align: -2.5px;" src="../../assets/img/main/fastask.png">
                <label slot="title" class="big13 blacklower whitespace ohidden">{{title}}</label>
                <label class="small10 gray whitespace ohidden">&emsp;无需出门，药品到家</label>
                <label class="small10 blacklower whitespace ohidden fright">查看全部<img class="arrow" src="../../assets/img/main/toall.png"></label>
            </cell>
        </group>
        <div class="sctionblock scroll" v-if="drugs.length">
            <dl class="list-container ohidden clearfix" :style="`width: ${drugs.length * 11.25}rem`">
                <dd class="list-item fleft relative blacklower" v-for="(drug, key) in drugs" :key="key">
                    <router-link :to="'/drugdetail/'+drug.drugInnerCode " class="itemlink ohidden">
                        <i class="photo tcenter">
                            <img :src="`${imgsrc(drug.pics[0].picUrl ,'nodrug', '300')}`">
                        </i>
                        <p class="whitespace small10 bbox">{{drug.drugName}}</p>
                        <p class="bbox flex">
                            <span class="tleft whitespace flex_2">{{drug.drugSpec}}</span>
                            <span class="tright maincolor flex_1">￥{{drug.price}}</span>
                        </p>
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
    name: 'fastbuydrug',
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
        this.drugs = JSON.parse(localStorage.getItem('_cache_home_drugs') || '[]')
    },
    mounted() {
        this.initData()
    },
    data() {
        return {
            drugs: []
        }
    },
    methods: {
        imgsrc,
        initData() {
            // 药品列表
            this.$http.get(this.$urls.DRUGSLIST, {
                pageNo: 1,
                pageSize: 5
            }).then((d) => {
                localStorage.setItem('_cache_home_drugs', JSON.stringify(this.drugs = d.drugs))
            })
        }
    }
}
</script>
<style lang="less" scoped>
    @import "../../assets/css/var";
    .sctionblock {
        overflow-x: scroll;
        margin-left: 0.75rem;
        margin-right: 0.75rem;
        box-sizing: border-box;
        .list-item {
            display: inline-block;
            width: 11.25rem;
            padding: 0 0 1.25rem;
            .itemlink {
                display: block;
                color: #222;
                box-sizing: border-box;
                border: 1px solid @main-bg-color;
                border-radius: 3px;
                margin: 0 .2rem 0 .2rem;
                height:11.55rem;
            }
            .photo {
                display:inline-block;
                height: 7.5rem;
                width: 100%;
                padding: 0.67rem 0.67rem 0;
                box-sizing: border-box;
               img {
                    width: 100%;
                    height: 20vw;
                    object-fit: contain
               }
            }
            p {
                padding: 0 .67rem;
            }
        }
    }

</style>

