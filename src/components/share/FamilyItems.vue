<template>
  <div class="familyitems">
    <cell :title="title" is-link @click.native="sheet=true" :class="{'family-item': bigSize}">
      <span class="formtext">
        <label class="gray" v-if="!familyName">{{placeholder}}</label>
        <label v-else>{{familyName}}</label>
      </span>
    </cell>
    <actionsheet v-model="sheet" :menus="familyItems" @on-click-menu="click"
      cancel-text="添加联系人"
      :show-cancel="familyItems.length < 5"></actionsheet>
  </div>
</template>

<script>
import { Actionsheet, Cell } from 'vux'
export default {
  name: 'familyitems',
  props: {
    value: [String, Number, Object],
    placeholder: String,
    title: String,
    bigSize: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Actionsheet, Cell
  },
  created () {
    this.$http.get(this.$urls.GAINFAMILIES, {
        openid: this.$store.state.openid
    }).then(d => {
        this.familyItems = d.users.map(item => {
            let newItem = {
                label: this.label(item),
                value: item.id + '',
                telphone: item.telphone
            }
            if (this.value) {
              let val = typeof this.value == 'object' ? this.value.value || '' : this.value + ''
              if (item.id == val) {
                  this.familyObj = newItem
                  this.familyName = newItem.label
                  this.familyValue = this.value
              }
            }
            return newItem
        })
        if (!this.familyName && this.familyItems.length) {
            this.familyObj = this.familyItems[0]
            this.familyName = this.familyItems[0].label
            this.familyValue = this.familyItems[0].value
        }
    })
  },
  methods: {
    label (item) {
      let arr = []
      item.contactName && arr.push(item.contactName)
      item.sex && arr.push(item.sex == '1' ? '男' : item.sex == '2' ? '女' : '')
      item.age && arr.push(item.age + '岁')
      return arr.join(' / ')
    },
    click (val) {
      if (val == 'cancel') {
        this.$router.push({ path: '/familyadd', query: { back: -1 } })
      } else {
        this.familyObj = this.familyItems.find(item => item.value == val)
        this.familyValue = val
        this.familyName = this.familyObj.label
      }
    }
  },
  watch: {
    value (val) {
      this.familyValue = val
    },
    familyValue (val) {
      this.$emit('input', val)
      this.$emit('on-change', this.familyObj)
    }
  },
  mounted () {
    if (this.start) {
      this.tick()
    }
  },
  data () {
    return {
      familyItems: [],
      familyObj: {},
      familyValue: '',
      familyName: '',
      sheet: false
    }
  }
}
</script>
<style lang="less">
  .family-item{
      .vux-label{
        font-size: 1.167rem
      }
  }
</style>
