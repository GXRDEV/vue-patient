<template>
    <section class="h100vh appraisemorepage">
        <scroller lock-x scrollbar-y use-pullup :prevent-default="false"
            :pullup-config="pullupConfig" height="100%"
            v-model="scroll"
            @on-pullup-loading="loadPullUp"
            ref="scroller">
            <appraises :oid="id" @on-more="LoadMore" :type="type" :more="true" ref="appraise"></appraises>
        </scroller>
    </section>
</template>
<script>
    import { Scroller } from 'vux'
    import { Appraises } from '@components/share'
    export default {
        name: 'appraise',
        components: {
            Scroller, Appraises
        },
        data () {
            return {
                id: this.$route.params.id,
                type: this.$route.params.type,
                scroll: {
                    pullupStatus: ''
                },
                pullupConfig: this.$store.state.pullupConfig,
            }
        },
        methods: {
            loadPullUp () {
                this.$refs.appraise.load()
            },
            LoadMore (end) {
                this.$nextTick(() => {
                    this.$refs.scroller.reset()
                })
                setTimeout(() => {
                    this.scroll.pullupStatus = end ? 'default' : 'disabled'
                }, 100)
            }
        }
    }
</script>
<style lang="less">
    .appraisemorepage{
        .judgments{
            .judgment{
                margin-top: 6px;
            }
            padding: 0!important;
            .cells{
                margin: 0!important;
            }
            p{
                padding: 0 15px;
              &.tright {
                margin-left:15px;
               }
            }
        }
    }
</style>
