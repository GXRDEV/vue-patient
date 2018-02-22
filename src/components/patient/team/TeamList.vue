<template>
    <div class="h100 bgfff teamList">
        <heading :title="title" style="padding-top: 0; padding-bottom: 0.7rem">
            <div style="color: #878d99">
                <p v-if="type == 2">
                    请选择一位医生进行首诊，首诊完毕后，团队首席将给予您复诊意见
                </p>
                <div v-else-if="type == 3">
                    会诊申请<span style="color: #F6AB00">不收取费用</span>
                    <p>一经确认会诊，将按照<span style="color: #0086D1">会诊金额缴纳相关费用</span></p>
                </div>
                <div v-else>
                    <p style="padding-bottom: .2rem">选择团队内成员报到，成为该团队的患者</p>
                    <p>您将获得一次<span style="color: #F6AB00;">免费的团队问诊服务</span></p>
                </div>
            </div>
        </heading>
        <item-flex-img v-for="item in members" :key="item.doctorId" radius="50%" class="itemsdoc relative"
            :img="item.headImageUrl" size="3.33rem" :borderBottom="true">
            <span class="special big13 absolute" @click.prevent="jump(item)">{{type == 2? '向ta问诊' :  (type == 3 ? '向ta申请' : '向ta报到') }}</span>
            <p>
                <span class="big15">{{item.docName}}</span>&ensp;
                <span class="font-color big13">
                    {{item.duty}}<span v-if="item.duty && item.profession">/</span>{{item.profession}}
                </span>
            </p>
            <p class="whitespace big13" style="padding: .2rem 5rem 0 0">{{item.hosName}}&ensp;{{item.depName}}</p>
            <p style="color: #F6AB00; padding-top: .2rem" v-if="type == 2">
                <span class="big14">{{item.askAmount}}</span>元/次
            </p>
        </item-flex-img>
    </div>
</template>
<script>
    import { Heading, ItemFlexImg } from '@components/share'
    export default {
        components: {
            Heading, ItemFlexImg
        },
        created () {
            this.id && this.$http.get(this.$urls.GAINTEAMMEMBERS, { teamId: this.id, sceneType: this.type }).then(d => {
                this.members = d.members || []
            })
            this.title += this.type == 2 ? '首诊' : this.type == 3 ? '会诊申请' : '报到';
        },
        data () {
            return {
                id: this.$route.params.id,
                otype: this.$route.params.type,
                type: this.$route.query.types,
                title: '请选择一位医生',
                members: '',
                timer: new Date().getTime(),
                apply: this.$route.query.apply
            }
        },
        methods: {
            jump (item) {
                this.type == 4 ?
                this.$router.push('/report/'+ item.doctorId + '/' + item.teamUuid + '/' + this.timer ):
                this.$router.push( { path: '/interrogation/'+this.timer, query: { sever: this.otype, docid: item.doctorId, teamUuid: item.teamUuid, apply: this.apply}})

            }
        }
    }
</script>
<style lang="less">
    @import '../../../assets/css/var';
    .teamList {
        .special{
          right: 1.16rem;
          padding: .2rem .41rem ;
          border-radius: .2rem;
          color: #fff;
          background: @main-color;
          top: 50%;
          margin-top: -.7rem
        }
        .font-color{
          color: @font-color
        }
        .itemlist {
          margin-left :1rem;
        }
    }
</style>

