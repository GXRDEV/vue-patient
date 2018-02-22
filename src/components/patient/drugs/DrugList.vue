<template>
    <div class="h100 w100 scroll bgfff absolute" id="resultScroll" v-scroll="onScroll" :class="{'noscroll': filterInd != 0}">
        <router-link v-for="(item, ind) in drugs" :key="ind" class="flex main" :to="`/drugdetail/${item.drugInnerCode}`">
            <img :src="`${imgsrc(drugsImg[ind], 'nodrug', '300')}`">
            <div class="drug-main flex_1">
                <p style="padding-top: .3rem; color: #000">{{item.drugName}}</p>
                <p class="drug-introduce small10">{{item.drugXZ || '暂无'}}</p>
                <p class="icon flex">
                    <i></i><i></i>
                    <span class="maincolor big13 flex_1" style="text-align:right">￥{{item.price}}</span>
                </p>
            </div>
        </router-link>
        <load-more v-if="!drugs.length && scroll.pullupStatus == 'disabled'" :show-loading="false" :tip="'暂无数据'" background-color="transparent"></load-more>
        <div class="loadingdiv" style="height: 2.6rem;" v-if="scroll.pullupStatus!='disabled'">
            <div class="weui-loadmore tcenter" style="margin: 0 auto; line-height: 2.6rem; color: #666;">
                <i class="weui-loading" v-if="scroll.pullupStatus=='loading'"></i>
                <span v-else>上拉加载更多</span>
            </div>
        </div>
    </div>
</template>
<script>
    import { LoadMore } from 'vux'
    import { imgsrc } from '@filters'
    import Scroll from '@/directives/scroll'
    import debounce from 'vux/src/tools/debounce'
    export default {
        components: {
            LoadMore  
        },
        directives: {
            Scroll
        },
        props: {
            price: {
                type: String,
                default: ''
            },
            drugType: {
                type: String,
                default: ''
            },
            filterInd: {
                type: Number,
                default: 0
            }
        },
        data () {
            return {
                scroll: {
                    pullupStatus: 'default',
                    bottom: 2
                },
                query: {
                    pageNo: 1,
                    pageSize: 10,
                    search: this.$route.query.search
                },
                drugs: [],
                drugsImg: [],
                url: {},
                price_: ''
            }
        },
        created () {
            this.loadPullUp()
        },
        watch: {
            price (n, o){
                this.price_ = n
                this.queryUrl = { drugType: this.drugType, price: n}
                this.initData()
            },
            drugType (n, o){
                this.queryUrl = {drugType: n}
                if(this.price) return this.$emit('setsort', '') 
                this.initData()
            }
        },
        methods: {
            imgsrc,
            onScroll: debounce( function ( e, position ){
                let clientHeight = e.clientHeight;
                let scrollHeight = e.scrollHeight;
                let scrollH = clientHeight + position.scrollTop + this.scroll.bottom
                if( scrollH >= scrollHeight && this.scroll.pullupStatus == 'default'){
                    this.loadPullUp()
                }
            }, 100),
            loadPullUp (){
                let sort = [ this.price && `price:${this.price}`].join()
                this.scroll.pullupStatus = 'loading'
                this.$http.get(this.$urls.DRUGSLIST, {
                        ...this.query, 
                        sort: sort, 
                        type: this.drugType == '全部分类' ? '' : this.drugType
                    }).then( d => {

                        let drugs = d.drugs || []
                        let drugsImg = drugs.map( item => {
                            if(item.pics[0]) return item.pics[0].picUrl 
                            return ''
                        })
                        this.drugs = this.drugs.concat(drugs)
                        this.drugsImg = this.drugsImg.concat(drugsImg)
                        setTimeout(() => {
                            if( drugs.length == this.query.pageSize ){
                                this.query.pageNo ++
                                this.scroll.pullupStatus = 'default'
                            } else {
                                this.scroll.pullupStatus = 'disabled'
                            }
                        }, 100);
                    })
            },
            initData (){
                this.query.pageNo = 1
                this.scroll.pullupStatus = 'enabled'
                this.drugs = this.drugsImg = [];
                this.loadPullUp()
                this.$router.replace({ name: 'drugfilter', query: this.queryUrl});
            }
        }
    }
</script>
<style lang="less" scoped>
    @import '../../../assets/css/var';
    .noscroll {
        -webkit-overflow-scrolling: auto;
    }
    .main{
        padding: 0.83rem 1rem;
        border-bottom: .5px solid #eee
    }
    img{
        width: 6.67rem;
        height: 20vw;
        object-fit: contain
    }
    .drug-main{
        padding-left: .83rem;
        .drug-introduce{
            color: #9196a1;
            margin: 0.7rem 0 0.5rem;
            min-height: 2.3rem;
            overflow: hidden;
            .setMultEllipsis(2)
        }
        .icon{
            align-items: center;
            padding-right: 0.25rem;
            i{
                width: 1.25rem;
                height: 1.25rem;
                display: inline-block;
                background-size: cover !important
            }
            i:nth-child(1){
                margin-right: .2rem;
                background: url(../../../assets/img/drugs/free-icon.png) no-repeat center
            }
            i:nth-child(2){
                background: url(../../../assets/img/drugs/quality-icon.png) no-repeat center
            }
        }
    }
</style>


