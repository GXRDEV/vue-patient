<template>
    <div class="coupons fixed" v-if="visible" @click.self="closeFn">
        <div class="coupons-main coupons-color relative">
            <div class="top coupons-color absolute"></div>
            <div class="line fff tcenter absolute w100">
                <p class="big16">送您 {{lists.length}} 张送心意专属代金券</p>
                <p style="margin-top: .5rem;">赶快去给医生送心意吧</p>
            </div>
            <button @click="closeFn" class="closebtn"><i class="iconfont icon-guanbi"></i></button>
            <div class="coupons-list-main">
                <div class="bgfff coupons-list relative" v-for="(item, ind) in lists" :key="ind">
                    <span class="absolute list-top coupons-color"></span>
                    <span class="absolute list-bottom coupons-color"></span>
                    <div class="inner flex acenter jcenter">
                        <div class="inner-left">
                            <p>￥<span>{{item.couponPrice}}</span></p>
                            <p class="small9">满{{item.fullCutPrice}}元可用</p> 
                        </div>
                        <div class="inner-center flex_1 ohidden">
                            <p class="big15 whitespace">{{item.couponName}}</p>
                            <p class="small8 whitespace">{{item.startStr.split('-').join('.')}} - {{item.endStr.split('-').join('.')}}</p>
                        </div>
                        <div class="inner-right" v-if="more">
                            <router-link to="/main/my/mydoc" class="small10">立即使用</router-link>
                        </div>
                    </div>
                </div>
            </div>
            <footer>
                <router-link v-if="more" class="fff footer flex acenter" to="/mycoupons">
                    查看我的优惠券 <i class="iconfont icon-arrright small8"></i>
                </router-link>
            </footer>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'coupons',
        props: {
            lists: Array,
            more: {
                type: Boolean,
                default: true
            }
        },
        data () {
            return {
                visible: false
            }
        },
        watch: {
            lists (d) {
                this.visible = d.length > 0
            }
        },
        mounted () {
            this.visible = this.lists.length > 0
        },
        methods: {
            closeFn () {
                this.visible = false
                this.$emit('on-closed')
            }
        }
    }
</script>
<style lang="less" scoped>
    .coupons{
        background: rgba(0, 0, 0, 0.5);
        height: 100%;
        width: 100%;
        top: 0; z-index: 100;
        .coupons-main{
            max-width: 26rem;
            width: 90%;
            border-radius: 2rem;
            border-bottom-left-radius: .5rem;
            border-bottom-right-radius: .5rem;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
        .closebtn{
            position: absolute;
            top: 0.4rem;
            right: 0.6rem;
            background: transparent;
            border: 0;
            font-size: 2.4rem;
            color: #333;
        }
        .coupons-color{
            background: #F5B44E;
        }
        .top{
            height: 4.8rem;
            width: 4.8rem;
            top: -1.5rem;
            border-radius: 50%;
            left: 50%;
            margin-left: -2.4rem;
        }
        .line{
           border-bottom: 1px solid #edac47;
           border-radius: 50%;
           padding: 1.5rem 0;
           p:first-child{
               padding-bottom: .1rem
           }
        }
        .coupons-list-main{
            padding-top: 8.5rem;
            min-height: 13rem;
            .coupons-list{
                padding: .8rem 0;
                margin: .92rem 1.2rem;
                border-radius: .2rem
            }
            .inner-left{
                flex: 0 0 6rem;
                border-right: 1px dashed #ced1d6;
                text-align: center;
                padding: .8rem 0;
                p:first-child{
                    color: red;
                    padding-bottom: .2rem;
                    span{
                        font-size: 1.8rem;
                        font-weight: bold;
                    }
                }
            }
            .inner-center{
                padding-left: 1.2rem;
                p:last-child{
                    padding-top: .6rem;
                    font-size: .8rem;
                    color: #ced1d6
                }
            }
            .inner-right a{
                display: inline-block; white-space: nowrap;
                padding: .42rem .5rem;
                color: #fff;
                background: red;
                border-radius: 1.5rem;
                line-height: 1;
                margin: 0 .6rem 0 0;
            }
            .list-top{
                top: -.7rem;
                height: 1rem;
                width: 1rem;
                left: 5.5rem;
                border-radius: 50%;
            }
            .list-bottom{
                bottom: -.7rem;
                height: 1rem;
                width: 1rem;
                left: 5.5rem;
                border-radius: 50%;
            }
        }
        footer{
            text-align: right;
            padding: 1rem;
            a{
                justify-content: flex-end;
            }
        }
    }
</style>