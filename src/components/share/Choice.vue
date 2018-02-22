<template>
    <div :style="{margin: margin}">
        <p style="text-align: center">
            <span v-for="(item, idx) in states" :key="idx" class="choice" @click="choice(item)"
                :class="{ 'selected': currentValue == item.value }" :style="{ width: styles, height: styles, lineHeight: styles, fontSize: size}">
                {{item.name}}
            </span>
        </p>
    </div>
</template>
<script>
    export default {
        props: {
            states: Array,
            value: [String, Number],
            margin: {
                type: String,
                default: '1rem 0 .5rem'
            },
            styles: {
                type: String,
                default: '4rem'
            },
            size: {
                type: String,
                default: '1.2rem'
            }
        },
        data () {
            return {
               currentValue: -1
            }
        },
        methods: {
            choice (item) {
                this.currentValue = item.value
            }
        },
        created () {
            this.currentValue = this.value
        },
        watch: {
            currentValue (val) {
                this.$emit('input', val)
            },
            value (v){
                this.currentValue = v
            }
        }
    }
</script>
<style lang="less" scoped>
    .choice{
        display: inline-block;
        background: #e5e5e5;
        color: #fff;
        text-align: center;
        border-radius: 50%;
        margin: 0 3rem 0 .2rem;
    }
    .selected{
        background: #0186D1
    }
</style>
