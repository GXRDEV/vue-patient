<template>
    <article  class="h100 scroll relative bgfff" id="resultScroll" v-scroll="onScroll">
        <div class="bgfff warm">
            <div class="title big13">
                心意墙&ensp;<span>（{{number}}）</span>
                <router-link :to="{ path: '/warmwall', query: {docid: this.docid}}" v-if="more">
                    更多
                </router-link>
            </div>
            <ul>
                <li v-for="(item, ind) in warm" :key="ind" >
                    <p style="overflow: hidden">
                        {{item.patientName}}
                        <section class="li-right">
                            送出了
                            <template>
                                <img src="../../../assets/img/sendMind/min_send_0.png" v-if="item.warmthName == '一点心意'">
                                <img src="../../../assets/img/sendMind/min_send_1.png" v-else-if="item.warmthName == '白衣天使'">
                                <img src="../../../assets/img/sendMind/min_send_2.png" v-else-if="item.warmthName == '医德高尚'">
                                <img src="../../../assets/img/sendMind/min_send_3.png" v-else-if="item.warmthName == '德艺双馨'">
                                <img src="../../../assets/img/sendMind/min_send_4.png" v-else>
                            </template>
                            <span :style="item.warmthName | warmcolor">{{item.warmthName}}</span>
                        </section>
                    </p>
                    <p style="padding-top: .2rem; color: #9196a1" v-if="item.content">{{item.content}}</p>
                </li>
            </ul>
        </div>
        <load-more v-if="!warm.length" :show-loading="false" :tip="'暂无数据'" background-color="transparent"></load-more>
        <div class="loadingdiv" style="height: 2.6rem;" v-if="scroll.pullupStatus!='disabled' && !more">
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
    import { warmcolor } from '@filters'
    import { LoadMore } from 'vux'
    export default{
        components: {
             LoadMore
        },
        directives: {
            Scroll
        },
        filters: {
            warmcolor
        },
        props: {
            docid: [String, Number],
            pageSize: {
                type: Number,
                default: 10
            },
            more: {
                type: Boolean,
                default: false
            }
        },
        created () {
            let that = this
            this.docId = this.$route.query.docid || this.docid
            this.loadPullUp()
        },
        data () {
            return {
                number: '',
                warm: [],
                pageNo: 1,
                docId: '',
                scroll: {
                    pullupStatus: 'default',
                    bottom: 2
                }
            }
        },
        methods: {
             style(item){
                switch( item ){
                    case '一点心意': return 'color: #acd598'; break;
                    case '白衣天使': return 'color: #0086d1'; break;
                    case '医德高尚': return 'color: #f19ec2'; break;
                    case '德艺双馨': return 'color: #f6ab00'; break;
                    case '华佗在世': return 'color: #d22432'; break;
                }
            },
            onScroll: debounce(function(e, position) {
                let clientHeight = e.clientHeight
                let scrollHeight = e.scrollHeight
                let scrollH = clientHeight + position.scrollTop + this.scroll.bottom
                if (scrollH >= scrollHeight && this.scroll.pullupStatus == 'default') {
                    this.loadPullUp()
                }
            }, 100),
            loadPullUp () {
                this.scroll.pullupStatus = 'loading'
                this.$http.get(this.$urls.WARMWALL,  {
                    docid: this.docId, pageSize: this.pageSize, pageNo: this.pageNo
                }, this).then(d => {
                    this.number = d.warmcount;
                    let warm = JSON.parse(d.warms)
                    this.warm = this.warm.concat(warm)
                    setTimeout(() => {
                        if (warm.length == this.pageSize) {
                            this.pageNo ++
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
<style lang="less" scoped>
    @import '../../../assets/css/var.less';
    .warm{
        padding-left: 1rem;
        .title{
            padding: .7rem 0;
            span{
                color: #9196a1
            }
            a{
                float: right;
                color: @main-color;
                position: relative;
                padding-right: 1.8rem;
                &:after{
                    content: '';
                    position: absolute;
                    top: .45rem;
                    right: 1rem;
                    width: 6px;
                    height: 6px;
                    border-top: 1px solid @main-color;
                    border-right: 1px solid @main-color;
                    transform: rotate(45deg);

                }
            }
        }
        ul{
            list-style: none;
            border-top: 1px solid #eee;
            li{
                padding: 1rem 1.15rem .8rem 0;
                border-bottom: .5px solid #e5e5e5;
                .li-right{
                    float: right;
                    padding: 0;
                    img{
                        width: .84rem;
                        vertical-align: bottom;
                    }

                }
            }
        }
    }
</style>
