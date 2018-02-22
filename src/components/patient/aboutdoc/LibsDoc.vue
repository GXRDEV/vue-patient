<template>
    <article class="flex h100vh column libsDoc">
        <header>
            <div class="toptitle bgcove">
                <h3><span class="relative">图文问诊、电话问诊<i class="absolute top right sign">24h"</i></span></h3>
                <h4>全天候及时回复</h4>
                <p>
                    <search-bar placeholder="医院、科室、医生姓名" styles="padding: 0;"></search-bar>
                </p>
            </div>
            <choose v-model="choose"></choose>
        </header>
        <section class="flex_1 relative">
            <div class="h100 w100 absolute top left scroll" id="resultScroll" v-scroll="onScroll">
                <div class="doclists bgfff">
                    <doc-item v-for="i in docs" :item="i" :key="i.specialId" :type="type"></doc-item>
                </div>
                <load-more v-if="!docs.length && scroll.pullupStatus == 'disabled'" :show-loading="false" :tip="'暂无数据'" background-color="transparent"></load-more>
                <div class="loadingdiv" style="height: 2.6rem;" v-if="scroll.pullupStatus!='disabled'">
                    <div class="weui-loadmore tcenter" style="margin: 0 auto; line-height: 2.6rem; color: #666;">
                        <i class="weui-loading" v-if="scroll.pullupStatus=='loading'"></i>
                        <span v-else>上拉加载更多</span>
                    </div>
                </div>
            </div>
            <choose-items v-model="choose" position="absolute" :role="query.dtype" @on-query="queryChange" ref="chooseitem"></choose-items>
        </section>
    </article>
</template>
<script>
    import { LoadMore } from 'vux'
    import { Choose, ChooseItems, DocItem, SearchBar } from '@components/share'
    import { mapGetters } from 'vuex'
    import debounce from 'vux/src/tools/debounce'
    import Scroll from '@/directives/scroll'
    export default {
        name: 'libsdoc',
        components: {
            Choose, ChooseItems, SearchBar, LoadMore, DocItem
        },
        directives: {
            Scroll
        },
        data () {
            return {
                type: 'doc',
                choose: {
                    selected: 0,
                    navtop: 0,
                    navfixed: false,
                    navstyle: '',
                    distCode: {},
                    hosName: '',
                    hosId: '',
                    depName: '',
                    depId: '',
                    servName: '',
                    serviceId: ''
                },
                query: {
                    dtype: '3',
                    pageNo: 1,
                    pageSize: 10,
                    search: '',
                    serviceId: '',
                    depId: '',
                    hosId: '',
                    distCode: ''
                },
                keyword: '',
                scroll: {
                    pullupStatus: 'default',
                    bottom: 2
                },
                pullupConfig: this.$store.state.pullupConfig,
                docs: []
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
            q.search && ( this.keyword = q.search )
            q.hosId && ( this.choose.hosId = q.hosId )
            q.depId && ( this.choose.depId = q.depId )
            q.serviceId && ( this.choose.serviceId = q.serviceId )
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
            onScroll: debounce( function ( e, position ){
                let clientHeight = e.clientHeight;
                let scrollHeight = e.scrollHeight;
                let scrollH = clientHeight + position.scrollTop + this.scroll.bottom
                if( scrollH >= scrollHeight && this.scroll.pullupStatus == 'default'){
                    this.loadPullUp()
                }
            }, 100),
            loadPullUp () {
                this.scroll.pullupStatus = 'loading'
                this.$http.get(this.$urls.GAINDOCTORS, this.query, this).then(d => {
                    let cur = JSON.parse(d.docs)
                    this.docs = this.docs.concat(cur)
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
                this.query.hosId = this.choose.hosId
                this.query.serviceId = this.choose.serviceId
                this.query.depId = this.choose.depId
                this.query.distCode = this.choose.distCode.code
                this.initData()
            },
            initData () {
                this.query.pageNo = 1
                this.docs = []
                this.scroll.pullupStatus = 'enabled'
                this.$nextTick(() => {
                    this.$refs.scroller.reset({ top: 0 })
                })
                this.loadPullUp()
                this.$router.replace({ name: 'docs', params: { pid: +new Date }, query: this.query })
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../../../assets/css/var";
    header{
        .toptitle{
            height: 8.6rem; box-sizing: border-box;
            background-image: url("../../../assets/img/main/advicebg.png");
            padding: 1.667rem 3.458rem; line-height: 1;
            h3{ font-size: 1.1667rem; color: @main-color; font-weight: 400; }
            h4{ font-size: 1rem; color: #222; font-weight: 400; padding-top: 0.75rem; }
            p{ margin-top: 1.3rem;}
            .sign{
                border-radius: 0.6em; font-size: 0.8rem; right: -4em; top: -1em; line-height: 1.2;
                background: @warn-color; color: #fff; padding: 2px 5px;
            }
        }

    }
</style>
<style lang="less">
  .libsDoc {
        .itemlist {
          margin-left :1rem;
        }
  }
</style>
