<template>
  <div class="main page-tabbar h100vh">
    <div class="page-wrap scroll h100">
        <router-view></router-view>
    </div>
    <footer class="fixed bottom left right">
        <div class="tabbar flex">
            <router-link to="/main/ask" class="flex_1" :class="{'selected': selected.indexOf('ask') != -1}">
                <div class="tabbar-item">
                    <label><img :src="icon('ask')" alt=""></label>
                    <span>寻医问诊</span>
                </div>
            </router-link>
            <router-link to="/main/message" class="flex_1" :class="{'selected': selected.indexOf('message') != -1}">
                <div class="tabbar-item">
                    <label class="relative">
                        <img :src="icon('message')" alt="">
                        <i v-if="hasMsg" class="g_newtip absolute"></i>
                    </label>
                    <span>消息</span>
                </div>
            </router-link>
            <router-link to="/main/my" class="flex_1" :class="{'selected': selected.indexOf('mydoc') != -1 || selected.indexOf('follow') != -1 || selected.indexOf('mysign') != -1}">
                <div class="tabbar-item">
                    <label class="relative">
                        <img :src="icon(selected.indexOf('mydoc') != -1 ? 'mydoc' : 'follow','mysign')" alt="">
                    </label>
                    <span>我的医生</span>
                </div>
            </router-link>
            <router-link to="/main/family" class="flex_1" :class="{'selected': selected.indexOf('family') != -1}">
                <div class="tabbar-item">
                    <label><img :src="icon('family')" alt=""></label>
                    <span>健康管理</span>
                </div>
            </router-link>
            <router-link to="/main/info" class="flex_1" :class="{'selected': selected.indexOf('info') != -1}">
                <div class="tabbar-item">
                    <label><img :src="icon('info')" alt=""></label>
                    <span>我的</span>
                </div>
            </router-link>
        </div>
    </footer>
    <invitation v-model="firstInit" v-if="firstInit"></invitation>
  </div>
</template>
<script>
    import { Invitation } from '@components/share'

    export default {
        components: {
            Invitation
        },
        beforeRouteUpdate (to, from, next) {
            this.selected = to.fullPath.split('/').pop()
            next()
        },
        data() {
            return {
                selected: this.$route.fullPath.split('/').pop(),
                hasMsg: false,
                localTime: '',
                firstInit: false
            }
        },
        mounted () {
            if( this.$route.name == 'ask' ) {
                let dates = new Date().getMonth()+1 + '' + new Date().getDate()
                this.localTime = localStorage.getItem('_cache_local_time_') || ''
                this.firstInit = this.localTime != dates;
                this.firstInit && localStorage.setItem('_cache_local_time_', dates)
            }
            this.$http.get(this.$urls.HASNEWMSG ,{ openid: this.$store.state.openid })
            .then(d => {
                this.hasMsg = d.status == 'success' && d.hasNew == 'true'
            })
        },
        methods: {
            icon (name,namedoc) {
                this.selected.indexOf('?') != -1 && (this.selected = this.selected.substring(0, this.selected.indexOf('?')))
                let selected = this.selected == name ||this.selected == namedoc
                return require(`@assets/img/main/${name + (selected ? '-active' : '')}.png`)
            }
        }
    }
</script>

<style scoped lang="less">
    @import '../../../assets/css/var';
    @footer: 3.83333rem;
    .page-tabbar {
        overflow: hidden;
    }
    .page-wrap {
        overflow: auto;
        padding-bottom: @footer;
        box-sizing: border-box;
    }
    footer{
        height: @footer;
        background: #F8F8F8;
        &:before{
            .setTopLine(#ededed);z-index: 0;
        }
        .tabbar{
            height: 100%;
            a{
                color: #878D99;
                text-align:center;
                align-self: center;
                &.selected{
                    color: @main-color;
                }
            }
        }
        .tabbar-item{
            img{
                margin: auto;
                width: 1.75rem;
                height: 1.75rem;
                object-fit: contain;
            }
            label{ height: 2.3rem; .dflex(); }
            span{
                line-height: 1.2; font-size: 0.83rem;
                position: relative;display: block;
            }
            .g_newtip{
                top: -3px; right: .8rem;
            }
        }
    }

</style>
