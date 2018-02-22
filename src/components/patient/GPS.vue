<template>
    <article class="h100vh">
        <choose-area v-model="discode" :hasgps="true" @on-change="selectChange" :role="role"></choose-area>
    </article>
</template>
<script>
    import { Group } from 'vux'
    import { mapMutations, mapGetters } from 'vuex'
    import { ChooseArea } from '@components/share'
    import { SET_SGPS } from '@/module/patient/store/mutation-types'

    export default {
        name: 'gps',
        components: {
          ChooseArea
        },
        data () {
            return {
                discode: {},
                role: this.$route.query.role || '3'
            }
        },
        computed: {
            ...mapGetters(['gpsCode', 'gpsName'])
        },
        created () {
            this.discode =  {
                code: this.gpsCode,
                name: this.gpsName
            }
        },
        methods: {
            ...mapMutations([ SET_SGPS ]),
            selectChange (value) {
                this[SET_SGPS](value)
                this.$router.go(-1)
            }
        }
    }
</script>
