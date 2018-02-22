<template>
    <div class="family h100 relative">
        <div class="h100" style="padding-bottom: 2.1rem; box-sizing: border-box">
            <swiper :show-dots="false" v-model="index" height="100%">
                <swiper-item v-for="(item, idx) in users" :key="idx" class="flex">
                    <div class="flex_1 family-main flex column bgfff">
                        <router-link :to="'/familyedit/'+item.id+'?index='+index" class="relative header">
                            <p v-if="item.isDefault == 1" class="absolute labels bgfff">默认</p>
                            <p class="fff head">
                                <i class="thumb bgcove headImg" :style="`background-image:url(${imgsrc(item.headImageUrl, 'user-head')})`"></i>
                                <span class="big16">{{item.contactName}}</span>&ensp;<span class="big13">{{item.sex | sex}}&ensp;{{item.age | age}}</span>
                                <i class="iconfont icon-arrright list_right small11"></i>
                            </p>
                        </router-link>
                        <section class="flex_1 flex column">
                            <div class="explain">
                                <h3>就诊记录</h3>
                                <p class="big13">积极记录您的就诊内容，让医生更好的帮助您</p>
                            </div>
                            <div class="flex_1" style="overflow: auto">
                                <template v-if="item.records.length">
                                    <router-link v-for="(items, ind) in item.records" :key="ind" class="records flex"
                                        :to="{ path: '/visitingRecord/'+timer, query: { id: item.id, rid: items.id, index: index }}">
                                        <div class="left">
                                            <p class="dont"></p>
                                        </div>
                                        <div class="right flex_1">
                                            <p class="record-head">
                                                <span class="visit big13" :class="{'visits': items.firstVisit == 1}">{{ items.firstVisit | visit }}</span>
                                                <span class="timer small11">{{ items.timeStr }}</span>
                                            </p>
                                            <p class="big14" v-if="items.caseInfo.caseName" style="margin-bottom: .5rem;color: #000">{{items.caseInfo.caseName}}</p>
                                            <p class="big13" style="color: #878d99; margin-bottom: .5rem" v-if="items.caseInfo.mainSuit">{{ items.caseInfo.mainSuit }}</p>
                                            <show-enclosures :attachments="items.caseInfo.attachments" :hasTitle="false" width="4.5rem" style="padding: 0; padding-right: 1rem" margin=".5rem" padding=".8rem" modal="muilt" :stopEvent="true"></show-enclosures>
                                            <p style="color: #878d99" class="big13">
                                                <span>
                                                    {{items.hosName}}&ensp;<span v-if="items.depName">|&ensp;{{items.depName}}</span>
                                                </span>
                                                <span style="float: right;padding-right: 1rem">
                                                    {{items.doctorName}}
                                                </span>
                                            </p>
                                        </div>
                                    </router-link>
                                </template>
                                <no-order v-else text="暂无数据" :haslink="false" marginTop="2rem"></no-order>
                            </div>
                            <router-link :to="{ path: '/visitingRecord/'+timer, query: { id: item.id, index: index }}" class="add-record big13">
                                新增一条记录
                            </router-link>
                        </section>
                    </div>
                </swiper-item>
                <swiper-item class="flex" v-if="users.length < 5">
                    <div class="flex_1 family-main add-contact bgfff">
                        <img src="../../../assets/img/user-head.png" class="imgs">
                        <router-link :to="'/familyadd?index='+index" class="big15">新建联系人</router-link>
                        <div class="small11" v-if="users.length < 2">
                            <p>请尽快新建就诊人并完善就诊记录</p>
                            <p>以便享受医生为您提供服务</p>
                        </div>
                    </div>
                </swiper-item>
            </swiper>
        </div>
        <div class="line absolute">
            <span v-for="i in total" :key="i"
                :class="{'selected': index == i-1}"
                @click="index=i-1" :style="`width: ${getBarWidth}`"></span>
        </div>
    </div>
