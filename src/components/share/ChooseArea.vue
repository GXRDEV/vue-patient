<template>
    <article class="flex column h100">
        <div class="flex_1 flex boxbordertop ohidden">
            <div class="flex_3 scroll boxborderright" style="background:#ddd;">
                <ul class="vux-dep-menu-level1">
                    <li v-for="(item, idx) in provs" :key="idx" @click="selectMenu(idx)" :class="{'selected': idx === firstVal}">
                        <span>{{item.distName}}</span>
                    </li>
                </ul>
            </div>
            <div class="flex_3 scroll innerData" style="background: #eee;">
                <ul class="vux-dep-menu-level2">
                    <li v-for="(item, idx) in citys" :key="idx" @click="selectCity(idx)" :class="{'selected': idx === firstArea}">
                        <label class="flex cityitem">
                            <span class="flex_1">{{item.distName}}</span>
                        </label>
                    </li>
                </ul>
            </div>
            <div class="flex_3 scroll">
                <ul class="vue-areas">
                    <li v-for="(area,ind) in areas" :key="ind">
                        <label class="flex" @click="chooseCity(ind)" :class="{'selected': currentValue.code === area.distCode}">
                            <span class="flex_1">{{area.distName}}</span>
                            <icon v-if="currentValue.code==area.distCode" type="success-no-circle"></icon>
                        </label>
                    </li>
                </ul>
            </div>
        </div>
    </article>
</template>
<script>
    import { Icon } from 'vux'
    import { mapState } from 'vuex'
    const findIndex = function(code = '', list){
        return list.findIndex(item => {
            let bol = item.distCode == code
            return bol ? bol : (item.citys ? findIndex(code, item.citys) != -1 : bol)
        })
    }
    const findObj = function (code, list) {
        let idx = findIndex(code, list)
        let fobj = list[idx]
        return fobj.distCode == code ? fobj : fobj.citys ? findObj(code, fobj.citys) : {}
    }

    export default {
        name: 'choosearea',
        components: {
            Icon
        },
        props: {
            value: {
                type: Object,
                default () {
                    return {}
                }
            },
            show: {
                type: Boolean,
                default: true
            },
            hasgps: {
                type: Boolean,
                default: false
            },
            hasall: {
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
                firstVal: 0,
                firstArea:0,
                provs: [],
                citys: [],
                areas:[]
            }
        },
        watch: {
            currentValue (val) {
                this.$emit('on-change', val)
                this.$emit('input', val)
            }
        },
        created () {
            this.fillData()
        },
        computed: {
          ...mapState({
              gps: state => state.gps
          })
        },
        methods: {
            fillData () {
                this.$http.get(this.$urls.GAINOPENCITYS, { type: this.role }).then(d => {
                    this.provs = (this.hasgps ? [{
                        distName: this.gps.name + '[定位]'
                    }] : this.hasall ? [{
                        distName: '所有区域'
                    }] : []).concat(d.pros)

                    this.firstVal = findIndex(this.value.code, this.provs)
                    this.citys = this.firstVal != -1 ? this.provs[this.firstVal]['citys'] : []
                    this.firstArea = findIndex(this.value.code, this.citys)
                    if(this.firstArea!=-1){
                        if(!this.areas.length ||(this.areas && this.areas[0].distCode!=this.citys[this.firstArea].distCode)){
                            let areaLocal = { distCode:this.citys[this.firstArea].distCode,distName:this.citys[this.firstArea].distName };
                            let newArea = this.citys[this.firstArea]['citys'];
                            newArea.unshift(areaLocal);
                            this.areas = newArea;
                        }else {
                            this.areas = this.citys[this.firstArea]['citys'];
                        }
                    }else {
                        this.areas = [];
                    }
                    if(this.value.code && this.citys.length) {
                        let queryInfo = [findObj(this.value.code, this.citys)].map(itm => {
                            return itm ? {
                                name: itm.distName,
                                code: itm.distCode
                            } : this.gps
                        })[0]
                        this.$emit('on-init', queryInfo)
                    }
                })
            },
            selectMenu (idx) {
                this.areas.splice(0,1);
                idx = idx || 0
                this.firstVal = idx
                if (idx) {
                    this.citys = this.provs[idx]['citys']
                } else {
                    this.hasgps ? this.gps : (this.currentValue = { name: '', code: '' })
                    this.citys = []
                }
                this.areas = [];
            },
            selectCity (idx) {
                this.areas.splice(0,1);
                idx = idx || 0;
                this.firstArea = idx;
                let cityArr = this.citys[idx];
                let local = { distCode:cityArr.distCode,distName:cityArr.distName };
                this.areas = cityArr['citys'];
                if(!this.areas.length ||(this.areas && this.areas[0].distCode!=local.distCode) ){
                  this.areas.unshift(local);
                }
            },
            chooseCity (idx) {
                this.currentValue = [this.areas[idx]].map(itm => {
                    return {
                        name: itm.distName,
                        code: itm.distCode
                    }
                })[0] || this.gps
            },
            clearItem () {
                this.currentValue = this.gps
            }
        }
    }
</script>
<style scoped lang="less">
    @import "../../assets/css/var";
    .boxbordertop{
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
                background: #eee;
            }
            &:first-child.selected{
                background: transparent;
                color: @main-color;
             }
        }
    }
    .vux-dep-menu-level2{
        li{
            list-style: none;
            padding: 0;
            text-indent: .5em;
            &.selected{
               background: #fff;
             }
            &:first-child.selected{
               background: transparent;
             }
            label{
                display: block;
                line-height: 1.5em;
                padding: 0.7em;
                position: relative;
                .weui-icon-success-no-circle{
                    font-size: 1.33rem;
                }
            }
        }
    }
    .vue-areas{
        padding-left:.5em;
        li {
            list-style:none;
            label{
                display: block;
                line-height: 1.5em;
                padding: 0.7em;
                position: relative;
                .weui-icon-success-no-circle{
                    font-size: 1.33rem;
                }
                &:first-child.selected{
                   color: @main-color;
                }
          }
        }
    }
</style>
