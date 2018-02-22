<template>
    <div>
        <header>
            我的评价 ({{number}})
        </header>
        <div class="myeval">
            <div class="myeval-main" v-for="(item, ind) in list" :key="ind" >
                <div class="myeval-head flex">
                    <i class="thumb radius50 bgcove " :style="`background-image:url(${imgsrc(item.headImageUrl, 'doc')});`"></i>
                    <p class="flex_1">
                        <span class="strong big13">{{item.docName}}</span>
                        <span>&ensp;{{item.hosName}}&ensp;</span><span>{{item.depName}}</span>
                    </p>
                </div>
                <div class="flex myeval-star">
                    <span style="padding-right: 0.2rem">评星：</span>
                    <star class="flex_1" style="margin-top:0.2rem" v-model="item.grade" :width=".92" :height=".84" :margin="0.23" disabled></star>
                </div>
                <div class="myeval-label flex" v-if="item.impressionString">
                    <span style="padding-right: 0.2rem; padding-top: 0.2rem">标签：</span>
                    <div class="flex_1">
                        <span class="label" v-for="(lab, index) in label[ind]" :key="index">{{lab}}</span>
                    </div>
                </div>
                <div class="myeval-txt">
                    <p style="padding-bottom: 0.8rem" v-if="item.content">{{item.content}}</p>
                    <p class="timer">{{item.timeStr}}</p>
                </div>
            </div>
        </div>
        <no-order v-if="noEval" text="您还没有评价过医生" :haslink="false"></no-order>
    </div>
</template>
<script>
    import { imgsrc } from '@filters'
    import { NoOrder, Star } from '@components/share'
    import { mapState } from 'vuex'
    export default {
        components: {
            Star, NoOrder
        },
        computed: {
            ...mapState({
                userid: state => state.userid
            })
        },
        data (){
            return{
                number: 0,
                noEval: false,
                list: [],
                label: {}
            }
        },
        mounted () {
            this.initData()
        },
        methods: {
            imgsrc,
            initData () {
                let that = this
                this.userid && this.$http.get(this.$urls.QUERYESTIMATE, {
                    userId: this.userid
                }).then(d => {
                    this.number = d.count
                    this.list = d.list || []
                    this.noEval = !d.count
                    this.list.forEach(function(val, ind){
                        if(val.impressionString){
                            that.label[ind] = val.impressionString.split(',')
                        }
                    })
                })
            }
        }
    }
</script>
<style lang="less" scoped>
    @import '../../../assets/css/var';
    header{
        height: 2.75rem;
        line-height: 2.75rem;
        padding-left: .9rem;
    }
    .myeval{
        background: #fff
    }
    .myeval-main{
        padding: .83rem .9rem .83rem 0;
        margin-left: .9rem;
        border-bottom: 1px solid #eee;
        .myeval-head{
            i{
                height: 2.3rem;
                width: 2.3rem;
                display: inline-block;
                margin-right: 0.9rem;
            }
            p{

                line-height: 2.4rem
            }
        }
        .myeval-star{
            margin: 1.1rem 0 .55rem 0
        }
        .myeval-label{
            margin-bottom: 0.3rem;
            .label{
                display: inline-block;
                color: #fff;
                padding: 0.2rem 0.35rem;
                border-radius: 0.2rem;
                background: #878d99;
                font-size: .9rem;
                margin: 0 0.5rem 0.5rem 0
            }
        }
        .myeval-txt{
            line-height: 1.4rem;
            p:first-child{
                word-break: break-all;
                word-break: break-word;
            }
            .timer{
                text-align: right;
                color: #c1c1c1;
            }
        }
    }
    .myeval-main:last-child{
        border-bottom: 0
    }
</style>
