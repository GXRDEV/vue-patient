<template>
    <div class="bgfff completeInfo">
        <heading title="完善个人资料" content="请您完善相关资料，以便我们为您更好的匹配适合的医生" style="background-color:#f4f4f5;"></heading>
        <section class="formStyle form_000_ccc">
            <div class="form-group" style="padding-right: 1rem">
                <heads @success="uploadok" class="form-group" :list="list"></heads>
            </div>
            <div class="form-group minWdth relative">
                <x-input title="姓名" placeholder="请填写真实姓名（必填）" :show-clear="false" v-model="form.uwr.displayName"></x-input>
                <span class="red-star">*</span>
            </div>
            <div class="form-group relative" style="padding: .9rem 1.625rem">
                <span class="red-star">*</span><span style="min-width: 4rem; display:inline-block">性别</span>
                <choice :states="state" styles="2rem" margin="0" style="display: inline-block" size="1rem" v-model="form.uwr.sex[0]"></choice>
            </div>
            <div class="form-group minWdth">
                <x-input title="身份证" placeholder="建议填写" v-model="form.uwr.idCard" @on-blur="validateItem('form.uwr.idCard')" :show-clear="false"></x-input>
            </div>
            <div class="form-group minWdth relative">
                <x-input title="手机号" placeholder="常用的手机号码，方便联系（必填）" :show-clear="false" v-model="form.uinfo.mobileNumber" @on-blur="phone"></x-input>
                <span class="red-star">*</span>
            </div>
            <div class="form-group relative">
                <popup-picker title="年龄" :data="[$store.state.age]" v-model="form.uwr.age" class="age" show-name placeholder="必填"></popup-picker>
                <span class="red-star">*</span>
            </div>
            <div class="form-group relative">
                <x-address title="常驻地" v-model="city" :list="$store.state.distcodes" placeholder="必填"></x-address>
                <span class="red-star">*</span>
            </div>
            <div class="form-group relative" style="padding-left:0.625rem;">
                <span class="red-star">*</span><label class="margin weui-label">您感兴趣的科室</label>
                <div class="margin">
                    <span class="dep signitem" v-for="(item, ind) in dep" :key="ind" @click="deldep(item, ind)">{{item.displayName}}</span>
                    <router-link class="add signitem" v-if="dep.length < 10" to="/selectdep" tag="span"><i class="iconfont icon-jiahao"></i></router-link>
                </div>
            </div>
            <div style="padding-left:0.625rem;" class="relative">
                <span class="red-star">*</span><label class="margin weui-label">您想关注的疾病</label>
                <div class="margin">
                    <span class="dep signitem" v-for="(item, ind) in easeName" :key="ind" @click="delease(ind)">{{item}}</span>
                    <router-link class="add signitem" v-if="easeName.length < 10" to="/selectease" tag="span"><i class="iconfont icon-jiahao"></i></router-link>
                </div>
            </div>
        </section>
        <footer class="fixedbottom" style="height: 3.4rem">
            <div class="fixed left right bottom tcenter nobg">
                <x-button @click.native="submitForm" :disabled="validate" type="primary" class="weui-btn_circle" style="height: 3.4rem!important">保存</x-button>
            </div>
        </footer>
        <coupons :lists="coupons" @on-closed="jumpTo"></coupons>
    </div>
