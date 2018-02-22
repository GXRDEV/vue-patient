<template>
    <div class="payblock">
        <dl class="bgfff big13">
            <dd class="big13 flex dditem" v-if="userName">
                <span class="labelTitle">就诊人</span>
                {{userName}}&emsp;{{sex}}&emsp;{{age}}
            </dd>
            <dd class="flex acenter dditem" v-if="doctor.specialId">
                <div class="big13 labelTitle">
                    <span v-if="type == 'give'">感谢</span>{{otype == 14 ? 'vip团队' : teamType ? '首诊医生' : '医生'}}
                </div>
                <item-flex-img :img="doctor.listSpecialPicture" radius="50%" class="doctor flex_1" size="3.1rem">
                    <p class="big13">{{doctor.specialName}}</p>
                    <p style="color: #9196a1">{{doctor.hosName}}</p>
                </item-flex-img>
            </dd>
            <dd class="flex acenter dditem" v-if="exp.specialId">
                <div v-if="teamType" class="big13 labelTitle">复诊医生</div>
                <div v-else class="big13 labelTitle">专家</div>
                <item-flex-img :img="exp.listSpecialPicture" radius="50%" class="doctor flex_1" size="3.1rem">
                    <p class="big13">{{exp.specialName}}</p>
                    <p style="color: #9196a1">{{exp.hosName}}</p>
                </item-flex-img>
            </dd>
            <dd class="big13 flex dditem">
                <div class="labelTitle">
                    {{sever}}
                    <span v-if="type != 'give'">费用</span>
                </div>
                <div class="send-mind flex_1">
                    <template v-if="type == 'give'">
                        <img src="../../assets/img/sendMind/min_send_0.png" v-if="form.warmthName == '一点心意'">
                        <img src="../../assets/img/sendMind/min_send_1.png" v-else-if="form.warmthName == '白衣天使'">
                        <img src="../../assets/img/sendMind/min_send_2.png" v-else-if="form.warmthName == '医德高尚'">
                        <img src="../../assets/img/sendMind/min_send_3.png" v-else-if="form.warmthName == '德艺双馨'">
                        <img src="../../assets/img/sendMind/min_send_4.png" v-else>
                        <span :style="form.warmthName | warmcolor">{{form.warmthName}}</span>
                    </template>
                </div>
                <div class="big16" style="color: #f6ab00">
                    {{ money }}
                    <span class="small11">元</span>
                </div>
            </dd>
        </dl>
        <div class="coupon big13 couponmain" style="margin: .84rem 0">
            <p class="bgfff title">优惠券
                <span style="color: #9196a1" class="small10">&ensp;勾选使用，单次只可使用一张优惠券</span>
            </p>
            <div v-if="coupons.length" style="padding: 0 0.8rem">
                <div class="item bbox" v-for="(item ,index) in coupons" :key="index" style="margin: 1rem 0;" @click="couponId = couponId == item.id ? '' : item.id">
                    <div class="fff item-left bbox relative" :class="{'teamcolor':item.type==2}">
                        <span class="spottop"></span>
                        <span class="spotbottom"></span>
                        <div class="flex column acenter jcenter h100">
                            <p class="moneytotal whitespace" v-if="item.type == 1">
                                <i>￥</i>
                                <span class="money" :class="{'multnum': (item.couponPrice + '').indexOf('.') != -1}">{{ item.couponPrice }}</span>
                            </p>
                            <p class="moneytotal" v-if="item.type == 2">
                                <span class="money" style="font-size:2.6rem;">免费</span>
                            </p>
                            <p class="fullprice small11 whitespace" v-if="item.type == 1">满{{ item.fullCutPrice }}元可用</p>
                            <p class="fullprice small11" v-if="item.type == 2">指定团队可用</p>
                            <p v-if="item.type == 3" class="moneytotal" ><span class="money" style="font-size:1.6rem;">平台服务</span></p>
                        </div>
                    </div>
                    <div class="item-right bbox relative">
                        <p class="big16">{{ item.couponName }}</p>
                        <i class="absolute cleck iconfont icon-yuanxingweixuanzhong" :class="{ 'checked': couponId == item.id }"></i>
                    </div>
                </div>
            </div>
            <div v-else class="noCoupons bgfff" style="padding: 1rem 0">
                <img src="../../assets/img/indexInfo/coupon-empty.png">
                <p>暂无优惠券可用</p>
            </div>
        </div>
        <footer class="fixed bottom bgfff left right">
            <span class="strong proce">
                ￥{{ needpay }}
            </span>
            <span class="pay fff" @click="pay">
                <i class="iconfont icon-weixinzhifu fff"></i>&ensp;微信支付
            </span>
        </footer>
    </div>
