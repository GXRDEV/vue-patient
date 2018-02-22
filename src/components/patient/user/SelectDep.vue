<template>
    <div class="flex h100">
        <ul class="flex_1">
            <li class="left-li" v-for="(item, ind) in bigDep" :key="ind"
                :class="{'selected': ind == index}" @click="selectBig(ind)">{{item}}</li>
        </ul>
        <ul class="flex_2 bgfff" ref="dep">
            <li class="right-li flex" v-for="(item, ind) in dep[index]" :key="ind"
                @click="selectdep(item)" style="padding-right: 1rem"><span class="flex_1">{{item.displayName}}</span><icon type="success-no-circle" v-if="select(item.id)"></icon></li>
        </ul>
    </div>
</template>
<script>
    import { Icon } from 'vux'
    export default {
        components: {
            Icon
        },
        created () {
            let that = this;
            this.$vux.loading.show({text: '加载中'});
            this.$http.get(this.$urls.GAINBIGDEPARTMENTS, {}, this).then( d => {
                this.$vux.loading.hide()
                d.forEach( i => {
                    that.bigDep.push(i.name)
                    that.dep.push(i.stands)
                })
            })
        },
        mounted () {
            sessionStorage.getItem('_cache_dep_') && (this.sessionDep = JSON.parse(sessionStorage.getItem('_cache_dep_')))
        },
        data () {
            return {
                bigDep: [],
                dep: [],
                index: 0,
                sessionDep: []
            }
        },
        methods: {
            select (id){
                let array = this.sessionDep.find( obj => {
                    return obj.id == id
                })
                return array
            },
            selectBig (ind) {
                this.index = ind;
            },
            selectdep (item) {
                let that = this
                let array = this.sessionDep.find( (obj, ind) => {
                    if(obj.id == item.id){
                        that.sessionDep.splice(ind, 1)
                    }
                    return obj.id == item.id
                })
                !array ? this.sessionDep.push(item) : ''
                sessionStorage.setItem('_cache_dep_', JSON.stringify(this.sessionDep))
                this.$router.back()
            }
        }
    }
</script>
<style lang="less" scoped>
    ul{
        overflow: auto
    }
    li{
        list-style: none
    }
    .left-li {
        line-height: 4rem;
        padding-left: 1rem
    }
    .selected {
        background: #fff;
    }
    .right-li {
        line-height: 3rem;
        padding-left: 2rem;
    }
    i:before{
        margin-top: .6rem
    }
</style>
