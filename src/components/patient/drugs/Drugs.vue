<template>
    <div class="disease flex column h100">
        <header class="bgfff">
            <router-link to="/search?types=drugs">
                <i class="iconfont icon-search maincolor"></i>&ensp;
                请输入药品名称
            </router-link>
        </header>
        <section class="flex_1 scroll">
            <grid :cols="4" class="bgfff">
                <grid-item v-for="(easeItem, easeInd) in disease" :key="easeInd" :label="easeItem.drugType" :link="`/drugfilter?drugType=${easeItem.drugType}`">
                    <i slot="icon" class="thumb bgcove" :style="`background-image: url(${imgsrc(easeItem.iconUrl, '', '200')})`"></i>
                </grid-item>
                <grid-item label="全部分类" :link="`/drugfilter?drugType=全部分类`">
                    <i slot="icon" class="thumb bgcove all"></i>
                </grid-item>
            </grid>
            <div class="drugs">
                <router-link v-for="(drugsItem, drugsInd) in drugs" :key="drugsInd" class="bgfff drugs-main" :to="`/drugdetail/${drugsItem.drugInnerCode}`">
                    <img :src="`${imgsrc(drugsImg[drugsInd], 'nodrug', '300')}`" alt="">
                    <p class="drug-name">{{drugsItem.drugName}}</p>
                    <p class="flex">
                        <span class="flex_1" style="overflow: hidden; white-space: nowrap;text-overflow: ellipsis;">{{drugsItem.drugSpec}}</span>
                        <span class="maincolor">￥{{drugsItem.price}}</span>
                    </p>
                </router-link>
                <router-link to="drugfilter" class="maincolor tcenter inlineblock w100" style="margin: 0.5rem 0 1rem">查看全部药品</router-link>
            </div>
        </section>
        <router-link class="shop-car thumb bgcove fixed" to="/shopcart">
            <span class="absolute right tcenter small11" v-if="getNum" :class="{'small8': getNum > 9}">{{getNum > 99 ? '99+' : getNum}}</span>
            <i class="h100 w100 block"></i>
        </router-link>
    </div>
</template>
<script>
    import { Grid, GridItem } from 'vux'
    import { imgsrc } from '@filters'
    export default {
        components: {
            Grid, GridItem
        },
        methods: {
            imgsrc
        },
        data () {
            return {
                disease: [],
                drugs: [],
                drugsImg: []
            }
        },
        computed: {
            getNum(){
                return this.$store.getters['shopCart/getProdsCount'];
            }
        },
        created () {
            this.$http.get(this.$urls.DRUGSLIST, { pageNo: 1, pageSize: 10 }).then( d => {
                this.drugs = d.drugs
                this.drugsImg = this.drugs.map( item => {
                    if(item.pics[0]) return item.pics[0].picUrl
                    return ''
                })
            })
            this.$http.get(this.$urls.DRUGTYPELIST).then( d => {
                d.types.map( (item, ind) => {
                    ind < 7 && this.disease.push(item)
                })
            })
        }
    }
</script>

<style lang="less" scoped>
    @import '../../../assets/css/var';
    .all{
        background: url(../../../assets/img/drugs/all.png) no-repeat center;
        background-size: cover;
    }
    header{
        padding: 0.54rem 0;
        a{
            height: 2.04rem;
            line-height: 2.04rem;
            color: #bfbfbf;
            margin: 0 1rem;
            border-radius: 3rem;
            display: block;
            background: #f6f6f6;
            padding-left: 0.5rem
        }
    }
    section{
        .drugs{
            margin: 0.91rem 0.83rem 0;
            .drugs-main{
                width: 50%;
                float: left;
                box-sizing: border-box;
                padding: 1.08rem 1.4rem;
                margin-bottom: 0.5rem;
                color: #000;
                &:nth-child(odd){
                    border-right: 0.25rem solid #eee;
                }
                &:nth-child(even){
                    border-left: 0.25rem solid #eee
                }
                img{
                    width: 100%;
                    height: 35vw;
                    object-fit: contain
                }
                .drug-name{
                    overflow: hidden;
                    margin: 0.3rem 0;
                    .setMultEllipsis(1)
                }
            }
        }
    }
    .shop-car{
        bottom: 2rem;
        right: 1.25rem;
        width: 4.6rem;
        height: 4.6rem;
        span{
            top: .3rem;
            background: red;
            color: #fff;
            border-radius: 50%;
            width: 1.2rem;
            height: 1.2rem;
            line-height: 1.3rem;
        }
        i{
            background: url(../../../assets/img/drugs/shop-car.png) center no-repeat;
            background-size: cover
        }

    }
</style>
<style lang="less">
    .disease{
        .weui-grids{ &:before{ display: none}; padding-bottom: 1.25rem}
        .weui-grid{
            &:before,&:after{ display: none}
            padding: 1.25rem 0 0;
            .weui-grid__icon{
                width: 3.95rem;
                height: 3.95rem;
                i{
                    width: 100%;
                    height: 100%;
                }
            }
            &:last-child{
                span{
                    color: #eca614
                }
            }
        }
    }
</style>


