<template>
    <article class="docdetail">
        <header class="relative bbox">
          <h3>{{doc.specialName}}</h3>
          <p class="colorSize">{{doc.hosName}} | {{doc.depName}}</p>
          <div class="thumb bgcove radius50 absolute" :style="`background-image:url(${imgsrc(doc.listSpecialPicture)})`"></div>
        </header>
        <section>
          <div class="infomain" style="height:2.27rem;">
            <div class="title">
            </div>
            <div class="info">
            </div>
          </div>
          <div class="infomain">
            <div class="title base12">
              执业点
            </div>
            <div class="info relative base12 bbox">
              <span class="absolute"></span>
              <i class="absolute"></i>
              <p>{{doc.hosName}}</p>
              <p>{{doc.depName}} ({{doc.userType == '3' ? '医生' :'专家'}})</p>
            </div>
          </div>

          <div class="infomain">
            <div class="title base12">
              团队
            </div>
            <div class="info relative base12 bbox" v-if="teams.length">
              <span class="absolute"></span>
              <i class="absolute"></i>
              <p v-for="(item, idx) in teams" :key="idx">{{ item.teamName }}</p>
            </div>
            <div v-else class="info relative base12 bbox">
              <span class="absolute"></span>
              <i class="absolute"></i>
              <p class="graycolor">暂无所属团队</p>
            </div>
          </div>

          <div class="infomain">
            <div class="title base12">
              擅长领域
            </div>
            <div class="info relative base12 bbox">
              <span class="absolute"></span>
              <i class="absolute"></i>
              <p v-if="doc.specialty">{{ doc.specialty }}</p>
              <p v-else class="graycolor"> 暂无</p>
            </div>
          </div>

          <div class="infomain">
            <div class="title base12">
              个人简介
            </div>
            <div class="info relative base12 bbox">
              <span class="absolute"></span>
              <i class="absolute"></i>
              <p v-if="doc.profile">{{ doc.profile }}</p>
              <p class="graycolor" v-else>毕业院校、进修经历、获奖履历、执业经历等</p>
            </div>
          </div>
        </section>
    </article>
</template>
<script>
    import { ItemFlexImg } from '@components/share'
    import { imgsrc } from '@filters'
    export default {
        name: 'docinfo',
        components: {
            ItemFlexImg
        },
        data () {
            return {
                id: this.$route.params.id,
                doc: {},
                teams:{}
            }
        },
        created () {
            // 医生基本信息
            this.$http.get(this.$urls.DOCMAIN, { docid: this.id }).then(d => {
                this.doc = d.doc || {};
            })
            //医生所属团队
           this.$http.get(this.$urls.GAINDOCBELONGTEAMS, { docid: this.id })
             .then(d=> {
              this.teams = d.teams || {};
           })
        },
        methods: {
            imgsrc
        }
    }
</script>

<style scoped lang="less">
    @import '../../../assets/css/var';
    .docdetail{
      background-color: #fff;
    }
    header{
         height:5.85rem;
         line-height: 1.5rem;
         background-color: #fff;
         padding:1.3rem @body-margin 0 0;
         margin-left: @body-margin;
         border-bottom:2px solid @main-bg-color;
        h3 {
            font-size:1.615rem;
            color:#222;
            font-weight:normal;
            letter-spacing: .2rem;
            margin-bottom:.6rem;
        }
        .colorSize{
            color: #878d99;
            font-size:@body-margin;
        }
        .thumb {
            width:3.07rem;
            height:3.07rem;
            top:1.3rem;
            right:2rem;
        }
    }
    section {
        padding:0 1rem 1rem;
        .graycolor {
            color:#878d99;
        }
        p{
            padding-bottom: .6rem;
            line-height: 1.5em;margin: 0 1rem;
        }
        .title {
            display:inline-block;
            width:20%;
            color:#0086d1;
            vertical-align:top;
        }
        .info{
            width:77%;
            min-height:5rem;
            display:inline-block;
            border-left:1px solid #0086d1;
            color:#222;
            span{
                width:.5rem;
                height:.5rem;
                border-radius:50%;
                margin-top:.25rem;
                margin-left:-.25rem;
                background-color: #0086d1;
                z-index:3;
            }
            i{
                width:1rem;
                height:1rem;
                border-radius:50%;
                margin-top:0;
                margin-left:-.5rem;
                background-color: @main-color-lower;
            }
        }
    }


</style>
