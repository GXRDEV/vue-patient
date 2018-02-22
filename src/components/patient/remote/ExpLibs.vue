<template>
    <div class="h100 bgfff flex column">
        <header>
            <div class="flex search">
                <div class="flex_1 search-box">
                    <p class="flex h100">
                        <i class="iconfont icon-search big12"></i>
                        <input type="text" class="flex_1" placeholder="请输入医院、科室或医生姓名" v-model="search">
                        <i class="iconfont icon-del big15" style="padding-left: .2rem" v-show="!!this.form.keywords" @click="form.keywords=''"></i>
                    </p>
                </div>
                <span class="big15 maincolor" @click="initData">确认</span>
            </div>
            <choose v-model="choose" v-if="!form.depid"></choose>
        </header>
        <section class="flex_1 relative">
            <div class="h100 w100 absolute top left scroll" id="resultScroll" v-scroll="onScroll">
                <div>
                    <item-flex-img v-for="(item, ind) in exps" :key="ind" :img="item.listSpecialPicture" size="4rem" radius="50%" :borderBottom="true" style="padding-left: 1rem" class="relative">
                        <section @click="urls(item)">
                            <div>
                                <p><span class="big15">{{item.specialName}}&ensp;</span><span class="gray">{{item.duty}}&ensp;{{item.profession}}</span></p>
                                <p class="hos big13" style="padding: .3rem 0">{{item.hosName}}&ensp;{{item.depName}}</p>
                            </div>
                            <p class="specialty gray">{{item.specialty}}</p>
                        </section>
                        <router-link class="absolute choice maincolor" :to="'/remote?docid='+item.specialId" v-if="!!form.depid">选定</router-link>
                    </item-flex-img>
                </div>
                <load-more v-if="scroll.pullupStatus == 'disabled'" :show-loading="false" :tip="'暂无数据'" background-color="transparent"></load-more>
                <div class="loadingdiv" style="height: 2.6rem;" v-if="scroll.pullupStatus!='disabled'">
                    <div class="weui-loadmore tcenter" style="margin: 0 auto; line-height: 2.6rem; color: #666;">
                        <i class="weui-loading" v-if="scroll.pullupStatus=='loading'"></i>
                        <span v-else>上拉加载更多</span>
                    </div>
                </div>
            </div>
            <choose-items v-model="choose" position="absolute" ref="chooseitem" role="2" @on-query="queryChange" v-if="!form.depid"></choose-items>
        </section>
    </div>
</template>
<script>
    import debounce from 'vux/src/tools/debounce'
    import Scroll from '@/directives/scroll'
    import { LoadMore } from 'vux'
    import { Choose, ItemFlexImg, ChooseItems } from '@components/share'
    export default {
        components: {
            Choose, LoadMore, ItemFlexImg, ChooseItems 
        },
        directives: {
            Scroll
        },
        data () {
            return {
                search: '',
                form: {
                    depid: this.$route.query.depid || '',
                    hosid: '',
                    zc: '',
                    keywords: ''
                },
                forms: {
                    dtype: 2,
                    depId: this.$route.query.depId || '',
                    hosId: this.$route.query.hosId || '',
                    distCode: this.$route.query.distCode || '',
                    serviceId: this.$route.query.serviceId || ''
                },
                page: {
                    pageNo: 1,
                    pageSize:10
                },
                exps: [],
                scroll: {
                    pullupStatus: 'default',
                    bottom: 2
                },
                pullupConfig: this.$store.state.pullupConfig,
                choose: {
                    selected: 0,
                    distCode: {},
                    hosName: '',
                    hosId: this.$route.query.hosId || '',
                    depName: '',
                    depId: this.$route.query.depId || '',
                    servName: '',
                    serviceId: this.$route.query.serviceId || '',
                    remote: true
                }
            }
        },
        created () {
            if ('distCode' in this.$route.query) {
                this.choose.distCode = {
                    code: this.$route.query.distCode,
                    name: ''
                }
            } 
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
            loadPullUp (){
                this.scroll.pullupStatus = 'loading'
                if (this.form.depid) {
                    this.$http.get(this.$urls.LOADEXPERTS, { ...this.form, keywords: this.search, ...this.page}).then( d => {
                        let cur = d.specials
                        this.exps = this.exps.concat(cur)
                        this.pageStatus(cur)
                    })
                } else {
                    this.$http.get(this.$urls.GAINDOCTORS, { ...this.forms, search: this.search, ...this.page}).then( d => {
                        let cur = JSON.parse(d.docs)
                        this.exps = this.exps.concat(cur)
                        this.pageStatus(cur)
                    })
                } 
            },
            pageStatus (cur){
                if(cur.length == this.page.pageSize){
                    this.page.pageNo ++
                    this.scroll.pullupStatus = 'default'
                } else {
                    this.scroll.pullupStatus = 'disabled'
                }
            },
            queryChange (){
                this.forms.distCode = this.choose.distCode.code || ''
                this.forms.hosId = this.choose.hosId
                this.forms.depId = this.choose.depId
                this.forms.serviceId = this.choose.serviceId
                this.$nextTick(() => {
                    this.initData()
                })
            },
            initData (){
                this.page.pageNo = 1
                this.exps = []
                this.scroll.pullupStatus = 'enabled'
                this.loadPullUp()
                this.$router.replace({ path: '/explibs', query: this.forms })
            },
            urls (item){
                let url = this.form.depid ? 
                        { docid: item.specialId } : 
                        { docid: item.specialId, from: 'explibs'} 
                this.$router.push({ path: '/expdetail', query: url })
            }
        }
    }
</script>
<style lang="less" scoped>
    @import '../../../assets/css/var';
    .search{
        background: #efeff4;
        padding: .7rem 1rem;
        .search-box{
            p{
                background: #fff;
                border-radius: .2rem;
                height: 2rem;
                line-height: 2.2rem
            }
            input{
                outline: none;
                border: none;
                line-height: 1.2rem 
            }
            .icon-search,.icon-del{
                color: #b2b2b2;
                padding: 0 0.5rem;
            }
        }
        span{
            line-height: 2.2rem;
            margin-left: 1rem;
        }
    }
    .choice{
        border: 1px solid @main-color;
        border-radius: .2rem;
        padding: 0 .6rem;
        line-height: 1.6rem;
        right: 1.2rem;
        top: 1rem;
        box-sizing: border-box
    }
    .specialty{
        overflow: hidden;
        .setMultEllipsis(2)
    }
</style>