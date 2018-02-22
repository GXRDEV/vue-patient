<template>
    <div class="h100 contact">
        <header>
            <i class="thumb bgcove"></i>
            <p class="big13 text">
                佰医汇（Specialist Service）是一款提供在线问诊和远程医疗的移动医疗平台公众号。佰医汇提供优质的医生在线咨询和全国名院专家的远程视频会诊服务，让您足不出城，即可直接与全国名院专家在线完成医疗服务。
            </p>
        </header>
        <section>
            <div class="con">
                <p>微信公众号</p>
                <p class="maincolor">ebaiyihui</p>
            </div>
            <div class="con">
                <p>官方客服邮箱</p>
                <p><a href="mailto:kefu@51zjh.com" class="maincolor">kefu@ebaiyihui.com</a></p>
            </div>
            <div class="con">
                <p>联系客服</p>
                <p><a href="tel:400-631-9377" class="maincolor">400-631-9377</a><span class="gray">（点击拨打）</span></p>
            </div>
        </section>
        <footer class="footer tcenter fixed">
            <p class="flex jcenter">
                <a href="https://develop.ebaiyihui.com/">官方网站</a><span>|</span>
                <a href="https://develop.ebaiyihui.com/app.jsp#home_statichtm/agreement">服务协议</a>
            </p>
            <p class="gray small10">Copyright@2015-2017 Baiyihui</p>
        </footer>
    </div>
</template>
<style lang="less" scoped>
    @import '../../../assets/css/var';
    header{
        background: #fff;
        padding: 3.07rem 0 3.46rem;
        i{
            display: block;
            width: 6.3rem;
            height: 2.2rem;
            margin: 0 auto;
            background: url("../../../assets/img/zjh.png") no-repeat center center;
            background-size: cover
        }
        .text{
            padding: 1.47rem @body-margin 0;
            line-height: 1.6;
            text-indent: 2rem
        }
    }
    section{
        background: #fff;
        padding: 1.8rem @body-margin;
        margin-top: .75rem;
    }
    .con{
        p{
            &:first-child{
                padding-bottom: 1rem;
                color: #999;
            }
        }
        & + .con{
            margin-top: 1.8rem;
        }
    }
    .footer{
        width: 100%;
        color: #666; line-height: 1;
        bottom: 1.15rem;
        a{
            color: #666;
            padding: 0 1.53rem;
            font-size: 1.08rem
        }
        p:last-child{
            padding-top: 1.53rem;
        }
    }
</style>
