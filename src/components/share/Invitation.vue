<template>
    <div class="fixed mark tcenter top left right bottom relative">
        <div class="mark-box bgfff absolute relative tcenter">
            <i class="absolute img"></i>
            <p class="big15" style="margin-top: 9rem; color: #00a9fe">邀请好友，您和好友各得</p>
            <p class="price">10元</p>
            <p class="big15" style="color: #58bcfe">平台服务代金券</p>
            <router-link to="/invitefriend" class="fff block big16 tcenter">立即邀请</router-link>
            <i class="iconfont icon-guanbi fff block absolute" @click="$emit('input', false)"></i>
        </div>
    </div>
</template>
<style lang="less" scoped>
    .mark {
        background: rgba(0, 0, 0, 0.5);
        z-index: 10;
    }
    .mark-box{
        width: 20.8rem;
        height: 23.5rem;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -44%);
        border-radius: 1rem;
        .img{
            width: 18rem;
            height: 16.67rem;
            background: url(../../assets/img/sharepage/people.png) no-repeat center;
            background-size: cover;
            top: -8.5rem;
            left: 50%;
            margin-left: -9rem
        }
        .price{
            background: url(../../assets/img/sharepage/price-bg.png) no-repeat center;
            background-size: cover;
            height: 2.7rem;
            line-height: 2.7rem;
            color: #ff6464;
            margin: 1rem 3.6rem;
            font-size: 2.4rem 
        }
        a{
            margin: 0 auto;
            width: 13.3rem;
            border-radius: 3.5rem;
            height: 3.25rem;
            line-height: 3.25rem;
            margin-top: 1.4rem;
            background: linear-gradient(#ffc438, #ffc231, #feb300);
        }
        .icon-guanbi{
            font-size: 3rem;
            bottom: -5rem;
            left: 50%;
            transform: translate(-50%)
        }
    }
    
</style>