<template>
    <section class="itemtitle hotdepart">
        <group gutter="0" class="noborder">
            <cell class="cell-title" :is-link="islink" :link="islink ? { path: '/libs/doc/all', query:{ distCode: gpsCode} } : ''" value-align="left">
                 <img v-if="img" slot="icon" style="height: 1.5rem; margin-right: .5rem; vertical-align: -3px;" src="../../assets/img/main/lineicon.png">
                 <label slot="title" class="big19 blacklower whitespace ohidden">{{title}}</label>
                 <label class="small11 gray whitespace ohidden">&emsp;{{subtitle}}</label>
            </cell>
        </group>
        <grid v-if="deps.length" class="list-container" :cols="4">
            <grid-item class="list-item" v-for="(dep, idx) in deps" :label="dep.displayName" @click.native="rediretTo(dep)" :key="idx">
                <i slot="icon" class="thumb bgcove" :style="`background-image: url(${imgsrc(dep.remark)})`"></i>
            </grid-item>
            <!--<grid-item class="list-item" v-if="!nomore" label="更多" @click.native="rediretTo({id: ''})">-->
                <!--<i slot="icon" class="thumb bgcove more"></i>-->
            <!--</grid-item>-->
        </grid>
    </section>
</template>
<script>
    import { Group, Cell, Grid, GridItem } from 'vux'
    import { imgsrc } from '@filters'
    export default {
        name: 'hotdepart',
        components: {
            Group, Cell, Grid, GridItem
        },
        props: {
            gpsCode: [String, Number],
            length: {
                type: Number,
                default: 12
            },
            nomore: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: '在线问诊'
            },
            islink: {
                type: Boolean,
                default: true
            },
            subtitle: {
              type: String,
              default: '图文电话，高效无忧'
            },
            img: {
              type: Boolean,
              default: true
            },
            router: Object
        },
        created () {
            this.deps = JSON.parse(localStorage.getItem('_cache_home_deps') || '[]')
        },
        mounted() {
            // 热门科室
            this.$http.get(this.$urls.GAINSTANDDEPS, {
                ispage: 1,
                ishot: 1,
                pageNo: 1,
                pageSize: this.length
            }).then(d => {
                this.deps = d.deps
                localStorage.setItem('_cache_home_deps', JSON.stringify(this.deps))
            })
        },
        data () {
            return {
                deps: []
            }
        },
        methods: {
            imgsrc,
            rediretTo (obj) {
                let id = obj.id + ''
                if( this.router && (this.router.name || this.router.path) ){
                    this.$router.push({...this.router, query: { depId: id, distCode: this.gpsCode }})
                } else {
                    this.$emit('on-change', {
                        depName: obj.displayName,
                        depId: id
                    })
                }
            },
            initData() {
                // 热门科室
                this.$http.get(this.$urls.GAINSTANDDEPS, {
                    ispage: 1,
                    ishot: 1,
                    pageNo: 1,
                    pageSize: this.length
                }).then(d => {
                    localStorage.setItem('_cache_home_deps', JSON.stringify(this.deps = d.deps))
                })
            }
        }
    }
</script>
<style scoped lang="less">
    .thumb{ width: 2rem; height: 100%; border-radius: 0; display: block; margin: 0 auto; background-size: 100% auto;}
    /*.more{*/
        /*background-image: url(../../assets/img/main/more.png);*/
    /*}*/
    .list-item{
        height: 7.5rem;
        box-sizing: border-box;
        padding:1.25rem 0 0!important;
    }
    .list-item:nth-child(4n){
        &:before{ display: none; }
    }
    .list-container{
        &:after{ display: none; }
    }
</style>
<style lang="less">
    .hotdepart {
        .weui-grid__icon + .weui-grid__label {
            margin-top:1.25rem;
        }
        .weui-grid__label {
            font-size:1rem;
            color: #333;
        }
    }
</style>
