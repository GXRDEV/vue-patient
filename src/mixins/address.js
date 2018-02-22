import { XAddress } from 'vux'
export default {
    components: {
        XAddress
    },
    created () {
        !this.$store.state.distcodes.length && this.$store.dispatch('getDistCodes')
    }
}
