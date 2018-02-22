<template>
    <div class="h100vh bgfff flex column">
        <p class="title relative" @click="jump"><i></i>订单消息</p>
        <div class="orderlist scroll relative flex_1" v-scroll="onScroll">
            <div v-for="i in lists" :key="i.id" class="msglist relative" @click="jumpto(i)">
                <span class="big15" v-if="i.isRead != 1 " :class="orderTypeColor(i.businessType)">[{{orderState[i.businessType]}}]</span>
                <span v-else class="gray big15">[{{orderState[i.businessType]}}]</span>
                <span class="gray time small11 absolute">{{ i.timeStr }}</span>
                <label class="whitespace block big14" :class="{'gray': i.isRead == 1 }">{{ i.content }}</label>
            </div>
            <div class="nomessage" v-if="!lists.length"><img src="../../../assets/img/message/nomessage.png"/></div>
            <div class="loadingdiv" style="height: 2.6rem;" v-if="scroll.pullupStatus!='disabled'">
                <div class="weui-loadmore tcenter" style="margin: 0 auto; line-height: 2.6rem; color: #666;">
                    <i class="weui-loading" v-if="scroll.pullupStatus=='loading'"></i>
                    <span v-else>上拉加载更多</span>
                </div>
            </div>
        </div>
        <footer class="footer fixed bottom bbox" v-if="lists.length">
            <span class="clear fff" @click = "delMsg"><i class="iconclear bgcove"></i>清空消息列表</span>
            <span class="readed fff" @click = "allRead"><i class="iconread bgcove"></i>全部标记已读</span>
        </footer>
    </div>
</template>
<script>
  import Scroll from '@/directives/scroll'
  import debounce from 'vux/src/tools/debounce'
  export default {
      directives: {
          Scroll
      },
      data(){
          return {
              lists:[],
              orderState:this.$store.state.orderType,
              scroll:{
                  pullupStatus:'default',
                  bottom:2
              },
              query :{
                  openid:this.$store.state.openid,
                  pageNo:1,
                  pageSize:10
              }
          }
      },
      created () {
          this.loadPullUp()
      },
      methods:{
          onScroll: debounce(function(e, position) {
              let clientHeight = e.clientHeight
              let scrollHeight = e.scrollHeight
              let scrollH = clientHeight + position.scrollTop + this.scroll.bottom
              if (scrollH >= scrollHeight && this.scroll.pullupStatus == 'default') {
                this.loadPullUp()
              }
        }, 100),
      loadPullUp () {
          this.scroll.pullupStatus == 'loading'
          this.$http.get(this.$urls.GAINSYSTEMPUSHINFODATAS, this.query, this).then(d => {
              let cur = d.datas || []
              this.lists = this.lists.concat(cur)
              setTimeout(() => {
                  if (cur.length == this.query.pageSize) {
                      this.query.pageNo++
                      this.scroll.pullupStatus = 'default'
                  } else {
                      this.scroll.pullupStatus = 'disabled'
                  }
              }, 100)
          })
      },
      jumpto (item) {
          let id = item.doctorId
          let query = { id, oid: item.businessKey, otype: item.businessType }
          let route = { path: '/chat', query }

          if (item.businessType == 9 && !id) {
              route = { path: '/fastfind/' + item.businessKey, query: { from: this.$route.fullPath } }
          } else if (item.businessType == 4 || item.businessType == 5) {
              route = { path: '/details', query }
          }
          this.$http.post(this.$urls.UPDATESYSTEMPUSHINFOREAD, { systemPushInfoId: item.id })

          route && this.$router.push(route)
      },
      allRead (){
          this.$http.post(this.$urls.UPDATESYSTEMPUSHINFOREADALL ,{ openid:this.$store.state.openid })
          setTimeout(()=>{
              this.$router.go(0)
          },1000)
      },
      delMsg (){
          this.$vux.loading.show({text:'正在清空'});
          this.$http.post(this.$urls.DELALLMESSAGE, { 
              openid:this.$store.state.openid 
          }, this).then(d=>{
              this.$vux.loading.hide();
              this.lists = [];
              this.$vux.toast.show({ type: 'text', text: '删除成功', position: 'top' })
          })
      },
      jump (){
          this.$router.go(-1);
      },
      orderTypeColor(type){
          if(type == 11){
              return 'applycolor'
          }else if(type == 8){
              return 'reportcolor'
          }else {
              return 'maincolor'
          }
      }
    }
  }
</script>
<style lang="less" scoped>
    @import "../../../assets/css/var";
    .title {
        height: 3.07rem;
        line-height: 3.07rem;
        text-align: center;
        border-bottom: 1px solid #e5e5e5;
        padding: 0 1rem;
        font-size: 1.25rem;
        i{
            display: inline-block;
            width: .7rem;
            height: .7rem;
            border-left: 2px solid #ccc;
            border-bottom: 2px solid #ccc;
            transform: rotate(45deg);
            position: absolute;
            left: 1rem;
            top: 1rem;
        }
    }
    .orderlist {
        background: #fff;
        color: #222;
        padding-bottom: 3.65rem;
        .time {
            right: 1rem;
        }
        .reportcolor {
            color: #ef6666;
        }
        .applycolor {
            color: #f6ab00;
        }
    }
    .footer {
        width: 100%;
        margin-top: 2rem;
        span{
            float: left;
            width: 50%;
            height: 3.65rem;
            line-height: 3.65rem;
            font-size: 1.167rem;
            text-align: center;
        }
        .readed {
            background: @main-color;
        }
        .clear {
            background: #eee;
            color: #222;
        }
        i{
            display: inline-block;
            vertical-align: middle;
            margin-right: .3rem;
        }
        .iconclear {
            width: 1.3rem;
            height: 1.53rem;
            background-image: url(../../../assets/img/message/clear.png);
        }
        .iconread {
            width: 1.46rem;
            height: 1rem;
            background-image: url(../../../assets/img/message/readed .png);
        }
    }
    .msglist{
        background: #fff;
        padding: .96rem .8rem 1.1rem ;
        label{
            line-height: 1.2;
            margin-top: .5rem;
        }
        &:after{
            .setBottomLine(#e5e5e5);
            left: .8em;
        }
    }
    .nomessage {
        text-align: center;
        margin-top: 50%;
        img {
            width: auto;
            height: 8rem;
        }
    }
</style>
