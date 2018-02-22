<template>
    <span class="star">
        <i class="img"></i><label :style="{ fontStyle, fontSize }">{{star}}</label>
    </span>
</template>
<script>
    export default {
        props: {
            value: {
                type: [String, Number],
                default: 0
            },
            fontStyle: String, // italic
            fontSize: {
                type: String,
                default: '1.18rem'
            }
        },
        computed: {
            star () {
                return this.value >= 10 ? this.value : parseFloat(this.value).toFixed(1)
            }
        }
    }
</script>
<style lang="less" scoped>
    .star{
        .img{
            width: .86rem; height: .86rem; display: inline-block;
            vertical-align: text-bottom; margin-bottom: 3px;
            background: url(../../assets/img/star/active.png) no-repeat center center;
            background-size: contain;
        }
        label{
            color: #f6ab00; zoom: 1.3; margin-left: .4rem;
        }
    }
</style>