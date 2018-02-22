<template>
    <section class="teamserver">
        <div class="bgfff" :style="`padding-bottom: ${teams.length ? 0 : 1.5}rem`">
            <img src="../../../assets/img/servrdetails.png" alt="" class="w100">
            <div class="title flex">
                <i class="flex_1"></i><span>优选团队</span><i class="flex_1"></i>
            </div>
        </div>
        <div v-if="teams.length" style="padding-bottom:4.25rem; background:#fff;">
            <item-flex-img v-for="(team,index) in teams" :key="index" :link="'/teaminfo/' + team.id"
                           :img="team.logoUrl" :borderBottom="true" radius="9999px" class="itemteam relative"
                           style="padding: 1.5rem 1rem .6rem 0" size="4rem" logo="teamlogo">
                <p class="big14 blacklower">
                    {{team.teamName}}
                </p>
                <div class="duty" v-if="team.depName"><span class="small10">{{ team.depName  }}</span></div>
                <p class="absolute star"><score :value="team.aver"></score></p>
                <p class="whitespace base12 gray">擅长: {{team.speciality || '暂无'}}</p>
                <p class="username" v-if="team.members.length">
                    <i class="thumb bgcove" v-for="(m,index) in team.members" :key="index" :style="`background-image:url(${imgsrc(m.headImageUrl,'user-head')})`"></i>
                    <span class="blacklower small10"> &nbsp;等{{ team.memberCount  }}位医生</span>
                </p>
                <p style="margin-top:.5rem;">
                    <span v-for="(p,index) in team.vipServiceDtos" :key="index" class="blacklower package small10">{{ p.packageName }} / <span class="warncolor">{{ p.amount }}</span></span>
                </p>
            </item-flex-img>
        </div>
        <load-more v-else :tip="'暂无数据'" :show-loading="false" background-color="#eee"></load-more>
        <footer class=" fixed bottom bbox">
            <router-link :to="{ path: '/libs/team/all', query:{ distCode: distCode, serviceId: 14 } }" class="btn">查看全部医生团队</router-link>
        </footer>
    </section>
</template>
<script>
    import { ItemFlexImg, Score } from '@components/share'
    import { imgsrc } from '@filters'
    import { LoadMore } from 'vux'
    export default {
        components: {
            ItemFlexImg, Score, LoadMore
        },
        data (){
            return {
                teams: '',
                distCode: this.$route.query.distCode || ''
            }
        },
        methods : {
            imgsrc
        },
        created (){
            this.$http.get(this.$urls.GAINDOCTEAMS, {
                ispage: 1,
                pageNo: 1,
                pageSize: 2,
                distCode: this.distCode,
                serviceId: 14,
            }).then(d => {
                this.teams = d.dts;
            })
        }
    }
</script>
<style scoped lang="less">
    @import '../../../assets/css/var';
    .teamserver {
         .title  {
              margin: 0 1.56rem;
              text-align: center;
              i{
                   height:1px;
                   margin-top: 1.05rem;
                   background: #fceec9;
               }
              span {
                  height: 2.1rem;
                  width: 6.8rem;
                  background: @warn-color;
                  border-radius: 1.4rem 1.4rem .4rem .4rem;
                  color: #fff;
                  line-height: 2.1rem;
                  margin: 0 1.2rem
              }
         }

    }
    .itemteam {
        p + p {
            padding-top: .6rem;
        }
        .package {
            background: #fff9ee;
            display:  inline-block;
            height: 1.375rem;
            padding:  .1rem .6rem 0;
            line-height:  1.375rem;
            text-align: center;
            border-radius:  .2rem;
            margin-right: .6rem;
        }
        p.star {
            top:  .6rem;
            right:  1rem;
        }
        .thumb {
            display:inline-block;
            vertical-align:middle;
            width:1.66rem;
            height:1.66rem;
            border-radius:50%;
            margin-right:.5rem;
        }
    }
    .duty {
        margin-top:.5rem;
        span{
            font-size: .83rem;
            background: @font-color;
            color: #fff;
            border-radius: .2rem;
            padding: .2rem .3rem .1rem;
        }

    }
    footer {
        width:100%;
        text-align:center;
        margin-bottom: 1.5rem;
        background: transparent;
        .btn {
            display:inline-block;
            width:12rem;
            height:2.75rem;
            line-height:2.75rem;
            text-align: center;
            background-color: #ff9702;
            color:#fff;
            border-radius:3rem;
            box-shadow:0 0 10px #ff9702;
        }
    }
</style>
<style lang="less">
  .teamserver {
      .itemlist {
          margin-left: 1rem;
      }
  }
</style>
