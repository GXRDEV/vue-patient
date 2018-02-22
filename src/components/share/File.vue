<template>
  <div class="file-component" :class="className">
    <div class="fileupload clearfix" :id="id">
        <ul class="weui-uploader__files" :id="id + 'Files'">
            <li v-for="(l, idx) in items" :class="'weui-uploader__file' + (l.add ? ' weui-uploader__file_status' : '')" 
              :data-id="l.id || idx" :key="idx"
              :style="`background-image: url(${imgsrc(l.url, 'nopic@2x')})`" @click.prevent="showDiag(idx)">
                <div class="weui-uploader__file-content" v-if="l.add">
                    <i class="weui-icon-warn" v-if="l.add=='error'"></i>
                    <i class="weui-loading" v-else style="width: 30px;height: 30px;"></i>
                </div>
            </li>
        </ul>
        <div class="weui-uploader__input-box relative" :class="clsName">
            <slot name="name"></slot>
            <input :id="id + 'Input'" class="weui-uploader__input" type="file" :accept="accept" :multiple="multiple">
            <label v-if="android" class="wx-android absolute top left w100 h100" @click="chooseImage"></label>
        </div>
        <div class="weui-uploader__remark" v-if="!items.length">
          <div v-if="remark" v-html="remark"></div>
          <div v-else><slot></slot></div>
        </div>
    </div>
    <div v-transfer-dom>
      <previewer :list="prevItems" ref="previewer" :options="options" @on-close="closePrev">
        <template slot="button-after">
            <a href="javascript:;" class="weui-gallery__del" @click.prevent.stop="delItem">
                <i class="iconfont icon-shanchu"></i>
            </a>
        </template>
      </previewer>
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
      list: {
        type: Array,
        default () {
          return [];
        }
      },
      multiple: {
        type: Boolean,
        default: true
      },
      clsName: {
        type: String,
        default: 'custombg'
      },
      className: String,
      remark: [String, HTMLElement]
    },
    mixins: [files],
    methods: {
      showDiag (idx) {
        this.prevId = idx
        this.$refs.previewer.show(idx)
      },
      closePrev () {
        this.prevId = -1
      },
      delItem () {
          let idx = this.$refs.previewer.getCurrentIndex()
          let item = this.items[idx]
          if (item.id) {
            let bidx = this.backIds.findIndex(i => i == item.id)
            let lidx = this.localIds.findIndex(i => i == item.id)
            lidx != -1 && this.localIds.splice(lidx, 1)
            bidx != -1 && this.backIds.splice(bidx, 1)
          }
          this.$refs.previewer.close();
          this.items.splice(idx, 1);
          this.$emit('success', this.ids, this.urls);
      }
    }
  }
</script>
<style scoped lang="less">
  @import "../../assets/css/file";
  .wx-android{ z-index: 2; }
</style>
