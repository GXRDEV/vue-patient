<template>
    <div class="exp-details">
        <swiper :list="headImg" height="15rem" :show-desc-mask="false" dots-class="custom-bottom" dots-position="center"></swiper>
        <header class="bgfff borders">
            <p><span class="strong big15">{{doc.specialName}}</span>&ensp;{{doc.duty}}&ensp;{{doc.profession}}</p>
            <p class="gray">{{doc.hosName}}&ensp;{{doc.depName}}</p>
        </header>
        <div class="bgfff borders">
            <p class="flex" style="padding-bottom: .5rem">
                <span class="flex_1"><span class="gray">医院等级：</span>{{doc.hosLevel}}</span>
                <span class="flex_1"><span class="gray">教学职称：</span>{{doc.profession}}</span>
            </p>
            <p class="flex">
                <span class="flex_1 hosName"><span class="gray">所属医院：</span>{{doc.hosName}}</span>
                <span class="flex_1"><span class="gray">职&emsp;&emsp;称：</span>{{doc.duty}}</span>
            </p>
        </div>
        <div class="bgfff borders flex">
            <div v-for="(item, ind) in service" :key="ind" class="flex_1 gray service" :style="item.isOpen == 1 ? 'color: #0086D1 ' : '' " @click="jumpPage(item)">
                <i class="big18 iconfont" :class="iconFun(item)"></i>
                <p style="padding: .2rem 0">{{item.serviceName}}</p>
                <p>{{ item.amount==null ? '' :  item.amount + '元' }}</p>
            </div>
        </div>
        <div class="bgfff borders">
            <h3 class="big15">擅长领域</h3>
            <p class="text-style">{{doc.specialty}}</p>
        </div>
        <div class="bgfff borders">
            <h3 class="big15">简介</h3>
            <p class="text-style">{{doc.profile}}</p>
        </div>
        <appraises :oid="docid" :size="5" style="background: #fff"></appraises>
    </div>
</template>
<script>
    import { Swiper } from 'vux'
    import { Appraises } from '@components/share'
    import { imgsrc } from '@filters'
    export default {
        components: {
            Swiper, Appraises  
        },
        data () {
            return {
                docid: this.$route.query.docid,
                from: this.$route.query.from || '',
                headImg: [],
                doc: {},
                service: [],
            }
        },
        created () {
            this.$http.get(this.$urls.DOCMAIN, {docid: this.docid}).then( d => {
                this.doc = d.doc
                this.service = d.spervices
                d.images && (this.headImg = d.images.map( item => {
                    return {
                        url: '',
                        img: item.fileUrl
                    }
                }))
                this.setShareTo(this.doc)
            })
        },
        methods: {
            imgsrc,
            iconFun (item) {
                switch (item.serviceId) {
                    case 4: return 'icon-computer';
                    case 1: return 'icon-message';
                    case 2: return 'icon-dianhua';
                }
            },
            jumpPage (item) {
                let query = this.from ? { docid: this.docid, from: this.from } : { docid: this.docid }
                if (item.isOpen == 1){
                    switch (item.serviceId){
                        case 4: this.$router.push({path: '/remote', query: query}); break;
                        case 1: 
                        case 2: this.$router.push({path: '/expreport', query: { ...query, ltype: item.serviceId}})
                    } 
                }
            },
            setShareTo (doc) {
                let wx = this.$wechat;
                let shareconfig = {
                    title: [doc.specialName, doc.duty, doc.profession, doc.hosName, doc.depName].join(' '),
                    desc: doc.specialty || doc.profile,
                    link: `${location.origin + location.pathname}#${this.$route.fullPath}`,
                    imgUrl: this.imgsrc(doc.listSpecialPicture, 'doc', 200)
                }
                wx.ready(() => {
                    wx.showMenuItems({
                        menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline']
                    })
                    wx.onMenuShareAppMessage(shareconfig)
                    wx.onMenuShareTimeline(shareconfig)
                })
            } 
        }
    }
</script>
<style lang="less" scoped>
    @import '../../../assets/css/var';
    .borders{
        padding: 1rem;
        margin-bottom: .8rem;
        border-bottom: .5px solid @gray-color-lower;
        border-top: .5px solid @gray-color-lower;
        &:last-child{
            margin: 0
        }
    }
    header{
        p:first-child{
            padding-bottom: .3rem 
        }
    }
    .hosName{
        overflow: hidden;
        .setMultEllipsis(1)
    }
    .service{
        text-align: center; 
        border-right: .5px solid #ccc; 
        &:last-child{
            border: none
        }
    }
    .video{
        color: @main-color
    }
    .text-style{
        line-height: 1.5rem;
        padding-top: .5rem;
        margin-top: .8rem;
        border-top: .5px solid #ccc;
    }
</style>
<style lang="less">
    .exp-details {
        .vux-img{
            background-size: contain !important 
        }
    }
</style>