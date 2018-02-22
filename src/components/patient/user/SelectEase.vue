<template>
    <div class="formStyle">
        <div class="flex bgfff" style="line-height: 4rem;">
            <input type="text" class="flex_1" v-model="easeName" placeholder="例如“头疼”"><span class="iconfont icon-x" v-if="!validate" @click="easeName = ''"></span>
        </div>
        <div class="bgfff ease" v-if="easelist.length">
            <p v-for="(item, ind) in easelist" :key="ind" @click="easeName=item.diseaseName">{{item.diseaseName}}</p>
        </div>
        <x-button type="primary" class="button" :disabled="validate" @click.native="keep">保存</x-button>
    </div>
</template>
<script>
    import { XButton } from 'vux'
    export default {
        components: {
            XButton
        },
        created () {
            // 获取疾病
            this.$http.get(this.$urls.GAINSYSTEMDISEASE, { isHot: 0, isPage: 0  }).then( d => {
                this.easelist = d.diseases.content
            })
        },
        mounted () {
            sessionStorage.getItem('_cache_ease_') && (this.ease = JSON.parse(sessionStorage.getItem('_cache_ease_')))
        },
        data () {
            return {
                easelist: '',
                easeName: '',
                ease: []
            }
        },
        computed: {
            validate () {
                return !this.easeName
            }
        },
        methods: {
            keep () {
                this.ease.indexOf(this.easeName) == -1 ? this.ease.push(this.easeName) : ''
                sessionStorage.setItem('_cache_ease_', JSON.stringify(this.ease))
                this.$router.go(-1)
            }
        }
    }
</script>
<style lang="less" scoped>
    input{
        border: none;
        line-height: 1.4rem;
        outline: none;
        margin: 1.3rem 1rem;
        font-size: 1.15rem
    }
    span{
        display: inline-block;
        margin-right: 1rem;
        height: 1.5rem;
        width: 1.5rem;
        text-align: center;
        line-height: 1.5rem;
        border: 1px solid #aaa;
        color: #aaa;
        border-radius: 50%;
        margin-top: 1.25rem;
    }
    .ease {
        border-top: 1px solid #ededed;
        padding: 1rem 0 1rem 1rem;
        p{
            font-size: 1.15rem;
            line-height: 2.5rem;
            color: #9198a2
        }
    }
</style>
