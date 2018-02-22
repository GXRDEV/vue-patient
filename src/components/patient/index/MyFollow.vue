<template>
    <div class="followPage" v-if="follow">
        <div class="minmydoc" v-for="(item, ind) in items" :key="ind">
            <div class="docteam" v-if="item.attentType=='doctor'">
                <item-flex-img
                               :img="item.logoUrl" radius="50%" @click.native="jumpto(item)"
                               style="padding: 1rem 1rem 1.23rem 0;" size="3.38rem" thumb="right">
                    <p class="flex" style="align-items: flex-end;">
                        <span class="big18 blacklower whitespace">{{ item.userName }}&ensp;</span>
                        <span class="small10" v-if="item.duty"><label class="duty">{{ item.duty }}</label></span>
                    </p>
                    <p class="big12 blacklower username">{{item.hosName}}&ensp;｜ {{item.depName}}</p>
                    <p class="big12 whitespace doc-color">擅长：{{ item.speciality || '暂无' }}</p>
                </item-flex-img>
            </div>
            <div class="docteam" v-if="item.attentType=='team'">
                <item-flex-img class="relative"
                               :img="item.logoUrl" radius="50%" @click.native="jumpto(item)"
                               style="padding: 1rem 1rem 1.23rem 0;" size="3.38rem" logo="teamlogo" thumb="right">
                     <p class="flex" style="align-items: flex-end;">
                          <span class="big18 blacklower whitespace">{{ item.userName }}&ensp;</span>
                          <span class="small10" v-if="item.depName"><label class="duty">{{item.depName}}</label></span>
                     </p>
                     <p class="username">
                          <i class="thumb bgcove" v-for="(m,index) in item.members" :key="index" :style="`background-image:url(${imgsrc(m.headImageUrl,'user-head')})`"></i>
                          <span class="blacklower big12"><span class="maincolor"> &nbsp;等{{ item.memberCount  }}</span>位医生</span>
                     </p>
                    <p class="base12 whitespace team-color">擅长：{{ item.speciality || '暂无' }}</p>
                </item-flex-img>
            </div>
        </div>
    </div>
    <no-doctor v-else title="您还没有关注过医生" subtitle="您关注过的医生将会在这里显示" linktitle="去关注"></no-doctor>
</template>
<script>
    import { NoDoctor,ItemFlexImg } from '@components/share';
    import { mapState } from 'vuex';
    import { imgsrc } from '@filters'
    export default{
        components:{
            NoDoctor,
            ItemFlexImg
        },
        computed: {
            ...mapState({
                  userid: state => state.userid
            })
        },
        data () {
            return {
                follow: false,
                items: []
            }
        },
        watch: {
            userid (v) {
                v && this.initData()
            }
        },
        created () {
            this.$vux.loading.show()
            this.items = JSON.parse(localStorage.getItem('_cache_myfollow_') || '[]')
            this.initData()
        },
        methods: {
            imgsrc,
            initData () {
                this.userid ? this.$http.post(this.$urls.GETUSERATTENTEDDOCTOR, { 
                    userId: this.userid 
                }, this).then(d => {
                    localStorage.setItem('_cache_myfollow_', JSON.stringify(this.items = d.list || []))
                    this.follow = !!this.items.length
                    this.$vux.loading.hide()
                }) : window.setTimeout(() => {
                    this.$vux.loading.hide()
                }, 2000)
            },
            jumpto (item) {
                if(item.doctorId){
                    this.$router.push('/docinfo/' + item.doctorId)
                }else {
                    this.$router.push('/teaminfo/'+ item.teamId);
                }

            }
        }
    }
</script>
<style scoped lang="less">
    @import '../../../assets/css/var';
    .followPage{
        margin:.88rem;
    }
    .minmydoc {
        background: #fff;
        border-bottom:.88rem solid #eee;
        p {
            line-height: 1.1;
        }
        .username{
          margin:.7rem 0 1rem;
        }
        .duty {
            background-color: #878d99;
            color: #fff;
            line-height: 1.2rem;
            border-radius: .2rem;
            padding: 1px .3rem 0;
            white-space: nowrap;
        }
        .thumb {
            display:inline-block;
            vertical-align:middle;
            width:1.615rem;
            height:1.615rem;
            border-radius:50%;
            margin-right:.5rem;
         }
        .doc-color {
            color:#9196a1;
        }
        .team-color {
            color:#878d99;
        }
    }
</style>
<style lang="less">
  .followPage {
      .itemlist {
        margin-left :1rem;
      }
      .mainbox {
          margin-right:.8rem;
      }
  }
</style>
