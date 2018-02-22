<template>
    <div class="navmenu">
        <div class="sticky" :class="{'fixed top left right': currentValue.navfixed}" :style="currentValue.navstyle">
            <nav class="nav flex tcenter">
                <template v-if="'distCode' in currentValue">
                    <span class="flex_1 whitespace" :class="{'selected': currentValue.distCode.name, 'current': currentValue.selected == 1 }" @click="selected(1)">
                        {{ currentValue.distCode.name || '区域' }}
                    </span>
                    <i class="iconfont icon-arrdown" @click="selected(1)"></i>
                </template>
                <template v-if="'hosName' in currentValue">
                    <span class="flex_1 whitespace" :class="{'selected': currentValue.hosName, 'current': currentValue.selected == 2 }" @click="selected(2)">
                        {{ currentValue.hosName || '医院' }}
                    </span>
                    <i class="iconfont icon-arrdown" @click="selected(2)"></i>
                </template>
                <template v-if="'depName' in currentValue">
                    <span class="flex_1 whitespace" :class="{'selected': currentValue.depName, 'current': currentValue.selected == 3 }" @click="selected(3)">
                        {{ currentValue.depName || '科室' }}
                    </span>
                    <i class="iconfont icon-arrdown" @click="selected(3)"></i>
                </template>
                <template v-if="'servName' in currentValue">
                    <span class="flex_1 whitespace" :class="{'selected': currentValue.servName, 'current': currentValue.selected == 4 }" @click="selected(4)">
                        {{ currentValue.servName || '服务' }}
                    </span>
                    <i class="iconfont icon-arrdown" @click="selected(4)"></i>
                </template>
            </nav>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'choose',
        props: {
            value: {
                type: Object,
                default () {
                    return {}
                }
            },
            sticky: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                currentValue: this.value
            }
        },        
        watch: {
            currentValue (val) {
                this.$emit('on-change', val)
                this.$emit('input', val)
            }
        },
        methods: {
            selected (i) {
                this.currentValue.selected = i
            }
        }
    }
</script>
<style scoped lang="less">
    @import "../../assets/css/var";
    .fixed nav{
        background: @main-color;
        color: #caceff;
        &:before {
            .setTopLine(@main-color);
        }
        &:after {
            .setBottomLine(@main-color);
        }
        span{
            &.current,
            &.selected{
                color: #fff;
                & + .iconfont{
                    color: #fff;
                }
            }
            & + .iconfont{
                color: inherit;;
            }
            & ~ span{
                &:after {
                    .setLeftLine(#038de0);
                    top: 10px;
                    bottom: 10px;
                }
            }
        }
    }
    .sticky{
        z-index: 1;
    }
    .navmenu{
        height: 2.5rem;
    }
    .nav{
        position: relative; color: #aaa;
        line-height: 2.5rem; background: #fafafa;
        font-size: 0.92rem;
        &:before {
            .setTopLine(#D7D6DC);
        }
        &:after {
            .setBottomLine(#D7D6DC);
        }
        .iconfont{
            line-height: inherit;
            color: #aaa; font-size: 0.83rem;
            margin-right: 6px;vertical-align: middle;
        }
        span{
            padding-left: 6px;
            position: relative;
            line-height: inherit;
            &.selected{
                color: @main-color;
                & + .iconfont{
                    color: @main-color;
                }
            }
            &.current{
                color: @main-color;
                & + .iconfont{
                    color: @main-color;
                    &:before{
                        content: "\E605";
                    }
                }
            }
            & ~ span{
                &:after {
                    .setLeftLine(#e7e6ec);
                    top: 10px;
                    bottom: 10px;
                }
            }
        }
    }
</style>