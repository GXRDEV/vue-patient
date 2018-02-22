<template>
    <article class="h100 bgfff teamInfo">
        <header>
            <span class="thumb team-img" :style="`background: url(${imgsrc(team.backgroundUrl, 'team-bj', 'auto')})`"></span>
            <i class="thumb bgcove team-logo" :style="`background-image:url(${imgsrc(team.logoUrl, 'teamlogo')})`"></i>
        </header>
        <section class="head-main relative">
            <h3 class="big18">{{team.teamName}}</h3>
            <p style="margin-bottom: .4rem; overflow: hidden">
                <span class="team-dep" v-if="team.teamDepName">{{team.teamDepName}}</span>&ensp;
                <span class="follow base12" @click="follow">{{ isattent ? '已' :'+ '}}关注</span>
            </p>
            <star v-model="team.aver" :height="1" :width="1" :margin=".5" disabled></star>
            <p class="speciality">
                <span>擅长：</span>
                {{team.speciality || '暂无'}}
            </p>
            <div class="profile" id="teamprofilediv">
                <span>简介：</span>
                <p>{{profile || '暂无'}}</p>
                <span class="expand down" v-if="profile.indexOf('...') != -1" @click="profile=team.profile">展开</span>
                <span class="expand up" v-if="profile.indexOf('...') == -1 && teamprofile().indexOf('...') != -1" @click="profile=teamprofile()">收起</span>
            </div>
        </section>
        <section class="teamvip bgcove flex" v-if="isOpen == 'true'">
            <span class="warncolor small10" @click="toVip(hasSign=='true')">{{hasSign == 'true' ? '已签约': '立即签约'}}</span>
        </section>
        <section class="tab-main flex column">
            <div class="tab" ref="tab">
                <p v-for="(item, ind) in tab" :key="ind" @click="tabchange(ind)">
                    <span :class="{'checked': ind == index}" v-html="item"></span>
                </p>
            </div>
            <div class="flex_1">
                <div v-show="index == 0" class="doc-list bgfff">
                    <item-flex-img v-for="item in members" :key="item.doctorId" radius="50%" class="itemsdoc relative"
                        :link="`/docinfo/${item.doctorId}`" :img="item.headImageUrl" size="3.33rem" :borderBottom="true">
                        <span class="special small10 absolute" v-if="filterDuty(item.roleName)"
                            :class="item.roleName.indexOf('团队') != -1 ? 'chief' : 'exp'">{{item.roleName}}</span>
                        <p>
                            <span class="big15">{{item.docName}}</span>&ensp;
                            <span class="big13">{{item.duty}}</span><span></span>
                        </p>
                        <p class="whitespace font-color big13">{{item.hosName}} {{item.depName}}</p>
                        <p class="whitespace font-color big13">擅长：{{item.specialty || '暂无'}}</p>
                    </item-flex-img>
                </div>
                <appraises v-show="index == 1" :oid="oid" type="team" style="background: #fff; padding-top: 1rem" :showHeader="false" :showFooter="true"></appraises>
            </div>
        </section>
        <footer style="height: 3.4rem;">
            <div class="fixed footer" style="z-index: 11">
                <span v-for="(item, ind) in foot" :key="ind" :class="'foot'+ind" class="big15" @click="jumpPage(item)">
                    <i></i>&ensp;{{item.value}}
                </span>
            </div>
        </footer>
        <section class="mark fixed w100vw h100vh top" v-if="isMark" @click.self="isMark=false">
            <div class="mark-box bgfff absolute">
                <div v-for="(applyList, applyInd) in apply" :key="applyInd">
                    <h3>{{applyList.title}} <i class="iconfont icon small11" :class="{'icon-computer': applyInd == 0, 'icon-message': applyInd == 1}"></i></h3>
                    <p class="relative"><i class="disc absolute"></i>{{applyList.value}}</p>
                    <span class="big14" @click="jumpPage(applyList)">申请</span>
                </div>
            </div>
        </section>
    </article>
