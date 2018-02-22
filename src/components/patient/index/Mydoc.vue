<template>
    <div class="maxmydoc" v-if="!nodoc">
        <div class="minmydoc relative" v-for="(item, index) in mydoc" :key="index" :class="{ 'sendMind':item.userWarmTime && item.userWarmTime.deadLine > nowTime && item.status!=10 }">
            <item-flex-img :link="'/docinfo/' + item.doctorId"
                :img="item.headImage" radius="9999px" class="senditem"
                style="padding: 1rem 1.2rem 0 .2rem" size="3.42rem" thumb="right">
                <p class="bigtitle relative">
                    <span class="big20 blacklower" style="display:inline-block;max-width:14rem;">{{ item.docName }}&ensp;</span>
                    <span class="duty absolute small10" v-if="item.duty">{{ item.duty }}</span>
                </p>
                <p class="big12 blacklower">{{item.hosName}}&ensp;｜ {{item.depName}}</p>
            </item-flex-img>
            <router-link style="padding: .65rem 1.2rem;" :to="'/docdetail/' + item.doctorId" class="maincolor small10 sendcolor flex acenter">
                <span>简介</span> <i class="iconfont icon-arrright small8 gray"></i>
            </router-link>
            <router-link class="msg base12 flex acenter" tag="section" v-if="item.status > 10 && item.newMsg"
                :to="{ path: '/chat', query: { id: item.doctorId, oid: item.uuid, uid: item.subUserUuid, otype: '8' }}">
                <span class="small10 maincolor sendcolor">最新消息&emsp;</span>
                <span class="flex_1 whitespace base12 msgcolor ohidden">{{item.newMsg}}</span>
                <i class="iconfont icon-arrright small9 gray newarr"></i>
            </router-link>
            <footer class="clearfix">
                <div class="nodoc flex" v-if="item.status == 10">
                    <span class="flex_1 big12">您的报到信息已发送成功，请耐心等待医生通过...</span>
                    <span class="grayccc small">{{item.createTime}}</span>
                </div>
                <div v-else>
                    <div class="jumps small11 flex jend">
                        <router-link :to="{ path: '/evaluate', query: { id: item.doctorId, oid: item.uuid, otype: '8' }}">
                            <span class="toeva" :class="{'noteam': !item.doctorTeam}">去评价</span>
                        </router-link>
                        <router-link :to="{ path: '/give', query: { docid: item.doctorId, uid: item.subUserUuid, oid: item.uuid, otype: '8' }}">
                            <span class="togive" :class="{'noteam': !item.doctorTeam}">送心意</span>
                        </router-link>
                        <router-link :to="{ path: '/chat', query: { id: item.doctorId, oid: item.uuid, uid: item.subUserUuid, otype: '8' }}">
                          <span class="tochat" :class="{'noteam': !item.doctorTeam}"><i class="icon iconfont icon-liaotian"></i> 发起沟通</span>
                        </router-link>
                    </div>
                    <section class="docteam" v-if="item.doctorTeam">
                        <div class="teamtitle">所属团队</div>
                        <item-flex-img class="relative teambg" :link="'/teaminfo/'+ item.doctorTeam.id"
                            :img="item.doctorTeam.logoUrl" radius="9999px"
                            style="padding: 1rem 1rem .8rem .8rem;margin-right:1.2rem;" size="3.3rem" logo="teamlogo">
                            <p class="big16 blacklower whitespace">{{item.doctorTeam.teamName }}</p>
                            <p class="big13 whitespace" style="color:#878d99;">擅长：{{item.doctorTeam.speciality ||'暂无'}}</p>
                            <p>
                                <i class="thumb bgcove" v-for="(m,index) in item.doctorTeam.members" :key="index" :style="`background-image:url(${imgsrc(m.headImageUrl,'user-head')})`"></i>
                                <span class="blacklower small11"><span> 等{{ item.doctorTeam.memberCount  }}</span>位医生</span>
                            </p>
                            <p class="base12 onefree" v-if="item.free==1">您有一次免费团队问诊可使用<span class="free fff small10">免费</span></p>
                        </item-flex-img>
                    </section>
                </div>
            </footer>
        </div>
    </div>
    <no-doctor v-else title="您还没有报到过医生" subtitle="您报到过的医生将会在这里显示" linktitle="去报到"></no-doctor>
