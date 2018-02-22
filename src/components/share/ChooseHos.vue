<template>
    <article class="flex column h100">
        <div class="flex_1 scroll boxbordertop innerData">
            <ul class="vux-dep-menu-level2">
                <li v-for="(item, idx) in hoss" :key="idx" @click="chooseCity(idx)" class="flex" :class="{'selected': currentValue==item.id}">
                    <span class="flex_1">{{item.displayName}}</span>
                    <icon v-if="currentValue==item.id" type="success-no-circle"></icon>
                </li>
            </ul>
        </div> 
    </article>
</template>
<script>
    import { Icon } from 'vux'
    import stopEvent from '@mixins/stopdefaultscroll'

    export default {
        name: 'choosehos',
        components: {
            Icon
        },
        mixins: [stopEvent],
        props: {
            value: {
                type: String,
                default: ''
            },
            gps: {
                type: Object,
                default () {
                    return {}
                }
            },
            show: {
                type: Boolean,
                default: true
            },
            role: {
                type: String,
                default: '3'
            }
        },
        data () {
            return {
                currentValue: this.value,
                currentName: '',
                hoss: []
            }
        },        
        watch: {
            currentValue (val) {
                this.$emit('on-change', val, this.currentName)
                this.$emit('input', val)
            },
            value (val) {
                !val && this.clearItem()
            },
            ['gps.code'](v, n) {
                v != n && this.fillData()
            }
        },
        created () {
            this.fillData()
            this.fillName()
        },
        methods: {
            fillData () {
                this.hoss = []
                this.$http.get(this.$urls.GAINNEARHOSES, { type: this.role, htype:2, distCode: this.gps.code }).then(d => {
                    this.hoss = [{
                        id: '',
                        displayName: '全部医院'
                    }].concat(d.hospitals)
                })
            },
            fillName () {
                this.value && this.$http.get(this.$urls.GAINHOSNAME, { hosid: this.value }).then( d => {
                    let jsond = JSON.parse(d.hosName)
                    this.currentName = jsond.displayName
                    this.$emit('on-init', this.currentName)
                })
            },
            chooseCity (idx) {
                let hos = this.hoss[idx]
                this.currentValue = hos['id'] + ''
                this.currentName = this.currentValue ? hos['displayName'] : ''
            },
            clearItem () {
                this.currentValue = ''
                this.currentName = ''
            }
        }
    }
</script>
<style scoped lang="less">
    @import "../../assets/css/var";
    .boxbordertop{
        background: #fff;
    }
    .vux-dep-menu-level2{
        margin-left: 1.5em;
        li{
            line-height: 1.5em; 
            padding: 1em;
            position: relative;
            .weui-icon-success-no-circle{
                font-size: 1.33rem;
            }
        }
    }
</style>