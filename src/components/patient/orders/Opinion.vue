<template>
    <div class="opinion">
        <header class="flex big14 gray">
            <div class="flex_1 tabs" :class="{'selected': pageid == 0}" @click="pageid=0">
                <span class="tab">
                    专家会诊报告(电子版)
                </span>
            </div>
            <div class="flex_1 tabs" :class="{'selected': pageid == 1}" @click="pageid=1">
                <span class="tab">
                    专家会诊报告(手录版)
                </span>
            </div>
        </header>
        <section v-if="pageid == 0">
            <h3>诊断意见</h3>
            <p class="gray">{{conresult || '暂无'}}</p>
            <h3>治疗方案</h3>
            <p class="gray">{{treatplan || '暂无'}}</p>
            <h3>注意事项</h3>
            <p class="gray">{{attentions || '暂无'}}</p>
            <footer>
                <div class="title big13 maincolor">
                    <span>专家签名</span>
                </div>
                <div class="imgarea">
                    <img v-if="signature" :src="imgsrc(signature, '500', 'auto')" alt="签名">
                </div>
            </footer>
        </section>
        <section v-if="pageid == 1">
            <div class="reportarea">
                <img v-if="reportImg" :src="imgsrc(reportImg, '500', 'auto')" alt="报告单">
            </div>
        </section>
    </div>
</template>
<script>
    import { imgsrc } from '@filters'
    export default {
        data () {
            return {
                pageid: 0,
                conresult: '',
                treatplan: '',
                attentions: '',
                signature: '',
                reportImg: ''
            }
        },
        created () {
            this.$http.get(this.$urls.GAINVEDIOINFO, { oid: this.$route.params.id, otype: this.$route.params.type })
            .then(d => {
                this.conresult = d.conresult
                this.treatplan = d.treatplan
                this.attentions = d.attentions
                this.signature = d.signature
                this.reportImg = d.reportImg
            })
        },
        methods: {
            imgsrc
        }
    }
</script>
<style lang="less" scoped>
    @import '../../../assets/css/var';
    .tabs{
        background: #fff; text-align: center;
        .tab{
            display: inline-block;
            line-height: 4.3rem;
        }
        &.selected{
            .tab{
                color: @main-color;
                position: relative;
                &:before{
                    content: "";
                    position: absolute;
                    bottom: 0;left: 0;
                    height: 4px; width: 100%;
                    background: @main-color;
                }
            }
        }
        & + .tabs{
            position: relative;
            &:after{
                .setLeftLine(#DCDCDC);
                top: 1.5rem;
                bottom: 1.5rem;
            }
        }
    }
    section{
        padding: 1rem;
        h3{
            font-size: 1rem; font-weight: 400; line-height: 1;
            padding: .58rem 0;
            & ~ h3{
                margin-top: 1.08rem;
            }
        }
        p{
            background: #fff; min-height: 3rem; box-sizing: border-box;
            font-size: 1.083rem; color: @gray-color-lower; line-height: 1.6rem; padding: .6rem;
        }
    }
    footer{
        margin-top: 2.6rem;
    }
    .title{
        position: relative;
        padding: 1.25rem;
        &:after{
            content: "";
            position: absolute;
            top: 50%; left: 0; width: 100%;
            height: 1px; background: @main-color;
        }
        span{
            display: inline-block;
            padding: 0 .583rem;
            background: @main-bg-color;
            position: relative; z-index: 2;
        }
    }
    .imgarea{
        height: 8.875rem; text-align: center;
        background-color: #fff;
        img{
            height: 100%; margin: 0 auto;
        }
    }
    .reportarea{
        background: #D2D2D2;
        margin-top: 3rem;
        padding: 1rem; text-align: center;
        img{
            width: 100%;
        }
    }
</style>