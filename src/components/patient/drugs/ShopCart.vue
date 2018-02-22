<template>
    <article style="padding-bottom: 7rem">
        <div class="drugstore flex big14 blacklower bbox bgfff w100">
            <span class="flex_1">药品提供</span>
            <span>爱心大药房</span>
        </div>
        <section style="margin-bottom:.67rem;" class="bgfff big14 blacklower">
            <p class="title" @click="getAddress" v-if="!address.userName">点击选择或修改收货地址</p>
            <div class="address-detail big13" @click="getAddress" v-else>
                <p>{{this.address.userName}}&ensp;{{this.address.telNumber}}</p>
                <p>{{this.address.provinceName}}&ensp;{{this.address.cityName}}&ensp;{{this.address.countryName}}{{this.address.detailInfo}}</p>
            </div>
        </section>
        <section style="margin-bottom:.67rem;">
            <p class="flex title bbox bgfff big14 blacklower">
                <span class="flex_1">购药清单</span>
                <span class="big13 maincolor" :class="{'checked': isChecked}" @click="changeSelectAll(!isChecked)">
                    <i class="check"></i> 全选
                </span>
            </p>
            <dl>
                <dd v-for="(item, ind) in drugs" :key="ind" class="bgfff drug-item">
                    <div class="flex item-top bbox relative">
                        <div class="top-left" @click="changeStatus(item)" :class="{'checked': item.isSelected}">
                            <i class="check"></i>
                        </div>
                        <div class="flex_1 flex" style="align-items: center">
                            <img :src="`${imgsrc(item.detail.pics.length && item.detail.pics[0].picUrl, 'nodrug', '300')}`" style="width:4.5rem;height: 4.5rem; object-fit: contain;margin-right:.8rem;">
                            <div class="ohidden big13 blacklower flex_1 h100">
                                <p>{{item.detail.drugName}}</p>
                                <p class="flex">
                                    <span class="flex_1 ohidden whitespace">{{item.detail.drugSpec}}</span>
                                    <span class="big16" style="color:#f98f38;">￥{{item.detail.price}}</span>
                                </p>
                            </div>
                            <span class="delbtn" @click="del(ind)">删除</span>
                        </div>
                    </div>
                    <div class="flex item-bottom bbox big13 blacklower">
                        <span class="flex_1">购买数量</span>
                        <p class="buycount flex">
                            <span @click="substract(item)" class="addorsub iconfont icon-jian flex_1" :class="{'disabled': item.num <= 1}"></span>
                            <span class="number flex_1">{{item.num}}</span>
                            <span @click="add(item)" class="addorsub iconfont icon-jiahao flex_1" :class="{'disabled': item.num >= 99}"></span>
                        </p>
                    </div>
                </dd>
            </dl>
        </section>
        <section class="bgfff big14 blacklower coupons">
            <p class="cou-list">优惠券</p>
            <div class="coupons-list">
                <div class="noCoupons bgfff tcenter" style="padding: 1rem 0">
                    <img src="../../../assets/img/indexInfo/coupon-empty.png">
                    <p>暂无优惠券可用</p>
                </div>
            </div>
        </section>
        <footer class="fixed bottom left right bbox flex">
            <span class="flex_1">￥{{computePrice}}</span>
            <span class="pay fff big16 tcenter" @click="submit">
                <i class="iconfont icon-weixinzhifu fff big18"></i>&ensp;微信支付
            </span>
        </footer>
    </article>