</template>
<script>
    import { NoDoctor, ItemFlexImg } from '@components/share'
    import debounce from 'vux/src/tools/debounce'
    import goeasy from '@mixins/goeasy'
    import { imgsrc } from '@filters'
    export default {
        components: {
            NoDoctor,
            ItemFlexImg
        },
        mixins: [goeasy],
        created () {
            this.$vux.loading.show()
            this.mydoc = JSON.parse(localStorage.getItem('_cache_mydoc_') || '[]')
            this.initData()
        },
        data () {
            return {
                mydoc: [],
                nodoc: false,
                hash: this.$route.fullPath,
                nowTime: +new Date()
            }
        },
        methods: {
            imgsrc,
            refresh: debounce(function(key){
                this.initData()
            }, 2000),
            initData () {
                this.$http.get( this.$urls.MYDOCTORS, {
                  openid: this.$store.state.openid
                }, this).then(d => {
                    localStorage.setItem('_cache_mydoc_', JSON.stringify(this.mydoc = d.orders || []))
                    this.nodoc = !this.mydoc.length
                    this.$vux.loading.hide()
                }).catch(() => {
                    this.nodoc = !this.mydoc.length
                })
            }
        }
    }
</script>
<style lang="less" scoped>
    @import '../../../assets/css/var';
    .minmydoc {
      background: #fff;
      margin: .708rem;
      .msgcolor {
        color: #878d99;
      }
      p{
        line-height: 1.4;
        & + p{
          margin-top: .65rem;
        }
      }
      .docteam{
          p + p{
            margin-top: .45rem;
          }
      }
      .duty {
          background-color: #878d99;
          color: #fff; line-height: 1.2rem;
          border-radius: .2rem;
          padding: 1px .3rem 0;
          top: .5rem;
      }
      .msg {
          position: relative;
          margin: 0 1.2rem;
          line-height: normal;
          padding: .5rem 3px .5rem .7rem;
          background: #f2f8fb;
          border-radius: .2rem;
      }
      footer {
        .nodoc {
          color: @main-color;
          line-height: 3.167rem;
          padding: .2rem .8rem .2rem 1.25rem;
          border-top: 1px solid #eee;
        }
        .jumps {
          position: relative;
          line-height: 0;
          height: 4.15rem;
          box-sizing: border-box;
          padding-top: 1.9rem;
          a {
            margin-left: 1.23rem;
            &:last-child {
              margin-right: 1.2rem;
            }
            .toeva {
              border: 1px solid #f6ab00;
              color:#f6ab00;
              border-radius:2rem;
              padding:.3rem .6rem;
            }
            .togive {
              border: 1px solid #fd6154;
              color:#fd6154;
              border-radius:2rem;
              padding:.3rem .8rem;
            }
            .tochat {
              border: 1px solid @main-color;
              color:@main-color;
              border-radius:2rem;
              padding:.3rem 1.1rem;

            }
          }
        }
      }
      .docteam {
        padding-bottom: 1.38rem;
        .teambg {
          background-color: #f9fafa;
        }
        .teamtitle {
          font-size: 1rem;
          color: #878d99;
          padding:0 0 .8rem 1.2rem;
        }
        .onefree {
          color: #fd6154; margin-top: .8rem;
          position: relative;
        }
        .free {
          background-color: #fd6154;
          border-radius: 10px 10px 10px 1px;
          padding: 3px 4px;
          margin-left: .5rem;
          position: relative;
          bottom: .25rem;
          line-height: normal;
        }
        .thumb {
          display: inline-block;
          vertical-align: middle;
          width: 1.615rem;
          height: 1.615rem;
          border-radius: 9999px;
          margin-right: .5rem;
        }
      }
    }

    .sendMind {
      background-image: url(../../../assets/img/mydoc/sendMindbg.png);
      background-size: 100% 100%;
      .itemlist {
        background: transparent;
      }
      .senditem p {
        color: #fff!important;
      }
      .senditem p span {
        color: #fff !important;
      }
      .sendcolor {
        color: #ccc;
      }
      .duty {
        background: #f6ab00 !important;
      }
      .msg {
        background-color: #0086d1;
      }
      .msgcolor {
        color: #fff;
      }
      .newarr {
        color: #fff;
      }
      .jumps a {
        .toeva,.togive,.tochat{
          color:#fff !important;
          border: 1px solid #fff !important
        }
        .noteam{
          border: 1px solid @main-color !important;
          color: @main-color !important
        }
      }
      .docteam {
        .teambg {
          background-color: #fff;
          box-shadow: 2px 2px 6px #ccc;
          border-radius: .3rem;
        }
        .teamtitle {
          color: #fff;
        }
      }
    }
    .androidcls {
        .jumps a span {
            padding-top:.4rem !important;
        }
    }
</style>
<style lang="less">
  .maxmydoc {
    .itemlist {
      margin-left :1rem;
    }
  }
</style>
