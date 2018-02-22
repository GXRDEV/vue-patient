<template>
  <div :id="pageId" v-if="items.length" class="file-component" :class="className">
    <div class="fileupload clearfix">
        <ul class="weui-uploader__files">
            <template v-if="modal=='muilt'">
              <li v-for="(l, idx) in items" :key="idx"
                class="weui-uploader__file" 
                @click="show(idx)"
                :style="{height, width, marginRight, marginBottom, border}">
                <img :src="imgsrc(l.src, 'nopic@2x')" class="w100 h100" alt="">
              </li>
            </template>
            <li v-else
              class="weui-uploader__file" 
              @click="show(0)"
              :style="{height, width, marginRight, marginBottom, border}">
              <img :src="imgsrc(items[0].src, 'nopic@2x')" class="w100 h100" alt="">
              <span :style="`line-height:`+parseFloat(this.height)/3+`rem`">共{{items.length}}张</span>
            </li>
        </ul>
        <previewer v-if="!iswechat" :list="items" :options="options" ref="previewer"></previewer>
    </div>
  </div>
</template>

<script>
  import { Previewer } from 'vux'
  import { imgsrc } from '@filters'

  export default {
    components: {
      Previewer
    },
    props: {
      list: {
        type: Array,
        default () {
          return [];
        }
      },
      modal: {
        type: String,
        default: 'muilt'
      },
      height: String,
      width: String,
      marginRight: String,
      marginBottom: String,
      className: String,
      border: String,
      stopEvent: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        pageId: 'comp' + Math.floor(Math.random() * +new Date),
        iswechat: this.$store.state.wechat,
        items: [],
        options: {
          getThumbBoundsFn (index) {
            let thumbnail = document.querySelectorAll('.weui-uploader__file')[index]
            let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
            let rect = thumbnail.getBoundingClientRect()
            return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
          }
        }
      }
    },
    created () {
        this.imgListMap(this.list || [])
    },
    watch: {
        list (v){
            this.imgListMap(v)
        }
    },
    methods: {
      imgsrc,
      imgListMap (list){
        this.items = list.map(item => {
              return {
                  id: item.id,
                  src: item.fileUrl || item.url,
                  name: item.fileName,
                  w: 800,
                  h: 600
              }
          })
      },
      show (index) {
        if (this.stopEvent) {
          return
        } else {
            !this.iswechat ? this.$refs.previewer.show(index) : (() => {
              let urls = this.items.map( item => item.src)
              this.$wechat.previewImage({
                current: urls[index],
                urls
              })
          })()
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import "../../assets/css/file";
  .weui-uploader__file{
    position: relative;
    & > span{
      position: absolute; z-index: 3;
      bottom: 0; left: 0; width: 100%; text-align: center;
      background: rgba(0,0,0,.4); font-size: 1rem;
      color: #fff;
    }
  }
</style>
