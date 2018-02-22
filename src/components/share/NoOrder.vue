<template>
    <div style="padding-bottom: 1rem">
        <i></i>
        <p class="showNo" :style="`margin-top: ${marginTop}`">{{text}}</p>
        <p v-if="haslink">
            <router-link :to="link"  replace>{{linkText}}</router-link>
        </p>
        
    </div>
</template>
<script>
    export default {
        props: {
            text: String,
            haslink: {
                type: Boolean,
                default: true
            },
            link: {
                type: String,
                default: '/libs/docs/all'
            },
            linkText: {
                type: String,
                default: '去咨询医生'
            },
            marginTop: {
                type: String,
                default: '3rem'
            }
        }
    }
</script>
<style lang="less" scoped>
    i{
        height: 7.7rem;
        width: 11rem;
        display: block;
        background: url("../../assets/img/indexInfo/order.png");
        background-size: cover; 
        margin: 20% auto 0;
    }
    p{
        text-align: center
    }
    .showNo{
        text-align: center;
        font-size: 1.2rem;
        color: #ccc;
    }
    a{
        display: inline-block;
        overflow: hidden;
        text-align: center;
        color: #0284D2;
        border: 1px solid #0284D2;
        padding: .4rem .8rem .5rem;
        border-radius: .2rem;
        box-sizing: border-box;
        margin-top: 1rem;
    }
</style>