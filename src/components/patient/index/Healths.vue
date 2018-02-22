<template>
  <div class="mainpage bgfff h100">
      <div class="tab-main flex column">
          <div class="tabs">
              <span class="inlineblock big12" v-for="(t,index) in tabs" :key="index" :class="{'checked' : form.type == t.id}" @click="tabClick(t.id)"><span>{{ t.typeName }}</span></span>
          </div>
          <scroller lock-x scrollbar-y use-pullup :prevent-default="false"
                    :pullup-config="pullupConfig" height="100%"
                    v-model="scroll"
                    @on-pullup-loading="loadPullUp"
                    ref="scroller" class="flex_1">
              <div class="scroller-main">
                  <div class="tab-item clearfix" v-for="item in healthlist" :key="item.id">
                      <a :href = "item.textLink" class="ohidden block">
                          <i class="thumb bgcove" :style="`background-image:url(${imgsrc(item.backImage, 'health', 112)})`"></i>
                          <div>
                              <p class="title">{{ item.title }} </p>
                              <span class="small11 time gray">{{ item.timeStr }}</span>
                          </div>
                      </a>
                  </div>
              </div>
          </scroller>
    </div>
  </div>
</template>

<script>
  import { Scroller } from 'vux'
  import { imgsrc } from '@filters'
  export default {
      name: 'healths',
      components: {
          Scroller
      },
      created (){
          this.loadPullUp();
          //获取tab栏数据
          this.$http.get(this.$urls.GAINPLATHEALTHTYPES).then(d=> {
              this.tabs = d.types;
          })
      },
      data (){
          return {
              pullupConfig: this.$store.state.pullupConfig,
              scroll: {
                pullupStatus: ''
              },
              healthlist: [],
              form:{
                type: this.$route.params.type,
                pageNo: 1,
                pageSize: 10
              },
              tabs: ''
          }
      },
      methods: {
          imgsrc,
          loadPullUp (){
              this.$http.get(this.$urls.HEALTHINFORMATION, this.form, this).then(d => {
                  let lists = d.resources;
                  this.healthlist = this.healthlist.concat(lists);
                  this.$nextTick(() => {
                      this.$refs.scroller.reset(this.form.pageNo == 1 ? {top: 0} : {})
                  })
                  setTimeout(() => {
                      if (lists.length == this.form.pageSize) {
                          this.form.pageNo++;
                          this.scroll.pullupStatus = 'default'
                      } else {
                          this.scroll.pullupStatus = 'disabled'
                      }
                  }, 200)
              })
          },
         //tab切换
          tabClick ( index ){
              index = index || 1;
              this.healthlist = [];
              this.form.pageNo = 1;
              this.form.type = index;
              this.scroll.pullupStatus = 'enabled'
              this.$nextTick( () => {
                  this.$refs.scroller.reset({ top: 0 })
              });
              this.loadPullUp();
          }
      }
  }
</script>
<style lang="less" scoped>
  @import "../../../assets/css/var";
  .scroller-main {
    padding:0 1rem;
  }
  .tab-main {
        height:100%;
      .tab-item {
          position: relative;  border-top: 1px solid @main-bg-color;  padding: 1.07rem 0;
          .thumb {
            width: 8.65rem;  height: 5.38rem;  float: left;  margin-right: .5rem;
          }
          .title {
            font-size: 1.07rem;  color: #222222;  overflow: hidden;
            .setMultEllipsis();
          }
          .time {  position: absolute;  bottom: 1rem;  right: 0;  }
      }
      .tabs {
            padding: 0 1rem;
            height: 3.08rem;
            span {
                padding: 0 .5rem;
                display: inline-block;
                color: #222;
                line-height: 3.08rem
            }
      }
      .checked span {
          position: relative;
          color: @main-color;
          &:after{ content: ""; position: absolute; bottom: 0; left: 0; right: 0; border-radius: 3px;  height: 3px; background: @main-color; }
      }
  }
</style>