</template>
<script>
    import { Tab, TabItem, Swiper, SwiperItem, LoadMore } from 'vux'
    import { obscure, sex, age, visit, imgsrc } from '@filters'
    import { NoOrder, ShowEnclosures } from '@components/share'
    export default {
        components: {
            Tab, TabItem, Swiper, SwiperItem, LoadMore, NoOrder, ShowEnclosures
        },
        filters: {
            obscure,
            sex,
            age,
            visit
        },
        data () {
            return {
                index: 0,
                users: [],
                total: 0,
                timer: new Date().getTime()
            }
        },
        watch: {
            index (v) {
                this.getRecords(v)
                this.$router.replace({ path: this.$route.path, query: { index: v }})
            }
        },
        created () {
            this.index = parseInt(this.$route.query.index || 0);
            this.users = JSON.parse(localStorage.getItem('_cache_familys_') || '[]')
        },
        mounted () {
            this.initData()
        },
        methods: {
            imgsrc,
            // 获取病历信息
            getRecords (index = 0) {
                let user = this.users[index]
                if(!user) return;
                if(localStorage.getItem('_cache_familys_'+ user.id +'_')) return;

                this.$http.get(this.$urls.GAINFAMRECORDS, {
                    familyid: user.id
                }).then(d => {
                    localStorage.setItem('_cache_familys_' + user.id + '_', JSON.stringify(user.records = d.records || []))
                    this.cacheFamily()
                })
            },
            // 获取联系人
            initData () {
                if(this.users.lenght) return this.setDotsAndChild();
                this.$vux.loading.show()
                this.$http.get(this.$urls.GAINFAMILIES, {
                    openid: this.$store.state.openid
                }, this).then(d => {
                    d.users.length && (this.users = [].concat(d.users).map(item => {
                        return {
                            ...item,
                            records: JSON.parse(localStorage.getItem('_cache_familys_'+ item.id +'_') || '[]')
                        }
                    }))
                    this.setDotsAndChild()
                    this.cacheFamily()
                    this.$vux.loading.hide()
                })
            },
            setDotsAndChild () {
                this.total = this.users.length < 5 ? this.users.length + 1 : this.users.length
                this.getRecords(this.index)
            },
            cacheFamily () {
                localStorage.setItem('_cache_familys_', JSON.stringify(this.users))
            }
        },
        computed: {
            getBarWidth (){
                switch (this.total){
                    case 1: return 0 + 'px'; break;
                    case 2: return 7 + 'rem'; break;
                    case 3: return 6 + 'rem'; break;
                    case 4: return 5 + 'rem'; break;
                    case 5: return 3 + 'rem'; break;
                }
            }
        }
    }
</script>
<style lang="less" scoped>
    @import '../../../assets/css/var';
    .family-main{
        margin: 1rem;
        margin-bottom: 0;
        border-radius: .2rem;
    }
    .header{
        height: 7.58rem;
        line-height: 7.58rem;
        background: @main-color;
        border-top-right-radius: .2rem;
        border-top-left-radius: .2rem;
        .labels{
            width: 4.1rem;
            line-height: 1.95rem;
            text-align: center;
            right: .2rem;
            top: .2rem;
            border-top-right-radius: .2rem;
            border-bottom-left-radius: .7rem;
            color: @gray-color
        }
        .head{
            .list_right{
                float: right;
                margin-right: .5rem
            }
        }
        .headImg{
            width: 3.1rem;
            height: 3.1rem;
            vertical-align: middle;
            border-radius: 50%;
            margin: 0 1rem 0 1.3rem
        }
    }
    .explain{
        height: 5.67rem;
        padding: 1rem 1.4rem;
        box-sizing: border-box;
        border-bottom: 1px solid #eee;
        h3{
            font-size: 1.75rem;
            font-weight: normal;
            line-height: 1
        }
        p{
            padding-top: .5rem;
            color: @font-color
        }
    }
    section{
        .add-record{
            line-height: 3.5rem;
            border-top: 1px solid #eee;
            color: @main-color;
            text-align: center
        }
    }
    .add-contact{
        text-align: center;
        img{
            width: 3.1rem;
            height: 3.1rem;
            border-radius: 50%;
            display: block;
            margin: 50% auto 2rem;
        }
        a{
            color: @main-color;
            border: 1px solid @main-color;
            border-radius: .2rem;
            padding: .4rem 1.2rem;
            display: inline-block
        }
        div{
            text-align: center;
            color: #91969c;
            padding-top: 2.2rem;
            p{
                padding-bottom: .5rem
            }
            span{
                color: @warn-color
            }
        }
    }
    .records{
        .left{
            border-right: 1px solid #eee;
            position: relative;
            margin: 0 1rem 0 1.5rem;
            .dont{
                position: absolute;
                border: .15rem solid #fff;
                width: 7px;
                height: 7px;
                border-radius: 50%;
                background: #eee;
                top: 2.2rem;
                left: -4.5px;
                z-index: 1;
            }
        }
        .right{
            margin-top: 1.83rem;
            .record-head{
                margin-bottom: 1.3rem;
                overflow: hidden;
                .visit{
                    display: inline-block;
                    border-radius: 1rem;
                    padding: .1rem .8rem .2rem;
                    background: #cce7f6;
                    color: @main-color
                }
                .visits{
                    background: #fef6e5;
                    color: #fdbe27;
                }
                .timer{
                    float: right;
                    color: @font-color;
                    padding-top: .3rem;
                    margin-right: 1rem;
                }
            }
            img{
                width: 5rem;
                height: 5rem;
                margin: 0 .5rem .5rem 0;
            }
        }
        .right:last-child{
            margin-bottom: 1rem
        }
    }
    .line{
        bottom: 0;
        width: 100%;
        text-align: center;
        line-height: 2.1rem;
        height: 2.1rem;
        span{
            height: 100%;
            display: inline-block;
            position: relative;
            margin: 0 .5rem 0;
            &:after{
                content: '';
                position: absolute;
                height: 3px;
                width: 100%;
                background: #d5d7da;
                border-radius: 1rem;
                left: 0;
                top: 50%;
            }
        }
        .selected{
            &:after{
                background: @main-color
            }
        }
    }

</style>
<style lang="less">
    .family{
        .vux-slider{
            height: 100% !important
        }
    }
</style>
