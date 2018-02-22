<template>
  <section class="privateserver">
        <div class="bgfff" :style="`padding-bottom: ${docs.length? 0 : 1.5}rem`">
            <img src="../../../assets/img/privatedocbg.png" alt="" class="w100">
            <div class="title flex">
                <i class="flex_1"></i><span>优选医生</span><i class="flex_1"></i>
            </div>
        </div>
        <div v-if="docs.length" style="padding-bottom:4.25rem;background:#fff;">
            <item-flex-img v-for="(doc,index) in docs" :key="index" :link="'/docinfo/' + doc.specialId"
                            :img="doc.listSpecialPicture" :borderBottom="true" radius="9999px" class="itemdoc relative"
                            style="padding: 1.5rem 1rem 1.3rem 0" size="4rem">
                <p>
                    <span class="big14 blacklower">{{doc.specialName}} </span>
                    <span class="small10 gray">{{ doc.duty }}</span>
                </p>
                <p class="absolute star"><score :value="doc.aver" fontStyle="italic" fontSize="1.22rem"></score></p>
                <p class="small11 blacklower">{{doc.hosName}}&ensp; {{doc.depName}}</p>
                <p class="whitespace small10 gray">擅长: {{doc.specialty || '暂无'}}</p>
                <p style="margin-top:.5rem;">
                    <span v-for="(p,index) in doc.vipServiceDtoList" :key="index" class="blacklower package small10">{{ p.packageName }} / <span class="warncolor">{{ p.amount }}</span></span>
                </p>
            </item-flex-img>
        </div>
        <load-more v-else :tip="'暂无数据'" :show-loading="false" background-color="#eee"></load-more>
        <footer class=" fixed bottom bbox">
            <router-link :to="{ path: '/libs/doc/all', query:{ distCode: distCode ,serviceId: '15' } }" class="btn">查看全部家庭医生</router-link>
        </footer>
  </section>
</template>
<script>
    import { ItemFlexImg, Score } from '@components/share'
    import { LoadMore } from 'vux'
    export default {
        components: {
            ItemFlexImg, Score, LoadMore
        },
        data (){
            return {
                docs: '',
                distCode: this.$route.query.distCode || ''
            }
        },
        created (){
            this.$http.get(this.$urls.GAINDOCTORS, {
                dtype: 3,
                ispage: 1,
                pageNo: 1,
                pageSize: 4,
                distCode: this.distCode,
                serviceId: 15,
            }).then(d => {
                this.docs = JSON.parse(d.docs)|| {};
            })
        }
    }
</script>
<style scoped lang="less">
    @import '../../../assets/css/var';
    .privateserver {
        .title  {
              margin: 0 1.56rem;
              text-align: center;
              i{
                   height: 1px;
                   margin-top: 1.05rem;
                   background: #a9dff7;
               }
              span {
                  background: @main-color;
                  border-radius: 1.4rem 1.4rem .4rem .4rem;
                  color: #fff;
                  height: 2.1rem;
                  width: 6.8rem;
                  line-height: 2.1rem;
                  margin: 0 1.2rem
              }
         }
    }
    .itemdoc {
        p + p {
           padding-top: .5rem;
        }
        .package {
            background: #fff9ee;
            display:  inline-block;
            height: 1.375rem;
            padding:  .1rem .6rem 0;
            line-height:  1.375rem;
            text-align: center;
            border-radius:  .2rem;
            margin-right: .6rem;
        }
        p.star {
            top:  .6rem;
            right:  1rem;
        }
    }
    footer {
        width:  100%;
        text-align: center;
        margin-bottom: 1.5rem;
        background: transparent;
        .btn {
            display:  inline-block;
            width:  12.8rem;
            height: 2.75rem;
            line-height:  2.75rem;
            text-align: center;
            background-color: @main-color;
            color:  #fff;
            border-radius:  3rem;
            box-shadow: 0 0 10px @main-color;
        }
    }
</style>
<style lang="less">
  .privateserver {
      .itemlist {
        margin-left: 1rem;
      }
  }
</style>
