<template>
    <div class="bgfff h100 srcoll">
        <template v-if="type == 'team'">
            <item-flex-img thumb="right" size="4.8rem" class="acenter" :img="details.logoUrl" style="padding: 0 1rem;" radius="50%">
                <h3 class="big19 pf-regular" style="padding-bottom: .5rem">
                    {{details.teamName}}
                </h3>
                <span class="teamDepName small10 fff">{{details.teamDepName || '暂无'}}</span>
                <div>
                    <star v-model="details.aver" :height="1" :width="1" :margin=".5" disabled></star>
                </div>
            </item-flex-img>
        </template>
        <template v-else>
            <item-flex-img thumb="right" size="4.58rem" class="acenter" :img="details.listSpecialPicture" style="padding: 0 1rem;" radius="50%">
                <h3 class="big19 pf-regular" style="display: inline-block">{{details.specialName}}</h3><span class="duty small10 fff">{{details.duty}}</span>
                <p style="padding-top: .5rem">{{details.hosName}}<span v-if="details.hosName && details.depName"> | </span>{{details.depName}}</p>
                <router-link class="maincolor small11 block" :to="'/docdetail/' + id" style="padding-top: .5rem">
                    简介<i class="iconfont icon-arrright small9 gray" style="vertical-align: 1px;"></i>
                </router-link>
            </item-flex-img>
        </template>
        <section class="bgfff" style="padding-bottom: 4.3rem">
            <div class="price">
                <p class="big13 title-p">请选择服务期限</p>
                <div class="flex">
                    <p v-for="(prices, serverInd) in server" :key="serverInd" class="flex_1 relative big14" @click="selectSever(prices, serverInd)" :class="{ 'severSelect': severInd == serverInd}">
                        ￥{{prices.amount}}/<span class="small11">{{prices.packageName}}</span>
                        <i v-if="severInd == serverInd"></i>
                    </p>
                </div>
            </div>
            <server :type="type"></server>
        </section>
        <footer class="fixed bottom bgfff left right">
            <span class="big14" style="color: #acb0b9">
                已选择<span style="color: #F6AB00">￥{{money}}/{{packageName}}</span>
            </span>
            <span class="pay fff" @click="next()">
                下一步
            </span>
        </footer>
    </div>
</template>
<script>
    import { ItemFlexImg, Star, Server } from '@components/share'
    export default {
        components: {
            ItemFlexImg, Star, Server
        },
        data () {
            return {
                userId: this.$store.state.userid,
                id: this.$route.params.id || '',
                type: this.$route.params.type,
                teamUuid: this.$route.query.uuid || '',
                serviceId: this.$route.query.serviceId || '',
                server: [],
                severInd: 0,
                severPack: '',
                money: '',
                packageName: '',
                details: {
                    teamName: '■■■■',
                    teamDepName: '■■■■',
                    specialName: '■■■■',
                    duty: '■■■■',
                    hosName: '■■■■■■■■',
                    depName: '■■■■'
                }
            }
        },
        created () {
            let url = this.type == 'team' ? this.$urls.GAINTEAMBASICINFO : this.$urls.DOCMAIN
            let urlName = this.type == 'team' ? { teamId: this.id, userId: this.userId } : { docid: this.id }
            let vipurl = this.type == 'team' ? {teamUuid: this.teamUuid, serviceId: this.serviceId } : {doctorId: this.id, serviceId: this.serviceId}
            this.$http.get( url, urlName).then( d => {
                this.details = this.type == 'team' ? d.team : d.doc
            })
            // 获取vip服务
            this.$http.get(this.$urls.VIPSERVER, vipurl ).then( d => {
                this.server = d.services
                this.severPack = d.services[0].id
                this.money = d.services[0].amount
                this.packageName = d.services[0].packageName
            })
        },
        methods: {
            selectSever (sever, serverInd){
                this.severPack = sever.id
                this.severInd = serverInd
                this.money = sever.amount
                this.packageName = sever.packageName
            },
            next () {
                let parameter = {
                    doc: {
                        specialId: this.id,
                        specialName: this.details.specialName || this.details.teamName,
                        listSpecialPicture: this.details.listSpecialPicture || this.details.logoUrl,
                        hosName: this.details.hosName || '',
                        serviceId: this.serviceId,
                        severPack: this.severPack,
                        teamUuid: this.teamUuid || ''
                    },
                    form: {
                        otype: this.serviceId,
                        serviceId: this.serviceId,
                        warmthMoney: this.money
                    }
                }
                sessionStorage.setItem('pay_parameter', JSON.stringify(parameter))
                this.$router.push(this.serviceId == 15 ? '/choicefamily': '/pay')
            }
        }
    }
</script>
<style lang="less" scoped>
    @import '../../../assets/css/var.less';
    .thumbRight{
        height: 8.95rem;
        box-sizing: border-box
    }
    .teamDepName{
        display: inline-block;
        padding: 0.2rem 0.3rem;
        background: #868c9a;
        border-radius: .2rem;
        margin-bottom: .7rem;
    }
    .duty{
        background: #868c9a;
        border-radius: .2rem;
        padding: .2rem .3rem;
        margin-left: .83rem;
    }
    section{
        padding: 0 1rem;
        border-top: .5px solid #eee;
        .price{
            margin-bottom: 2.625rem;
            .title-p{
                padding: 1.2rem 0 1.45rem
            }
            div{
                p{
                    line-height: 3.25rem;
                    text-align: center;
                    color: #909398;
                    border-radius: .2rem;
                    border: 1px solid #9493a1;
                    box-sizing: border-box;
                    margin-right: .5rem;
                    i{
                        position: absolute;
                        width: 0px;
                        height: 0px;
                        right: 0;
                        bottom: 0;
                        border-left: 7px solid transparent;
                        border-top: 7px solid transparent;
                        border-right: 7px solid @main-color;
                        border-bottom: 7px solid @main-color;
                        border-bottom-right-radius: .15rem;
                        &:before{
                            content: '';
                            position: absolute;
                            right: -.3rem;
                            bottom: -.3rem;
                            width: .15rem;
                            height: .3rem;
                            border-right: .5px solid #fff;
                            border-bottom: .5px solid #fff;
                            transform: rotate(30deg)
                        }
                    }
                }
                p:last-child{
                    margin: 0
                }
                .severSelect{
                    color: @main-color;
                    border-color: @main-color
                }
            }
        }
    }
    footer{
        z-index: 10;
        line-height: 4.3rem;
        padding: 0 .8rem;
        box-shadow: 0 -2px 8px 0px #eee;
        .pay{
            float: right;
            background: @main-color;
            width: 9.54rem;
            height: 2.9rem;
            line-height: 2.9rem;
            border-radius: 3rem;
            text-align: center;
            font-size: 1.2rem;
            margin-top: .7rem;
            border-top: 1px solid #e5e5e5;
            box-shadow: 0 1.5px 8px 0 #0086D1;
            i{
                font-size: 1.6rem
            }
        }
    }
</style>
