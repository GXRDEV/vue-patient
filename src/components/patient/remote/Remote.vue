<template>
    <div class="flex column h100 remote">
        <header>
            当前位置「<span>{{gpsName}}</span>」-
            <router-link to="/gps?role=2">
                切换 &ensp;
            </router-link>
        </header>
        <section class="bgfff flex_1" style="overflow-x: hidden">
            <template v-if="!from">
                <p class="title g_padding">当前城市合作医院 <span>*</span></p>
                <div class="flex form-group">
                    <popup-picker class="flex_1" :data="hos" placeholder="请选择医院" v-model="form.hosid" show-name value-text-align="left"></popup-picker>
                    <popup-picker class="flex_1" :data="dep" placeholder="请选择科室" v-model="form.depid" show-name value-text-align="left"></popup-picker>
                </div>
            </template>
            <template>
                <div class="g_padding form-group" :class="{borders: !!from}">
                    <p class="title">选择您要会诊的专家 <span>*</span></p>
                    <router-link class="relative weui-cell__ft" :to="{ path: '/explibs', query: { depid: form.depid[0] }}" v-if="choiceExp"
                        style="display:block;color: #ccc; width: 100%; text-align: left">
                        所选专家<span class="choice-span">我明确要会诊的专家，去选择</span>
                    </router-link>
                    <span class="doc flex relative" style="align-items: center; text-align: left" v-if="showExp" @click="jumpPage" :class="{'weui-cell__ft': !from}">
                        <i class="thumb bgcove" :style="`background-image:url(${imgsrc(doc.listSpecialPicture, 'user-head')})`"></i>
                        <p class="flex_1 ohidden">&emsp;<span class="big15 blacklower">{{doc.specialName}}</span>&ensp;<span class="gray">{{doc.hosName}}&ensp;{{doc.depName}}</span></p>
                        <span class="blacklower" :style=" !from ? 'padding-right: 1rem' : ''">{{services.amount}}元</span>
                    </span>
                </div>
                <div class="form-group choice" v-if="!from">
                    <popup-picker title="所选级别" placeholder="不明确会诊专家，按级别选择" :data="level" v-model="form.levelid" show-name value-text-align="left"></popup-picker>
                </div>
            </template>
            <template v-if="!!from">
                <p class="title g_padding" style="margin-bottom: .2rem">当前城市合作医院 <span>*</span></p>
                <div class="flex form-group">
                    <popup-picker class="flex_1" :data="hos" placeholder="请选择医院" v-model="form.hosid" show-name value-text-align="left"></popup-picker>
                    <popup-picker class="flex_1" :data="dep" placeholder="请选择科室" v-model="form.depid" show-name value-text-align="left"></popup-picker>
                </div>
            </template>

            <div class="g_padding">
                <p class="title">期望会诊时间在 <span>*</span></p>
                <label v-for="(item, ind) in times" :key="ind" class="checkbox">
                    {{item.displayName}}&ensp;
                    <input type="radio" name="radio" v-model="form.timer" :value="item.id">
                    <i></i>
                </label>
                <router-link to="/remark" class="toRemark relative weui-cell__ft">
                    服务流程&emsp;<i class="arrow"></i>
                </router-link>
            </div>
        </section>
        <footer class="fixedbottom" style="height: 3.4rem">
            <div class="fixed left right bottom tcenter nobg">
                <x-button type="primary" class="weui-btn_circle" style="height: 3.4rem" :disabled="validate" @click.native="next">下一步</x-button>
            </div>
        </footer>
    </div>
