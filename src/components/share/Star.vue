<template>
  <div class="vux-rater">
    <input v-model="currentValue" style="display:none">
    <a class="vux-rater-box" v-for="i in max" ref="box" :key="i"
        @click="handleClick(i-1)" :class="{'is-active':currentValue > i-1}"
        :style="{ marginRight: margin+'rem', fontSize: fontSize + 'rem', width: width + 'rem', height: height + 'rem'}">
    </a>
  </div>
</template>
<script>
    export default {
        props: {
            max: {
                type: Number,
                default: 5
            },
            value: {
                type: [Number, String],
                default: 0
            },
            disabled: {
                type: Boolean,
                default: false
            },
            margin: {
                type: Number,
                default: 1
            },
            fontSize: {
                type: Number,
                default: 3
            },
            width: {
                type: Number,
                default: 2.538
            },
            height: {
                type: Number,
                default: 2.307
            },
            bjImg: {
                type: String,
                default: '../../assets/img/star/star2.png'
            },
            activeImg: {
                type: String,
                default: '../../assets/img/star/active.png'
            }
        },
        created () {
            this.currentValue = parseInt(this.value || 0, 10);
        },
        methods: {
            handleClick (i, force) {
                if(this.disabled) return
                if ( !this.disabled) {
                    if (this.currentValue == i + 1) {
                        this.currentValue = i
                    } else {
                        this.currentValue = i + 1
                    }
                }
            }
        },
        data () {
            return {
                currentValue: 0
            }
        },
        watch: {
            currentValue (val) {
                this.$emit('input', val)
            },
            value (val) {
                this.currentValue = parseInt(val || 0, 10);
            }
        }
    }
</script>
<style scoped lang="less">
    .vux-rater {
        text-align: left;
        display: inline-block;
        line-height: normal;
    }
    .vux-rater a:last-child {
        padding-right: 0!important;
        margin-right: 0!important;
    }
    .vux-rater a {
        display: inline-block;
        text-align: center;
        cursor: pointer;
    }
    .vux-rater a.is-active {
        background: url("../../assets/img/star/active.png") no-repeat center;
        background-size: cover
    }
    .vux-rater-box {
        background: url("../../assets/img/star/star.png") no-repeat center;
        background-size: cover
    }
</style>
