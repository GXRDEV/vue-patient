<template>
    <article class="invitefriend h100">
        <img src="../../../assets/img/indexInfo/sharebg.png" class="w100">
        <div class="content tcenter blacklower">
            <h4 class="big15 pf-light">邀请好友，您和好友各得</h4>
            <h3 class="pf-light">
                <span class="warncolor">10元</span>平台服务代金券</h3>
            <div class="flex" @click="isMask=true">
                <div class="flex_1 tab-item">
                    <label><img src="../../../assets/img/indexInfo/weixin.png" /></label>
                    <span>微信好友</span>
                </div>
                <div class="flex_1 tab-item">
                    <label><img src="../../../assets/img/indexInfo/friendcircle.png" /></label>
                    <span>朋友圈</span>
                </div>
                <div class="flex_1 tab-item">
                    <label><img src="../../../assets/img/indexInfo/qq.png" /></label>
                    <span>qq好友</span>
                </div>
            </div>
            <a class="small10 maincolor" @click="rule = true">查看详细规则></a>
        </div>
        <p class="base12 blacklower code">您的邀请码：{{ userCode }}</p>
        <section class="mark fixed" v-if="isMask" @click="isMask=false">
            <img src="../../../assets/img/indexInfo/guide-icon.png">
        </section>
        <rule v-model="rule" title="邀请好友">
            <div class="small10 rule">
                <p style="color: #b9b9c1;" class="base12">活动内容:</p>
                <p>1. 通过发送 邀请链接 给微信好友，推荐微信好友注册并绑定佰医汇公号；</p>
                <p>2. 每邀请一个好友注册成功可获得2张5元代金券（不限使用范围，有效期3个月）；</p>
                <p>3. 好友注册成功也可获得2张5元代金券（不限使用范围，有效期3个月）；</p>
                <p>4. 带动更多的公众注册体验佰医汇公众号。</p>
                <p style="margin-top:1rem;color: #b9b9c1;" class="base12">活动规则:</p>
                <p>1、邀请者发送邀请二维码（邀请链接）给亲友，让亲友识别/扫描“佰医汇”公众号二维码；</p>
                <p>2、被邀请的亲友通过二维码关注“佰医汇”微信公众号并进行个人信息注册后，邀请者即可获得10元代金券，被邀请者也将获得10元代金券；</p>
                <p>3、以往未关注使用过“佰医汇”微信公众号的朋友才属于有效邀请用户；</p>
                <p>4、邀请成功后，双方可在个人中心查看到代金券；</p>
                <p>5、用户在使用代金券时，只能一次使用一张。</p>
            </div>
        </rule>
    </article>
</template>
<script>
import { mapState } from 'vuex'
import { Rule } from '@components/share'
export default {
    components: {
        Rule
    },
    data() {
        return {
            isMask: false,
            userCode: '',
            rule:false
        }
    },
    computed: {
        ...mapState({
            userid: state => state.userid,
            static: state => state.static
        })
    },
    created() {
        this.$http.get(this.$urls.GETCODE, {
            userId: this.userid
        }).then(d => {
            this.userCode = d.code;
            this.setShareTo();
        })
    },
    methods: {
        setShareTo() {
            let wx = this.$wechat
            let shareconfig = {
                title: '佰医汇',
                desc: '在线问诊，远程会诊，私人医生服务，佰医汇懂你所需，让您看病更轻松！',
                link: `${location.origin + location.pathname}#/patientshare?code=${this.userCode}`,
                imgUrl: `${location.href.split('module')[0]}/${this.static.replace('../', '')}/zjh.png`
            }
            wx.ready(() => {
                wx.showMenuItems({
                    menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline', 'menuItem:share:qq']
                })
                wx.onMenuShareAppMessage(shareconfig)
                wx.onMenuShareTimeline(shareconfig)
                wx.onMenuShareQQ(shareconfig)
            })
        }
    }
}
</script>
<style scoped lang="less">
@import '../../../assets/css/var';
.content {
    box-sizing: border-box;
    padding: 1.6rem 0 1rem;
    height: 17.9rem;
    width: 86%;
    background: #fff;
    position: absolute;
    margin: 0 7%;
    margin-top: -8.9rem;
    z-index: 10;
    border-radius: .3rem;
    box-shadow: 0 0 20px #878d99;
    h3 {
        font-size: 2rem;
        margin: 1.8rem 0 1.92rem;
    }
    a {
        display: block;
        margin-top: 1rem;
        text-decoration: underline;
    }
}

.tab-item {
    img {
        width: 3.33rem;
        height: 3.33rem;
        margin: auto;
    }
    span {
        display: block;
        margin-top: .67rem;
        font-size: .75rem;
    }
}

p.code {
    height: 4.6rem;
    line-height: 4.6rem;
    text-align: center;
    margin-top: 10rem;
}

.mark {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    top: 0;
    z-index: 10;
    img {
        width: 14rem;
        position: absolute;
        right: 1.3rem;
    }
}
.rule p {
    line-height:1.5rem;
}
</style>
