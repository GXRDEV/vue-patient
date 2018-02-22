<template>
    <article class="bgfff userinfomain">
        <section>
            <div class="relative usermain bgcove" @click="admin">
                <div class="thumb bgcove radius50 fleft userimg" :style="'background-image:url('+ imgsrc(uwr.headImageUrl, 'user') +')'"></div>
                <div class="username">
                    <label class="fff">{{ uwr.displayName || '匿名用户' }}</label>
                    <p class="big13">{{ uinfo.mobileNumber | obscure('未绑定') }}</p>
                </div>
                <i>完善您的信息</i>
            </div>
        </section>
        <div class="routegroup relative top flex tcenter">
            <router-link class="flex_1 flex" to="/inquirylist/1">
                <div class="flex_1 ask relative">
                    <img src="../../../assets/img/indexInfo/message.png">
                    <p class="big13">我的问诊</p>
                </div>
            </router-link>
             <router-link class="flex_1 flex" to="/orderlist/1">
                <div class="flex_1">
                    <img src="../../../assets/img/indexInfo/file.png">
                    <p class="big13">我的订单</p>
                </div>
            </router-link>
        </div>
        <section>
            <group gutter="0">
                <cell class="list-item-menu" title="优惠券" is-link link="/mycoupons">
                    <img slot="icon" src="../../../assets/img/indexInfo/coupon.png">
                    <span class="new bgcove" solt="after-title"></span>
                </cell>
                <cell class="list-item-menu" title="交易记录" is-link link="/record">
                    <img slot="icon" src="../../../assets/img/indexInfo/record.png">
                    
                </cell>
            </group>
        </section>
        <section>
            <cell class="list-item-menu" title="我的评价" is-link link="/myevaluate">
                <img slot="icon" src="../../../assets/img/indexInfo/evaluate.png">
            </cell>
            <cell class="list-item-menu" title="我的心意" is-link link="/mysendminds">
                <img slot="icon" src="../../../assets/img/indexInfo/spanbj-5.png">
            </cell>
        </section>
        <section>
            <group gutter="0">
                <cell class="list-item-menu" title="问诊攻略" is-link link="/intro">
                    <img slot="icon" src="../../../assets/img/indexInfo/spanbj-4.png">
                </cell>
                <cell class="list-item-menu" title="功能介绍" is-link link="/funintro">
                    <img slot="icon" src="../../../assets/img/indexInfo/intro.png">
                </cell>
            </group>
        </section>
        <section>
            <group gutter="0">
                <cell class="list-item-menu friend" title="邀请好友" is-link link="/invitefriend">
                    <img slot="icon" src="../../../assets/img/indexInfo/friend.png">
                    <span class="invitation bgcove" solt="after-title"></span>
                </cell>
            </group>
        </section>
        <section>
            <group gutter="0">
                <cell class="list-item-menu" title="联系客服" is-link link="/contact">
                    <img slot="icon" src="../../../assets/img/indexInfo/spanbj-6.png">
                </cell>
                <cell class="list-item-menu" title="关于我们" is-link link="/aboutMe">
                    <img slot="icon" src="../../../assets/img/indexInfo/spanbj-7.png">
                </cell>
                <cell class="list-item-menu" title="帮助与反馈" is-link link="/feedback?from=1">
                    <img slot="icon" src="../../../assets/img/indexInfo/spanbj-8.png">
                </cell>
                <cell class="list-item-menu" title="设置" is-link link="/password">
                    <img slot="icon" src="../../../assets/img/indexInfo/spanbj-9.png">
                </cell>
            </group>
        </section>
    </article>
</template>

<script>
    import { mapState } from 'vuex'
    import { Group, Cell } from 'vux'
    import { MsgCount } from '@components/share';
    import { obscure, imgsrc } from '@filters'
    export default {
        components: {
            Group, Cell, MsgCount
        },
        filters: {
            obscure
        },
        computed: {
            ...mapState({
                uwr: state => state.uwr || {},
                uinfo: state => state.uinfo || {},
            })
        },
        methods: {
            imgsrc,
            admin () {
                this.$router.push( "/completeinfo/" + new Date().getTime())
            }
        }
    }
</script>
<style lang="less" scoped>
    @import '../../../assets/css/var';
    .usermain{
        height: 8.38rem;
        box-sizing: border-box;
        background-image: url(../../../assets/img/indexInfo/userbg.png);
        padding: 1.5rem 0 0 1rem;
        .userimg{
            box-sizing: border-box;
            width: 3.8rem;
            height: 3.8rem;
            margin-right: 1.5rem;
        }
        .username {
            overflow: hidden;
            label{
              display: inline-block;
              font-size: 2rem;
              margin-bottom: .7rem;
              line-height: 1;
            }
            p{
              color:#eaecf0;
            }
        }
        i {
            color: #dfe1ed;
            border-radius: 2rem;
            background: #339eda;
            padding: .3rem .6rem;
            position: absolute;
            top: 1rem;
            right: 1rem;
            font-size: 1rem;
            font-style: normal;
        }
    }
    section{
        background: #fff;
        & + section{
            border-top: .7rem solid #eee;
        }
    }
    .routegroup{
        box-sizing: border-box;
        z-index: 100;
        margin: 0 3%;
        margin-top: -1.84rem;
        box-shadow: 2px 2px 20px #eee;
        border-radius: .3rem;
        background-color: #fff;
        width: 94%;
        height: 7.3rem;
        a{
            align-items: center;
            justify-content: center;
            color: #000
        }
        img{
            width: 2.8rem
        }
        .ask:after{
            content: " ";
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 1px;
            height: 2.625rem;
            background: #eee
        }
    }

    .new {
        display: inline-block;
        width: 1.5rem;
        height: 1rem;
        background-image: url(../../../assets/img/indexInfo/new.png);
        margin-top: .3rem;
    }
    .invitation{
        display: inline-block;
        width: 1.5rem;
        height: 1.5rem;
        background-image: url(../../../assets/img/indexInfo/Invitation.png);
        margin-top: .3rem;
    }

</style>
<style lang="less">
  @import '../../../assets/css/var';
  .userinfomain{
      .weui-cells:before {
        border-top: 0;
      }
      .list-item-menu .weui-cell__hd img {
        width: 1.5rem;
        height: inherit;
      }
      .list-item-menu .vux-label {
        color: #222;
      }
      .list-item-menu {
        padding: 1rem 1.5rem 1rem .76rem!important;
      }
      .list-item-menu.friend .vux-label {
        color: #0086d1;
      }
  }
</style>