</template>
<script>
    import { imgsrc } from '@filters'
    import { WxJsPay } from '@plugins/api';
    export default{
        data(){
            return {
                address:{
                    userName:'',
                    postalCode:'',
                    provinceName:'',
                    cityName:'',
                    countryName:'',
                    detailInfo:'',
                    nationalCode:'',
                    telNumber:''
                }
            }
        },
        created () {
            this.$nextTick(() => {
                document.documentElement.scrollTop = window.pageYOffset = document.body.scrollTop = 0
            })
            sessionStorage.getItem('_catch_shopcar_address_') && (this.address = JSON.parse(sessionStorage.getItem('_catch_shopcar_address_')))
        },
        computed:{
            drugs() {
                return this.$store.getters['shopCart/getProds'];
            },
            computePrice() {
                return this.$store.getters['shopCart/getTotalPrice'];
            },
            elseDrugs() {
                return this.$store.getters['shopCart/getElseDrugs'];
            },
            selectedDrugs() {
                return this.$store.getters['shopCart/getSelectedDrugs'];
            },
            isChecked (){
                return this.$store.getters['shopCart/isSelectedAll']
            }
        },
        methods:{
            imgsrc,
            add(item){
                if(item.num >= 99) return;
                this.$store.dispatch('shopCart/saveNewChangedMoreProd', item);
            },
            substract(item){
                if(item.num <= 1) return;
                this.$store.dispatch('shopCart/saveNewChangedLessProd', item)
            },
            del(index){
                let that = this;
                this.$vux.confirm.show({
                    content: '亲，您确定要删除吗？',
                    cancelText: '取消',
                    confirmText: '确定',
                    onConfirm(){
                      that.$store.dispatch('shopCart/delProd', index);
                    }
                })
            },
            changeSelectAll(val){
                this.$store.dispatch('shopCart/saveChangedStatus', val);
            },
            changeStatus(item){
                this.$store.dispatch('shopCart/saveChangedProdStatus', item);
            },
            toast (text){
                this.$vux.toast.show({
                    position: 'top',
                    type: 'text',
                    width: 'auto',
                    text: text
                })
            },
            submit(){
                let newArr = this.selectedDrugs
                let obj = {}
                let submitDrug = newArr.map( item => {
                    return {
                        drugInnerCode: item.id,
                        count: item.num
                    }
                })
                obj.drugs = submitDrug;
                obj.address = this.address;
                if(!submitDrug.length) return this.toast('请选择购买药品')
                if(!this.address.userName) return this.toast('请选择收货地址')
                this.$vux.loading.show({
                    text: '正在提交'
                });
                this.$http.post(this.$urls.DRUGSUBMIT, {
                    openid:this.$store.state.openid,
                    drugAndAddress:JSON.stringify(obj),
                    couponId:''
                }, this).then(d => {
                    this.$vux.loading.hide()
                    this.toast('提交成功')
                    WxJsPay(this, d, this.redirect.bind(this))
                });
            },

            redirect (){
                let that = this
                this.$vux.alert.show({
                    title: '支付成功',
                    onHide () {
                        that.$router.replace('/orderlist/1');
                    }
                })
                // 将剩余的商品存到state中
                this.$store.commit('shopCart/saveProds', this.elseDrugs);
            },
            //获取收获人的地址
            getAddress(){
                let that  = this;
                let wx = this.$wechat;
                wx.ready(() => {
                    wx.openAddress({
                        success: function (res) {
                            that.address.userName = res.userName; // 收货人姓名
                            that.address.postalCode = res.postalCode; // 邮编
                            that.address.provinceName = res.provinceName; // 国标收货地址第一级地址（省）
                            that.address.cityName = res.cityName; // 国标收货地址第二级地址（市）
                            that.address.countryName = res.countryName; // 国标收货地址第三级地址（国家）
                            that.address.detailInfo = res.detailInfo; // 详细收货地址信息
                            that.address.nationalCode = res.nationalCode; // 收货地址国家码
                            that.address.telNumber = res.telNumber; // 收货人手机号码
                        }
                    })
                })
            }
        },
        beforeDestroy () {
            this.address.userName && sessionStorage.setItem('_catch_shopcar_address_', JSON.stringify(this.address))
        }
    }
</script>
<style lang="less" scoped>
    @import '../../../assets/css/var';
    .disabled{ color: #ccc }
    .drugstore {
        height: 4rem;
        padding: 0 1rem;
        line-height: 4rem;
        margin-bottom: .9rem;
    }
    .title {
        height: 3.25rem;
        line-height: 3.25rem;
        padding: 0 1rem;
        border-bottom: 1px solid #eee;
    }
    .address-detail {
        padding: 1rem;
        p:first-child {
            margin-bottom: .5rem;
        }
    }
    .item-top {
        height: 7rem;
        padding: 1.16rem 1rem 1.2rem;
        align-items: center;
        p{
            &:first-child { margin: .4rem 3rem 0.4rem 0;}
        }
        .top-left {
            margin-right: 0.625rem
        }
    }
    .item-bottom {
        height: 3.25rem;
        line-height: 3.25rem;
        border-top: 1px solid #eee;
        margin-left: 3rem;
        padding: 0 1rem 0 .3rem;
        align-items: center;
    }
    .check{
        display: inline-block;
        width: 1.4rem;
        height: 1.4rem;
        border-radius: 50%;
        background: url('../../../assets/img/drugs/checkdrug.png') center no-repeat;
        background-size: cover !important;
        vertical-align: middle;
    }
    .checked{
        .check{
            background: url('../../../assets/img/drugs/checkeddrug.png') center no-repeat;
        }
    }
    .delbtn {
        position:absolute;
        top: 1.125rem;
        right: 1rem;
        color: #ff9292;
        border: 1px solid #ff9292;
        padding: .1rem .4rem;
        border-radius: .25rem;
    }
    dd + dd{ border-top:1px solid #eee;}
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
    .coupons {
        .cou-list { padding: 1.25rem 1rem;}
        .coupons-list { min-height: 9.8rem;}
        .noCoupons{
            color: #bbbbbb;
            margin-bottom: 1rem;
            img{ width: 3.5rem; }
        }
    }
    footer {
        height:5.33rem;
        line-height:5.33rem;
        background:#fff;
        font-size: 1.75rem;
        padding: 0 1rem;
        border-top: 1px solid #eee;
        align-items: center;
        .pay{
            background: #229848;
            width: 9.54rem;
            height: 2.9rem;
            line-height: 2.9rem;
            border-radius: 3rem;
            border-top: 1px solid #e5e5e5;
        }
    }
</style>
