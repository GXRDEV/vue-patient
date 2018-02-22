<template>
    <div class="filterarea top bottom left right" :class="position" :style="`top:${offset}`" v-show="currentValue.selected>0">
        <div class="h100 filterinner" id="chooseitemspage"
            :class="currentValue.selected>0 ? 'animated fadeInDownBig' : ''" 
            @click.self="currentValue.selected=0">
            <div class="tabarea" v-if="'distCode' in currentValue" v-show="currentValue.selected==1">
                <choose-area v-model="currentValue.distCode" :role="role" :show="currentValue.selected==1" @on-change="distChange" @on-init="distInitName"></choose-area>
            </div>
            <div class="tabarea" v-if="'hosName' in currentValue" v-show="currentValue.selected==2">
                <choose-hos v-model="currentValue.hosId" :role="role" :gps="currentValue.distCode" :show="currentValue.selected==2" @on-change="hosChange" @on-init="hosInitName"></choose-hos>
            </div>
            <div class="tabarea" v-if="'depName' in currentValue" v-show="currentValue.selected==3">
                <choose-depart v-model="currentValue.depId" :show="currentValue.selected==3" @on-change="depChange" @on-init="depInitName"></choose-depart>
            </div>
            <div class="tabarea" v-if="'servName' in currentValue" v-show="currentValue.selected==4" style="height: auto">
                <choose-service v-model="currentValue.serviceId" :role="role" :show="currentValue.selected==4" :remote="currentValue.remote" @on-change="servChange" @on-init="servInitName"></choose-service>
            </div>
        </div>
        <div @click="currentValue.selected=0" class="absolute bottom w100 tcenter bclose">
            <icon type="clear"></icon>
        </div>
    </div>
</template>
<script>
    import { Icon } from 'vux'
    import ChooseArea from './ChooseArea'
    import ChooseDepart from './ChooseDepart'
    import ChooseHos from './ChooseHos'
    import ChooseService from './ChooseService'
    import debounce from 'vux/src/tools/debounce'

    export default {
        name: 'chooseitems',
        components: {
            ChooseArea, ChooseDepart, ChooseHos, ChooseService, Icon
        },
        props: {
            value: {
                type: Object,
                default () {
                    return {}
                }
            },
            fixed: {
                type: Boolean,
                default: false
            },
            offset: {
                type: String,
                default: '0px'
            },
            role: {
                type: String,
                default: '3'
            },
            position: {
                type: String,
                default: 'fixed'
            }
        },
        data () {
            return {
                currentValue: this.value
            }
        },
        watch: {
            currentValue: {
                deep: true,
                handler: debounce(function (val) {
                    this.$emit('on-change', val)
                    this.$emit('input', val)
                }, 200)
            },
            ['currentValue.selected'] (val) {
                if(this.fixed){
                    if(val && !this.currentValue.navfixed) {
                        this.fixedFilter()
                    } else if(!val && this.currentValue.navtop < this.currentValue.navheight) {
                        this.currentValue.navfixed = false
                        this.currentValue.navstyle = ''
                    }
                }
            }
        },
        methods: {
            initFilterParams (top) {
                this.currentValue.navtop = top
                this.currentValue.navfixed = false
                this.currentValue.navstyle = ''
                this.fixedFilter()
            },
            fixedFilter: debounce(function(){
                let cval = this.currentValue
                let bol = this.currentValue.selected ? true : cval.navtop > cval.navheight
                this.currentValue.navfixed = bol
                this.currentValue.navstyle = bol ? 'transform: translateY('+ cval.navtop +'px)' : ''
            }, 100),
            initPage: debounce(function() {
                this.currentValue.selected = 0
                this.currentValue.navtop = 0
                if(this.fixed){
                    this.currentValue.navfixed = false
                    this.currentValue.navstyle = ''
                }
                this.$emit('on-query', this.currentValue)
            }, 200),
            distChange (val) {
                this.currentValue.distCode = val
                this.currentValue.hosId = ''
                this.initPage()
            },
            hosChange (id, name) {
                this.currentValue.hosName = name
                this.currentValue.hosId = id
                this.initPage()
            },
            depChange (id, name) {
                this.currentValue.depName = name
                this.currentValue.depId = id
                this.initPage()
            },
            servChange (id, name) {
                this.currentValue.servName = name
                this.currentValue.serviceId = id
                this.initPage()
            },
            distInitName (val) {
                this.currentValue.distCode = val
            },
            hosInitName (name) {
                this.currentValue.hosName = name
            },
            depInitName (name) {
                this.currentValue.depName = name
            },
            servInitName (name) {
                this.currentValue.servName = name
            }
        }
    }
</script>
<style scoped lang="less">  
    /* 专家医生库地区、医院、科室、服务过滤弹出层 */
    .filterarea{
        background: rgba(0,0,0,.6);z-index: 1;
        -webkit-transition: all linear 0.9s;
        transition: all linear 0.9s;
        .tabarea{
            height: 100%; background:#eee
        }
        .filterinner{
            padding-bottom: 50px;box-sizing:border-box;
        }
        .bclose{
            padding: 11px 0;
            .weui_icon_clear{
                color:#F43530; font-size:2em;
            }
        }
    }
</style>