<template>
    <div class="h100 bgfff">
        <heading title="您感兴趣的科室和疾病" content="添加关注科室和疾病，时刻关注相关信息和治疗方案" router="#" code="2"></heading>
        <section class="formStyle bgfff form_000_ccc" style="padding-top: 1.7rem">
            <div class="form-group">
                <label class="margin weui-label">您感兴趣的科室</label>
                <div class="margin">
                    <span class="dep signitem" v-for="(item, ind) in dep" :key="ind" @click="deldep(item, ind)">{{item.displayName}}</span>
                    <router-link class="add signitem" v-if="dep.length < 10" to="/selectdep" tag="span"><i class="iconfont icon-jiahao"></i></router-link>
                </div>
            </div>
            <div class="form-group">
                <label class="margin weui-label">您想关注的疾病</label>
                <div class="margin">
                    <span class="dep signitem" v-for="(item, ind) in easeName" :key="ind" @click="delease(ind)">{{item}}</span>
                    <router-link class="add signitem" v-if="easeName.length < 10" to="/selectease" tag="span"><i class="iconfont icon-jiahao"></i></router-link>
                </div>
            </div>
            <x-button type="primary" class="button" :disabled="validate" @click.native="next">下一步</x-button>
        </section>
        <coupons :lists="coupons" :more="false" @on-closed="jumpTo"></coupons>
    </div>
</template>
<script>
    import { Heading, Coupons } from '@components/share'
    import { XInput, XButton } from 'vux'
    export default {
        components: {
            Heading, XInput, XButton, Coupons
        },
        created () {
            // 获取信息
            sessionStorage.getItem('_cache_bind_') && (this.form = JSON.parse(sessionStorage.getItem('_cache_bind_')))
            // 获取科室
            sessionStorage.getItem('_cache_dep_') && (this.dep = JSON.parse(sessionStorage.getItem('_cache_dep_')))
            // 获取疾病
            sessionStorage.getItem('_cache_ease_') && (this.easeName = JSON.parse(sessionStorage.getItem('_cache_ease_')))
        },
        data () {
            return {
                index: '',
                dep: [],
                easeName: [],
                deplist: this.$store.state.dep,
                coupons: [],
                timer: new Date().getTime(),
                form: {}
            }
        },
        computed: {
            validate () {
                return !(this.dep.length !=0 && this.easeName.length !=0)
            }
        },
        methods: {
            // 删除科室
            deldep (item, ind) {
                this.dep.splice(ind, 1)
                sessionStorage.setItem('_cache_dep_', JSON.stringify(this.dep))
            },
            // 删除疾病
            delease (ind) {
                this.easeName.splice(ind, 1)
                sessionStorage.setItem('_cache_ease_', JSON.stringify(this.easeName))
            },
            // 提交
            next () {
                let depid = [];
                JSON.parse(sessionStorage.getItem('_cache_dep_')).forEach( item => {
                    depid.push(item.id)
                })
                this.$vux.loading.show({text: '正在保存'})
                this.$http.post(this.$urls.INTERESTDEPANDDISEASE, {
                    userId: this.form.id,
                    depIds: depid.join(),
                    diseases: this.easeName.join()
                }, this).then( d => {
                    this.coupons = d.coupons || []
                    sessionStorage.removeItem('_cache_dep_')
                    sessionStorage.removeItem('_cache_ease_')
                    this.$vux.loading.hide()
                    !this.coupons.length && this.jumpTo()
                })
            },
            jumpTo () {
                this.$router.replace('/visitingRecord/' + this.timer)
            }
        }
    }
</script>
<style lang="less" scoped>
    .margin{
        display: block;
        padding: 1.1rem 1rem 1rem
    }
    .signitem{
        display: inline-block;
        line-height: 2rem;
        border-radius: .2rem;
        margin: 0 1rem 1rem 0;
        background: transparent;
    }
    .add{
        color: #91cbeb;
        border: 1px solid #e5f3fa;
        padding: 0 2.1rem;
        .iconfont{
            font-size: 1.4rem;
        }
    }
    .dep{
        color: #0186D1;
        border: 1px solid #0186D1;
        padding: 0 1.2rem;
    }
</style>
<style lang="less">
    .formStyle{
        .disease:before{
            display: none
        }
    }
</style>
