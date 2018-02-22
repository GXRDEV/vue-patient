<template>
    <article class="flex column h100">
        <div class="flex_1 scroll boxbordertop innerData">
            <ul class="vux-dep-menu-level2">
                <li v-for="(item, idx) in services" :key="idx"
                    @click="chooseService(idx)" class="flex" 
                    :class="{'selected': currentValue==item.id}">
                    <span class="flex_1">{{item.serviceName}}</span>
                    <icon v-if="currentValue==item.id" type="success-no-circle"></icon>
                </li>
            </ul>
        </div> 
    </article>
</template>
<script>
    import { Icon } from 'vux'
    const value2name = function (value, list) {
        if (value && !list.length) {
            return ''
        }
        let obj = list.find(item => {    
            return item.id == value
        })
        return obj.serviceName || ''
    }
    export default {
        name: 'chooseservice',
        components: {
            Icon
        },
        props: {
            value: {
                type: String,
                default: ''
            },
            show: {
                type: Boolean,
                default: true
            },
            role: {
                type: String,
                default: '3'
            },
            remote: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                currentValue: this.value,
                currentName: '',
                services: [],
                server: [ { id: '', serviceName: '所有服务' }, { id: '1', serviceName: '图文问诊' }, { id: '2', serviceName: '电话问诊' }, { id: '4', serviceName: '远程问诊' }]
            }
        },        
        watch: {
            currentValue (val) {
                this.$emit('on-change', val, this.currentName)
                this.$emit('input', val)
            },
            show (val) {
                val && this.fillData()
            },
            value (val) {
                !val && this.clearItem()
            }
        },
        created () {
            if( this.remote ){
                this.services = this.server;
                if(this.value){
                    this.currentName = value2name(this.value, this.services)
                    this.$emit('on-init', this.currentName)
                }
            } else {
                this.fillData()
            }
        },
        methods: {
            fillData () {
                !this.services.length && this.$http.get(this.$urls.GAINFILTERSERS, { type: this.role }).then(d => {
                    this.services = [{
                        id: '',
                        serviceName: '所有服务'
                    }].concat(JSON.parse(d.sers))
                    
                    if(this.value){
                        this.currentName = value2name(this.value, this.services)
                        this.$emit('on-init', this.currentName)
                    }
                })
            },
            chooseService (idx) {
                let service = this.services[idx]
                this.currentValue = service['id'] + ''
                this.currentName = this.currentValue ? service['serviceName'] : ''
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