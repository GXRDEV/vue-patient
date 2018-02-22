<template>
    <article class="flex h100 column">
        <div class="flex flex_1 boxbordertop ohidden">
            <div class="flex_4 scroll boxborderright">
                <ul class="vux-dep-menu-level1">
                    <li v-for="(item, idx) in newData" :key="idx" @click="selectMenu(idx)" :class="{'selected': idx === firstVal}">
                        <span>{{ item.name }}</span>
                    </li>
                </ul>
            </div>
            <div class="flex_6 scroll noborder innerData">
                <group gutter="0" style="margin-left: 1.6rem;">
                    <radio :options="childData" v-model="currentValue" @on-change="radioChange" ref="radios"></radio>
                </group>
            </div>
        </div>
    </article>
</template>
<script>
    import { Group, Radio } from 'vux'

    const value2name = function (value, list, delimiter) {
        if (value && !list.length) {
            return ''
        }
        if (!delimiter) {
            delimiter = ' '
        }
        let obj
        list.find(item => {    
            obj = item['stands'].find(i => {
            return i.id == value
            })
            return typeof obj != 'undefined' ;
        })
        return obj.displayName || ''
    }
    const value2index = function (value, list) {
        return list.findIndex(item => {    
            let obj = item['stands'].find(i => {
                return i.id == value
            })
            return typeof obj != 'undefined' ;
        })
    }

    export default {
        name: 'choosedepart',
        components: {
            Group, Radio
        },
        props: {
            value: {
                type: [String, Number],
                default: ''
            },
            data: {
                type: Array,
                default () {
                    return []
                }
            },
            hasall: {
                type: Boolean,
                default: true
            },
            show: {
                type: Boolean,
                default: true
            },
        },
        data () {
            return {
                currentValue: this.value,
                currentName: '',
                firstVal: '',
                newData: JSON.parse(JSON.stringify(this.data)),
                childData: []
            }
        },        
        watch: {
            currentValue (val) {
                this.currentName = val ? value2name(val, this.newData) : ''
                this.$emit('on-change', val || '', this.currentName)
                this.$emit('input', val || '')
            },
            show (val) {
                val && this.fillData()
            },
            value (val) {
                if(!val){
                    this.currentValue = ''
                    this.currentName = ''
                }
            }
        },
        created () {
            this.fillData()
        },
        methods: {
            fillData () {
                !this.newData.length && this.$http.get(this.$urls.GAINBIGDEPARTMENTS).then( d => {
                    this.newData = (this.hasall ? [{
                        name: '全部科室',
                        stands: []
                    }] : []).concat(d)
                    this.value && (
                        this.selectMenu(value2index(this.value, this.newData)),
                        this.currentName = value2name(this.value, this.newData),
                        this.currentValue = this.value + '',
                        this.$emit('on-init', this.currentName)
                    )
                    this.hasall && !this.value && (this.firstVal = 0)
                })
            },
            selectMenu (idx) {
                this.firstVal = idx
                this.childData = this.newData[idx]['stands'].map(item => {
                    return {
                        // icon: item.remark,
                        key: item.id + '',
                        value: item.displayName
                    }
                })
                this.hasall && !idx && (this.currentValue = 0)
            },
            radioChange (val) {
                this.currentValue = val + ''
            },
            clearItem () {
                this.$refs.radios.currentValue = ''
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../../assets/css/var";
    .boxbordertop{
        position: relative;
        background: #fff;
    }
    .boxborderright{
        position: relative;
        background: @main-bg-color;
    }
    .vux-dep-menu-level1{
        li{ 
            line-height: 1.5em; 
            padding: 1em 1.5em;
            position: relative;
            &.selected{
                background: #fff;
            }
        }
    }  
</style>