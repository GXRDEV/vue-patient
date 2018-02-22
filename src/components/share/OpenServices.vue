<template>
  <div class="flex openservices">
      <span class="flex acenter jcenter" :class="{'disabled': !item.openAsk}">
          <i class="thumb icon-tupian1"></i>
          <span v-if="item.openAsk">{{item.askAmount || '0.00'}}元</span>
          <span v-else>未开通</span>
      </span>
      <span v-if="type=='doc' || type=='3'" class="flex acenter jcenter" :class="{'disabled': !item.openTel}">
          <i class="thumb icon-phone"></i>
          <span v-if="item.openTel">{{item.telAmount || '0.00'}}元</span>
          <span v-else>未开通</span>
      </span>
      <span class="flex acenter jcenter" :class="{'disabled': !item.openVedio}">
          <i class="thumb icon-xitongshexiangtou"></i>
          <span v-if="item.openVedio">{{item.vedioAmount || '0.00'}}元</span>
          <span v-else>未开通</span>
      </span>
  </div>
</template>

<script>
  export default {
    name: 'openservices',
    props: {
      item: Object,
      type: [String, Number]
    }
  }
</script>
<style scoped lang="less">
@import '../../assets/css/var';
/* 医生列表，团队主页开通的服务 */
.openservices {
    &>span {
        position: relative;
        font-size: 0.85rem;
        margin: 0; color: @main-color;
        &+span {
            margin-left: 1.33rem;
            padding-left: 1.33rem;
            &:after{
                .setLeftLine(#eee);
            }
        }
        span {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-left: 0.5rem;
        }
    }
    .thumb {
        font-size: 0;
        width: 1.3333rem;
        height: 1.5rem;
        overflow: visible;
        .backgroundSize(100% auto);
    }
    .icon-phone {
        background-image: url(../../assets/img/info/list-tel.png)
    }
    .icon-tupian1{
        background-image: url(../../assets/img/info/list-img.png)
    }
    .icon-xitongshexiangtou{
        background-image: url(../../assets/img/info/list-video.png)
    }
    .disabled {
        color: @gray-color;
        .icon-phone {
            background-image: url(../../assets/img/info/list-tel-disabled.png)
        }
        .icon-tupian1{
            background-image: url(../../assets/img/info/list-img-disabled.png)
        }
        .icon-xitongshexiangtou{
            background-image: url(../../assets/img/info/list-video-disabled.png)
        }
    }
}
</style>