</template>
<script>
    import { imgsrc } from '@filters'
    import { ItemFlexImg, Appraises, Star } from '@components/share'
    export default {
        components: {
           ItemFlexImg, Appraises, Star
        },
        created () {
            // 获取医生团队基本信息
            this.$http.get(this.$urls.GAINTEAMBASICINFO, { teamId: this.id,userId: this.userId }).then(d => {
                this.team = d.team || {}
                this.oid = this.team.uuid
                this.isOpen = d.openVip;
                this.hasSign = d.hasSign;
                this.getmember()
                this.isAttent()
                // 展开收起
                let width = document.getElementById('teamprofilediv').clientWidth - 25
                let size = Math.ceil(parseFloat(document.documentElement.style.fontSize))
                this.profilelinesize = Math.floor(width / size) * 2 - 3
                this.profile = this.teamprofile()
            })
        },
        data () {
            return {
                id: this.$route.params.id,
                userId: this.$store.state.userid,
                team: {
                    teamName: '■■■■'
                },
                oid: '',
                members: [],
                profilelinesize: 0,
                profile: '',
                tab: ['团队成员', '患者评价'],
                index: 0,
                foot:[
                    { id: 12, value: '团队问诊', type: 2 },
                    { id: 11, value: '会诊申请', type: 3 },
                    { id: 8, value: '患者报到', type: 4 }
                ],
                apply: [
                    {
                        id: 11,
                        title: '视频会诊',
                        type: 3,
                        value: '通过向团队内成员提交会诊申请，由医生辅助您完成会诊下单，患者接收到会诊相关消息通知后，于指定时间前往医院，在医生协助下视频问诊专家，并获得专家诊疗意见报告。',
                        applyType: 4
                    },
                    {
                        id: 11,
                        title: '图文会诊',
                        type: 3,
                        value: '通过向团队内成员提交会诊申请，由医生辅助您完成会诊下单，在医生的专业协助下图文问诊专家，并获得专家诊疗意见报告。',
                        applyType: 5
                    }
                ],
                isMark: false,
                isattent: '',
                isOpen:'false',
                hasSign: 'false'
            }
        },
        methods: {
            imgsrc,
            // 展开收起
            teamprofile () {
                let c = this.profilelinesize;
                let str = this.team.profile || ''
                let l = str.length
                return l > c ? (str.substring(0, c) + '...') : str
            },
            // tab切换
            tabchange (ind) {
                this.index = ind;
                ind == 0 ? this.getmember() : ''
            },
            // 团队成员
            getmember () {
                if (this.members.length) return;
                this.$http.get(this.$urls.GAINTEAMMEMBERS, { teamId: this.id, sceneType: 1 }).then(d => {
                    this.members = d.members || []
                })
            },
            toast (text) {
                this.$vux.toast.show({
                    text: text
                })
            },
            filterDuty (roleName) {
                return roleName && roleName.indexOf('成员') == -1 && roleName.indexOf('助理') == -1
            },
            // 团队是否被关注
            isAttent () {
                this.$http.get(this.$urls.QUERYATTENTDOCTORTEAM, {
                    userId: this.userId, uuid: this.oid
                }).then(d => {
                    this.isattent = d.attent == "true"
                })
            },
            // 关注(取消)医生团队
            follow () {
                let url = !this.isattent ? this.$urls.ATTENTDOCTORTEAM : this.$urls.DELDOCTORTEAM
                this.$http.post( url, { userId: this.userId, uuid: this.oid }).then( d => {
                    let text = !this.isattent ? '您已成功关注团队' : '您已取消关注团队';
                    this.isattent = !this.isattent;
                    this.$vux.toast.show({
                        type: 'text',
                        text,
                        position: 'middle',
                        width: '15rem'
                    })
                })
            },
            // 点击跳转页面
            jumpPage (item) {
                (item.id != 11 || item.applyType) && this.$router.push({ path: '/teamlist/'+this.id+'/'+item.id, query: { types: item.type, apply: item.applyType || '' }})
                item.id == 11 && (this.isMark = true)

            },
            toVip(hasSign){
                !hasSign ? this.$router.push({ path: '/vip/' + this.id + '/team',query: {uuid: this.team.uuid, serviceId: 14 }}) : ''
            }
        }
    }
