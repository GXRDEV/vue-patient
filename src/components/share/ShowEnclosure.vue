<template>
    <div class="enclosure form-group">
        <header class="big14" :style="`color:`+color">
            {{title}}
            <router-link to="/enclosure" class="base14">
                <span class="iconfont icon-jia"></span>添加
            </router-link>
        </header>
        <section :style=" describe ? 'margin-top: 1rem' : ''">
            <router-link v-for="(item, ind) in attachments" :key="ind" class="enclo" :to="{path: '/enclosure', query: {id: getId(item), idx: ind}}">
                 <p class="enclo-title big15">
                     {{types[item.type]}}&emsp;<span class="base12 font-color" v-if="!isPerfect">{{format(item.reportTime, "yyyy-MM-dd", false)}}</span> 
                 </p>
                 <p class="remark big14" :class="{'font-color' : isPerfect}" v-if="item.remark">
                    {{item.remark}}  
                 </p>
                 <div v-if="item.files.length" class="relative img">
                    <i :style="`background-image:url(${imgsrc(item.files[0].url)})`" class="thumb bgcove"></i>
                    <div class="absolute img-len fff tcenter base12">共{{item.files.length}}张</div>
                 </div>
                 <p v-if="isPerfect" class="font-color base12" style="padding-top: .79rem">
                     {{format(item.reportTime, "yyyy-MM-dd", false)}}
                 </p>
            </router-link>
            <div class="no-enclo" v-if="(!attachments || !attachments.length) && describe">
                添加疾病检查资料，ct，化验单等内容...
            </div>
        </section>
    </div>
</template>
<script>
    import { format, imgsrc } from '@filters'
    export default{
        props: {
            attachments: {
                type: Array,
                default: []
            },
            name: String,
            isPerfect: {
                type: Boolean,
                default: false
            },
            color: {
                type: String,
                default: '#000'
            },
            describe: {
                type: Boolean,
                default: true
            }
        },
        data () {
            return {
                types: {
                    '1': 'CT',
                    '2': 'DX',
                    '3': 'MR',
                    '4': 'DCM',
                    '5': 'IMG',
                    '99': '其他' 
                },
                title: ''
            }
        },
        created () {
            this.title = this.isPerfect ? '图片资料' : '病例附件'
        },
        methods: {
            format,
            imgsrc,
            getId (item) {
                return item.id || item.createTime || +new Date()
            }
        }
    }
</script>
<style lang="less" scoped>
    @import '../../assets/css/var.less';
    .enclosure{
        padding: 1.2rem 1rem
    }
    header {
        a{
            color: @main-color;
            float: right;
            span{
               padding-right: .3rem
            }
        }
    }
    section{
        .no-enclo{
            background: #eee;
            line-height: 6.17rem;
            border-radius: .2rem;
            text-align: center;
            color: @gray-color
        }
        .enclo{
            display: block;
            background: #eee;
            border-radius: .2rem;
            margin-bottom: 1rem;
            padding: 1.29rem;
            color: #000
        }
        .enclo-title{
            color: @main-color;
        }
        .remark{
            padding-top: .3rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap
        }
        .img{
            width: 6.67rem;
            height: 6.67rem;
            margin: .5rem .5rem 0 0;
            i{
                display: inline-block;
                width: 100%;
                height: 100%;
            }
        }
        .img-len{
            width: 100%;
            bottom: 0;
            line-height: 2.08rem;
            background: rgba(0, 0, 0, 0.5)
        }
        .font-color {
            color: #9196a1
        }
    }
</style>