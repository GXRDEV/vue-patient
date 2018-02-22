<template>
    <div class="scroll mywramspage" v-if="datas.length">
        <group :title="`我的心意（${datas.length}）`" gutter="-1px">
            <div class="item" v-for="i in datas" :key="i.id">
                <div class="flex">
                    <span class="flex_1">
                        送给&ensp;<label class="strong">{{i.docName}}</label>&ensp;医生，
                        <label class="warncolor strong">{{i.warmthName}}</label>
                        <label class="gray">（{{ i.warmthMoney }}元）</label>
                    </span>
                    <span class="grayccc small10" v-html="i.timeStr"></span>
                </div>
                <div class="flex content">
                    <label>赠言：</label><span class="flex_1 gray">{{i.content}}</span>
                </div>
            </div>
        </group>
    </div>
    <no-doctor v-else title="您还没有送出过心意" subtitle="您送给医生的心意将会在这里显示" linktitle="去送心意"></no-doctor>
</template>
<script>
    import { Group } from 'vux'
    import { NoDoctor } from '@components/share'
    export default{
        components: {
            NoDoctor, Group
        },
        created () {
            this.$vux.loading.show()
            this.$http.get(this.$urls.MYWARMS, { 
                openid: this.$store.state.openid 
            }, this).then(d => {
                this.datas = d.warms
                this.$vux.loading.hide()
            })
        },
        data () {
            return {
                datas: []
            }
        }
    }
</script>
<style lang="less">
    @import "../../../assets/css/var";
    .mywramspage{
        .weui-cells__title{ color: #222; margin: 1rem 0; line-height: 1; font-weight: 600; }
        .item{
            position: relative;
            padding: @body-margin;
            line-height: 2em;
            & + .item{
                &:before{
                    .setTopLine(#eee);
                    left: @body-margin;
                }
            }
            .content{
                line-height: 1.5; 
                margin-top: .45em;
            }
        }
    }
</style>