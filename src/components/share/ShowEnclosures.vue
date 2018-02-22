<template>
    <div class="enclosure form-group">
        <header class="big14" style="color: #000" v-if="hasTitle">
            {{title}}
        </header>
        <section :style="`margin: `+margin+` 0`">
            <div v-for="(item, ind) in attachments" :key="ind" class="enclo" :style="`padding: `+padding" style="margin-bottom: .5rem">
                 <p class="enclo-title big15">
                     {{types[item.type]}}&emsp;<span class="base12 font-color" v-if="!isPerfect">{{format(item.reportTime, "yyyy-MM-dd", false)}}</span> 
                 </p>
                 <p class="remark big14" :class="{'font-color' : isPerfect, 'space': isSpace}" v-if="item.remark">
                    {{item.remark}}  
                 </p>
                <img-list :list="attachments[ind].files" :width="width" :height="width" :modal="modal" margin-right="8px" margin-bottom="8px" :size="true" :stopEvent="stopEvent"></img-list>
                 <p v-if="isPerfect" class="font-color base12">
                     {{format(item.reportTime, "yyyy-MM-dd", false)}}
                 </p>
            </div>
        </section>
    </div>
</template>
<script>
    import { ImgList } from '@components/share'
    import { format } from '@filters'
    export default{
        components: {
            ImgList
        },
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
            isSpace: {
                type: Boolean,
                default: false
            },
            width: {
                type: String,
                default: '6.67rem'
            },
            margin: {
                type: String,
                default: '1rem'
            },
            padding: {
                type: String,
                default: '1.29rem'
            },
            modal: {
                type: String,
                default: 'single'
            },
            stopEvent: {
                type: Boolean,
                default: false
            },
            hasTitle: {
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
            format
        }
    }
</script>
<style lang="less" scoped>
    @import '../../assets/css/var.less';
    .enclosure{
        padding: 1rem
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
            line-height: 5.3rem;
            border-radius: .2rem;
            text-align: center;
            color: @gray-color
        }
        .enclo{
            display: block;
            background: #eee;
            border-radius: .2rem;
            color: #000
        }
        .enclo-title{
            color: @main-color;
            padding-bottom: .4rem
        }
        .remark{
            padding-bottom: .5rem;
        }
        .space{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap
        }
        .font-color {
            color: #9196a1
        }
    }
</style>