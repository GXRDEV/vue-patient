<template>
    <article class="bgfff h100">
        <header>
            <img src="../../../assets/img/sharepage/sharebar.png">
            <span class="fff big14" @click="bind">关注</span>
        </header>
        <div class="content bbox">
            <p class="title fff">无时无刻</p>
            <p class="big19 fff">关注您和家人的身心健康</p>
            <div class="flex" style="margin-top:3.1rem;">
                <div class="flex_1 tab-item">
                    <label><img src="../../../assets/img/sharepage/share-icon-ask.png"/></label>
                    <span>疾病问诊</span>
                </div>
                <div class="flex_1 tab-item">
                    <label><img src="../../../assets/img/sharepage/share-icon-sign.png"/></label>
                    <span>签约名医</span>
                </div>
                <div class="flex_1 tab-item">
                    <label><img src="../../../assets/img/sharepage/share-icon-huizhen.png"/></label>
                    <span>重症会诊</span>
                </div>
                <div class="flex_1 tab-item">
                    <label><img src="../../../assets/img/sharepage/share-icon-family.png"/></label>
                    <span>家庭管理</span>
                </div>
                <div class="flex_1 tab-item">
                    <label><img src="../../../assets/img/sharepage/share-icon-more.png"/></label>
                    <span>更多服务</span>
                </div>
            </div>
        </div>
        <p class="warncolor big15 tcenter follow">即刻关注并注册，您将获得10元代金券</p>
        <p class="tcenter big13 maincolor">
            <span class="bind" @click="bind">关注并绑定</span>
        </p>
        <footer class="small10 bbox">
            <p class="big20 blacklower">详细规则</p>
            <p style="margin-top:1.3rem;">活动内容:</p>
            <p>1. 通过发送 邀请链接 给微信好友，推荐微信好友注册并绑定佰医汇公号；</p>
            <p>2. 每邀请一个好友注册成功可获得2张5元代金券（不限使用范围，有效期3个月）；</p>
            <p>3. 好友注册成功也可获得2张5元代金券（不限使用范围，有效期3个月）；</p>
            <p>4. 带动更多的公众注册体验佰医汇公众号。</p>
            <p style="margin-top:1.7rem;">活动规则:</p>
            <p>1、邀请者发送邀请二维码（邀请链接）给亲友，让亲友识别/扫描“佰医汇”公众号二维码；</p>
            <p>2、被邀请的亲友通过二维码关注“佰医汇”微信公众号并进行个人信息注册后，邀请者即可获得10元代金券，被邀请者也将获得10元代金券；</p>
            <p>3、以往未关注使用过“佰医汇”微信公众号的朋友才属于有效邀请用户；</p>
            <p>4、邀请成功后，双方可在个人中心查看到代金券；</p>
            <p>5、用户在使用代金券时，只能一次使用一张。</p>
            <p class="tcenter blacklower" style="margin-top:3.7rem;">佰医汇，一款无微不至的掌上医疗应用</p>
        </footer>
    </article>
</template>
<script>
    export default {
        data () {
            return {
                code: this.$route.query.code
            }
        },
        methods: {
            bind (){
                localStorage.setItem('_cache_invitCode_', this.code)
                this.$router.push('/main/info')
            }
        }
    }
</script>
<style  scoped lang="less">
    header {
        height:3.8rem;
        width: 100%;
        position: relative;
        img{
            width:23rem;
            position: absolute;
            top:50%;
            transform: translateY(-50%);
            left: 0.8rem;
        }
        span{
            position: absolute;
            right: .6rem;
            background: #0186d1;
            padding: .2rem .6rem;
            border-radius: .3rem;
            top: 50%;
            transform: translateY(-50%);
        }
    }
    .content {
        width: 100%;
        background: url("../../../assets/img/sharepage/sharelinkbg.png");
        background-size: 100% 100%;
        padding: 0 3.07rem 3rem;
        background-repeat: no-repeat;
        .title {
            font-size: 2.08rem;
            padding: 3.9rem 0 1.16rem 0;
        }
    }
    .tab-item {
        text-align: center;
        img {
            width:2.7rem;
            height:2.7rem;
            margin:auto;
        }
        span {
            display:block;
            margin-top:.67rem;
            font-size: .75rem;
            color: #fff;
        }
    }
    .follow {
        margin:2.7rem 0 1.7rem;
    }
    .bind {
        border:1px solid #0186d1;
        display: inline-block;
        color: #0186d1;
        border-radius:.3rem;
        height: 3.2rem;
        width: 13rem;
        line-height: 3.2rem;
    }
    footer {
        background: #f9f9f9;
        margin-top:2.2rem;
        padding:1.7rem 1.7rem 2.7rem;
        color: #9196a1;
        p{
            margin-bottom: .3rem;
            line-height: 1.3rem;
        }
    }
</style>
