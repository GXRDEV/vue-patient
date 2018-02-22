<template>
    <div class="header">
        <p v-if="router" class="skip relative" replace>
            <span @click="waitToComplete">稍后完善</span> <i class="absolute"></i>
        </p>
        <h3>{{title}}</h3>
        <slot>
            <p class="content">{{content}}</p>
        </slot>
    </div>
</template>
<script>
    export default {
        props: {
            title: String,
            content: String,
            router: String,
            code: [String, Number]
        },
        methods: {
            waitToComplete (){
                this.router && this.getUrl();
                this.code && this.$http.post(this.$urls.WAITTOCOMPLETE, { openid: this.$store.state.openid, code: this.code })
                
            },
            getUrl (){
                let hisUrl = sessionStorage.getItem('_cache_bind_from_') || '';
                sessionStorage.removeItem('_cache_bind_from_')
                this.$router.replace(this.router == '#' ? hisUrl : this.router)
            }
        }
    }
</script>
<style lang="less" scoped>
    @import '../../assets/css/var';
    .header{
        padding: 1rem
    }
    .skip{
        display: block;
        color: @main-color;
        text-align: right;
        padding-right: 10px;
        i{
            width: 5px;
            height: 5px;
            border-right: 1px solid @gray-color;
            border-top: 1px solid @gray-color;
            right: 0;
            top: 50%;
            margin-top: -2.5px;
            transform: rotate(45deg)
        }
    }
    h3{
        padding: 0.85rem 0 0.8rem;
        font-size: 1.61rem;
        font-weight: 400
    }
    .content{
        color: #878d99
    }
</style>