</script>
<style scoped lang="less">
    @import '../../../assets/css/var';
    header{
        position: relative;
        .team-img{
            width: 100%;
            background-size: cover !important;
            background-repeat: no-repeat !important;
            &:after{
                content: "";
                display: block;
                padding: 21.2%;
            } 
        }
        .team-logo{
            position: absolute;
            border: .2rem solid #fff;
            width: 4.83rem;
            height: 4.83rem;
            right: .84rem;
            bottom: -2.41rem;
            border-radius: 50%;
        }
    }
    .head-main{
        padding: 0 1rem;
        overflow: hidden;
        h3{
            margin-top: 1.2rem;
            font-weight: normal;
            display: inline-block;
            vertical-align: top;
            margin-bottom: .7rem
        }
        .follow{
            float: right;
            line-height: 1.2rem;
            border: 1px solid @main-color;
            color: @main-color;
            padding: 2px 8px;
            border-top-left-radius: .8rem;
            border-bottom-right-radius: .8rem;
            box-sizing: border-box
        }
        .team-dep{
            font-size: .84rem;
            background: @font-color;
            color: #fff;
            border-radius: .2rem;
            padding: .2rem .3rem .1rem;
        }
        .speciality,.profile{
            span{
                color: @font-color;
            }
        }
        .speciality{
            margin: 1.2rem 0 1.23rem
        }
        .profile{
            p{
                display: inline
            }
            .expand{
                color: @main-color;
                position: relative;
            }
            .down{
                &:after{
                    content: '';
                    position: absolute;
                    width: .5rem;
                    height: .5rem;
                    border-right: .5px solid #aeaeae;
                    border-bottom: .5px solid #aeaeae;
                    top: 12%;
                    right: -1rem;
                    transform: rotate(45deg)
                }
            }
            .up{
                &:after{
                    content: '';
                    position: absolute;
                    width: .5rem;
                    height: .5rem;
                    border-left: .5px solid #aeaeae;
                    border-top: .5px solid #aeaeae;
                    top: 40%;
                    right: -1rem;
                    transform: rotate(45deg)
                }
            }
        }
    }
    .tab-main{
        margin-top: 0.65rem;
        .tops{
            top: 0rem
        }
        .tab{
            display: block;
            line-height: 3.7rem;
            text-align: center;
            border-bottom: 1px solid #eee;
            z-index: 10;
            left: 0;
            right: 0;
            background: #fff;
            p{
                display: inline-block;
                width: 40%;
            }
            .checked{
                color: @main-color;
                position: relative;
                padding-bottom: 1.25rem;
                &:after{
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: .38rem;
                    width: 100%;
                    background: @main-color;
                    border-radius: .5rem;
                }
            }
        }
        .doc-list{
            p{
                line-height: 1.5;
            }
            .special{
                font-size: 0.88rem;
                text-align: center;
                right: 1.16rem;
                top: 1.25rem;
                line-height: 1.2rem;
                padding: .1rem .3rem .06rem;
                border-radius: .2rem;
                color: #fff;
                box-sizing: border-box
            }
            .chief{
                background: @main-color
            }
            .exp{
                background: @warn-color
            }
            .font-color{
                color: @font-color
            }
        }
    }
    .mark{
        background: rgba(0, 0, 0, 0.5);
        z-index: 11;
        .mark-box{
            width: 26.11rem;
            height: 30.91rem;
            box-sizing: border-box;
            border-radius: .2rem;
            top: 50%;
            margin-top: -16rem;
            left: 50%;
            margin-left: -13.05rem;
            padding-bottom:2rem;
            div{
                overflow: hidden;
                padding: 2rem 2.167rem 0 2.33rem;
                &:first-child{
                    border-bottom: 1px solid #e5e5e5;
                }
                h3{
                    font-size: 1.83rem;
                    padding-bottom: 1.9rem;
                    line-height: 1;
                    font-weight: normal;
                    .icon{
                        width: 1.67rem;
                        height: 1.67rem;
                        display: inline-block;
                        color: @main-color;
                        background: #e4f2fd;
                        line-height: 1.67rem;
                        text-align: center;
                        border-radius: 50%;
                        vertical-align: top
                    }
                }
                p{
                    color: #9799a5;
                    line-height: 1.6
                }
                span{
                    float: right;
                    margin: .75rem 0;
                    padding: .1rem .75rem;
                    border: 1px solid #cbe6f7;
                    border-radius: .2rem;
                    color: @main-color;
                }
            }
            .disc{
                width: 5px;
                height: 5px;
                border-radius: 50%;
                background: @main-color;
                left: -1.3rem;
                top: .5rem
            }
        }
    }
    .teamvip {
        margin:1.67rem 1rem 0;
        background-image: url(../../../assets/img/team/teamvip.png);
        background-repeat: no-repeat;
        background-size:100% 100%;
        position:relative;
            &:after {
               content:"";
               display:block;
               padding:8%;
             }
            span {
                position:absolute;
                top:50%;
                transform:translateY(-50%);
                right:.8rem;
                border:1px solid #f6ab00;
                border-radius:2rem;
                padding:.2rem .5rem;
            }
    }
    .footer{
        bottom: 0;
        width: 100%;
        border-top: 1px solid #eee;
        background: #fcfcfc;
        box-sizing: border-box;
        line-height: 3.7rem;
        span{
            display: inline-block;
            width: 33%;
            text-align: center;
            border-right: 1px solid #eee;
            color: #000;
            i{
                width: 1.29rem;
                height: 1.29rem;
                display: inline-block;
                vertical-align: middle
            }
        }
        a:last-child{
            border: none
        }
        .foot0{
            i{
                width: 1.5rem
            }
        }
    }
    .footer(@navicon) when (@navicon < 3 ) {
        .foot@{navicon} {
            i{
                background:url("../../../assets/img/team/team-@{navicon}.png") no-repeat left center;
                // margin-left: 5%;
                background-size: cover;
            }
        }
        .footer(( @navicon + 1 ));// 递归调用自身
    }
    .footer(0);
</style>
<style lang="less">
  .teamInfo {
      .itemlist {
        margin-left :1rem;
      }
  }
</style>
