<template>
    <div class="h100 bgfff flex column">
        <header>
            <router-link to="/search?types=drugs">
                <i class="iconfont icon-search maincolor"></i>&ensp;
                请输入药品名称
            </router-link>
            <div class="filter flex">
                <p class="flex_1 tcenter flex" @click="filterInd = 1" :class="{'maincolor': filterInd == 1 || (drugType && drugType!='全部分类'),'selected': filterInd == 1}">
                    <span class="flex_1 types" style="border-right: 0.5px solid #e5e5e5">
                        {{ drugType || '全部分类'}}&ensp;
                        <i class="iconfont icon-arrdown"></i>
                    </span>
                </p>
                <p class="flex_1 tcenter flex" @click="filterInd = 2" :class="{'maincolor': filterInd == 2 || priceName[price], 'selected': filterInd == 2 }">
                    <span class="flex_1">
                        {{ priceName[price] || '默认排序'}}&ensp;
                        <i class="iconfont icon-arrdown"></i>
                    </span>
                </p>
            </div>
        </header>
        <section class="flex_1 scroll relative">
            <div class="mark flex column absolute left right bottom" style="top: -1px" v-if="filterInd != 0"  @click="filterInd = 0">
                <div class="w100 flex_1 scroll" :class="filterInd > 0 ? 'animated fadeInDownBig' : ''">
                    <div class="sort bgfff" v-show="filterInd==1">
                        <p v-for="(item, ind) in disease" :key="ind" @click="changeType(item)">
                            {{item.drugType}}<icon type="success-no-circle" v-if="drugType == item.drugType"></icon>
                        </p>
                    </div>
                    <div class="sort bgfff" v-show="filterInd==2">
                        <p v-for="(item, ind) in priceName" :key="ind" @click="price = ind">
                            {{item}}<icon type="success-no-circle" v-if="price == ind"></icon>
                        </p>
                    </div>
                </div>
                <div class="close tcenter" style="padding: 1rem 0">
                    <x-icon type="ios-close" size="35"></x-icon>
                </div>
            </div>
            <drug-list :price="price" :filterInd="filterInd" :drugType="drugType" @setsort="price = ''"></drug-list>
            <router-link class="shop-car thumb bgcove absolute" to="/shopcart">
                <span class="absolute right tcenter small11" v-if="getNum" :class="{'small8': getNum > 9}">{{getNum > 99 ? '99+' : getNum}}</span>
                <i class="h100 w100 block"></i>
            </router-link>
        </section>
    </div>
</template>
<script>
    import DrugList from './DrugList'
    import { Icon } from 'vux'
    export default {
        components: {
            DrugList, Icon
        },
        computed: {
            getNum(){
                return this.$store.getters['shopCart/getProdsCount'];
            }
        },
        data () {
            return {
                disease: [],
                filterInd: 0,
                price: this.$route.query.price || '',
                drugType: this.$route.query.drugType || '',
                priceName: {
                    'desc': '价格从高到低',
                    'asc': '价格从低到高'
                }
            }
        },
        created () {
            this.$http.get(this.$urls.DRUGTYPELIST).then( d => {
                this.disease = d.types.map( item => {
                    return item
                })
                this.disease.unshift({
                    drugType: '全部分类',
                    id: 0,
                    rank: 99
                })
            })
        },
        methods: {
            changeType (val){
                this.drugType = val.drugType
            }
        }
    }
</script>
<style lang="less" scoped>
    header{
        padding-top: 0.75rem;
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
        .filter{
            height: 3.58rem;
            background: #fafafa;
            color: #9196a1;
            margin-top: 0.75rem;
            border-bottom: 0.5px solid #eee;
            p{
                align-items: center;
                span{
                    height: 1.958rem;
                    line-height: 1.958rem;
                }
            }
            .selected i{
                &:before{
                    content: "\E605";
                }
            }
        }
    }
    .mark{
        background: rgba(0, 0, 0, 0.6);
        z-index: 1000;
        .sort{
            padding: 0.8rem 0 0.8rem 1rem;
            p{
                line-height: 1.5rem;
                padding: 0.8rem 1rem;
                i{
                    float: right;
                    padding-right: 1rem
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
    .mark{
        .close{
            padding: 1rem 0;
            .vux-x-icon {
                fill: #F43530;
            }
        }
        .weui-icon-success-no-circle{
            font-size: 1.5rem;
        }
    }

</style>


