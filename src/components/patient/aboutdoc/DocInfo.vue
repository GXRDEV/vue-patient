<template>
    <article class="docinfopage">
        <header class="relative ohidden">
            <div class="clearfix docexplain relative">
                <item-flex-img :img="doc.listSpecialPicture" radius="9999px" @click.native="toDocCard"
                        style="padding: .18rem 0 0" size="5rem">
                    <p class="bigtitle relative">
                      <span class="big16 blackcolor">{{ doc.specialName }}&ensp;</span>
                      <span class="big14 graycolor" v-if="doc.duty">{{ doc.duty }}</span>
                    </p>
                    <p class="big14 blackcolor">{{doc.hosName}}｜{{doc.depName}}</p>
                </item-flex-img>
                <router-link class="base12 graycolor absolute brief" :to="'/docdetail/' + id">
                简介<i class="iconfont icon-arrright graycolor" style="vertical-align: 1px;"></i>
                </router-link>
                <div class="flex attention">
                    <span class="flex_1 maincolor" @click="follow">
                        <img src="../../../assets/img/aboutdoc/heart-icon.png" v-if="!isStar">
                        <img src="../../../assets/img/aboutdoc/hearted-icon.png" v-else>
                        <span class="sidebtn">{{isfollow}}</span>
                    </span>
                    <router-link :to="{ path: '/give', query: { docid: id }}" class="flex_1 tcenter" style="color: #eca614;">
                        <img src="../../../assets/img/aboutdoc/mind-icon.png"><span class="sidebtn">送心意</span>
                    </router-link>
                    <span class="flex_1 tright" style="color: #ff7f7a;">
                        <img src="../../../assets/img/aboutdoc/atten-icon.png"><span class="sidebtn">{{ attentCount }}人关注</span>
                    </span>
                </div>
            </div>
            <div style="min-height: 3rem;">
                <div class="notifys" v-if="notifys.length">
                    <marquee class="toptips g_padding base12 whitespace">
                        <marquee-item v-for="(item, ind) in notifys" :key="ind" class="span_item whitespace" @click.native="jumpnoti(id)">
                            <p class="flex acenter jcenter h100">
                                <span class="big14" style="color: #ffb417;">公告｜</span>
                                <span class="flex_1 whitespace big13 graylight">{{item.content}}</span>
                                <i class="iconfont icon-arrright small9 gray"></i>
                            </p>
                        </marquee-item>
                    </marquee>
                </div>
                <div class="toptips g_padding whitespace" v-else>
                    <p class="flex acenter jcenter h100">
                        <span class="big14" style="color: #ffb417;">公告｜</span>
                        <span class="flex_1 whitespace big13 graylight">暂无最新公告</span>
                        <i class="iconfont icon-arrright small9 gray"></i>
                    </p>
                </div>
            </div>
            <div class="servicelists">
                <div class="seritem">
                    <div v-for="(item, idx) in services" :key="idx" class="consu relative bbox" :class="{'disabled': !item.isOpen}" @click="jumppage(item)">
                        <i class="thumb" :class="iconFun(item)"></i>
                        <div class="ohidden bbox" style="padding-right:1rem;padding-top:.5rem;">
                            <span class="yellow big15 absolute" v-if="item.isOpen && item.serviceId != 8">￥{{ item.amount || 0 }}</span>
                            <span class="big15 whitespace" :class="{'blackcolor':item.isOpen, 'graylight': !item.isOpen}">{{ item.serviceName }}</span>
                            <template v-if="doc.userType == 3">
                                <span class="graylight base12">|</span>
                                <span class="maincolor base12 remark" v-if="item.isOpen" :class="{'reportcolor': item.serviceId == 8}">
                                  {{ item.count|| 0 }}人{{ item.serviceId == 8 ? '报到': '问过' }}
                                </span>
                                <span class="graylight base12 remark" v-else>暂未开通</span>
                            </template>
                            <template v-else>
                                <span v-if="!item.isOpen">暂未开通</span>
                            </template>
                            <p class="graylight small11" style="margin-top: .5rem;">{{item.description}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="docsign bgcove flex" v-if="doc.userType == 3 && isOpenPrivate == 'true'" @click="toVip">
            </div>
            <div class="timeshow">
                <doc-time-show :oid="id"></doc-time-show>
            </div>
            <div class="belongdocteam" v-if="belongteams.length">
                <div class="header big14">
                    所属医生团队
                </div>
                <div class="docmainlist">
                    <div class="doclist clearfix" v-for="(item, index) in belongteams" :key="index">
                        <router-link :to="'/teaminfo/' + item.id">
                            <div class="docteamlogo">
                                <i class="thumb bgcove" :style="`background-image:url(${imgsrc(item.logoUrl,'teamlogo')})`"></i>
                            </div>
                            <div class="docteaminfo">
                                <p class="name">{{item.teamName}}</p>
                                <p class="whitespace base12 info"><span class="specialty"></span>{{item.speciality}}</p>
                                <p class="member">
                                    <i class="thumb bgcove" v-for="(m,ind) in item.members" :key="ind" :style="`background-image:url(${imgsrc(m.headImageUrl)})`"></i>
                                    <span class="small11 blacklower">
                                        <span class="maincolor">{{ item.memberCount }}</span>位成员组成
                                        <i class="iconfont icon-arrright small10 gray"></i>
                                    </span>
                                </p>
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
        </header>
        <appraises :oid="id" :size="5"></appraises>
        <span class="fixed gobackbtn bgcove" @click="goBack"></span>
    </article>
</template>
<script>
import { Group, XButton, Marquee, MarqueeItem } from 'vux'
import { DocTimeShow, Appraises, Star, ItemFlexImg } from '@components/share'
import { imgsrc } from '@filters'
import { mapState } from 'vuex'
export default {
    name: 'docinfo',
    components: {
        Group, XButton, DocTimeShow, Appraises, Star, Marquee, MarqueeItem, ItemFlexImg
    },
    computed: {
        ...mapState({
            userid: state => state.userid
        }),
        isfollow () {
            return this.isStar == true ? '已关注' : '关注医生'
        }
    },
    beforeRouteUpdate(to, from, next) {
        window.scrollTo(0, 0)
        next()
    },
    data() {
        return {
            openid: this.$store.state.openid,
            id: this.$route.params.id,
            autofollow: this.$route.query.follow,
            doc: {
                specialName: '■■■',
                duty: '■■',
                hosName: '■■■■■■■■■■',
                depName: '■■■■'
            },
            report: false,
            warm: '',
            services: [],
            appraises: [],
            acount: 4,
            notifys: '',
            hash: this.$route.fullPath,
            isStar: false,
            belongteams: '',
            timer: new Date().getTime(),
            isOpenPrivate: 'false',
            attentCount:'■',
            reportObj: {
                isOpen: 1,
                serviceName: "加医生好友",
                description: "向医生发送病情资料，申请与医生建立长期沟通关系",
                count: 0,
                serviceId: 8,
                custom: true
            }
        }
    },
    watch: {
        userid (v) {
            v && this.isFollow()
        }
    },
    created() {
        let that = this;
        // 医生基本信息
        this.gainDocInfo()
        // 医生动态信息
        this.$http.get(this.$urls.GAINDOCTORNOTIFYS, {
            doctorId: this.id
        }).then(d => {
            this.notifys = d.notifys
        })
        // 获取医生所属医生团队数据
        this.$http.get(this.$urls.GAINDOCBELONGTEAMS, {
            docid: this.id
        }).then(d => {
            this.belongteams = d.teams;
        })

        // 查看是否被关注
        this.isFollow();
    },
    methods: {
        imgsrc,
        isFollow () {
            if (!this.userid) return
            // 查看是否被关注
            this.$http.get(this.$urls.QUERYATTENTDOCTOR, {
                userId: this.userid, doctorId: this.id
            }).then(d => {
                this.isStar = d.attent == 'true';
                // 自动关注医生
                this.autofollow == '1' && !this.isStar && this.follow('1')
            })
        },
        gainDocInfo () {
            this.$http.get(this.$urls.DOCMAIN, { docid: this.id }).then(d => {
                this.doc = d.doc || {}
                this.report = d.report == 'true'
                this.warm = d.warmcount || 0
                this.services = d.services || []
                this.reportObj.count = d.report_count;
                this.isOpenPrivate = d.openPrivate;
                this.attentCount = d.attentCount || 0;
                this.setShareTo(this.doc)
                if(d.doc.userType == 3){
                  d.services[0].isOpen == 1 ? (this.services.splice(1,0,this.reportObj)): (this.services.unshift(this.reportObj))
                }
            })
        },
        iconFun(item) {
            let sing = !item.isOpen ? '-disabled' : ''
            switch (item.serviceId) {
                case 3: return 'icon-doc-video' + sing;
                case 4: return 'icon-exp-video' + sing;
                case 5: return 'icon-exp-img' + sing;
                case 6: return 'icon-doc-img' + sing;
                case 8: return 'icon-report-new' + sing;
            }
        },
        setShareTo(doc) {
            let wx = this.$wechat
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
        },
        jumppage(item) {
            if (item.isOpen && item.serviceId != 8) {
                if ([3, 4].indexOf(item.serviceId) != -1 && this.doc.userType == 3) {
                    return this.toast('建设中', 'auto', 'top'), false
                }
                this.$router.push(this.doc.userType == 3 ? {
                    path: '/interrogation/' + this.timer,
                    query: { docid: this.id, price: item.amount, sever: item.serviceId + '' }
                } : {
                    path: '/inquiry',
                    query: { docid: this.id, depId: this.doc.standardDepId, sever: item.serviceId + '' }
                })
            } else if (item.custom) {
                this.$router.push(this.belongteams.length ? '/selectteam/' + this.id : '/report/' + this.id + '/' + this.timer)
            }
        },
        toast(text, width = 'auto', position = 'middle') {
            this.$vux.toast.show({
                type: 'text',
                text,
                position,
                width
            })
        },
        follow(key) {
            let url = this.isStar ? this.$urls.DELATTENTDOCTOR : this.$urls.ATTENTDOCTOR
            let okt = this.isStar ? '已取消关注' : '关注成功，再次点击可取消关注'
            let failt = this.isStar ? '取消关注失败，请重试' : '关注失败，请重试'
            this.$http.post(url, {
                userId: this.userid,
                doctorId: this.id,
                follow: key || ''
            }).then(d => {
                if (d) {
                    this.toast(okt)
                    this.isStar = !this.isStar
                } else {
                    this.toast(failt)
                }
                // 更新医生信息
                this.gainDocInfo()
            })
        },
        jumpnoti(id) {
            this.$router.push({ path: '/doctotifys', query: { docId: this.id } });
        },
        toVip(){
            this.$router.push({ path: '/vip/' + this.id + '/doc',query: {serviceId : 15 }})
        },
        goBack() {
            this.$router.push({ path: '/'})
        },
        toDocCard(){
            this.$router.push({ path: '/doccard/' +this.id })
        }
    }
}
</script>
<style scoped lang="less">
@import '../../../assets/css/var';
.toptips {
    z-index: 2;
    line-height: 3rem;
    position: relative;
    .span_item {
        list-style: none;
    }
}
.graycolor { color: #666;}
.graylight { color: #999;}
.reportcolor { color: #ff7a7a }
header {
    background: #fff;
    box-sizing: border-box;
    padding: .65rem 0;
    .docexplain {
        padding: .18rem 1rem 1rem;
        border-bottom: .4rem solid #eee;
    }
    .bigtitle {
      margin: .33rem 0 .8rem;
    }
    .brief {
      top: 50%;
      margin-top: -2.5rem;
      right: .8rem;
    }
    .attention {
        margin-top: 1.25rem;
        img {
          width: 1.67rem;vertical-align: top; margin-right: .25rem;
        }
        .sidebtn { display: inline-block; margin-top: .1rem;}
    }

    .servicelists {
        background-color: #fff;
        border-bottom: .4rem solid #eee;
        .consu {
            color: #0086d1;
            padding: 1rem 0;
            border-top: 1px solid #eee;
            &.disabled {
                color: #666;
            }
        }
        .thumb {
            float: left;
            width: 4rem;
            height: 4rem;
            overflow: hidden;
            margin: 0 .8rem;
            .backgroundSize(auto 100%);
        }
        /*.report {*/
            /*background-image: url(../../../assets/img/aboutdoc/report-new.png)*/
        /*}*/
        .icon-doc-video {
            background-image: url(../../../assets/img/aboutdoc/doc-video.png)
        }
        .icon-doc-video-disabled {
            background-image: url(../../../assets/img/aboutdoc/doc-video-disabled.png)
        }
        .icon-doc-img {
            background-image: url(../../../assets/img/aboutdoc/doc-img.png)
        }
        .icon-doc-img-disabled {
            background-image: url(../../../assets/img/aboutdoc/doc-img-disabled.png)
        }

        .icon-exp-img {
            background-image: url(../../../assets/img/aboutdoc/exp-img.png)
        }
        .icon-exp-img-disabled {
            background-image: url(../../../assets/img/aboutdoc/doc-img-disabled.png)
        }

        .icon-exp-video {
            background-image: url(../../../assets/img/aboutdoc/exp-video.png)
        }
        .icon-exp-video-disabled {
            background-image: url(../../../assets/img/aboutdoc/doc-video-disabled.png)
        }
        .icon-report-new {
          background-image: url(../../../assets/img/aboutdoc/report-new.png)
        }
        span {
            line-height: 1;
        }
        .yellow {
            color: #eca614;
            top: 50%;
            right: 1rem;
            margin-top:-.625rem;
        }
    }
}

.timeshow {
    position: relative;
    border-bottom: .4rem solid #eee;
}
section {
    background: #fff;
    margin-top: 0.625rem;
}
.belongdocteam {
    padding: 1rem @body-margin 0;
    .header {
        padding-bottom: .9rem;
    }
    .doclist {
        padding: 1.07rem .7rem .92rem;
        background: #f2f8fb;
        margin-bottom: .77rem;
        &:last-child {
            margin-bottom: 0;
        }
        .docteamlogo {
            float: left;
            .thumb {
                display: inline-block;
                width: 2.5rem;
                height: 2.5rem;
                border-radius: 50%;
                margin-right: .9rem;
            }
        }
        .docteaminfo {
            overflow: hidden;
            .name {
                font-size: 1.077rem;
                color: #222;
                margin-bottom: .5rem;
            }
            .info {
                color: #878d99;
            }
            .specialty {
                width: 2.16rem;
                height: 1.1rem;
                display: inline-block;
                margin-right:.3rem;
                background-image: url(../../../assets/img/aboutdoc/specialty.png);
                background-size:100% 100%;
                vertical-align: text-top;
            }
            .member {
                margin-top: .5rem;
                .thumb {
                    display: inline-block;
                    vertical-align: middle;
                    width: 1.73rem;
                    height: 1.73rem;
                    border-radius: 50%;
                    margin-right: .5rem;
                }
            }
        }
    }
}
.docsign {
     margin:1rem 1rem 0;
     background-image: url(../../../assets/img/aboutdoc/doc-sign.png);
     background-repeat: no-repeat;
     background-size:100% 100%;
    &:after {
        content:"";
        display:block;
        padding:8%;
     }
}

.gobackbtn {
    bottom: 2rem;
    right: 1.5rem;
    width: 3.6rem;
    height: 3.6rem;
    background-image: url(../../../assets/img/aboutdoc/goback.png);
}
</style>
<style lang="less">
.docinfopage {
    .vux-toast-middle {
        .weui-toast__content {
            font-size: 1rem !important
        }
    }
    .mainbox { margin-right: 3.5rem; }
}
</style>
