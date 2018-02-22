<template>
  <router-link class="itemlist flex relative" :class="{'thumbRight': (thumb=='right'), 'borderbottom': borderBottom}" :to="linkUrl">
      <div class="outerthumb" :style="thumbstyle">
          <i class="thumb bgcove" :style="style"></i>
          <slot name="thumb"></slot>
      </div>
      <div class="flex_1 mainbox">
          <slot></slot>
      </div>
      <i v-if="isLink" class="iconfont icon-arrright absolute top right h100 flex acenter gray" style="padding:0 .6rem;"></i>
  </router-link>
</template>

<script>
  import { imgsrc } from '@filters'
  export default {
    name: 'itemfleximg',
    props: {
        link: [String, Object],
        isLink: {
            type: Boolean,
            default: false
        },
        img: String,
        size: String,
        logo: String,
        radius: String,
        thumb:{
          type: String,
          default: 'left'
        },
        borderBottom: {
            type: Boolean,
            default: false
        }
    },
    computed: {
      style () {
          let size = this.size || '3.83rem'
          let logo = this.logo || 'doc'
          let thumb = size.indexOf('rem') != -1 ? parseInt(size) * 30 : parseInt(size)
          return `background-image:url(${imgsrc(this.img, logo, thumb)});` +
            (this.radius ? `border-radius: ${this.radius};` : '')
      },
      thumbstyle () {
          let size = this.size || '3.83rem'
          return size ? `width:${size};-webkit-box-flex: 0 0 ${size}; -webkit-flex:0 0 ${size};flex:0 0 ${size};` : ''
      },
      islink () {
          return typeof this.link == 'object' ? (!!this.link.path || !!this.link.name) : !!this.link
      },
      linkUrl () {
          return  this.islink ? this.link : location.hash.replace('#', '')
      }
    }
  }
</script>

<style scoped lang="less">
    @import "../../assets/css/var";
    .itemlist{
        padding: 1.6rem 1.16rem 1.3rem 0; color: #333;
        background: #fff;
        .mainbox{
            overflow: hidden;
            margin-left: 1rem;
        }
        &.borderbottom{
            border-bottom: .5px solid #eee;
        }
    }
    .outerthumb{
        .flex(0 0 3.83rem); width: 3.83rem;
    }
    .thumb{
        width: 100%; height: 0;
        padding-top: 100%;
    }
    .thumbRight {
      .outerthumb {
        order:1;
      }
      .mainbox {
        order:0;
        margin-left: 0;
      }
    }
</style>
