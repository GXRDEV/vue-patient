<template>
    <div class="head_box weui-cell borderbox flex" :id="id">
        <label class="weui-label flex_1">头像</label>
        <ul class="headers flex acenter jcenter formtext" :id="id + 'Files'">
            <li v-for="(l, idx) in items" class="thumb bgcove radius50 relative" :key="idx"
              :style="'background-image: url('+ imgsrc(l.url, 'user-head') +')'">
                <div class="weui-uploader__file-content" v-if="l.add">
                    <i class="weui-icon-warn" v-if="l.add=='error'"></i>
                    <i class="weui-loading" v-else style="width: 30px;height: 30px;"></i>
                </div>
            </li>
        </ul>
        <div class="inputbox absolute top left w100 h100">
            <input :id="id + 'Input'" class="weui-uploader__input" type="file" :accept="accept">
            <label v-if="android" class="wx-android absolute top left w100 h100" @click="chooseImage"></label>
        </div>
    </div>
</template>

<script>
  import files from '@mixins/files'

  export default {
    props: {
      id: {
        type: String,
        default: 'localfile'
      },
      multiple: {
        type: Boolean,
        default: false
      },
      list: {
        type: Array,
        default () {
          return []
        }
      }
    },
    mixins: [files]
  }
</script>
<style scoped lang="less">
    @import "../../assets/css/var";
    @import "../../assets/css/file";
    .head_box{
      height: 5rem; padding-top: 0; padding-bottom: 0; padding-right: 0;
      line-height: 5rem;
      overflow: hidden;
      background: #fff;
    }
    .headers li{
      height: 3rem;
      width: 3rem;
      list-style: none;
    }
    .weui-uploader__file-content{
      display: block;
    }
    .inputbox{
        input{
          width: 100%;
          height: 100%;
          outline: none;
          opacity: 0;
        }
    }
    .wx-android{ z-index: 2; }
</style>
