<template>
    <div class="h100vh bgfff flex column systeminfo">
        <p class="title relative bgfff big14" @click="goback"><i></i>系统消息</p>
        <div class="systemlist">
            <div class="iteminfo" v-for="(item,ind) in lists" :key="ind">
                <p class="tcenter" style="line-height:normal;">
                    <span class="time fff small9" :data-txt="item.createTime">{{ item.createTime }}</span>
                </p>
                <div class="content bgfff">
                    <h3 class="big16 pf-regular blacklower">{{ item.title }}</h3>
                    <p class="content-main">{{ item.content }}</p>
                    <p style="padding-top:1rem;" class="maincolor" @click="jumpto(item)">{{ item.code==1?'去查看':'去完善' }}<i class="iconfont icon-arrright small9 gray fright"></i></p>
                </div>
            </div>
          </div>
          <div class="nomessage" v-if="!lists.length"><img src="../../../assets/img/message/nomessage.png"/></div>
    </div>
</template>
<script>
    export default{
        data (){
            return {
                timer: +new Date(),
                lists:[]
            }
        },
        created (){
            this.$http.get(this.$urls.GETSYSTEMLIST, { openid: this.$store.state.openid })
                .then(d=>{
                    this.lists = d.systemMessages;
                })
        },
        methods:{
            goback (){
                this.$router.go(-1);
            },
            jumpto (item){
                this.$router.push( item.code == 2 ? "/completeinfo/" + this.timer : (item.code == 3 ? "/main/family" : "/funintro") );
                this.$http.post(this.$urls.SYSTEMREADED, { openid: this.$store.state.openid })
            }
        }
    }
</script>
<style lang="less" scoped>
    @import "../../../assets/css/var";
    .systeminfo {
        background: #eee;
    }
    .title {
        height: 3.07rem;
        line-height: 3.07rem;
        text-align: center;
        border-bottom: 1px solid #e5e5e5;
        padding: 0 1rem;
        font-size: 1.25rem;
        i{
            display: inline-block;
            width: .7rem;
            height: .7rem;
            border-left: 2px solid #ccc;
            border-bottom: 2px solid #ccc;
            transform: rotate(45deg);
            position: absolute;
            left: 1rem;
            top: 1rem;
        }
    }
    .systemlist {
        padding: 1rem .8rem;
        .iteminfo + .iteminfo {
            margin-top:1.5rem;
        }
        .time {
            color: transparent; white-space: nowrap;
            padding: .2rem 1rem;background-color: #bfc2c7;
            border-radius: .2rem;position: relative;
            &:after{
               content: attr(data-txt); color: #fff;
               position: absolute;left: 50%; top: 50%; z-index: 1; transform: translate(-50%, -45.5%);
             }
        }
        .content {
            margin-top:.8rem;
            padding: 1.2rem 1rem 1rem;
            box-sizing: border-box;
            .content-main {
                color: #878d99;
                padding:1rem 0 1.3rem;
                border-bottom: 1px solid #eee;
                line-height:1.6rem;
            }
        }
    }
    .nomessage {
        text-align: center;
        margin-top: 50%;
        img {
            width: auto;
            height: 8rem;
        }
    }
</style>
