<template>
  <div class="vux-media">    
    <previewer v-if="!iswechat" :list="items" :options="options" ref="previewer"></previewer>
    <audio id="media_audio" preload="metadata" controls autoplay="false" style="display:none;opacity:0;">
      Your browser does not support the audio element.
    </audio>
  </div>
</template>

<script>
  import { Previewer } from 'vux'
  import { AppendScript } from '@plugins/ajax'
  import { IsWxUrl, IsHttpUrl } from '@plugins/api'
  export default {
    name: 'media',
    components: {
      Previewer
    },
    props: {
      element: HTMLElement
    },
    data () {
      return {
        iswechat: this.$store.state.wechat,
        targetEle: null,
        audio: null,
        audioId: '',
        audioLength: 0,
        items: [],
        options: {
          getThumbBoundsFn (index) {
            if(!this.element) return
            // find thumbnail element
            let thumbnail = this.element
            // get window scroll Y
            let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
            // optionally get horizontal scroll
            // get position of element relative to viewport
            let rect = thumbnail.getBoundingClientRect()
            return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
          }
        }
      }
    },
    created () {
      /*global RongIMLib */
      let h = this.$store.state.static + '/js/rong/'
      if (typeof RongIMLib == 'undefined') {
          AppendScript(h + 'RongIMLib-2.2.8.min.js', this.init)
      }
    },
    mounted () {
        let that = this
        this.audio = document.getElementById('media_audio')
        this.audio.addEventListener('ended', () => {  
            that.$emit('on-ended', that.audioId)
        }, false);
    },
    methods: {
      play (src) {
        let that = this
        this.audioId = src
        this.stop()
        if(IsWxUrl(this.audioId)){
            this.$wechat.ready(function () {
              that.$wechat.playVoice({
                  localId: that.audioId
              });
              that.$wechat.onVoicePlayEnd({
                  complete: function (res) {
                      that.$emit('on-ended', res.localId)
                  }
              });
            })
        } else if (IsHttpUrl(this.audioId)) {
            this.$wechat.ready(function () {
              that.audio.src = that.audioId
              that.audio.play()
            })
        } else {
          this.audioLength = Math.floor(this.audioId.length / 1024) + 1
          //预加载 + 播放
          RongIMLib.RongIMVoice.preLoaded(that.audioId, function(){
              RongIMLib.RongIMVoice.play(that.audioId, that.audioLength)
              RongIMLib.RongIMVoice.onprogress = function(){
                that.audioLength--
                !that.audioLength && that.$emit('on-ended', that.audioId)
              }
          })
        }
      },
      stop () {
        let that = this
        if(this.audioId.indexOf('wxLocalResource://') != -1 || this.audioId.indexOf('weixin://') != -1){
          this.$wechat.ready(function () {
            that.$wechat.stopVoice({
                localId: that.audioId // 需要播放的音频的本地ID，由stopRecord接口获得
            });
          });
        } else if (this.audioId.indexOf('http://') != -1 || this.audioId.indexOf('https://') != -1) {
          this.$wechat.ready(function () {
            that.audio.pause()
            that.audio.src = ''
          });
        } else {
          RongIMLib.RongIMVoice.stop(this.audioId)
        }
      },
      show (list, curr) {
        if(this.iswechat){
            this.$wechat.previewImage({
              current: curr,
              urls: list.map( item => item.src)
            })
        } else {
            let index = 0
            this.items = list.map((item, idx) => {
              item.src == curr && (index = idx)
              return {
                id: item.id,
                src: item.src,
                name: item.name,
                w: 800,
                h: 600
              }
            })
            this.$nextTick(() => {
              this.$refs.previewer.show(index)
            })
        }
      },
      init () {
        let h = this.$store.state.static + '/js/rong/'
        if (typeof RongIMLib == 'undefined') {
            window.setTimeout(this.init)
        } else {
            !('RongIMVoice' in RongIMLib) && AppendScript(h + 'Libamr-2.2.5.min.js', () => {
                AppendScript(h + 'RongIMVoice-2.2.5.js', this.initVoice)
            })
            !('RongIMEmoji' in RongIMLib) && AppendScript(h + 'RongEmoji-2.2.6.min.js', this.initEmj)
        }
      },
      initVoice () {
        if ('RongIMVoice' in RongIMLib) {
            RongIMLib.RongIMVoice.init();
        } else {
            window.setTimeout(this.initVoice)
        }
      },
      initEmj () {
        if ('RongIMEmoji' in RongIMLib) {
            RongIMLib.RongIMEmoji.init();
        } else {
            window.setTimeout(this.initEmj)
        }
      }
    }
  }
</script>
