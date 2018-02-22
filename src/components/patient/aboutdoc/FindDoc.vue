<template>
    <article class="finddoc h100 flex column">
        <search-bar class="absolute top left right gspsearch" :address="gpsName" placeholder="请输入医院 | 科室 | 医生姓名"></search-bar>
        <div style="overflow-y:auto;margin-top:3.26rem;" class="bgfff">
            <well-know-doc :gpsCode="gpsCode" title="优质医生推荐" subtitle="" :img="false" :islink="false" ></well-know-doc>
            <hot-depart :gpsCode="gpsCode" :router="{ path: '/libs/doc/all', query:{ distCode: gpsCode} }" title="按热门科室查找" subtitle="" :img="false" :islink="false"></hot-depart>
            <section class="hospital">
                <group gutter="0">
                    <cell class="big19 blacklower" title="按附近医院查找"></cell>
                </group>
                <dl v-if="hoss.length">
                    <dd class="bbox relative blacklower" v-for="(hos,ind) in hoss" :key="ind" @click="jumpto(hos)">
                        <span class="base14">{{hos.displayName}}</span>
                        <span class="maincolor small10 hoslevel" :data-txt="hos.hosLevel">{{hos.hosLevel}}</span>
                        <i class="absolute right arrow"></i>
                    </dd>
                </dl>
            </section>
        </div>
    </article>
</template>
<script>
    import { Group, Cell } from 'vux'
    import { HotDepart, WellKnowDoc, SearchBar } from '@components/share'
    import { mapGetters } from 'vuex'
    import { imgsrc } from '@filters'
    export default {
        name: 'finddoc',
        components: {
          Group, Cell, SearchBar, HotDepart, WellKnowDoc
        },
        computed: {
            ...mapGetters(['gpsName', 'gpsCode'])
        },
        created (){
            //获取附近医院
            this.$http.get(this.$urls.GAINNEARHOSES, {
              ispage: 1,
              htype: 1,
              distCode: this.gpsCode,
              ismain: 'true',
              pageNo: 1,
              pageSize: 5
            }).then(d => {
                this.hoss = d.hospitals
            })
        },
        data (){
            return {
                hoss:[]
            }
        },
        methods : {
            jumpto(obj){
                this.$router.push({ path: '/libs/doc/all', query: { distCode: this.gpsCode, hosId: obj.id + '' } })
            }
          }
    }
</script>
<style lang="less" scoped>
    @import "../../../assets/css/var";
    header {
        box-sizing: border-box;
        height: 3.26rem;
        line-height: 3.26rem;
        background-color: #fff;
        border-bottom: 1px solid #eee;
    }
  .hospital {
      dd {
          padding:1.25rem 1rem 1.25rem 0;
          border-top:1px solid #eee;
          margin-left:1rem;
      }
      .hoslevel {
          color: transparent; white-space: nowrap;
          padding: .2rem .42rem; vertical-align: 3px;
          background: #e5f3fa; border-radius: .4rem;
          position: relative;
          margin-left: .67rem;
          &:after{
             content: attr(data-txt); color: @main-color;
             position: absolute;left: 50%; top: 50%; z-index: 1; transform: translate(-50%, -50%);
           }
      }
      .arrow {
          display:inline-block;
          width:.5rem;
          height:.5rem;
          border-left:2px solid #eee;
          border-bottom:2px solid #eee;
          transform:rotate(-135deg);
          right:1rem;
          top:50%;
          margin-top:-.25rem;
      }
  }
</style>
<style lang="less">
    .finddoc {
        .searchbarCom .searchbar-input {
            background-color: #eee;
            border-radius: 2rem;
            width: 100%;
            height: 2.125rem;
            color: #ccc;
            padding-left: .8rem;
            justify-content: flex-start;
            .magnifier {
                margin-right: .8em;
                background-image: url(../../../assets/img/main/searchicon.png);
            }
        }
        .itemtitle {
            border-bottom: .67rem solid #eee;
        }
        .weui-cell {
            padding: 1.25rem 1rem;
        }
    }
</style>