</template>
<script>
import { ItemFlexImg } from '@components/share'
import { WxJsPay } from '@plugins/api'
import { warmcolor } from '@filters'
import { mapState } from 'vuex'
export default {
  components: {
    ItemFlexImg
  },
  filters: {
    warmcolor
  },
  data() {
    return {
      oid: this.$route.query.oid || '',
      otype: this.$route.query.otype || '',
      type: '',
      doctor: {},
      exp: {},
      sever: '',
      form: {},
      couponId: '',
      money: 0,
      coupons: [],
      userName: '',
      sex: '',
      age: '',
      familyId: ''
    }
  },
  created() {
    let parameter = JSON.parse(sessionStorage.getItem('pay_parameter') || '{}')
    this.form = parameter.form || {}
    this.doctor = parameter.doc || {}
    this.userName = parameter.userName || ''
    this.familyId = parameter.familyId || ''
    this.age = parameter.age || ''
    this.sex = parameter.sex || ''
    this.oid = this.oid || this.form.oid
    this.otype = this.otype || this.form.otype
    this.type = this.form.type
    this.sever = this.$store.state.orderType[this.otype]
    this.money = this.form.warmthMoney || 0
    // 送心意处理
    if (this.type == 'give') {
      this.doctor = parameter.doc || {}
    }
    if (this.oid && this.otype) {
      this.$http.get(this.$urls.GOTOPAY, {
          orderUuid: this.oid,
          orderType: this.otype
        }).then(d => {
          this.money = d.payMoney || this.money
          this.userName = d.userName || this.userName
          this.age = d.age || this.age
          this.sex = d.sex || this.sex
        })
      // 获取医生
      this.$http.get(this.$urls.DOCS, {
          orderUuid: this.oid,
          orderType: this.otype
        }).then(d => {
          this.doctor = d.doc || {}
          this.exp = d.otherDoc || {}
        })
    }

    this.$http.get(this.$urls.GETCOUPON, {
        userId: this.userid,
        orderUuid: this.oid,
        orderType: this.type == 'give' ? 13 : this.otype,
        payMoney: this.form.warmthMoney
      }).then(d => {
        this.coupons = d.coupons || []
        this.chooseFirstCoupon()
      })
  },
  computed: {
    ...mapState({
      userid: state => state.userid
    }),
    needpay() {
      let selected = this.coupons.find(item => item.id == this.couponId) || {}
      let total = this.money * 100
      let sval = (selected.type == 2 ? this.money : selected.couponPrice || 0) * 100
      let finaly = (total - sval) / 100
      return finaly > 0 ? finaly : 0
    },
    teamType() {
      return this.otype == 11 || this.otype == 12
    }
  },
  methods: {
    chooseFirstCoupon() {
      this.coupons.length && (this.couponId = this.coupons[0].id || '')
    },
    wxpay(d) {
      this.$vux.toast.show({
        position: 'top',
        type: 'text',
        width: 'auto',
        text: '提交成功'
      })
      d.needpay == 'true'
        ? WxJsPay(this, d, this.redirect.bind(this))
        : this.redirect()
    },
    redirect() {
      sessionStorage.removeItem('pay_parameter')
      this.$route.query.back
        ? this.$router.go(this.$route.query.back)
        : this.$router.replace(
            this.$route.query.from ||
              (this.otype == 9
                ? '/fastfind/' + this.oid
                : this.otype == 14 || this.otype == 15
                  ? '/main/my/mysign'
                  : '/inquirylist/2')
          )
    },
    pay() {
      let url =
        this.type == 'give'
          ? this.$urls.SUBUSERWARM
          : this.otype == 14 || this.otype == 15
            ? this.$urls.PRIVATESUBMIT
            : this.$urls.ORDERPAY
      this.$vux.loading.show({
        text: '正在提交'
      })
      this.$http.post(
          url,
          {
            ...this.form,
            openid: this.$store.state.openid,
            uuid: this.oid,
            orderType: this.otype,
            couponId: this.couponId,
            doctorId: this.doctor.specialId || '',
            teamUuid: this.oid || this.doctor.teamUuid || '',
            docServicePackageId: this.doctor.severPack || '',
            familyId: this.familyId || ''
          },
          this
        ).then(d => {
          this.$vux.loading.hide()
          this.wxpay(d)
        })
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../assets/css/var.less';
.payblock {
  color: #222;
  padding-bottom: 5em;
  .doctor {
    padding: 0;
    p {
      padding-top: 0.2rem;
    }
    .gray {
      font-size: 1rem;
      font-weight: normal;
    }
  }
}
.dditem {
  position: relative;
  padding: 1.5rem 1.5rem 1.5rem 0;
  margin-left: 1rem;
  & + .dditem:after {
    content: '';
    .setTopLine(#e5e5e5);
  }
}
.labelTitle {
  min-width: 6em;
}
.send-mind {
  img {
    width: 1rem;
    vertical-align: -4px;
  }
}
.coupon {
  clear: both;
  .title {
    padding: 0.8rem;
  }
  .noCoupons {
    text-align: center;
    color: #ced1d6;
    img {
      width: 3rem;
    }
  }
}
footer {
  z-index: 10;
  line-height: 4.3rem;
  padding: 0 0.8rem;
  .proce {
    font-size: 1.6rem;
  }
  .pay {
    float: right;
    background: #229848;
    width: 9.54rem;
    height: 2.9rem;
    line-height: 2.9rem;
    border-radius: 3rem;
    text-align: center;
    font-size: 1.2rem;
    margin-top: 0.7rem;
    border-top: 1px solid #e5e5e5;
    .iconfont {
      vertical-align: -2px;
      font-size: 1.6rem;
    }
  }
}
.cleck {
  font-size: 1.5rem;
  right: 1rem;
  bottom: 1rem;
  color: #eee;
}
.checked {
  &:before {
    content: '\E730';
    color: @warn-color;
  }
}
</style>
