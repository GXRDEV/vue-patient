import { XSwitch } from 'vux'

export default {
  components: {
    XSwitch
  },
  computed: {
    mainSuit () {
      return this.form.mainSuit && this.form.mainSuit.length >= 10
    },
    askProblem () {
      return true
    }
  },
  methods: {
    validateItem (key) {
      let value = this['form'][key] || ''
      switch (key) {
        case 'mainSuit':
        case 'askProblem':
          value.length < 10 && this.$vux.toast.show({
            position: 'top',
            type: 'text',
            width: '12em',
            text: '最少输入10个文字'
          })
          break
      }
    }
  },
  data () {
      return {
          form: {
              toDb: true
          }
      }
  }
}
