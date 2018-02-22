<template>
  <div class="vux-cell-box">
    <div class="weui-cell vux-tap-active weui-cell_access" @click="onClick" v-show="showCell">
      <div class="weui-cell__hd">
        <label class="weui-label" :style="{display: 'block', width: $parent.labelWidth || $parent.$parent.labelWidth, textAlign: $parent.labelAlign || $parent.$parent.labelAlign, marginRight: $parent.labelMarginRight || $parent.$parent.labelMarginRight}" v-if="title" v-html="title"></label>
        <inline-desc v-if="inlineDesc">{{inlineDesc}}</inline-desc>
      </div>
      <div class="vux-cell-primary vux-popup-picker-select-box">
        <div class="vux-popup-picker-select" :style="{textAlign: valueTextAlign}">
          <span class="vux-popup-picker-value" v-if="!displayFormat && !showName && value.length">{{value | array2string}}</span>
          <span class="vux-popup-picker-value" v-if="!displayFormat && showName && value.length">{{ value | value2name(newData) }}</span>
          <span class="vux-popup-picker-value" v-if="displayFormat && value.length">{{ displayFormat(value) }}</span>
          <span v-if="!value.length && placeholder" v-html="placeholder"></span>
        </div>
      </div>
      <div class="weui-cell__ft">
      </div>
    </div>

    <div v-transfer-dom="isTransferDom">
      <popup v-model="showValue" class="vux-popup-picker" :id="'vux-popup-picker-'+uuid" @on-hide="onPopupHide" @on-show="$emit('on-show')">
        <div class="vux-popup-picker-container">
          <div class="vux-popup-picker-header">
            <flexbox>
              <flexbox-item class="vux-popup-picker-header-menu" @click.native="onHide(false)">{{cancelText}}</flexbox-item>
              <flexbox-item class="vux-popup-picker-header-menu vux-popup-picker-header-menu-right" @click.native="onHide(true)">{{confirmText}}</flexbox-item>
            </flexbox>
          </div>
          <div class="flex" v-if="data.length==1">
              <input type="text" v-model="filterValue" placeholder="过滤或自定义值" style="width: 100%; height: 2.6em;padding: 5px 10px; box-sizing:border-box; text-align:center;border:0;border-bottom:1px solid #eee;">
          </div>
          <picker
          :data="newData"
          v-model="tempValue"
          @on-change="onPickerChange"
          :columns="columns"
          :fixed-columns="fixedColumns"
          :container="'#vux-popup-picker-'+uuid"></picker>
        </div>
      </popup>
    </div>

  </div>
</template>

