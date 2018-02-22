<template>
  <div class="h100 notifyspopups">
      <p class="notict bgfff">医生公告</p>
      <dl>
          <dd v-for="(item, ind) in notifys" :key="ind">
              <p class="big12 blacklower">{{item.content}}</p>
              <p class="time">{{item.timeStr}}</p>
          </dd>
      </dl>
  </div>
</template>
<script>
  export default {
      name: 'doctotifys',
      data (){
          return {
              notifys:'',
              id:this.$route.query.docId
          }
      },
      created (){
          // 医生动态信息
          this.$http.get(this.$urls.GAINDOCTORNOTIFYS, { doctorId: this.id })
              .then( d => {
                  this.notifys = d.notifys
              })
      }
  }
</script>
<style scoped lang="less">
  @import '../../../assets/css/var';
  .notifyspopups{
        background: #eee;
            .notict{
                color: #222;
                text-align: left;
                font-size:1.6rem;
                padding: 1.5rem 0 .9rem 1rem;
            }
            dl{ padding:0  1rem; background:#fff; }
            .time {
                font-size:.846rem;
                color:#9196a1;
                padding-bottom:1.15rem;
            }
            dd{
                position: relative;
                padding-top: 1.6rem;
                p{
                    line-height: 1.5;
                    &:first-child{ color: #222; padding-bottom:1.3rem;}
                }
                & + dd{
                    &:after{
                       .setTopLine(#eee);
                    }
                }
            }
  }
</style>
