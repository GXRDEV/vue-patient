<template>
    <section class="noborder itemtitle wellnknowteam">
        <group gutter="0">
            <cell class="cell-title flex" :is-link="islink" :link="islink ? { path: '/libs/team/all', query:{ distCode: gpsCode,  depId: depId } } : ''" value-align="left">
                <img slot="icon" v-if="img" style="height: 1.167rem; margin-right: .25rem;vertical-align: -2.5px;" src="../../assets/img/main/teamicon.png">
                <label slot="title" class="big13 blacklower whitespace ohidden">{{title}}</label>
                <label class="small10 gray whitespace ohidden " style="display:inline-block;max-width:12rem;">&emsp;{{subtitle}}</label>
                <label class="small10 blacklower whitespace ohidden fright" v-if="showall">查看全部<img class="arrow" src="../../assets/img/main/toall.png"></label>
            </cell>
        </group>
        <div class="sctionblock scroll" v-if="teams.length">
            <dl class="list-container ohidden clearfix" :style="`width: ${teams.length * 12}rem`">
                <dd class="list-item fleft relative" v-for="(team, key) in teams" :key="key">
                    <router-link :to="'/teaminfo/' + team.id" class="itemlink ohidden">
                        <div class="hasimg tcenter">
                            <i class="thumb bgcove" :style="`background-image:url(${imgsrc(team.logoUrl, team.hasExp=='true' ? 'teammain' : 'team')})`"></i>
                        </div>
                        <p class="tcenter whitespace">
                            <label class="big12 blacklower">{{team.teamName}}</label>
                        </p>
                        <span class="whitespace2 base12 block gray">
                            {{(team.speciality||'暂无')}}
                        </span>
                        <p class="tcenter base12">
                            <span class="list-item-star">
                                <i class="common star bgcove"></i>
                                <span class="star-count">{{ team.aver }}</span>
                            </span>
                            <span class="list-item-star">
                                <i class="common person bgcove"></i>
                                <span class="person-count">{{ team.memberCount }}</span>
                            </span>
                        </p>
                    </router-link>
                    <span v-if="team.hasExp=='true'" class="absolute sign small10">特约专家</span>
                </dd>
            </dl>
        </div>
    </section>
</template>
<script>
import { Group, Cell } from 'vux'
import { imgsrc } from '@filters'
export default {
    /*  gpsCode 区域码
        depId 标准科室id
        ispage 是否分页
        isoptimal 是否推优
        pageNo 当前页码
        pageSize 每页数量
    */
    name: 'wellknowteam',
    props: {
        gpsCode: [String, Number],
        title: {
            type: String,
            default: '医生团队服务'
        },
        subtitle: {
            type: String,
            default: '提供确诊保障，安心放心'
        },
        showall: {
            type: Boolean,
            default: true
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
        docId: [String, Number],
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
        }
    },
    components: {
        Group,
        Cell
    },
    data() {
        return {
            teams: ''
        }
    },
    watch: {
        gpsCode() {
            this.initData()
        }
    },
    created() {
        this.teams = JSON.parse(localStorage.getItem('_cache_home_teams') || '[]')
    },
    mounted() {
        this.initData()
    },
    methods: {
        imgsrc,
        initData() {
            if (this.docId) {
                //获取医生所属医生团队数据
                this.$http.get(this.$urls.GAINDOCBELONGTEAMS, {
                    docid: this.docId
                }).then(d => {
                    this.teams = d.teams;
                })
            } else {
                //区域优秀团队
                this.$http.get(this.$urls.GAINDOCTEAMS, {
                    ispage: this.ispage,
                    isoptimal: this.isoptimal,
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    distCode: this.gpsCode,
                    depId: this.depId,
                    serviceId: this.serviceId
                }).then(d => {
                    localStorage.setItem('_cache_home_teams', JSON.stringify(this.teams = d.dts))
                })
            }
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
        width: 12rem;
        padding: 0 0 1.25rem;
        .itemlink {
            display: block;
            color: #000;
            box-sizing: border-box;
            border: 1px solid @main-bg-color;
            border-radius: 3px;
            margin: 0 .2rem 0 .2rem;
            padding: .92rem 0.83rem 1.25rem;
            height: 13.2rem;
        }
        .sign {
            top: 0;
            right: 1.3em;
            border-radius: 4px;
            line-height: 1;
            background: @warn-color;
            color: #fff;
            padding: 3px 8px;
        }
        .thumb {
            width: 3.45rem;
            height: 3.45rem;
        }
        .hasimg {
            line-height: 1.5rem;
        }
        .whitespace2 {
            margin: .6rem 0 .5rem;
            box-sizing: border-box;
            overflow: hidden;
            .setMultEllipsis();
        }
        .list-item-star {
            width: 45%;
            display: inline-block;
            .common {
                display: inline-block;
                width: .83rem;
                height: .83rem;
            }
            .star {
                background-image: url(../../assets/img/star/active.png);
            }
            .star-count {
                color: @warn-color;
            }
            .person {
                background-image: url(../../assets/img/personicon.png);
                background-size: contain;
            }
            .person-count {
                color: @main-color;
            }
        }
    }
}
</style>

