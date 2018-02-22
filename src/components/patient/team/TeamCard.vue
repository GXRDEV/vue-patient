<template>
    <article class="bgfff flex column h100">
        <header class="tcenter">
            <i class="thumb radius50 bgcove" :style="`background-image: url(${imgsrc(item.logoUrl, 'teammain')})`"></i>
            <h3 class="pf-regular" style="font-weight: 400">{{item.teamName}}</h3>
            <p class="big13 depname">{{item.teamDepName || '暂无'}}</p>
            <p class="big13 specialty">擅长：{{item.speciality || '暂无'}}</p>
        </header>
        <section class="relative flex_1 ohidden" id="canvasOuter">
            <img :src="imgsrc(item.erweimaUrl, 'noCard', 'auto')" class="absolute top left bottom right" alt="">
            <i class="thumb radius50 head absolute" :style="`background-image: url(${imgsrc(item.logoUrl, 'teammain')});width:${r};height:${r};`"></i>
        </section>
        <footer class="tcenter big13 flex_1">
            <p>打开微信扫一扫，关注我们</p>
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
                item: {
                    teamName: '■■■',
                    teamDepName: '■■■',
                    speciality: '■■■■■■■■■■■■■■■■■■'
                },
                r: '3vw'
            }
        },
        created () {
            // 获取医生基本信息
            this.id && this.$http.get( this.$urls.GAINTEAMBASICINFOWITHERWEIMA, { teamId: this.id }).then(d => {
                this.item = d.team || {}
            })
        },
        mounted () {
            let outer = document.getElementById('canvasOuter')
            let w = outer.clientWidth
            let h = outer.clientHeight
            this.r = (h > w ? w * 0.15 : h * 0.15) + 'px'
        },
        methods: {
            imgsrc
        }
    }
</script>

<style scoped lang="less">
    @import '../../../assets/css/var';
    header{
        box-sizing: border-box;
        padding: 1.2rem 2.2rem .5rem;
        i{
            width: 3rem;
            height: 3rem;
        }
        h3{
            font-size: 2rem;
            margin: .25em auto;
        }
        .specialty{
            overflow: hidden; color: #9296A1;
            .setMultEllipsis(1);
            margin: .25em auto;
        }
        .depname{
            display: inline-block;
            background: #9296A1;
            color: #fff;
            padding: 2px .5em;
            border-radius: 2px;
            margin: .25em auto;
        }
    }
    #canvasOuter{
        margin: 1em 0;
        flex: 0 1 70vw;
        img{
            margin: auto;
            height: 100%;
            max-width: 70%;
            object-fit: contain;
            z-index: 1;
        }
        .head{
            width: 0; height: 0; z-index: 2;
            border: 3px solid #fff; background-size: cover;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
    footer{
        margin: 0 1rem 1.2rem;
    }
</style>
