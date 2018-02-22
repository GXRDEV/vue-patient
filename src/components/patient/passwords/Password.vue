<template>
    <group class="passwordpage">
        <cell title="重置密码" is-link link="/changepass"></cell>
        <cell title="绑定订单" is-link link="/bindorder"></cell>
    </group>
</template>
<script>
    import { Group, Cell } from 'vux'
    export default{
        components: {
            Group,
            Cell
        }
    }
</script>
<style lang="less">
    .passwordpage{
        .weui-cell{
            padding: 1rem;
        }
        .vux-label{
            font-size: 1.16rem !important
        }
    }
</style>