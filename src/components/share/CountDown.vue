<template>
  <span>{{currentTime | formtCountTime(format)}}</span>
</template>

<script>
import { formtCountTime } from '@filters'
export default {
  props: {
    value: Number,
    start: {
      type: Boolean,
      default: true
    },
    format: {
        type: String,
        default: 'hh:mm:ss'
    }
  },
  filters: {
      formtCountTime
  },
  created () {
    if (this.value) this.currentTime = this.value
  },
  methods: {
    tick () {
      let _this = this
      this.interval = setInterval(function () {
        if (_this.currentTime > 0) {
          _this.currentTime--
        } else {
          _this.stop()
          _this.index++
          _this.$emit('on-finish', _this.index)
        }
      }, 1000)
    },
    stop () {
      clearInterval(this.interval)
    }
  },
  watch: {
    value (val) {
      this.currentTime = val
    },
    currentTime (val) {
      this.$emit('input', val)
    },
    start (newVal, oldVal) {
      if (newVal === true && oldVal === false && this.currentTime > 0) {
        this.tick()
      }
      if (newVal === false && oldVal === true) {
        this.stop()
      }
    }
  },
  mounted () {
    if (this.start) {
      this.tick()
    }
  },
  data () {
    return {
      interval: null,
      index: 0,
      currentTime: 60
    }
  }
}
</script>