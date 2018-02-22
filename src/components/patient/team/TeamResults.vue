<template>
    <article class="h100 scroll relative" id="resultScroll" v-scroll="onScroll">
        <template v-if="teams.length">
            <team-item class="teamlists" v-for="(team, key) in teams" :key="key" :team="team"></team-item>
        </template>
        <load-more v-if="!teams.length" :show-loading="false" :tip="'暂无数据'" background-color="transparent"></load-more>
        <div class="loadingdiv" style="height: 2.6rem;" v-if="scroll.pullupStatus!='disabled'">
            <div class="weui-loadmore tcenter" style="margin: 0 auto; line-height: 2.6rem; color: #666;">
                <i class="weui-loading" v-if="scroll.pullupStatus=='loading'"></i>
                <span v-else>上拉加载更多</span>
            </div>
        </div>
    </article>
</template>
<script>
    import Scroll from '@/directives/scroll'
    import debounce from 'vux/src/tools/debounce'
    import { LoadMore } from 'vux'
    import { TeamItem } from '@components/share'
    export default {
        name: 'teamresults',
        components: {
            LoadMore, TeamItem
        },
        directives: {
            Scroll
        },
        data(){
            return {
                pullupConfig: this.$store.state.pullupConfig,
                scroll: {
                    pullupStatus: 'default',
                    bottom: 2
                },
                form: {
                    ispage: 1,
                    pageNo: 1,
                    pageSize: 10,
                    depId: '',
                    hosId: '',
                    distCode: '',
                    serviceId: this.$route.query.serviceId,
                    search: this.$route.query.search
                },
                teams: []
            }
        },
        created (){
            this.loadPullUp()
        },
        methods: {
            onScroll: debounce (function( e, position ){
                let clientHeight = e.clientHeight;
                let scrollHeight = e.scrollHeight;
                let scrollH = clientHeight + position.scrollTop + this.scroll.bottom
                if( scrollH >= scrollHeight && this.scroll.pullupStatus == 'default' ){
                    this.loadPullUp()
                }
            }, 100),
            loadPullUp () {
                this.scroll.pullupStatus == 'loading'
                this.$http.get(this.$urls.GAINDOCTEAMS, this.form, this).then( d => {
                    let team = d.dts
                    this.teams = this.teams.concat(team)
                    setTimeout(() => {
                        if( team.length == this.form.pageSize ){
                            this.form.pageNo ++
                            this.scroll.pullupStatus = 'default'
                        } else {
                            this.scroll.pullupStatus = 'disabled'
                        }
                    }, 100)
                })
            }
        }
    }
</script>