</template>
<script>
import { Heading, Choice, Heads, Coupons } from '@components/share'
import { XInput, PopupPicker, XButton } from 'vux'
import { ValideTel, ValideCard } from '@plugins/api'
import address from '@mixins/address'
import { mapGetters } from 'vuex'
export default {
  mixins: [address],
  components: {
    Heading,
    Choice,
    XInput,
    PopupPicker,
    XButton,
    Heads,
    Coupons
  },
  data() {
    return {
      openid: this.$store.state.openid,
      storage: window.sessionStorage,
      state: this.$store.state.sex,
      form: {
        uinfo: {
          mobileNumber: ""
        },
        uwr: {
          headImageUrl: "",
          displayName: "",
          sex: [],
          age: [],
          distCode: "",
          idCard: ""
        }
      },
      city: [],
      dep: [],
      depid: [],
      easeName: [],
      list: [{ id: "", url: "" }],
      discode: {},
      coupons: [],
      timer: this.$route.params.timer
    };
  },
  created() {
    if (sessionStorage.getItem(this.timer)) {
      this.saveData(JSON.parse(sessionStorage.getItem(this.timer)));
      this.dep = JSON.parse(sessionStorage.getItem("_cache_dep_") || "[]");
      this.easeName = JSON.parse(
        sessionStorage.getItem("_cache_ease_") || "[]"
      );
    } else {
      // 获取用户的基本信息
      this.$http.get(this.$urls.GAINPERSONINFO, {
          openid: this.openid
      }).then(d => {
          this.saveData(d);
      });
      // 获取用户感兴趣的科室及疾病
      this.$http.get(this.$urls.GAINUSERINTERESTS, {
          openid: this.openid
      }).then(d => {
          d.diseases && (this.easeName = d.diseases.split(","));
          d.deps && (this.dep = d.deps);
      });
    }
    this.discode = {
      code: this.gpsCode,
      name: this.gpsName
    };
  },
  methods: {
    saveData(data) {
      this.form = data;
      this.form.uwr.age = [].concat(data.uwr.age ? data.uwr.age + "" : []);
      this.form.uwr.sex = [].concat(data.uwr.sex ? data.uwr.sex + "" : []);
      this.city.push(data.uwr.distCode) || this.city.push(this.discode.code);
      this.list = [
        {
          id: data.uwr.userId,
          url: data.uwr.headImageUrl
        }
      ];
    },
    phone() {
      !this.tels &&
        this.$vux.toast.show({
          position: "top",
          type: "text",
          width: "auto",
          text: "手机号格式有误"
        });
    },
    validateItem(item) {
      if (!this.vidCard) {
        this.$vux.toast.show({
          position: "top",
          type: "text",
          width: "auto",
          text: "身份证格式有误"
        });
      }
    },
    uploadok(ids, urls) {
      this.form.uwr.headImageUrl = urls;
    },
    // 删除科室
    deldep(item, ind) {
      this.dep.splice(ind, 1);
      this.storage.removeItem(item.id);
    },
    // 删除疾病
    delease(ind) {
      this.easeName.splice(ind, 1);
      this.storage.ease = JSON.stringify(this.easeName);
    },
    submitForm() {
      let depid = [];
      let arr = !sessionStorage.getItem(this.timer)
        ? this.dep
        : JSON.parse(sessionStorage.getItem("_cache_dep_"));
      arr.forEach(item => {
        depid.push(item.id);
      });
      this.$vux.loading.show({ text: "正在保存" });
      this.$http.post(this.$urls.MAINCOMPLETEINFO, {
          openid: this.openid,
          userName: this.form.uwr.displayName,
          headImageUrl: this.form.uwr.headImageUrl,
          age: this.form.uwr.age[0],
          sex: this.form.uwr.sex[0],
          tel: this.form.uinfo.mobileNumber,
          idCard: this.form.uwr.idCard,
          distCode: this.form.uwr.distCode,
          depIds: depid.join(),
          diseases: this.easeName.join()
        }, this).then(d => {
          this.$vux.loading.hide();
          this.$vux.toast.show({ type: "text", text: "保存成功", position: "top" });
          this.$store.commit("SET_WXINFO", {
            uinfo: this.form.uinfo,
            uwr: {
              ...this.form.uwr,
              sex: this.form.uwr.sex[0],
              age: this.form.uwr.age[0]
            }
          });
          if (d.coupons.length > 0) {
            this.coupons = d.coupons;
            return;
          }
          window.setTimeout(() => {
            this.$router.go(-1);
          }, 400);
        });
    },
    jumpTo() {
      this.$router.go(-1);
    }
  },
  computed: {
    ...mapGetters(["gpsCode", "gpsName"]),
    validate() {
      return !(
        this.form.uwr.displayName &&
        this.vage &&
        this.form.uwr.sex[0] &&
        this.tels &&
        this.vidCard &&
        this.form.uwr.distCode &&
        this.dep.length != 0 &&
        this.easeName.length != 0
      );
    },
    vage () {
        return parseInt(this.form.uwr.age[0], 10) > 0
    },
    tels() {
      return ValideTel(this.form.uinfo.mobileNumber);
    },
    vidCard() {
      return !this.form.uwr.idCard || ValideCard(this.form.uwr.idCard);
    }
  },
  watch: {
    city(d) {
      this.form.uwr.distCode = d[d.length - 1];
    }
  },
  beforeDestroy() {
    sessionStorage.setItem(this.timer, JSON.stringify(this.form));
    sessionStorage.setItem("_cache_dep_", JSON.stringify(this.dep));
    sessionStorage.setItem("_cache_ease_", JSON.stringify(this.easeName));
  }
};
</script>
<style lang="less" scoped>
    .margin {
      display: block;
      padding: 1.1rem 1rem 1rem;
    }
    .signitem{
        display: inline-block;
        line-height: 2rem;
        border-radius: .2rem;
        margin: 0 1rem 1rem 0;
        background: transparent;
    }
    .add{
        color: #91cbeb;
        border: 1px solid #e5f3fa;
        padding: 0 2.1rem;
        .iconfont{
            font-size: 1.4rem;
        }
    }
    .dep{
        color: #0186D1;
        border: 1px solid #0186D1;
        padding: 0 1.2rem;
    }
</style>
<style lang="less">
.completeInfo {
  .weui-btn_primary {
    height: 3.38rem;
    line-height: 3.38rem;
  }
}
</style>
