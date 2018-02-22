import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
        watchgoeasy: state => state.goeasy
    })
  },
  watch: {
      watchgoeasy (key, old) {
          typeof this.refresh == 'function' && this.refresh(key)
      }
  }
}
