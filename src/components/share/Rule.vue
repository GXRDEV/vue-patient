<template>
    <div class="rule-mark fixed" v-if="currentValue">
        <div class="bgfff rule-main flex column">
            <span class="close iconfont icon-x" @click="currentValue = false"></span>
            <p class="tcenter big19" style="line-height: 1; padding-bottom: 1rem">
                {{title}}规则说明
            </p>
            <div class="scroll flex_1" style="padding: 0rem 1.5rem 2rem">
                <slot></slot>
            </div>
            <x-button type="primary" class="weui-btn_circle" @click.native="currentValue = false">我明白了</x-button>
        </div>
    </div>
</template>
<script>
    import { XButton } from 'vux'
    export default {
        components: {
            XButton
        },
        props: {
            title: String,
            value: Boolean
        },
        data () {
            return {
                currentValue: ''
            }
        },
        watch: {
            currentValue (val){
                this.$emit('input', val)
            },
            value (val){
                this.currentValue = val
            }
        }
    }
</script>
<style lang="less" scoped>
    .rule-mark{
        width: 100%;
        height: 100%;
        top: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 100;
        .rule-main{
            position: fixed;
            top: 50%;
            left: 50%;
            width: 23.4rem;
            height: 35rem;
            margin: -19.5rem 0 0 -11.7rem;
            background: #fff;
            border-radius: .3rem;
            .close{
                text-align: right;
                display: block;
                font-size: 3rem;
                line-height: .7;
                margin-top: .3rem
            }
            button{
                border-bottom-left-radius: .3rem;
                border-bottom-right-radius: .3rem;
            }
        }
    }
</style>
