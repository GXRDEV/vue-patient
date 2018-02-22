<template>
    <article class="bgfff flex column h100">
        <header class="relative bbox">
            <div class="head relative">
                <div class="head-img absolute">
                    <i class="thumb radius50 bgcove" :style="`background-image: url(${imgsrc(doc.listSpecialPicture, 'user-head')})`"></i>
                    <span class="absolute" :class="doc.erweimaUrl ? 'authen' : 'no-authen'"></span>
                </div>
                <div class="head-content">
                    <h3 class="big16">{{doc.specialName}}</h3>
                    <template v-if="!h414">
                        <p>{{doc.duty}}<span v-if="doc.duty"> / </span>{{doc.depName}}</p>
                        <p>{{doc.hosName}}</p>
                    </template>
                    <p class="specialty">擅长：{{doc.specialty || '暂无'}}</p>
                    <img src="../../../assets/img/aboutdoc/card-bg.png" alt="" class="absolute right" style="width: 6rem; top: 50%; transform: translate(0, -50%)">
                </div>
            </div>
        </header>
        <section class="flex_1 relative ohidden flexContain" id="flexContain">
            <div class="card bgfff absolute" id="canvasOuter">
                <img :src="imgsrc(doc.erweimaUrl, 'notAudited', 'auto')" alt="">
                <i v-if="doc.erweimaUrl" class="thumb radius50 absolute card-img" :style="`background-image: url(${imgsrc(doc.listSpecialPicture, 'doc-head')});width:${r};height:${r}`"></i>
            </div>
        </section>
        <footer v-if="!h414" class="tcenter small10 bgfff">
            <p v-if="!h480">这是我的个人主页</p>
            <p>打开微信扫一扫或长按识别二维码</p>
            <p v-if="!h480">可随时向我咨询</p>
            <i v-if="!h440" class="foot-icon"></i>
        </footer>
    </article>
</template>
<script>
    import { imgsrc } from '@filters'
    export default {
        name: 'doccard',
        data () {
            return {
                id: this.$route.params.id,
                doc: {
                    specialName: '■■■',
                    duty: '■■■',
                    depName: '■■■',
                    hosName: '■■■■■■■■■',
                    specialty: '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■'
                },
                h: window.innerHeight,
                r: '3vw'
            }
        },
        watch: {
            ['doc.specialName'] () {
                this.setImg()
            }
        },
        created () {
            // 获取医生基本信息
            this.id && this.$http.get( this.$urls.GAINDOCBASEINFO, { docid: this.id }).then(d => {
                if(!d.doc) return
                this.doc = JSON.parse(d.doc)
            })
            this.setImg()
        },
        mounted () {
            window.addEventListener('resize', this.setImg, false)
        },
        beforeDestroy () {
            window.removeEventListener('resize', this.setImg, false)
        },
        computed: {
            h480 () {
                return this.h < 480
            },
            h440 () {
                return this.h < 440
            },
            h414 () {
                return this.h <= 414
            }
        },
        methods: {
            imgsrc,
            setImg () {
                this.h = window.innerHeight
                window.setTimeout(() => {
                    this.h = window.innerHeight
                    let flex1 = document.getElementById('flexContain')
                    let img = document.getElementById('canvasOuter')
                    let w = flex1.clientWidth
                    let h = flex1.clientHeight
                    let maxw = w * 0.6
                    let lower = h > w ? w : h
                    lower = (lower > maxw ? maxw : lower) * 0.9

                    img.style.height = img.style.width = lower + 'px'
                    this.r = lower * 0.15 + 'px'
                }, 180)
            }
        }
    }
</script>

<style scoped lang="less">
    @import '../../../assets/css/var';
    article{
        background: #fff url(../../../assets/img/aboutdoc/docmain-bg.png) no-repeat 0 0;
        background-size: 100% auto; 
    }
    .card{
        border-radius: .5rem;
        box-shadow: 0 .1rem .5rem #aaa;
        overflow: hidden;
        z-index: 2;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        img{
            width: 100%; height: 100%;
            object-fit: content;
        }
        .card-img{
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border: 3px solid #fff;
            width: 0; height: 0; z-index: 2;
            background-size: cover;
        }
    }
    .flexContain{
        &:after{
            content: "";
            height: 50%;
            background: #fff;
            position: absolute;
            bottom: -1px;
            left: 0; width: 100%;
            z-index: 1;
        }
    }
    .head{
        background: #f2f7ff;
        width: 86%; margin: 5em auto 1.2rem;
        border-radius: 1rem;
        .head-img{
            width: 5.5rem;
            height: 5.5rem;
            border-radius: 50%;
            left: 50%;
            margin-left: -3.125rem;
            margin-top: -3.125rem;
            box-shadow: 0 .1rem .8rem #797979;
            i{
                width: 100%;
                height: 100%;
            }
            span{
                background-size: cover !important;
                width: 1.7rem;
                height: 1.7rem; 
                border-radius: 50%;
                bottom: -.2rem;
                right: -.1rem
            }
            .authen{
                background: url(../../../assets/img/aboutdoc/authen.png) no-repeat center
            }
            .no-authen{
                background: url(../../../assets/img/aboutdoc/no-authen.png) no-repeat center
            }
        }
        .head-content{
            padding: 1.6rem 2.3rem;
            h3{
                padding-bottom: .3rem
            }
            p{
                color: #666;
                padding: .2rem 0
            }
            .specialty{
                margin-top: .6rem;
                color: @main-color;
                overflow: hidden;
                .setMultEllipsis(2);
                line-height: 1.8rem;
                word-wrap: break-word;
                word-break: break-all;
            }
        }
    }
    footer{
        padding: 1rem 0 .4rem; color: #666;
        p{
            line-height: 1.8rem
        }
        .foot-icon{
            display: inline-block;
            width: 5.8rem;
            height: 1.9rem;
            margin: .8rem;
            background: url('../../../assets/img/zjh.png') center no-repeat;
            background-size: cover
        }
    }
</style>
