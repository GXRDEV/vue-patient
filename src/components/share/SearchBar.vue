<template>
    <header class="searchbarCom flex acenter jcenter">
        <router-link class="searchbar flex_1" :to="{path: '/search', query: { dtype, types, serviceId }}" :style="styles">
              <span class="searchbar-input tcenter flex acenter jcenter">
                  <i class="thumb magnifier"></i>
                  <span class="big13" style="color:#bfbfbf;">{{placeholder || '搜索'}}</span>
              </span>
        </router-link>
        <router-link v-if="address" to="/gps" class="gpsname flex acenter jcenter">
            <i class="iconfont bgcove"></i>
            <span class="big12 blacklower">{{ address }}</span>
        </router-link>
    </header>
</template>
<script>
    export default {
        name: 'searchbar',
        props: {
            placeholder: String,
            address: String,
            styles: String,
            types: {
                type: String,
                default: ''
            },
            dtype: {
                type: [String, Number],
                default: 3
            },
            serviceId: {
                type: [String, Number],
                default: ''
            }
        }
    }
</script>
<style lang="less">
    @import '../../assets/css/var';
    .searchbarCom{
        .gpsname{
            color: #000; white-space: nowrap; padding:0 1rem;
            .iconfont{
                font-size: 1.4rem;
                background-image: url(../../assets/img/main/position.png);
                display:inline-block;
                width: .92rem;
                height: 1.167rem;
                background-size: contain;
                margin-right: .5rem;
            }
        }
        .searchbar{
            display: block; box-sizing: border-box;
            padding: .42rem 1rem; background: transparent;
        }
        .searchbar-input{
            background-color: rgba(200, 200, 200, .5);
            color: #878d99;
            border-radius: 4px; height: 2rem;
            span{ line-height: normal; }
        }
        .magnifier{
            width: 1.05rem; height: 1.08rem; margin-right: 3px;
            background-image: url(../../assets/img/magnifier.png);
            background-size: contain;
            background-repeat: no-repeat;
        }
    }
</style>
