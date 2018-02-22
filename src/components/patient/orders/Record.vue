<template>
    <scroller
        lock-x scrollbar-y use-pullup :prevent-default="false"
        height="100%" :pullup-config="pullupConfig"
        @on-pullup-loading="loadPullUp"
        v-model="scroll"
        ref="scroller">
        <div>
            <group gutter="0" class="recordPage">
                <cell v-for="(item, index) in records" :key="index" :title="item.opAction" :inline-desc="item.timeStr">
                    <span class="big15" :class="item.type==2 ? 'errorcolor' : 'maincolor'">
                        {{ (item.type==2 ? '-' : '+') + item.money}}
                    </span>
                </cell>
            </group>
            <no-order v-if="!records.length" text="暂无记录"></no-order>
        </div>
    </scroller>
</template>
<script>
    import { Group, Cell, Scroller } from 'vux'
    import { NoOrder } from '@components/share'

    export default {
        components: {
            Group,
            Cell,
            Scroller,
            NoOrder
        },
        data () {
            return {
                records: [],
                form: {
                    openid: this.$store.state.openid,
                    ispage: 1,
                    pageNo: 1,
                    pageSize: 10
                },
                pullupConfig: this.$store.state.pullupConfig,
                scroll: {
                    pullupStatus: ''
                }
            }
        },
        created () {
            this.loadPullUp()
        },
        methods: {
            loadPullUp () {
                this.$http.get(this.$urls.GAINUSERBILLS, this.form, this).then(d => {
                    let record = d.records || []
                    this.records = this.records.concat(record)
                    this.$nextTick(() => {
                        this.$refs.scroller.reset(this.form.pageNo == 1 ? {top: 0} : {})
                    })
                    setTimeout(() => {
                        if (record.length == this.form.pageSize) {
                            this.form.pageNo++;
                            this.scroll.pullupStatus = 'default'
                        } else {
                            this.scroll.pullupStatus = 'disabled'
                        }
                    },100)
                })
            }
        }
    }
</script>
<style lang="less">
    .recordPage{
        .weui-cell{
            box-sizing: border-box;
            height: 5.42rem;
            .vux-label{
                font-size: 1.167rem;
                color: #222;
            }
            .vux-label-desc{
                display: block;
                font-size: 0.92rem; color: #aaa;
                margin-top: .5rem;
            }
        }
    }
</style>
