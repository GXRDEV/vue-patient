<template>
    <item-flex-img :borderBottom="true" :img="team.logoUrl" size="3.1rem"
        radius="50%" style="padding-bottom: .76rem" :link="'/teaminfo/'+team.id" class="resultTeam">
        <div class="relative doc-team">
            <p class="big15 name">{{team.teamName}}</p> <span class="absolute hasExp" v-if="team.hasExp == 'true'">特约专家</span>
            <p class="team-dep" v-if="team.depName">
                <span>
                    {{team.depName}}
                </span>
            </p>
            <p class="font-color small11">擅长：{{team.speciality}}</p>
            <p class="score">
                <score :value="team.aver"></score>
                <span style="color: #efefef">&ensp;|&ensp;</span>
                <span class="font-color small11">关注量：{{team.attentCount}}</span></p>
            <div>
                <span v-for="(item, ind) in team.members.slice(0,4)" :key="ind" class="thumb doc-head"
                    :style="`background: url(${imgsrc(item.headImageUrl, 'user-head')})`"></span>
                <span style="color: #000">等{{team.memberCount}}位医生</span>
            </div>
        </div>
    </item-flex-img>
</template>
<script>
    import { ItemFlexImg, Score } from '@components/share'
    import { imgsrc } from '@filters'
    export default {
        name: "teamlist",
        components: {
            ItemFlexImg, Score
        },
        props: {
            team: Object
        },
        methods: {
            imgsrc
        }
    }
    
</script>
<style lang="less" scoped>
    @import '../../assets/css/var';
    .resultTeam {
        padding-left: 1rem !important;
    }
    .doc-team{
        .font-color{
            color: #93969d
        }
        .name{
            color: #000;
            margin-bottom: 0.61rem
        }
        .hasExp{
            right: 0;
            top: 0;
            font-size: .9rem;
            padding: .2rem 1rem;
            background: #fef2d8;
            color: @warn-color;
            border-top-left-radius: 1rem;
            border-bottom-right-radius: 1rem;
        }
        .team-dep{
            margin-bottom: .5rem;
            span{
                font-size: .84rem;
                background: @font-color;
                color: #fff;
                border-radius: .2rem;
                padding: .2rem .3rem .1rem;
            }
        }
        .score{
            padding: .76rem 0 1.15rem;
        }
        .doc-head{
            vertical-align: bottom;
            display: inline-block;
            width: 1.6rem;
            height: 1.6rem;
            border-radius: 50%;
            margin-right: .38rem;
            background-size: cover !important;
        }
    }
</style>