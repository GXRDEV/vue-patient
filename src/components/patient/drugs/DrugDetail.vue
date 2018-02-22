<template>
    <article class="drugdetail">
        <div class="drugpic tcenter bgfff">
            <img :src="pic.picUrl" v-if="hasImg && pic.picUrl">
            <img src="../../../assets/img/drugs/nodrug.png" alt="" v-if="!hasImg">
        </div>
        <section class="drugtitle blacklower bbox bgfff">
            <p class="big16">{{drug.drugName}}</p>
            <p class="flex" style="align-items: baseline">
                <span class="flex_1 big16">{{drug.drugSpec}}</span>
                <span class="big20" style="color:#f98f38;">￥{{drug.price}}</span>
            </p>
        </section>
        <p class="free-item bbox base12">
            <img src="../../../assets/img/drugs/free-icon.png"><span style="margin-right:1.75rem;">包邮</span>
            <img src="../../../assets/img/drugs/quality-icon.png">正品保障
        </p>
        <section class="drugdes bgfff bbox">
            <h3 class="big19 blacklower">药品详情</h3>
            <dl  class="drug-content">
                <dd><p class="title">【药品成分】</p><p class="content">{{drug.drugComponent}}</p></dd>
                <dd><p class="title">【用药禁忌】</p><p class="content">{{drug.drugAvoid}}</p></dd>
                <dd><p class="title">【主治功能】</p><p class="content">{{drug.drugFunction}}</p></dd>
                <dd><p class="title">【用法用量】</p><p class="content">{{drug.drugUseMethod}}</p></dd>
                <dd><p class="title">【药品性状】</p><p class="content">{{drug.drugXZ}}</p></dd>
                <dd><p class="title">【不良反应】</p><p class="content">{{drug.drugUnEffect}}</p></dd>
                <!--<dd><p class="title">【互相作用】</p><p class="content">{{drug.drugName}}</p></dd>-->
                <dd><p class="title">【注意事项】</p><p class="content">{{drug.drugAttention}}</p></dd>
                <dd><p class="title">【批准文号】</p><p class="content">{{drug.drugLiceNum}}</p></dd>
            </dl>
        </section>
        <footer class="fixed bottom left right flex small11">
            <div class="flex_1 tcenter tab-item">
                <label><img src="../../../assets/img/drugs/kefu.png"></label>
                <span><a href="tel:400-631-9377" style="color:#999;">咨询热线</a></span>
            </div>
            <div class="flex_1 tcenter tab-item relative" @click="goCart">
                <label><img src="../../../assets/img/drugs/empty-cart.png"></label>
                <span>查看购物车</span>
                <span class="absolute count fff" v-if="getNum" :class="{'small-font':getNum>=10}">{{getNum > 99 ? '99+' : getNum}}</span>
            </div>
            <div class="flex_3 tcenter fff addcart big16" @click="isDrug < 99 && (isMask=true)" :class="{'noDrug': isDrug >= 99}">加入购物车</div>
        </footer>
        <section class="mark fixed" v-if="isMask" @click.self="isMask = false">
            <div class="mark-box bgfff absolute">
                <div class="bbox big13 blacklower" style="padding:1rem;height:6.16rem;">
                    <img :src="`${imgsrc(pic.picUrl, 'nodrug', '300')}`" class="fleft">
                    <div class="bbox ohidden">
                        <p class="whitespace" style="margin:.8rem 0 .4rem;">{{drug.drugName}}</p>
                        <p class="flex">
                            <span class="flex_1">{{drug.drugSpec}}</span>
                            <span class="big16" style="color:#f98f38;">￥{{drug.price}}</span>
                        </p>
                    </div>
                </div>
                <div class="flex" style="padding:0 1rem;border-top:1px solid #eee; height:3.16rem;line-height:3.16rem;align-items: center;">
                    <span class="flex_1">购买数量</span>
                    <p class="flex buycount">
                        <span @click="substract" class="addorsub iconfont icon-jian flex_1" :class="{'disabled': num <= 1}"></span>
                        <span class="number flex_1">{{num}}</span>
                        <span @click="add" class="addorsub iconfont icon-jiahao flex_1" :class="{'disabled': num >= 99 || isDrug >= 99 || num + isDrug >= 99}"></span>
                    </p>
                </div>
                <button @click="addCart" class="big16">确认</button>
            </div>
        </section>
    </article>
