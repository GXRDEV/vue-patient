<template>
    <article>
        <group title="咨询医生服务" class="servicegroup" gutter="0">
            <cell class="list-item-menu" title="快速问诊" is-link link="/introdetail/9">
                <img slot="icon" src="../../../assets/img/intro/intro_9.png">
            </cell>
            <cell class="list-item-menu" title="图文问诊" is-link link="/introdetail/6">
                <img slot="icon" src="../../../assets/img/intro/intro_6.png">
            </cell>
            <cell class="list-item-menu" title="电话问诊" is-link link="/introdetail/7">
                <img slot="icon" src="../../../assets/img/intro/intro_7.png">
            </cell>
            <cell class="list-item-menu" title="患者报到" is-link link="/introdetail/8">
                <img slot="icon" src="../../../assets/img/intro/intro_8.png">
            </cell>
        </group>
        <group title="医生团队服务" class="servicegroup" gutter="0">
            <cell class="list-item-menu" title="团队问诊" is-link link="/introdetail/12">
                <img slot="icon" src="../../../assets/img/intro/intro_12.png">
            </cell>
            <cell class="list-item-menu" title="图文会诊申请" is-link link="/introdetail/11-1">
                <img slot="icon" src="../../../assets/img/intro/intro_5.png">
            </cell>
            <cell class="list-item-menu" title="视频会诊申请" is-link link="/introdetail/11-2">
                <img slot="icon" src="../../../assets/img/intro/intro_4.png">
            </cell>
        </group>
        <group title="名院专家会诊服务" class="servicegroup" gutter="0">
            <cell class="list-item-menu" title="图文会诊" is-link link="/introdetail/5">
                <img slot="icon" src="../../../assets/img/intro/intro_5.png">
            </cell>
            <cell class="list-item-menu" title="视频会诊" is-link link="/introdetail/4">
                <img slot="icon" src="../../../assets/img/intro/intro_4.png">
            </cell>
        </group>
    </article>
</template>
<script>
    import { Group, Cell } from 'vux'
    export default {
        components :{
            Group, Cell
        }
    }
</script>
<style lang="less">
    .servicegroup{
        padding: 1px 0;
        .weui-cells__title{
            margin: .6rem 0;
        }
        .list-item-menu{
            padding: 1.5rem 1rem!important;
            .vux-label{
                line-height: 1;
            }
            .weui-cell__hd img{
                height: 1.83rem;
            }
        }
    }
</style>