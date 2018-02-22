<template>
    <div class="emjspicker" v-if="show" :class="transfroms" @click="chooseImg($event)">
        <div class="scroll borderbox h100 innerdiv tcenter" v-html="emjs"></div>
    </div>
</template>

<script>
import { ResizeImage } from '@plugins/api'
import { AppendScript } from '@plugins/ajax'

export default {
    name: 'wxchooseemj',
    props: {
        show: Boolean
    },
    created() {
        this.init()
    },
    methods: {
        showemj() {
            this.emjs = RongIMLib.RongIMEmoji.emojis.map(item => {
                item.children[0].removeAttribute('style')
                item.children[0].innerHTML = RongIMLib.RongIMEmoji.symbolToEmoji(item.children[0].getAttribute('name'))
                return item.innerHTML
            }).join('')
        },
        chooseImg(e) {
            let span
            if (e.target.tagName == 'B') {
                span = e.target.parentNode
            }
            if (e.target.tagName == 'SPAN') {
                span = e.target
            }
            span && this.$emit('on-choose', span.getAttribute("name"))
        },
        init() {
            if (typeof RongIMClient == 'undefined' || !('RongIMEmoji' in RongIMLib)) {
                window.setTimeout(this.init)
            } else {
                this.showemj()
            }
        }
    },
    data() {
        return {
            emjs: ''
        }
    },
    computed: {
        transfroms() {
            return 'animated keybord-' + (this.show ? 'in' : 'out')
        }
    }
}
</script>
<style lang="less">
@import "../../assets/css/var";
.emjspicker {
  position: relative;
  height: 35vh;
  will-change: opacity;
  &:before {
    .setTopLine(#ccc);
  }
  .innerdiv {
    padding: 0.5rem;
  }
  span[class^="RongIMExpression_"],
  .rong-emoji-content {
    display: inline-block;
    width: 40px !important;
    height: 36px !important;
    font-size: 2rem;
    text-align: center;
    vertical-align: middle;
    overflow: hidden;
    line-height: 36px;
  }
  &.animated {
    -webkit-animation-duration: 0.3s;
    animation-duration: 0.3s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }
  &.keybord-out {
    animation-name: fadeOutDown;
  }
  &.keybord-in {
    animation-name: fadeInUp;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    height: 0;
    transform: translate3d(0, 100%, 0);
  }

  to {
    opacity: 1;
    height: 35vh;
    transform: none;
  }
}
@keyframes fadeOutDown {
  from {
    opacity: 1;
    height: 35vh;
  }

  to {
    opacity: 0;
    height: 0;
    transform: translate3d(0, 100%, 0);
  }
}
</style>