<script>
import Picker from 'vux/src/components/picker'
import Popup from 'vux/src/components/popup'
import InlineDesc from 'vux/src/components/inline-desc'
import { Flexbox, FlexboxItem } from 'vux/src/components/flexbox'
import array2string from 'vux/src/filters/array2String'
import { value2name } from '@filters'
import uuidMixin from 'vux/src/libs/mixin_uuid'
import TransferDom from 'vux/src/directives/transfer-dom'
import debounce from 'vux/src/tools/debounce'
const getObject = function (obj) {
  return JSON.parse(JSON.stringify(obj))
}
const arrayFilter = function (data, value) {
    return value ? data.map((items) => {
        return items.filter((item) => {
            return 'name' in item ? (item.name.indexOf(value) != -1 || item.value.indexOf(value) != -1) : item.indexOf(value) != -1
        })
    }) : data
}
export default {
  directives: {
    TransferDom
  },
  created () {
    if (typeof this.show !== 'undefined') {
      this.showValue = this.show
    }
  },
  mixins: [uuidMixin],
  components: {
    Picker,
    Popup,
    Flexbox,
    FlexboxItem,
    InlineDesc
  },
  filters: {
    array2string,
    value2name
  },
  props: {
    valueTextAlign: {
      type: String,
      default: 'right'
    },
    title: String,
    cancelText: {
        type: String,
        default: '取消'
    },
    confirmText: {
        type: String,
        default: '确定'
    },
    data: {
      type: Array,
      default () {
        return []
      }
    },
    placeholder: String,
    columns: {
      type: Number,
      default: 0
    },
    fixedColumns: {
      type: Number,
      default: 0
    },
    value: {
      type: Array,
      default () {
        return []
      }
    },
    showName: Boolean,
    inlineDesc: [String, Number, Array, Object, Boolean],
    showCell: {
      type: Boolean,
      default: true
    },
    show: Boolean,
    displayFormat: Function,
    isTransferDom: {
      type: Boolean,
      default: true
    },
    filtersplit: {
        type: String,
        default: '_cus$:'
    }
  },
  methods: {
    value2name,
    getNameValues (value) {
      return value2name(value, this.newData)
    },
    onClick () {
      this.showValue = true
    },
    onHide (type) {
      this.showValue = false
      if (type) {
        this.closeType = true
        this.currentValue = getObject(this.tempValue)
      }
      if (!type) {
        this.closeType = false
        if (this.value.length > 0) {
          this.tempValue = getObject(this.currentValue)
        }
      }
    },
    onPopupHide (val) {
      if (this.value.length > 0) {
        this.tempValue = getObject(this.currentValue)
      }
      this.$emit('on-hide', this.closeType)
    },
    onPickerChange (val) {
      if (JSON.stringify(this.currentValue) !== JSON.stringify(val)) {
        // if has value, replace it
        if (this.value.length) {
          const nowData = JSON.stringify(this.data)
          if (nowData !== this.currentData && this.currentData !== '[]') {
            this.tempValue = getObject(val)
          }
          this.currentData = nowData
        } else { // if no value, stay quiet
          // if set to auto update, do update the value
        }
      }
      this.$emit('on-shadow-change', getObject(val))
    },
    watchFilterVal: debounce(function() {
        let val = this.filterValue
        this.newData = arrayFilter(JSON.parse(this.currentData), val)
        val && !this.newData[0].length && this.newData[0].unshift({
            name: val,
            value: this.filtersplit + val,
            parent: 0
        })
    }, 500)
  },
  watch: {
    value (val) {
      if (JSON.stringify(val) !== JSON.stringify(this.tempValue)) {
        this.tempValue = getObject(val)
      }
    },
    currentValue (val) {
      this.$emit('on-change', getObject(val))
      this.$emit('input', getObject(val))
    },
    show (val) {
      this.showValue = val
    },
    filterValue () {
        this.watchFilterVal()
    }
  },
  data () {
    return {
      onShowProcess: false,
      tempValue: getObject(this.value),
      closeType: false,
      currentData: JSON.stringify(this.data), // used for detecting if it is after data change
      showValue: false,
      currentValue: this.value,
      newData: JSON.parse(JSON.stringify(this.data)),
      filterValue: ''
    }
  }
}
</script>

<style lang="less">
@import '../../../node_modules/vux/src/styles/variable.less';
@import '../../../node_modules/vux/src/styles/1px.less';

.vux-cell-box {
  position: relative;
}
.vux-cell-box:before {
  content: " ";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 1px;
  border-top: 1px solid #D9D9D9;
  color: #D9D9D9;
  transform-origin: 0 0;
  transform: scaleY(0.5);
  left: 15px;
}
.vux-popup-picker-header {
  height: 44px;
  color: @popup-picker-header-text-color;
  background-color: @popup-picker-header-bg-color;
  font-size: @popup-picker-header-font-size;
  position: relative;
  &:after {
    .setBottomLine(#e5e5e5);
  }
}
.vux-popup-picker-value {
  /* display: inline-block; */
}
.vux-popup-picker-header-menu {
  text-align: left;
  padding-left: 15px;
  line-height: 44px;
}
.vux-popup-picker-header-menu-right {
  text-align: right;
  padding-right: 15px;
}
.vux-popup-picker-select {
  width: 100%;
  position: relative;
}
.vux-popup-picker-select-box.weui-cell__bd:after {
  content: " ";
  display: inline-block;
  transform: rotate(45deg);
  height: 6px;
  width: 6px;
  border-width: 2px 2px 0 0;
  border-color: #C8C8CD;
  border-style: solid;
  position: relative;
  top: -2px;
  position: absolute;
  top: 50%;
  right: 15px;
  margin-top: -3px;
}
</style>
