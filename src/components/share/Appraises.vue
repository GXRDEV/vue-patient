<template>
    <section :class="{'morepage': more}" style="margin-top:0;" class="appraisespag">
        <div v-if="showHeader">
            <router-link :to="link" class="weui-cell vux-tap-active weui-cell_access">
                <div class="vux-cell-bd vux-cell-primary small11">
                    <p class="big14">患者评价<small v-if="acount">({{ acount }})</small><small v-else style="opacity: .6">(暂无评价)</small></p>
                </div>
                <div v-if="!more" class="weui-cell__ft">查看更多</div>
            </router-link>
        </div>
        <div class="appraisestag small11" v-if="tags.length">
            <span class="impress"><i class="thumb bgcove"></i>印象 &ensp;</span>
            <span class="taglabel" v-for="(tag, idx) in tags" :key="idx">
                {{ tag.name }}({{ tag.num }})
            </span>
        </div>
        <dl class="judgments" v-if="appraises.length">
            <dd class="judgment" v-for="i in appraises" :key="i.id">
                <cell class="cells">
                    <span slot="icon" class="patientname">{{i.patientName | obscure}}<label v-if="i.typeStr"> ({{ i.typeStr }})</label></span>
                    <star v-model="i.grade" :width=".84" :height=".84" :margin="0.23" disabled></star>
                </cell>
                <p style="color: #878d99;line-height:1.5;">{{ i.content || '暂无' }}</p>
                <p class="tright relative time">
                  <span class="small11 gray">{{ i.timeStr | format }}</span>
                </p>
            </dd>
        </dl>
        <div class="form-group" v-if="showFooter" style="text-align:right;padding-bottom: 1rem">
            <router-link :to="link" class="jumpFoot" v-if="appraises.length"><span class="big" style="vertical-align: top">查看更多</span> <i class="iconfont icon-arrright small10"></i></router-link>
        </div>
    </section>
</template>
<script>
    import { Group, Cell } from 'vux'
    import { obscure, format } from '@filters'
    import { Star } from '@components/share'
    export default {
        name: 'appraises',
        components: {
            Group, Cell, Star
        },
        filters: {
            obscure, format
        },
        props: {
            oid: [String, Number],
            more: Boolean,
            type: {
                type: String,
                default: 'doc'
            },
            size: {
                type: Number,
                default: 10
            },
            showHeader: {
                type: Boolean,
                default: true
            },
            showFooter: {
                type: Boolean,
                default: false
            }
        },
        created () {
            this.oid && this.load()
        },
        watch: {
            oid (v) {
                v && this.load()
            }
        },
        data () {
            return {
                appraises: [],
                tags: [],
                acount: 0,
                pageNo: 1
            }
        },
        computed: {
            link () {
                return this.more ? '' : `/appraise/${this.type}/${this.oid}`
            }
        },
        methods: {
            load () {
                this.$http.get(this.$urls.GAINAPPRAISES, {
                    [this.type == 'doc' ? 'docid' : 'teamUuid']: this.oid,
                    pageNo: this.pageNo,
                    pageSize: this.size
                }).then(d => {
                    let appraises = d.appraises ? JSON.parse(d.appraises) : []
                    this.appraises = this.appraises.concat(appraises)
                    this.tags = d.tags || []
                    this.acount = d.count || 0
                    let isEnd = appraises.length == this.size
                    isEnd && this.pageNo++;
                    if(this.more){
                        this.$emit('on-more', isEnd)
                    }
                })
            }
        }
    }
</script>
<style scoped lang="less">
    @import '../../assets/css/var';
    .appraisestag{
        padding: 6px 10px;
        background: #fff;
        .taglabel{
            display: inline-block;
            border: 1px solid @font-color;
            color: #fff;
            background-color: @font-color;
            padding: 1px 6px;
            border-radius: 4px;
            margin: 0 1em 0.5em 0;
        }
        .impress{
          color: @font-color;
        }
        .thumb {
          width:.846rem;
          height:.846rem;
          margin-right:.3rem;
          background-image: url(../../assets/img/info/impress.png);
        }
    }
    .judgments{
        padding: 0 15px;
        .judgment{
            color: #aaa;
            background: #fff;
            padding-bottom: .88rem;
            word-break: break-all;
            word-wrap: break-word;
            border-top: 1px solid #F2F2F2;
            .patientname {
              font-size: 1.07rem;
            }
            .weui-cell {
              padding:.88rem 1.3rem;
            }
            .time{
              margin-top:1rem;
            }
            label{
              color: @main-color;
            }
            .cells{
                margin: 0 -15px;
            }
        }
    }
    .jumpFoot{
        padding: .5rem 1rem 0.5rem 2rem;
        display: inline-block;
        background: @main-color;
        border-top-left-radius: 1rem;
        border-bottom-left-radius: 1rem;
        color: #fff
    }
</style>
<style lang="less">
  .appraisespag {
      .weui-cell_access .weui-cell__ft {
          color: #999; font-size: 1rem;
          &:after {width: 0; height: 0;}
       }
  }
</style>
