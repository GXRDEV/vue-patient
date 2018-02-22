<template>
    <article>
        <div class="big14 title"><span class="maincolor">出诊 |</span>
            <span class="base12" v-if="address" style="color:#0086d1;">{{address}}</span>
            <span class="base12" style="color: #999;" v-else>请点击出诊时间点查看详细信息</span>
        </div>
        <table class="table table-bordered">
            <thead>
                <tr class="big14">
                    <th></th>
                    <th>一</th>
                    <th>二</th>
                    <th>三</th>
                    <th>四</th>
                    <th>五</th>
                    <th>六</th>
                    <th>日</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(tr, tridx) in times" :key="tridx">
                    <template v-for="(td, idx) in tr">
                      <th v-if="!idx"><span>{{td}}</span></th>
                      <td v-else :class="{'online': td, 'focus': otridx==tridx && oidx==idx}" @click="showaddress(tridx, idx, td)"><span>{{ td ? '出诊' : td }}</span></td>
                    </template>
                </tr>
            </tbody>
        </table>
    </article>
</template>
<script>
    export default {
        name: 'doctimeshow',
        props: {
            oid: String
        },
        mounted () {
            // 医生出诊时间
            this.$http.get(this.$urls.GAINVISITTIMES, {
                docid: this.oid
            }).then(d => {
                (d.times || []).forEach(item => {
                    let row = item.outTime - 1
                    let column = item.weekDay == 0 ? 7 : item.weekDay
                    this.times[row][column] = (item.address || '暂未设置') + ' '+  (item.outType == 1 ? '普通号' : '专家号') + (item.cost ? '/' + item.cost + '元' : '')
                })
                this.$forceUpdate()
            })
        },
        data () {
            return {
                times: [
                    ['上午','','','','','','',''],
                    ['下午','','','','','','',''],
                    ['晚间','','','','','','','']
                ],
                otridx: -1,
                oidx: -1,
                address: ''
            }
        },
        methods: {
            showaddress (tridx, idx, address) {
                this.otridx = tridx
                this.oidx = idx
                this.address = address
            }
        }
    }
</script>

<style scoped lang="less">
    @import '../../assets/css/var';
    .title { height: 3rem; line-height: 3rem; margin: 0 .83rem;}
    .table{
        border-collapse: separate;border-radius: 4px; overflow: hidden;border-left-width: 0; border-right-width: 0;border-bottom-width: 0;
        th, td{
            font-size: 1.167rem; color: #666;
            padding: .3rem; border-color: #F5F5F5; border-left-width: 0; border-top-width: 0;border-right-width: 0; font-weight: 400;
            span{
                display: block; padding:0.3rem 0; box-sizing: border-box;
            }
        }
        tr th:first-child { border-right-width: 1px; color: #999;}
        thead th{
            width: 12.5%; background: #fff; padding:0.6rem 0;
            border-bottom-color: #F5F5F5;
        }
        tbody{
            td { font-size: 1rem;}
        }
        .online{
            position: relative;
            color: @main-color;
            text-align:center;
            span{
                border: 1px solid @main-color;
                border-radius:.2rem;
            }
            &.focus{
                span{
                    color: #fff;
                    background: @main-color;
                }
            }
        }
    }
</style>
