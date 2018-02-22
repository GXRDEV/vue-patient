<template>
    <article class="bgfff">
        <div class="docexplain relative">
            <item-flex-img :img="doc.listSpecialPicture" radius="9999px"
                           style="padding: 0;" size="5rem">
                <p class="bigtitle relative">
                  <span class="big16 blackcolor">{{ doc.specialName }}&ensp;</span>
                  <span class="big15 graylight" v-if="doc.duty">{{ doc.duty }} </span>
                  <span v-if="doc.userType == 3" class="big15 graylight">帮助患者{{totalcount}}人</span>
                </p>
                <p class="big15 graylight">{{doc.hosName}} {{doc.depName}}</p>
            </item-flex-img>
        </div>
        <div class="servicelists">
            <div class="seritem">
                <div v-for="(item, idx) in services" :key="idx" class="consu relative bbox" :class="{'disabled': !item.isOpen}" @click="jump(item)">
                    <i class="thumb" :class="iconFun(item)"></i>
                    <div class="ohidden bbox" style="padding-right:1rem;padding-top:.5rem;">
                        <span class="yellow big15 absolute" v-if="item.isOpen && item.serviceId != 13">￥{{ item.amount || 0 }}</span>
                        <span class="big15 whitespace" :class="{'blackcolor':item.isOpen, 'graylight': !item.isOpen}">{{ item.serviceName }} </span>
                        <template v-if="doc.userType == 3">
                            <span class="graylight base12">|</span>
                            <span class="maincolor base12 remark" v-if="item.isOpen" :class="{'reportcolor': item.serviceId == 13}">
                              {{ item.count|| 0 }}人{{ item.serviceId == 13 ? '已送': '问过' }}
                            </span>
                            <span class="graylight base12 remark" v-else>暂未开通</span>
                        </template>
                        <template v-else>
                            <span v-if="!item.isOpen">暂未开通</span>
                        </template>
                        <p class="graylight small11" style="margin-top: .5rem;">{{item.description}}</p>
                    </div>
                </div>
            </div>
        </div>
    </article>
</template>
<script>
    import { ItemFlexImg } from '@components/share'
    export default {
        name: 'buyservice',
        components: {
           ItemFlexImg
        },
        data (){
            return {
                id: this.$route.params.id,
                doc: {},
                timer: new Date().getTime(),
                totalcount: 0,
                services: [],
                uid: this.$route.query.uid, // 随访对象id
                otype: this.$route.query.otype, // 订单类型, 患者报到8
                sendObj: {
                    isOpen: 1,
                    serviceName: "送心意",
                    description: "您所赠送的心意，将用于感谢医生，感谢医生的付出",
                    count: 0,
                    serviceId: 13,
                    custom: true
                }
            }
        },
        created (){
            this.$http.get(this.$urls.DOCMAIN, { docid: this.id }).then(d=>{
                this.doc = d.doc || {}
                this.sendObj.count = d.warmcount
                this.services = d.services || []
                if(d.doc.userType == 3){
                    d.services[0].isOpen == 1 ? (this.services.splice(1,0,this.sendObj)): (this.services.unshift(this.sendObj))
                }else {
                   this.services.unshift(this.sendObj)
                }
                let num = 0;
                d.doc.userType == 3 && d.services.forEach((item)=>{
                     if(item.isOpen == 1){
                        num += item.count
                     }
                })
                d.doc.userType == 3 && (this.totalcount = d.report_count + num)
            })
        },
        methods: {
            iconFun(item) {
                let sing = !item.isOpen ? '-disabled' : ''
                switch (item.serviceId) {
                    case 6: return 'icon-doc-img' + sing;
                    case 3: return 'icon-doc-video' + sing;
                    case 4: return 'icon-exp-video' + sing;
                    case 5: return 'icon-exp-img' + sing;
                    case 13: return 'icon-send-icon' + sing;
                }
            },
            jump (item) {
                if(item.isOpen && item.serviceId != 13){
                    this.$router.push(this.doc.userType == 3 ? {
                        path: '/interrogation/' + this.timer,
                        query: { docid: this.id, price: item.amount, sever: item.serviceId + '' }
                    } : {
                        path: '/inquiry',
                        query: { docid: this.id, depId: this.doc.standardDepId, sever: item.serviceId + '' }
                    })
                }else if(item.custom) {
                    this.$router.push({ path: '/give',query: { docid: this.id, otype: this.otype, uid: this.uid, back: this.$route.query.back } } )
                }
            }
        }
    }
</script>
<style scoped lang="less">
  @import '../../../assets/css/var';
  .graycolor { color: #666;}
  .graylight { color: #999;}
  .reportcolor { color: #ff7a7a }
  .docexplain {
      padding: 1rem;
  }
  .bigtitle {
      margin: .33rem 0 .8rem;
  }
  .servicelists {
      background-color: #fff;
      .consu {
          color: #0086d1;
          padding: 1rem 0;
          border-top: .4rem solid #eee;
          &.disabled {
             color: #666;
           }
      }
      .thumb {
          float: left;
          width: 3.6rem;
          height: 3.6rem;
          overflow: hidden;
          margin: 0 .8rem;
        .backgroundSize(auto 100%);
      }
      .icon-doc-img {
          background-image: url(../../../assets/img/aboutdoc/doc-img.png)
      }
      .icon-doc-img-disabled {
          background-image: url(../../../assets/img/aboutdoc/doc-img-disabled.png)
      }
      .icon-doc-video {
          background-image: url(../../../assets/img/aboutdoc/doc-video.png)
      }
      .icon-doc-video-disabled {
          background-image: url(../../../assets/img/aboutdoc/doc-video-disabled.png)
      }
      .icon-send-icon {
          background-image: url(../../../assets/img/aboutdoc/send-icon.png)
      }
      .icon-exp-img {
          background-image: url(../../../assets/img/aboutdoc/exp-img.png)
      }
      .icon-exp-img-disabled {
          background-image: url(../../../assets/img/aboutdoc/doc-img-disabled.png)
      }

      .icon-exp-video {
          background-image: url(../../../assets/img/aboutdoc/exp-video.png)
      }
      .icon-exp-video-disabled {
          background-image: url(../../../assets/img/aboutdoc/doc-video-disabled.png)
      }

      span {
        line-height: 1;
      }
      .yellow {
          color: #eca614;
          top: 50%;
          right: 1rem;
          margin-top:-.625rem;
      }
  }
</style>
