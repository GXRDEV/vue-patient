<template>
    <div class="h100vh flex column couponPage">
        <header>
            <div class="tabs flex">
                <span class="flex_1 tcenter" @click="couponTab(0,noUseCoupons)" :class="{'checked': status == 0}">
                    <span>未使用({{noUseCoupons.length}})</span>
                </span>
                <span class="flex_1 tcenter" @click="couponTab(1,useCoupons)" :class="{'checked': status == 1}">
                    <span>使用记录({{useCoupons.length}})</span>
                </span>
                <span class="flex_1 tcenter" @click="couponTab(2,overCoupons)" :class="{'checked': status == 2}">
                    <span>已过期({{overCoupons.length}})</span>
                </span>
            </div>
        </header>
        <div class="couponmain">
            <div v-if="!coupons.length" class="coupon-empty">
                <i class="thumb bgcove"></i>
                <p>暂时没有可用券</p>
            </div>
            <div v-else class="item bbox" v-for="(item ,index) in coupons" :key="index">
                <div class="fff item-left bbox relative" :class="{'used-color':status== 1 || status== 2 ,'teamcolor':item.type==2&& status==0}">
                    <span class="spottop"></span>
                    <span class="spotbottom"></span>
                    <div class="flex column acenter jcenter h100">
                        <template v-if="item.type == 1">
                            <p class="moneytotal whitespace">
                                <i>￥</i>
                                <span class="money" :class="{'multnum': (item.couponPrice + '').indexOf('.') != -1}">{{ item.couponPrice }}</span>
                            </p>
                            <p class="fullprice small11 whitespace" :class="{'coloruse':status==0,'colorused':status==1||status==2}">满{{ item.fullCutPrice }}元可用</p>
                        </template>
                        <template v-if="item.type == 2">
                            <p class="moneytotal">
                                <span class="money" style="font-size:2.6rem;">免费</span>
                            </p>
                            <p class="fullprice small11">指定团队可用</p>
                        </template>
                        <template v-if="item.type == 3">
                            <p class="moneytotal">
                                <span class="money" style="font-size:1.6rem;">平台服务</span>
                            </p>
                        </template>
                    </div>
                </div>
                <div class="item-right bbox relative">
                    <div class="flex column jcenter h100">
                        <p class="big16" :class="{'margintop':item.type == 2 }">{{ item.couponName }}</p>
                        <p class="teaminfo whitespace">
                            <template v-if="item.type == 2">
                                <label></label>
                                {{item.teamName}}&ensp;{{item.docName}}医生&ensp;就诊人&ensp;{{item.patientName}}
                            </template>
                            &emsp;
                        </p>
                        <p class="time"> {{ item.startStr }} - {{ item.endStr }}</p>
                    </div>
                    <span v-if="status== 0 && item.type!=3" class="imuse fff absolute" :class="{'teamcolor':item.type == 2}" @click="jump(item)">立即使用</span>
                    <span v-else-if="status==1" class="used">已使用</span>
                    <span v-else-if="status==2" class="used">已过期</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
    name: 'mycoupons',
    data() {
        return {
            status: 0,
            noUseCoupons: '',
            useCoupons: '',
            overCoupons: '',
            coupons: ''
        }
    },
    computed: {
        ...mapState({
            userid: state => state.userid
        })
    },
    watch: {
        userid (v) {
            v && this.getDataList()
        }
    },
    mounted () {
        this.getDataList()
    },
    methods: {
        //tab切换
        couponTab(index, obj) {
            this.status = index;
            this.coupons = obj;
        },
        getDataList() {
            if (!this.userid) return
            this.$http.get(this.$urls.COUPONLIST, { userId: this.userid, status: 0 }).then(d => {
                this.coupons = this.noUseCoupons = d.coupons;
            })
            this.$http.get(this.$urls.COUPONLIST, { userId: this.userid, status: 1 }).then(d => {
                this.useCoupons = d.coupons;
            })
            this.$http.get(this.$urls.COUPONLIST, { userId: this.userid, status: 2 }).then(d => {
                this.overCoupons = d.coupons;
            })
        },
        jump(item) {
            this.$router.push(item.type == 1 ? { path: '/main/my/mydoc' } : (item.type == 2 ? { path: '/teaminfo/' + item.teamId } : this.$route.fullPath))
        }
    }
}
</script>
<style scoped lang="less">
@import "../../../assets/css/var";
.tabs {
  height: 3.5rem;
  line-height: 3.5rem;
  background-color: #fff;
  span {
    position: relative;
    display: inline-block;
    color: #222;
    font-size: 1.07rem;
  }
  .checked span {
    position: relative;
    display: inline-block;
    color: @main-color;
    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      border-radius: 3px;
      height: 3px;
      background: @main-color;
    }
  }
}
.coupon-empty {
  text-align: center;
  .thumb {
    width: 5.4rem;
    height: 5.34rem;
    background-image: url(../../../assets/img/indexInfo/coupon-empty.png);
    margin: 12.7rem 0 1.8rem;
  }
  p {
    color: #9196a1;
    font-size: 1.07rem;
  }
}
</style>

