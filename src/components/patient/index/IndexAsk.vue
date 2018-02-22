<template>
    <article class="mainpage h100 flex column">
        <search-bar class="absolute top left right gspsearch" :address="gpsName" placeholder="请输入医院 | 科室 | 医生姓名"></search-bar>
        <div style="overflow-y:auto;margin-top:3.33rem;">
            <section class="swipe-container">
                <swiper :list="swipelist" auto height="8.33rem" :show-desc-mask="false" dots-class="custom-bottom"></swiper>
                <section class="noborder finddoc">
                    <group gutter="0">
                        <cell class="cell-title" is-link :link="{ path: '/interrogation/'+timer, query: { sever: '9' } }" value-align="left" inline-desc="快速咨询病情，手机看病，在线开药">
                            <img slot="icon" style="height: 3rem; margin-right: 1rem;" src="../../../assets/img/main/disask.png">
                            <label slot="title" class="big20 colorgray">疾病咨询</label>
                        </cell>
                    </group>
                    <group gutter="0">
                        <cell class="cell-title" is-link :link="{ path: '/finddoc' }" value-align="left" inline-desc="搜全国医生，对症咨询，向医生报道">
                            <img slot="icon" style="height: 3rem; margin-right: 1rem;" src="../../../assets/img/main/finddoc.png">
                            <label slot="title" class="big20 colorgray">找医生</label>
                        </cell>
                    </group>
                </section>
            </section>
            <section class="flex serveritem ohidden">
                <router-link class="flex_1 team" :to="`/teamserver?distCode=${gpsCode}`"></router-link>
                <div class="flex_1 column">
                    <router-link class="flex_1 doc" :to="`/privatedocserver?distCode=${gpsCode}`">
                        <img src="../../../assets/img/doc-server.png" class="w100">
                    </router-link>
                    <router-link to="/greenapply" class="flex_1">
                        <img src="../../../assets/img/green-service.png" class="w100">
                    </router-link>
                </div>
            </section>
            <fast-buy-drug title="快速购药"></fast-buy-drug>
            <well-know-team :gpsCode="gpsCode"></well-know-team>
            <well-know-exp title="全国名院专家" ></well-know-exp>
            <section class="tab-main" v-if="tabs.length">
                <div class="tabs">
                    <span v-for="(t,index) in tabs" :key="index" :class="{'checked':form.type == t.id}" @click="tabClick(t.id)">
                        <span>{{ t.typeName }}</span>
                    </span>
                </div>
                <div class="scroller-main" ref="container" style="height: 17rem">
                    <div>
                        <a :href="item.textLink" class="tab-item block ohidden" v-for="(item, index) in healthlist" :key="index">
                            <i class="thumb bgcove" :style="`background-image:url(${imgsrc(item.backImage, 'health', 112)})`"></i>
                            <div>
                                <p class="title">{{ item.title }} </p>
                                <span class="small11 time gray">{{ item.timeStr }}</span>
                            </div>
                        </a>
                    </div>
                    <router-link :to="'/healths/'+ form.type" class="tcenter maincolor block" v-if="healthlist.length == 2" style="padding: .8rem 0 1rem">查看更多</router-link>
                </div>
            </section>
        </div>
    </article>
