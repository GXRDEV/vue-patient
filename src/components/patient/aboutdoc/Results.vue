<template>
    <article class="h100 scroll relative bgfff resultScroll" id="resultScroll" v-scroll="onScroll">
        <doc-item v-for="i in docs" :item="i" :key="i.specialId" :type="type"></doc-item>
        <load-more v-if="!docs.length" :show-loading="false" :tip="'暂无数据'" background-color="transparent"></load-more>
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
    import { DocItem } from '@components/share'

    export default {
        name: 'results',
        components: {
            LoadMore, DocItem
        },
        directives: {
            Scroll
        },
        data () {
            return {
                type: this.$route.query.dtype,
                docs: [],
                scroll: {
                    pullupStatus: 'default',
                    bottom: 2
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
                }
            }
        },
        created () {
            let q = this.$route.query
            this.query = {...this.query, ...q}
            this.loadPullUp()
        },
        methods: {
            onScroll: debounce(function(e, position) {
                let clientHeight = e.clientHeight
                let scrollHeight = e.scrollHeight
                let scrollH = clientHeight + position.scrollTop + this.scroll.bottom
                if (scrollH >= scrollHeight && this.scroll.pullupStatus == 'default') {
                    this.loadPullUp()
                }
            }, 100),
            loadPullUp () {
                this.scroll.pullupStatus == 'loading'
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
            }
        }
    }
</script>
<style lang="less">
  .resultScroll {
      .itemlist {
        margin-left :1rem;
      }
  }
</style>
