<template>
    <div class="nodoc">
        <i></i>
        <b v-html="title">您还没有{{title}}过医生</b>
        <p v-html="subtitle">您{{title}}过的医生将会实现在这里</p>
        <router-link :to="to" v-html="linktitle">去{{title}}</router-link>
    </div>
</template>
<script>
    export default {
        props: {
            title: String,
            subtitle: String,
            linktitle: String,
            to: {
                type: String,
                default: '/libs/doc/all'
            }
        }
    }
</script>
<style lang="less" scoped>
    @import '../../assets/css/var';
    .nodoc{
        text-align: center;
        i{
            display: block;
            width: 7rem;
            height: 7rem;
            background: url("../../assets/img/noDoc.png") no-repeat center center;
            background-size: cover;
            margin: 5.5rem auto 1rem;
        }
        b{
            color: #ababab
        }
        p{
            color: #ccc;
            font-size: .8rem;
            padding: .3rem 0 2rem;
        }
        a{
            display: inline-block;
            width: 6.25rem;
            line-height: 2rem;
            color: #fff;
            background: @main-color;
            border-radius: .2rem;
            font-size: .9rem;
        }
    }
</style>
