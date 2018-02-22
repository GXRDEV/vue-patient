<template>
  <item-flex-img :link="link" :size="size" radius="50%" class="docitem" :img="item.listSpecialPicture" :borderBottom="true">
    <p>
      <span class="big15">{{item.specialName}}</span>&ensp;
      <span class="gray small">{{item.duty}}&ensp;{{item.profession}}</span>
      <score :value="item.aver" fontStyle="italic" fontSize="1.22rem"></score>
    </p>
    <p class="whitespace">{{item.hosName}}&ensp;{{item.depName}}</p>
    <p class="whitespace">擅长：{{item.specialty || '未知'}}</p>
    <open-services :item="item" :type="type"></open-services>
  </item-flex-img>
</template>

<script>
  import { ItemFlexImg, OpenServices, Score } from '@components/share'
  export default {
    name: 'docitem',
    components: {
        ItemFlexImg, OpenServices, Score
    },
    props: {
      item: Object,
      router: Object,
      size: String,
      type: {
        type: [String, Number],
        default: 'doc'
      }
    },
    computed: {
      link () {
        return `/${this.dtype}info/${this.item.specialId}`
      },
      dtype () {
        return this.type == '2' || '3' ? 'doc' : this.type
      }
    }
  }
</script>

<style scoped lang="less">
@import "../../assets/css/var";
.docitem {
    p {
        line-height: 1.4;
        &:nth-child(1) {
            position: relative;
            z-index: 0;
            color: #222;
            padding-bottom: .3rem;
            .star {
                position: absolute;
                right: 5px;
            }
        }
        &:nth-child(3) {
            color: #aaa;
            font-size: 0.92rem;
            padding: 0.6em 0;
        }
    }
}
</style>
