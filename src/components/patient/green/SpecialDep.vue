<template>
    <section class="bgfff specialdep">
        <p class="title relative bgfff big16" @click="goback"><i></i>特殊科室名单</p>
        <div class="total">
            <p class="tcenter" style="margin-bottom: 1.5rem;"><span class="hos big16">北京地区医院</span></p>
            <dl>
                <dd class="base12 relative" v-for="(hos,ind) in hoss" :key="ind">
                    <div class="tleft maincolor hosname bbox">
                        {{ hos.hosName }}
                    </div>
                    <div class="tleft deps">
                        <span class="depitem" v-for="(dep,inx) in hos.deps">{{ dep }}</span>
                    </div>
                </dd>
            </dl>
        </div>
    </section>
</template>
<script>
    export default {
        data (){
            return {
                hoss: [
                    {
                        hosName: "北京协和医院",
                        deps: ['全科']
                    },
                    {
                        hosName: "解放军301医院",
                        deps: ['全科']
                    },
                    {
                        hosName: "北医三院",
                        deps: ['妇产科','运动医学','骨科','生殖医学','康复科']
                    }
                ]
            }
        },
        methods :{
            goback (){
                this.$router.go(-1)
            }
        }
    }
</script>
<style lang="less" scoped>
    @import "../../../assets/css/var";
    .title {
        height: 3.6rem;
        line-height: 3.6rem;
        text-align: center;
        color:rgba(1,1,1,1);
        border-bottom: 1px solid #eee;
        i{
            display: inline-block;
            width: .7rem;
            height: .7rem;
            border-left: 2px solid #ccc;
            border-bottom: 2px solid #ccc;
            transform: rotate(45deg);
            position: absolute;
            left: 1.25rem;
            top: 50%;
            margin-top: -.35rem;
        }
    }
    .total {
        padding: 1.5rem .8rem;
    }
    .hos {
        color:rgba(102,102,102,1);
        background: #e5f3fa;
        padding: .6rem 1.34rem;
    }
    dd {
        background: #e5f3fa;
        color:rgba(153,153,153,1);
        margin-bottom: .1rem;
        padding-top: .8rem;
        .depitem { display: inline-block; width: 32%; margin-bottom: .8rem;}
        .hosname { padding-left: .8rem; position: absolute; top: 50%; transform: translateY(-50%); }
        .deps { margin-left: 40%;}
    }
</style>
