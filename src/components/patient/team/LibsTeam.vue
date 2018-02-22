<template>
    <article class="flex h100vh column libsTeam">
        <header>
            <div class="toptitle bgcove">
                <h3 class="relative title big20">全国名医团队</h3>
                <div class="flex distrible">
                    <div class="disc"></div>
                    <div class="words flex_1 small10 ohidden whitespace2">
                        选择团队内医生进行初诊，根据您的病情可享受团队首席复诊，
                        或预约北上广名院专家进行远程会诊及转诊等服务
                    </div>
                </div>
                <search-bar class="absolute" placeholder="医生团队、医生、擅长" style="left: 3% ; right:3%;" types="team" :serviceId="query.serviceId"></search-bar>
            </div>
            <choose v-model="choose"></choose>
        </header>
        <section class="flex_1 relative bgfff">
            <div class="h100 w100 absolute top left scroll" id="resultScroll" v-scroll="onScroll">
                <template v-if="teams.length">
                    <team-item class="teamlists" v-for="(team, key) in teams" :key="key" :team="team"></team-item>
                </template>
                <load-more v-if="!teams.length && scroll.pullupStatus == 'disabled'" :show-loading="false" :tip="'暂无数据'" background-color="transparent"></load-more>
                <div class="loadingdiv" style="height: 2.6rem;" v-if="scroll.pullupStatus!='disabled'">
                    <div class="weui-loadmore tcenter" style="margin: 0 auto; line-height: 2.6rem; color: #666;">
                        <i class="weui-loading" v-if="scroll.pullupStatus=='loading'"></i>
                        <span v-else>上拉加载更多</span>
                    </div>
                </div>
            </div>
            <choose-items v-model="choose" @on-query="queryChange" :role="query.dtype" ref="chooseitem" position="absolute"></choose-items>
        </section>
    </article>
</template>
<script>
    import { LoadMore } from 'vux'
    import { Choose, ChooseItems, ItemFlexImg, SearchBar, TeamItem } from '@components/share'
    import debounce from 'vux/src/tools/debounce'
    import { mapGetters } from 'vuex'
    import Scroll from '@/directives/scroll'
    import { imgsrc } from '@filters'
    export default {
        name: 'libsteam',
        components: {
            LoadMore, Choose, ChooseItems, ItemFlexImg, SearchBar, TeamItem
        },
        directives: {
            Scroll
        },
        data () {
            return {
                choose: {
                    selected: 0,
                    navtop: 0,
                    navfixed: false,
                    navstyle: '',
                    distCode: {},
                    hosName: '',
                    hosId: '',
                    depName: '',
                    depId: ''
                },
                query: {
                    ispage: 1,
                    pageNo: 1,
                    pageSize: 5,
                    depId: '',
                    hosId: '',
                    distCode: '',
                    serviceId: this.$route.query.serviceId ||''
                },
                keyword: '',
                scroll: {
                    pullupStatus: 'default',
                    bottom: 2
                },
                pullupConfig: this.$store.state.pullupConfig,
                teams: []
            }
        },
        computed: {
            ...mapGetters(['gpsCode', 'gpsName'])
        },
        watch: {
            gpsCode () {
                let q = this.$route.query || {}
                if (q.gps == 1) {
                    this.choose.distCode = {
                        code: this.gpsCode,
                        name: this.gpsName
                    }
                }
            }
        },
        created () {
            let q = this.$route.query
            q.hosId && ( this.choose.hosId = q.hosId )
            q.depId && ( this.choose.depId = q.depId )
            if ('distCode' in q) {
                this.choose.distCode = {
                    code: q.distCode,
                    name: ''
                }
            } else if (q.gps == 1) {
                this.choose.distCode = {
                    code: this.gpsCode,
                    name: this.gpsName
                }
            }
            this.query = {...this.query, ...q}
            this.loadPullUp()
        },
        methods: {
            imgsrc,
            onScroll: debounce(function( e, position){
                let clientHeight = e.clientHeight;
                let scrollHeight = e.scrollHeight;
                let scrollH = clientHeight + position.scrollTop + this.scroll.bottom
                if( scrollH >= scrollHeight && this.scroll.pullupStatus == 'default'){
                    this.loadPullUp()
                }
            }, 100),
            loadPullUp () {
                this.scroll.pullupStatus = 'loading'
                this.$http.get(this.$urls.GAINDOCTEAMS, this.query, this).then(d => {
                    let cur = d.dts
                    this.teams = this.teams.concat(cur)
                    setTimeout(() => {
                        if (cur.length == this.query.pageSize) {
                            this.query.pageNo++
                            this.scroll.pullupStatus = 'default'
                        } else {
                            this.scroll.pullupStatus = 'disabled'
                        }
                    }, 100)
                })
            },
            queryChange (v) {
                this.query.pageNo = 1
                this.query.hosId = this.choose.hosId
                this.query.depId = this.choose.depId
                this.query.distCode = this.choose.distCode.code
                this.teams = []
                this.scroll.pullupStatus = 'enabled'
                this.loadPullUp()
                this.$router.replace({ name: 'team', params: { pid: +new Date }, query: this.query })
            }
        }
    }
</script>
<style scoped lang="less">
    @import '../../../assets/css/var';
    header{
        .toptitle{
            height: 11.34rem; box-sizing: border-box;
            background-image: url("../../../assets/img/team/team-list.png");
            padding: 0 1.4rem;
            margin-bottom: .769rem;
            h3{
                color: @warn-color;
                line-height: 1;
                text-align: center;
                padding: 1.76rem 0 1.1rem;
            }
            .distrible{
                padding: 0 .5rem .73rem;
            }
            .disc{
                width: 6px;
                height: 6px;
                background: @warn-color;
                margin: 4px .2rem 0 0;
                border-radius: 50%;
            }
            .words{
                color: #7e7e7e;
                list-style-type: disc;
            }
        }
    }
</style>
<style lang="less">
  .libsTeam {
        .searchbarCom .searchbar-input{
            border-radius: 1rem;
        }
  }
</style>