</template>
<script>
import { Swiper, SwiperItem, Group, Cell } from 'vux'
import {  WellKnowExp, WellKnowTeam, SearchBar, FastBuyDrug } from '@components/share'
import { mapGetters } from 'vuex'
import { imgsrc } from '@filters'
export default {
    name: 'home',
    components: {
        SearchBar, Swiper, SwiperItem, Group, Cell, WellKnowExp, WellKnowTeam, FastBuyDrug
    },
    computed: {
        ...mapGetters(['gpsName', 'gpsCode'])
    },
    created() {
        this.swipelist = JSON.parse(localStorage.getItem('_cache_home_swipelist') || '[]')
        this.tabs = JSON.parse(localStorage.getItem('_cache_home_tabs_') || '[]')
    },
    mounted() {
        // 滚动图片
        this.$http.get(this.$urls.GAINMAINPICS).then(d => {
            localStorage.setItem('_cache_home_swipelist', JSON.stringify(this.swipelist = (d.pics || []).map(item => {
                return {
                    url: item.linkUrl,
                    img: item.imageUrl
                }
            })))
        })
        this.tabClick();
        //获取tab栏数据
        this.$http.get(this.$urls.GAINPLATHEALTHTYPES).then(d => {
            this.tabs = d.types;
            localStorage.setItem('_cache_home_tabs_', JSON.stringify(d.types))
            for(let i in this.tabs){
              let ind = parseInt(i)+1
              localStorage.getItem('_cache_cases_' + ind + '_') && localStorage.removeItem('_cache_cases_' + ind + '_')
            }
        })
        this.loadPullUp(1);
        this.tabClick();
    },
    data() {
        return {
            keyword: '',
            swipelist: [],
            teams: [],
            tabs: [],
            healthlist: [],
            timer: new Date().getTime(),
            form: {
                type: 1,
                pageNo: 1,
                pageSize: 2
            }
        }
    },
    methods: {
        imgsrc,
        loadPullUp(index) {
            this.$http.get(this.$urls.HEALTHINFORMATION, this.form).then(d => {
                this.healthlist = d.resources || [];
                localStorage.setItem('_cache_cases_' + index + '_', JSON.stringify(d.resources))
            })
        },
        //tab切换
        tabClick(index) {
            index = index || 1;
            this.form.type = index;
            this.healthlist = JSON.parse(localStorage.getItem('_cache_cases_' + index + '_')) || []
            !this.healthlist.length && this.loadPullUp(index)
        },
    }
}
</script>
<style lang="less" scoped>
@import "../../../assets/css/var";
.grayImg {
    filter: brightness(99.5%) grayscale(100%);
}
.gspsearch {
    z-index: 10;
}
.colorgray {
    color: #333;
}
section {
    background: #fff;
    &+section {
        margin-top: 0.55rem;
    }
}
.swipe-container {
    ul {
        width: 100%;
        box-sizing: border-box;
        padding: .625rem 1rem 1.5rem;
        li {
            display: inline-block;
            line-height: 1.65rem;
            border: 1px solid @main-bg-color;
            border-radius: 2rem;
            padding: 0.13rem 0.9rem 0.04rem;
            margin-right: 3%;
            box-sizing: border-box;
            &:last-child {
                margin-right: 0;
            }
        }
    }
}
.tab-main {
    padding: 0 1rem;
    .tab-item {
        position: relative;
        border-top: 1px solid @main-bg-color;
        padding-top: .92rem;
        margin-bottom: .92rem;
        &:last-child {
            margin-bottom: 0;
        }
        .thumb {
            width: 8.65rem;
            height: 5.38rem;
            float: left;
            margin-right: .5rem;
        }
        .title {
            font-size: 1.083rem;
            color: #222222;
            overflow: hidden;
            .setMultEllipsis();
        }
        .time {
            position: absolute;
            bottom: 0;
            right: 0;
        }
    }
    .tabs {
        height: 3.33rem;
        width: 100%;
        line-height: 3.33rem;
    }
    .tabs span {
        position: relative;
        padding: 0 .5rem;
        display: inline-block;
        color: #222;
        font-size: 1.083rem;
    }
    .checked span {
        position: relative;
        padding: 0 .5rem;
        display: inline-block;
        color: @main-color;
        &:after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            border-radius: 3px;
            height: 3px;
            background: @main-color;
        }
    }
}
header {
    box-sizing: border-box;
    height: 3.33rem;
    line-height: 3.33rem;
    background-color: #fff;
}
.serveritem {
    background-color: #eee;
    .team {
        background-image: url(../../../assets/img/team-server.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        border-right: 1px dashed #fff;
        &:after {
           content: "";
           display: block;
           padding: 36.8%;
         }
    }
    img {
        display:block;
    }
    .doc img{
        border-bottom: 1px dashed #fff;
    }
}
.finddoc {
    border-top: 1px solid #eee;
}
</style>
<style lang="less">
.mainpage {
    .sctionblock {
        margin-left: 0.75rem;
        margin-right: 0.75rem;
        box-sizing: border-box;
    }
    .searchbarCom .searchbar-input {
        background-color: #eee;
        border-radius: 2rem;
        width: 100%;
        height: 2.04rem;
        color: #ccc;
        padding-left: .8rem;
        justify-content: flex-start;
        .magnifier {
            margin-right: .8em;
            background-image: url(../../../assets/img/main/searchicon.png);
        }
    }
    .itemtitle .weui-cell {
        padding: .92rem 1rem;
    }
    .itemtitle .weui-cell_access .weui-cell__ft {
        line-height: normal;
        padding-right: 0;
        .arrow {
            width: .67rem;
            height: .67rem;
            margin-left: .333rem;
        }
        &:after {
             width:0;
             height:0;
         }
    }
    .itemtitle .vux-cell-bd p {
          line-height:1;
    }
}
.swipe-container {
    .weui-cell {
        padding: 1.25rem 1.25rem 1.25rem 2.08rem;
    }
    .vux-cell-bd {
        .vux-label-desc {
          color: #989898;
          font-size:1.083rem;
        }
        p {
          line-height: 1;
          margin-bottom: .5rem;
        }
    }
}
</style>