</template>
<script>
    import { XButton, PopupPicker, PopupRadio } from 'vux'
    import { mapGetters } from 'vuex';
    import { FullDepart } from '@components/share'
    import { imgsrc } from '@filters'
    export default {
        components: {
            XButton, PopupPicker, FullDepart, PopupRadio
        },
        data () {
            return {
                from: this.$route.query.from || '',  // 当有from时，说明直接从专家库进入
                hos: [[{ name: '请选择医院', value: '0' }]],
                dep:[[{ name: '请选择科室', value: '0' }]],
                level: [[{}]],
                times: [],
                form: {
                    hosid: [],
                    oldhosId:[],
                    depid: [],
                    levelid: [],
                    timer: '',
                    docid: this.$route.query.docid || ''
                },
                docid: this.$route.query.docid || '',
                services: [],
                doc: {},
                showExp: false,
                oldgps: ''
            }
        },
        computed: {
            ...mapGetters(['gpsName', 'gpsCode']),
            choiceExp (){
                return !(!this.form.depid.length || this.form.depid[0] == '0' || this.compare || this.showExp)
            },
            compare (){
                if(!!this.form.oldhosId[0]){
                    return this.form.hosid[0] != this.form.oldhosId[0] && !this.form.oldhosId[0]
                } else {
                    return this.form.hosid[0] != this.form.oldhosId[0] && !!this.form.oldhosId[0]
                }
            },
            validate (){
                return !(this.form.timer && (this.form.hosid[0]) && (this.form.depid[0] && this.form.depid[0] != 0) && (this.docid || this.form.levelid[0]))
            }
        },
        created () {
            sessionStorage.getItem('_catch_oldgps_') && (this.oldgps = sessionStorage.getItem('_catch_oldgps_'))
            this.oldgps == this.gpsCode && sessionStorage.getItem('_catch_remote_') && (this.form = JSON.parse(sessionStorage.getItem('_catch_remote_')))
            this.getHos()
            // 加载专家信息
            this.docid && this.$http.get(this.$urls.DOCMAIN, {docid: this.docid}).then( d => {
                this.showExp = true
                this.services = d.services[0]
                this.doc = d.doc
                this.form.levelid = []
            })
            // 获取期望时间
            this.$http.get(this.$urls.LOADWISHTIME).then( d => {
                this.times = d.times
            })
            // 加载专家价格
            this.$http.get(this.$urls.LOADLEVELS).then( d => {
                this.level = [[]]
                d.splevels.map( item => {
                    this.level[0].push({
                        value: item.id + '',
                        name: item.displayName + ' / ' + item.displayValue + '元'
                    })
                })
            })
        },
        methods: {
            imgsrc,
            getHos (){
                this.$http.get(this.$urls.GAINNEARHOSES, { distCode: this.gpsCode }).then(d => {
                    this.hos = [[{ name: '请选择医院', value: '0' }]]
                    d.hospitals.map( item => {
                        this.hos[0].push({
                            name: item.displayName,
                            value: item.id + ''
                        })
                    })
                })
            },
            getDep (){
                this.dep = [[{ name: '请选择科室', value: '0' }]]
                this.$http.get( this.$urls.GETBYHOSID, { hosid: this.form.hosid[0]}).then( d => {
                    d.departs.map( item => {
                        this.dep[0].push({
                            name: item.displayName,
                            value: item.id + ''
                        })
                    })
                })
            },
            jumpPage (){
                !this.from && this.$router.push({ path: '/explibs', query: { depid: this.form.depid[0] }})
            },
            // 下一步，患者信息
            next (){
                let form = {
                    cityid: this.gpsCode,
                    hosid: this.form.hosid[0] || '',
                    departid: this.form.depid[0] || '',
                    expertid: this.docid || '',
                    levelid: this.form.levelid[0] || '',
                    timeid: this.form.timer
                }
                sessionStorage.setItem('_catch_exps_', JSON.stringify(form))
                let url = this.from ? '/userdetail?from=true' : '/userdetail'
                this.$router.push(url)
            }
        },
        watch: {
            ['form.hosid'] (n, o){
                this.form.oldhosId = o
                if( !!this.form.depid[0] && !o[0]){
                    this.getDep()
                } else if ( n[0] != o[0] ){
                    this.form.depid[0] = '0'
                    this.getDep()
                }
            },
            ['form.levelid'] (n, o){
                n.length && (this.showExp = false) && (this.docid = '')
            }
        },
        beforeDestroy () {
            sessionStorage.setItem('_catch_oldgps_', this.gpsCode)
            sessionStorage.setItem('_catch_remote_', JSON.stringify(this.form))
        }
    }
</script>
<style lang="less" scoped>
    @import '../../../assets/css/var';
    header{
        padding: 1rem;
        background: #eee;
        a {
            color: #0284D2;
        }
    }
    section{
        .title{
            color: #ccc;
            margin: .8rem 0;
            span {
                color: red;
            }
        }
        .choice-span{
            padding-left: 15px;
            color: #000
        }
        .toRemark{
            float: right;
            color: @main-color;
            margin: 1.5rem 0;
            &:after{
                margin-top: -3px
            }
        }
        .checkbox{
            display: inline-block;
            width: 33.33%;
            input[type="radio"]{
                display: none;
                & ~ i{
                    display: inline-block;
                    width: 15px;
                    height: 15px;
                    border-radius: 50%;
                    background: #ccc;
                    vertical-align: middle
                }
                &:checked ~ i{
                    &:after{
                        content: "";
                        display: inline-block;
                        width: 9px;
                        height: 9px;
                        background: #0284D2;
                        border-radius: 50%;
                        margin: 3px
                    }
                }
            }
        }
        .doc{
            p{
                .setMultEllipsis(1)
            }
            .thumb{
                width: 2.5rem;
                height: 2.5rem;
                border-radius: 50%
            }
        }
        .borders{
            padding: 0 1rem 1rem 0;
            margin-left: 1rem;
            border-bottom: .5px solid #D9D9D9
        }
    }
</style>
<style lang="less">
    @import '../../../assets/css/var';
    .remote{
        .weui-cell{
            padding: .625rem 1rem 1rem
        }
        .vux-cell-box:before{
            display: none
        }
        .vux-cell-box:after{
            content: "";
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 1px;
            border-top: 1px solid #D9D9D9;
            color: #D9D9D9;
            transform-origin: 0 0;
            transform: scaleY(0.5);
            left: 15px;
        }
        .weui-cell__ft:after {
            content: "";
            position: absolute;
            height: 6px;
            width: 6px;
            border-width: 1px 1px 0 0;
            border-color: #0284D2 !important;
            border-style: solid;
            transform: rotate(45deg);
            top: 50%;
            margin-top: -3px;
            right: 0.15rem;
        }
        .vux-popup-picker-select{
            span{
                color: #000;
                overflow: hidden;
                .setMultEllipsis(1);
            }
        }
        .choice{
            padding: .35rem 0;
            .weui-label{
                color: #ccc
            }
            .vux-cell-placeholder,.vux-popup-picker-value{
                padding-left: 15px;
            }
        }
    }
</style>
