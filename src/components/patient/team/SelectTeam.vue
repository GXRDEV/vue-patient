<template>
  <article class="selectteam bgfff h100">
      <div class="belongdocteam">
          <h3>选择医生所在团队</h3>
          <p class="base12">选择您报到的医生所在的其中一个团队，将获得一次<span class="free">免费团队问诊服务</span></p>
          <div class="docmainlist" v-if="belongteams.length">
              <div class="doclist clearfix relative" v-for="(item, index) in belongteams" :key="index">
                  <div class="docteamlogo">
                      <i class="thumb bgcove" :style="`background-image:url(${imgsrc(item.logoUrl,'teamlogo')})`"></i>
                  </div>
                  <div class="docteaminfo">
                      <p class="name">{{item.teamName}}</p>
                      <p class="whitespace base12 info"><span class="specialty"></span>{{item.speciality}}</p>
                      <p class="member">
                          <i class="thumb bgcove" v-for="(m,ind) in item.members" :key="ind" :style="`background-image:url(${imgsrc(m.headImageUrl)})`"></i>
                          <span class="small11 blacklower"><span class="maincolor">{{ item.memberCount }}</span>位成员组成<i class="arrow"></i></span>
                      </p>
                  </div>
                  <div class="selectradio absolute">
                      <input type="radio" v-model="teamuuid" :value="item.uuid" :id="item.uuid"/>
                      <label :for="item.uuid"></label>
                  </div>
              </div>
          </div>
      </div>
      <footer class="fixedbottom bgfff">
          <div class="fixed left right bottom tcenter db-button nobg">
              <x-button @click.native="jumpReport" type="primary" class="weui-btn_circle weui-btn_del">暂不选择</x-button>
              <x-button @click.native="jumpto" type="primary" class="weui-btn_circle">确认</x-button>
          </div>
    </footer>
  </article>
</template>
<script>
  import { XButton } from 'vux'
  import { imgsrc } from '@filters'
  export default {
      name: 'selectteam',
      components :{
          XButton
      },
      data () {
          return {
              openid: this.$store.state.openid,
              id: this.$route.params.id,
              belongteams:'',
              teamuuid:'',
              timer: new Date().getTime()
          }
      },
      created () {
          //获取医生所属医生团队数据
          this.$http.get( this.$urls.GAINDOCBELONGTEAMS, { docid: this.id })
              .then( d => {
                  this.teamuuid = d.teams[0].uuid;
                  this.belongteams = d.teams||{};
              })
      },
      methods: {
          imgsrc,
          jumpto() {
              this.$router.push( '/report/'+this.id+'/'+this.teamuuid+'/'+this.timer  );
          },
          jumpReport(){
              this.$router.push('/report/'+this.id+'/'+this.timer);
          }
      }
  }
</script>
<style scoped lang="less">
  @import '../../../assets/css/var';
  .selectteam {
      overflow:auto;
      .docmainlist {
          margin-top: .8rem;
      }
      .selectradio {
          top: 50%;
          right: 1rem;
          margin-top: -.75rem;
      }
  }
  h3 {
      font-size: 1.6rem;
      font-weight: normal;
      margin-bottom: .4rem;
      color: #222;
  }
  .belongdocteam {
      padding: 1.23rem @body-margin 0;
      p{
          line-height: 1.6rem;
      }
      .free {
          color: #f8b83b;
      }
      .doclist {
          padding: 1.07rem .7rem .92rem;
          background: #f3f8fb;
          margin-bottom: .92rem;
          .docteamlogo {
              float: left;
              .thumb {
                  display: inline-block;
                  width: 2.5rem;
                  height: 2.5rem;
                  border-radius: 50%;
                  margin-right: .9rem;
              }
          }
      }
  }
  .docteaminfo {
      overflow: hidden;
      .name {
          font-size: 1.077rem;
          color:#222;
          margin-bottom: .5rem;
      }
      .info {
          display: inline-block;
          color: #878d99;
          width: 88%;
      }
      .specialty {
          width: 2.16rem;
          height: 1.1rem;
          display: inline-block;
          margin-right:.3rem;
          background-image: url(../../../assets/img/aboutdoc/specialty.png);
          background-size:100% 100%;
          vertical-align: text-top;
      }
  }
  .member {
      margin-top: .5rem;
      span{
         position: relative;
      }
      .arrow {
          display: inline-block;
          width: .5rem;
          height: .5rem;
          border-top: 2px solid #aaa;
          border-right: 2px solid #aaa;
          transform: rotate(45deg);
      }
      .thumb {
          display: inline-block;
          vertical-align: middle;
          width: 1.73rem;
          height: 1.73rem;
          border-radius: 50%;
          margin-right: .5rem;
      }
  }
  .btn {
      float: left;
      width: 50%;
      font-size: 1.23rem;
      height: 3.7rem;
      line-height: 3.7rem;
      padding: 0;
  }
  input[type="radio"]{
      opacity:0;
      & ~ label{
            display: inline-block;
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 50%;
            background: url('../../../assets/img/team/checkteam.png') center no-repeat;
            background-size: cover
          }
      &:checked ~ label{
           display: inline-block;
           width: 1.5rem;
           height: 1.5rem;
           background: url('../../../assets/img/team/checkedteam.png') center no-repeat;
           background-size: cover;
           border-radius: 50%;
       }
  }
</style>
<style lang="less">
  .selectteam {
      .weui-btn + .weui-btn {
          margin-top: 0;
      }
  }
</style>

