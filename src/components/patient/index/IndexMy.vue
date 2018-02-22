<template>
    <div class="main flex column">
        <div class="link flex acenter big15">
            <router-link to="mydoc">
                <span>我的医生</span>
            </router-link>
            <router-link to="follow">
                <span>我的关注</span>
            </router-link>
            <router-link to="mysign">
                <span>我的签约</span>
            </router-link>
        </div>
        <div class="line"></div>
        <div class="scroll flex_1">
            <router-view></router-view>
        </div>
    </div>
</template>
<style scoped lang="less">
    @import '../../../assets/css/var';
    .main{
        height: 100%;
        overflow: hidden;
        .line{
            position: relative;
            height: 1px;
            &:after{
                .setBottomLine(#ededed);
            }
        }
        .link{
            background: #fff;
            height: 3.75rem;
            a{
                text-align: center; color: #878d99;margin-left: 1rem;
            }
            span {
                border-radius:2.5rem; height: 2.5rem; line-height: 2.5rem; display: block;
                min-width: 7.375rem; box-sizing: border-box; text-align: center;
            }
            .router-link-active{
                span {
                  background:@main-color;
                  color:#fff;
                }
            }
        }
    }
</style>
