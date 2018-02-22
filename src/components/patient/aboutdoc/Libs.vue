<template>
    <article class="flex h100vh column libsAll">
        <header>
            <search-bar :placeholder="`医院、科室、${type=='exp' ? '专家' : '医生' }姓名`" 
                :serviceId="query.serviceId"
                :dtype="query.dtype" styles="padding: .625rem 1rem;"></search-bar>
            <choose v-model="choose"></choose>
        </header>
        <section class="flex_1 relative">
            <div class="h100 w100 absolute top left">
                <scroller lock-x scrollbar-y use-pullup :prevent-default="false"
                    :pullup-config="pullupConfig" height="100%" v-model="scroll" @on-pullup-loading="loadPullUp" ref="scroller">
                    <div class="doclists bgfff">
                        <doc-item v-for="i in docs" :item="i" :key="i.specialId" :type="type"></doc-item>
                    </div>
                    <load-more v-if="!docs.length && scroll.pullupStatus == 'disabled'" :show-loading="false" :tip="'暂无数据'" background-color="transparent"></load-more>
                </scroller>
            </div>
            <choose-items v-model="choose" @on-query="queryChange" :role="query.dtype" position="absolute" ref="chooseitem"></choose-items>
        </section>
    </article>
</template>
<script>
    import { Scroller, LoadMore } from 'vux'
    import { Choose, ChooseItems, DocItem, SearchBar } from '@components/share'
    import { mapGetters } from 'vuex'

    export default {
        name: 'libs',
        components: {
            SearchBar, Scroller, LoadMore, Choose, ChooseItems, DocItem
        },
        data () {
            return {
                type: this.$route.params.type,
                choose: {
                    selected: 0,
                    distCode: {},
                    hosName: '',
                    hosId: '',
                    depName: '',
                    depId: '',
                    servName: '',
                    serviceId: this.$route.query.serviceId || ''
                },
                query: {
                    dtype: this.$route.params.type == 'exp' ? '2' : '3',
                    pageNo: 1,
                    pageSize: 10,
                    search: '',
                    serviceId: this.$route.query.serviceId || '',
                    depId: '',
                    hosId: '',
                    distCode: ''
                },
                keyword: '',
                scroll: {
                    pullupStatus: ''
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
            let that = this
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
            // 找不到dosCode，向上扩散
            window.location.hash.indexOf('libs/doc/all') != -1 && this.$http.get(this.$urls.GAINOPENCITYS, { type: 3 })
                .then( d => {
                        let array = d.pros.find ( obj => {
                            return obj.distCode == that.choose.distCode.code
                        } )
                        ! array &&  (that.choose.distCode = { code: that.$route.query.distCode && that.$route.query.distCode.toString().substr(0, 4)+'00', name: '' })
                        this.$set(this.query, 'distCode', that.choose.distCode.code)
                        this.loadPullUp()
                    })
            window.location.hash.indexOf('libs/doc/all') == -1 && this.loadPullUp()
        },
        methods: {
            loadPullUp () {
                this.$http.get(this.$urls.GAINDOCTORS, this.query).then(d => {
                    let cur = JSON.parse(d.docs)
                    this.docs = this.docs.concat(cur)
                    this.$nextTick(() => {
                        this.$refs.scroller.reset(this.query.pageNo == 1 ? {top: 0} : {})
                    })
                    setTimeout(() => {
                        if (cur.length == this.query.pageSize) {
                            this.query.pageNo++
                            this.scroll.pullupStatus = 'default'
                        } else {
                            this.scroll.pullupStatus = 'disabled'
                        }
                    }, 100)
                });
            },
            queryChange (v) {
                this.query.hosId = this.choose.hosId
                this.query.serviceId = this.choose.serviceId
                this.query.depId = this.choose.depId
                this.query.distCode = this.choose.distCode.code
                this.$nextTick(() => {
                    this.initData()
                })
            },
            initData () {
                this.query.pageNo = 1
                this.docs = []
                this.scroll.pullupStatus = 'enabled'
                this.$nextTick(() => {
                    this.$refs.scroller.reset({ top: 0 })
                })
                this.loadPullUp()
                this.$router.replace({ name: 'libs', params: { type: this.type, pid: +new Date }, query: this.query })
            }            
        }
    }
</script>
<style lang="less">
  .libsAll {
      header{
         background: #FAFAFA;
       }
      .itemlist {
        margin-left:1rem;
      }
  }
</style>
