<template>
    <div class="evaluate">
        <divider>{{docType}}</divider>
        <section class="flex">
            <div class="doctor">
                <span class="thumb bgcove" :style="`background-image:url(${imgsrc(doctor.listSpecialPicture, 'user-head')})`"></span>
                <p class="big13">{{doctor.specialName}}</p>
            </div>
            <div class="flex_1 eval-right">
                <div style="padding-top: .625rem">
                    <star v-model="form.grade" :height="1.875" :width="1.875" :margin=".458" ></star><span class="eval">{{impArr[form.grade]}}</span>
                </div>
                <div class="label">
                    <span class="base12" v-for="(item, index) in impression" :key="index" @click="addClassFun(index)" :class="{'selected': item.selected}">{{item.content}}</span>
                </div>
            </div>
        </section>
        <textarea v-model="form.content" placeholder="感谢医生，诊疗时态度好，医术高超！" class="big13"></textarea>
    </div>
</template>
<script>
    import { Divider } from 'vux'
    import { imgsrc } from '@filters'
    import { Star } from '@components/share'
    export default {
        components: {
            Divider, Star
        },
        props: {
            docType: String,
            doctor: {
                type: Object,
                default: {}
            },
            value: Object
        },
        methods: {
            imgsrc,
            label () {
                this.$http.get(this.$urls.GAINSYSTAGS, { grade: this.form.grade })
                .then(d => {
                    this.impression = d.tags.map(item => {
                        return {
                            ...item,
                            selected: false
                        }
                    })
                })
            },
            addClassFun (ind) {
                this.impression[ind].selected = !this.impression[ind].selected
            }
        },
        created () {
            this.label()
            this.form.grade = this.value.grade
        },
        data () {
            return {
                form: {
                    grade: 5,
                    content: '',
                    tagIds: '',
                    docId: ''
                },
                impArr:{ '1': '很差', '2': '一般', '3': '满意', '4': '很满意', '5': '非常满意' },
                impression: ''
            }
        },
        watch: {
            value (v){
                this.form.grade = v.grade
                this.$emit('input', this.form)
            },
            doctor (v){
                this.form.docId = v.specialId
                this.$emit('input', this.form)
            },
            ['form.grade'] (){
                this.label()
                this.$emit('input', this.form)
            },
            ['form.content'] (val){
                this.$emit('input', this.form)
            },
            tagIds (val){
                this.form.tagIds = val
                this.$emit('add-tagIds', this.form)
            }
        },
        computed: {
            tagIds () {
                return [...this.impression].filter(item => {
                    return item.selected
                }).map(item => {
                    return item.id
                }).join(',')
            }
        }
    }
</script>
<style lang="less" scoped>
    @import '../../assets/css/var';
    .evaluate{
        .vux-divider{
            color: #0082d3;
            padding: 0;
            font-size: 1.083rem;
            line-height: 1.2
        }
    }
    section{
        padding: 1.916rem 0 0 .75rem;
        .doctor{
            span{
                width: 2.91rem;
                height: 2.91rem;
                display: block;
                border-radius: 50%;
                margin-bottom: .75rem
            }
        }
        .eval-right{
            margin-left: 1.875rem;
            .eval{
                float: right;
                padding-top: .25rem;
                color: @warn-color
            }
        }
        .label{
            margin: 1.8rem 0 1.9rem;
             span{
                border: 1px solid #9fa3ac;
                display: inline-block;
                padding: .4rem .91rem;
                border-radius: 5rem;
                margin-bottom: .76rem;
                color: #9fa3ac;
                margin-right: .67rem;
            }
            .selected{
                color: #fff;
                background: @main-color;
                border: 1px solid @main-color;
            }
        }
    }
    textarea{
        width: 100%;
        height: 8.58rem;
        resize: none;
        padding: 1.25rem .75rem;
        box-sizing: border-box;
        border: 0;
        background: #eee;
        border-radius: .25rem;
        outline: none
    }

</style>