</template>
<script>
    import { imgsrc } from '@filters'
    export default {
        name:'drugdetail',
        created (){
            this.$http.get(this.$urls.DRUGDETAIL, { drugInnerCode: this.id }).then(d=>{
                this.drug = d.drug || {};
                !d.drug.pics.length && (this.hasImg = false)
                d.drug.pics.length && (this.pic = d.drug.pics[0])
            });
            this.shoppingCart = this.$store.state.shopCart.prods.find( obj => obj.id == this.id )
            this.shoppingCart && (this.isDrug = this.shoppingCart.num)
        },
        methods :{
            imgsrc,
            goCart(){
                this.$router.push({path:'/shopcart'})
            },
            add (){
                let nums = this.num + this.isDrug
                if(this.num >= 99 || this.isDrug >= 99 || nums >= 99) return;
                this.num ++
            },
            substract (){
                if(this.num<=1) return;
                this.num --
            },
            addCart(){
                this.isMask = false;
                this.$store.dispatch('shopCart/addProductOrNum',{
                    id: this.id,
                    num: this.num,
                    detail: this.drug,
                    isSelected: true
                })
                this.$router.push({path:'/shopcart'})
            }

        },
        computed:{
            getNum(){
                return this.$store.getters['shopCart/getProdsCount'];
            }
        },
        data (){
            return{
                drug: {},
                id: this.$route.params.id,
                pic: '',
                isMask: false,
                num: 1,
                shoppingCart: [],
                isDrug: 0,
                hasImg: true
            }
        }
    }
</script>
<style lang="less" scoped>
    @import '../../../assets/css/var';
    .androidcls .count{ line-height: 1.4rem !important}
    .noDrug{ background: #999 !important}
    .drugpic {
        width: 100%;
        height: 20rem;
        padding: 2rem;
        box-sizing: border-box;
        img {
            height: 100%;
            width: 100%;
            object-fit: contain
        }
    }
    .drugtitle {
        padding: 1.167rem 1.25rem 0.3rem 1rem;
        border-top: 1px dashed #eee;
    }
    .free-item {
        height: 2.7rem;
        background:#f6f6f6;
        line-height: 2.7rem;
        padding-left: 1rem;
        color: #7f7f7f;
        img {
            width: 1.25rem;
            height: 1.25rem;
            vertical-align: text-top;
            margin-right:.33rem;
        }
    }
    .drugdes {
        margin-top:.5rem;
        h3 {
            font-weight:normal;
            height:3.83rem;
            line-height: 3.83rem;
            border-bottom: 1px solid #eee;
            padding-left:1rem;
        }
        .drug-content {
            padding-bottom: 4.1rem;
        }
        dd {
            padding:.95rem 1rem;
            font-size:1rem;
            color: #565656;
            .title {
                margin-bottom:.5rem;
                line-height:1;
            }
            .content {
                line-height: 1.6;
            }
        }
    }
    footer {
        height:3.625rem;
        line-height:3.625rem;
        background:#fff;
        color: #999;
        .addcart {
          background:#fa8220;
        }
        .tab-item {
            border-top: 1px solid #eee;
            &:first-child {
                border-right:1px solid #eee;
            }
            label { .dflex();}
            img {
                width: 1.33rem;
                height: 1.33rem;
                margin:.4rem auto .25rem;
            }
            span {
              line-height:1;
              display:block;
            }
            span.count {
              background:red;
              top:.2rem;
              right:1.2rem;
              width:1.2rem;
              height:1.2rem;
              line-height:1.3rem;
              border-radius: 50%;
            }
            span.small-font {
                font-size: .75rem !important;
            }
        }
    }

    .mark {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        top: 0;
        z-index: 10;
        .mark-box {
            width: 100%;
            box-sizing: border-box;
            bottom: 0;
            img {
                width: 4.58rem;
                height: 4.58rem;
                object-fit: contain;
                margin-right: .8rem;
            }
            .disabled{ color: #ccc }
            .buycount {
                height: 2rem;
                line-height: 2rem;
                border: 1px solid #eee;
                .number {
                    padding: 0 1rem;
                    text-align: center;
                    line-height: 2.1rem;
                    border-left: 1px solid #eee;
                    border-right: 1px solid #eee
                }
                .addorsub {
                    padding: 0 0.35rem;
                }
            }
        }
        button {
          width: 100%;
          height: 4.16rem;
          background:#fa8220;
          color:#fff;
          border:none;
        }
    }
</style>
