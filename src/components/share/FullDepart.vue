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
          <span class="vux-popup-picker-value" v-if="!displayFormat && showName && value.length">{{ currentName }}</span>
          <span class="vux-popup-picker-value" v-if="displayFormat && value.length">{{ displayFormat(value) }}</span>
          <span v-if="!value.length && placeholder" v-html="placeholder"></span>
        </div>
      </div>
      <div class="weui-cell__ft arrow-right"></div>
    </div>
    <div v-transfer-dom="isTransferDom">
      <popup v-model="showValue" class="vux-popup-picker" @on-hide="onPopupHide" @on-show="$emit('on-show')" :height="height">
        <div class="vux-popup-picker-container flex column h100">
            <div class="vux-popup-picker-header">
              <flexbox>
                <flexbox-item class="vux-popup-picker-header-menu" @click.native="onHide(false)">{{cancelText}}</flexbox-item>
                <flexbox-item class="vux-popup-picker-header-menu vux-popup-picker-header-menu-right" @click.native="onHide(true)">{{confirmText}}</flexbox-item>
              </flexbox>
            </div>
            <div class="relative boxborderbottom">
              <x-switch title="不清楚要选择哪个科室" v-model="didtKnow" @on-change="switchChange"></x-switch>
            </div>
            <div class="flex_1 relative">
              <div class="absolute w100 h100 top left">
                <choose-depart v-model="radioValue" :data="data" :hasall="false" @on-change="radioChange" @on-init="setName" ref="depart"></choose-depart>
              </div>
            </div> 
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
  import array2string from 'vux/src/filters/array2String'
  import ChooseDepart from './ChooseDepart'
  import { Popup, InlineDesc, Flexbox, FlexboxItem, XSwitch, TransferDomDirective as TransferDom } from 'vux'

  const getObject = function (obj) {
    return JSON.parse(JSON.stringify(obj))
  }
  export default {
    directives: {
      TransferDom
    },
    components: {
      XSwitch, ChooseDepart,
      Popup, Flexbox,
      FlexboxItem,
      InlineDesc
    },
    filters: {
      array2string
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
        type: [String, Number],
        default: ''
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
      height: {
        type: String,
        default: '100%'
      }
    },  
    created () {
      if (typeof this.show !== 'undefined') {
        this.showValue = this.show
      }
      if (!!this.value) {
        this.didtKnow = false
        this.radioValue = this.value
      }
    },
    methods: {
      onClick () {
        this.showValue = true
      },
      onHide (type) {
        this.showValue = false
        if (type) {
          this.closeType = true
          this.currentValue = getObject(this.tempValue)
          this.currentName = this.tempName
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
      switchChange (val) {
        if(val){
          this.tempValue = this.radioValue = ''
        } else {
          this.tempValue = this.radioValue
        }
      },
      setName (name) {
        this.currentName = name
      },
      radioChange (id, name) {
        this.didtKnow = name ? false : true;
        this.tempName = name
      }
    },
    watch: {
      value (val) {
        if (JSON.stringify(val) !== JSON.stringify(this.tempValue)) {
          this.tempValue = getObject(val)
          this.radioValue = getObject(val)
        }
      },
      currentValue (val) {
        this.$emit('on-change', getObject(val))
        this.$emit('input', getObject(val))    
        this.$emit('show-name', this.currentName)    
      },
      show (val) {
        this.showValue = val
      },
      radioValue (val) {
        this.tempValue = val
      }
    },
    data () {
      return {
        tempValue: getObject(this.value),
        tempName: '',
        closeType: false,
        showValue: false,
        currentValue: this.value,
        currentName: '',
        newData: JSON.parse(JSON.stringify(this.data)),
        firstVal: '',
        radioValue: '',
        didtKnow: false
      }
    }
  }
</script>
<style lang="less">
  @import '../../../node_modules/vux/src/styles/variable.less';
  @import '../../../node_modules/vux/src/styles/1px.less';
  .boxborderbottom{
      &:before {
          .setBottomLine(#ccc);
      }
  }
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
  .weui-cell{
    .arrow-right{
      margin-top: -3.2px !important
    }
  }
</style>
