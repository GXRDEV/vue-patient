<template>
    <article class="searchpage">
        <search v-model.trim="search" :placeholder="placeholder" 
            class="customsearch" 
            :autoFixed="false" 
            @on-submit="keywordChange" 
            @on-cancel="clearKeyword" ref="search"></search>
        <dl>
            <dd v-for="(list, idx) in lists" :key="idx" @click="redirect(list)">
                {{list}}
            </dd>
            <dt class="flex acenter jcenter" v-if="lists.length" @click="clearHistory">
                <i class="thumb bgcove delitem"></i>
                <span>清空历史记录</span>
            </dt>
        </dl>
    </article>
</template>
<script>
    import { Search } from 'vux'

    export default {
        name: 'gps',
        components: {
          Search  
        },
        data () {
            return {
                search: '',
                lists: [],
                split: '_;_',
                types: this.$route.query.types || '',
                placeholder: ''
            }
        },
        mounted () {
            this.placeholder = this.types == 'team' ? '请输入医生团队、医生、擅长' : this.types == 'drugs' ? '请输入药品名称' : '请输入医院、科室、医生姓名'
            this.$refs.search.setFocus()
            let keywords = this.types == 'drugs' ? window.localStorage.getItem('_search_drugs_') : window.localStorage.getItem('_search')
            if (keywords) {
                this.lists = keywords.split(this.split)
            }
        },
        methods: {
            keywordChange () {
                document.querySelector('[type="search"]').blur()
                if(!this.search){
                    return false
                }
                if(this.lists.findIndex(item => item == this.search) < 0){
                    this.lists.unshift(this.search)
                    this.types == 'drugs' ? 
                        window.localStorage.setItem('_search_drugs_', this.lists.join(this.split)) :
                        window.localStorage.setItem('_search', this.lists.join(this.split))
                }
                this.redirect(this.search)
            },
            redirect (val) {
                let url = this.types == 'drugs' ? '/druglist' : `/${this.types}result`;
                let query = this.types == 'drugs' ? 
                    { search: val } : 
                    {
                        search: val,
                        dtype: this.$route.query.dtype,
                        serviceId: this.$route.query.serviceId
                    } 
                this.$router.push({
                    path: url,
                    query: query
                })
            },
            clearKeyword () {
                this.$router.go(-1)
            },
            clearHistory () {
                this.lists = []
                this.types == 'drugs' ? 
                window.localStorage.removeItem('_search_drugs_') :
                window.localStorage.removeItem('_search')
            }
        }
    }
</script>
<style lang="less">
    /* 首页、专家医生库搜索重置 */
    @import '../../assets/css/var';
    @font-size: 1.083rem;
    .searchpage{
        .customsearch{
            background: #fff;
            .weui-icon-search{
                font-size: @font-size;
            }
            .weui-search-bar{  
                background: transparent; 
                padding: .65rem .92rem;
                box-sizing: border-box;
                &:after,
                &:before {
                    display: none;
                }
                .weui-search-bar__form{
                    background: #E0E0E0;
                    border-radius: 5px;
                    &:after{
                        opacity: 0;
                    }
                }
                .weui-search-bar__box{
                    background: #E0E0E0;
                    border-radius: 5px;
                    .weui-icon-search,
                    .weui-icon-clear{
                        .dflex();
                        .alignItem();
                        .justifyContent();
                        line-height: 1;
                        height: 100%;
                    }
                }
                .weui-search-bar__input{
                    padding: 0.5rem 0;
                    font-size: @font-size;
                    height: 100%;
                    box-sizing: border-box;
                }
                .weui-search-bar__label{
                    .dflex();
                    .alignItem();
                    .justifyContent();
                    background: #E0E0E0;
                    border-radius: 5px;
                    line-height: 1;
                    z-index: 1;
                    .weui-icon-search{
                        transform: translateX(5px); 
                    }
                    span{ font-size: @font-size; }
                }
                .weui-search-bar__cancel-btn{
                    font-size: @font-size;
                }
                &.weui-search-bar_focusing{
                    .weui-search-bar__label{
                        opacity: 0;
                    }    
                    .weui-search-bar__cancel-btn{
                        line-height: 1;
                        color: @main-color;
                        .dflex0();
                        .alignItem();
                        .justifyContent();
                    }
                }
            }
        }
    }
</style>
<style lang="less" scoped>
    @import '../../assets/css/var';
    dl{
        position: relative;
        padding-left: .92rem;
        &:after{
            .setTopLine(#dcdcdc);
        }
        dd{
            position: relative;
            line-height: 3.2rem;
            color: #222; 
            font-size: 1.083rem;
            &:after{
                .setBottomLine(#dcdcdc);
            }
        }
        dt {
            font-size: 1rem; color: #aaa;
            line-height: 3.2rem;
            .delitem{
                width: .92rem; height: 1.167rem; margin-right: 5px;
                background-image: url(../../assets/img/trash.png);
            }
        }
    }
</style>

