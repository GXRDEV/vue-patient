<template>
  <div class="vux-speaking">
      <!--@touchstart="start"
          @mousedown="start"
          @touchmove="move"
          @mousemove="move"
          @touchend="end"
          @mouseup="end"
          @touchcancel="end"-->
      <button type="button" class="button" :class="{'speaking': speaking}"
          @touchstart="start"
          @touchmove="move"
          @touchend="end"
          @touchcancel="end">
          {{ speaking ? '松开 结束' : '按住 说话' }}
      </button>
      <div class="recording" v-show="speaking || showShort">
            <div class="recording-short" v-if='showShort'>
                <div class="short-inner single-img"></div>
                <p>说话时间太短</p>
            </div>
            <template v-else>
                <div class="recording-voice" v-show='!smove'>
                    <div class="voice-inner flex acenter jcenter" :class="{'notime': vtime < 10 && vtime > 0}">
                        <div class="voice-icon"></div>
                        <div class="voice-volume" v-if="!vtime">
                          <i v-for="i in 9" :key="i"></i>
                        </div>
                        <div v-else>
                          <count-down class="voice-time" v-model="vtime" @on-finish="finishTime" format="s"></count-down>
                        </div>
                    </div>
                    <p>手指上划,取消发送</p>
                </div>
                <div class="recording-cancel" v-show='smove'>
                    <div class="cancel-inner single-img"></div>
                    <p>松开手指,取消发送</p>
                </div>
            </template>
        </div>
  </div>
</template>

<script>
  import CountDown from './CountDown'
  export default {
    name: 'speaking',
    components: {
      CountDown
    },
    props: {
      element: HTMLElement
    },
    data () {
      return {
        iswechat: this.$store.state.wechat,
        // iswechat: true,
        speakId: '',
        speaking: false,
        showShort: false,
        speakTimes: 0,
        moveY: 0,
        vtime: 0,
        smove: false,
      }
    },
    // created () {
    //   let that = this
    //   this.$wechat.startRecord({
    //     complete () {
    //       that.$wechat.stopRecord();
    //     }
    //   })
    // },
    methods: {
        start (event) {
	        event.preventDefault();
            if(!this.iswechat) {
              this.$vux.toast.show({ type: 'text', width: '12em', text: '仅支持微信内使用', position: 'top' })
              return 
            }
            let that = this
            let e = 'targetTouches' in event ? event.targetTouches[0] : event
            this.speakId = ''
            this.moveY = e.clientY
            this.speaking = true
            this.smove = false
            this.speakTimes = (+new Date())
            this.$wechat.startRecord({
              fail () {
                alert('录音失败，请刷新重试。')
              },
              success () {
                that.speakTimes = (+new Date())
                that.vtime = 59
                if (!that.moveY || that.smove){
                  return that.cancel(), false
                }
                // 录音时间超过一分钟没有停止的时候会执行 complete 回调
                that.$wechat.onVoiceRecordEnd({
                    complete: function (res) {
                        that.speakId = res.localId;
                        that.finishTime('auto')
                    }
                });
                that.$emit('on-record-begin')
              }
            })
        },
        move (event) {
            if(!this.iswechat) return
            let e = 'targetTouches' in event ? event.targetTouches[0] : event
            if (this.moveY - e.clientY > 30){
              this.smove = true
            }
        },
        finishTime (sign) {
            // 说话时间到60s时停止录音
            if(!this.speaking) return
            this.speaking = false
            this.moveY = 0
            sign == 'auto' ? this.uploadRecord() : this.stopRecord()
            this.$vux.toast.show({
              type: 'text',
              width: '9em',
              text: '说话时间太长'
            })
        },
        cancel () {
          this.speaking = false
          this.moveY = 0
          this.$wechat.stopRecord({
              complete () {
                that.$emit('on-record-cancel')
              }
          })
        },
        end () {
            if(!this.speaking) return
            let that = this;
            this.speaking = false
            this.speakTimes = (+new Date()) - this.speakTimes
            this.moveY = 0
            let tooshort = !this.smove && this.speakTimes < 800
            if(this.smove || tooshort){
                this.cancel()
                if (tooshort) {
                  this.showShort = true
                  window.setTimeout(() => {
                      this.showShort = false
                  }, 999)
                }
            } else {
                this.stopRecord()
            }
        },
        stopRecord () {
            let that = this;
            this.$wechat.stopRecord({
                success: function (res) {
                    that.speakId = res.localId
                    that.uploadRecord()
                    that.$emit('on-record-end', res.localId)
                }
            });
        },
        uploadRecord () {
            let that = this;
            this.$wechat.uploadVoice({
                localId: that.speakId,
                isShowProgressTips: 0, // 默认为1，显示进度提示
                success: function (res) {
                    //把录音在微信服务器上的id（res.serverId）发送到自己的服务器供下载。
                    that.$http.get(that.$urls.GAINMEDIABASE64, { mediaId: res.serverId }).then(d => {
                        that.$emit('on-record-ok', d.base64Str, d.fileUrl, that.speakId)
                    })
                },
                fail: function () {
                  that.$emit('on-record-fail')
                }
            });
        }
    }
  }
</script>
<style lang="less">
    .vux-speaking{
        position: relative;
        box-sizing: border-box;
        height: 2.92rem;
        border-radius: 1.4rem;
        border: 1px solid #EFEFEF;
        touch-action: auto;
        user-select: none;
        -webkit-user-drag: none;
        overflow: hidden;
        .button{
            touch-action: auto;
            user-select: none;
            -webkit-user-drag: none;
            position: absolute; top: 0; left:0;
            height: 200%; width: 200%;
            padding: 10px;
            box-sizing: border-box;
            border: 0;
            background: #f6f6f8; line-height: 1;
            transform: scale(.5);
            transform-origin: 0 0;
            font-size: 32px;
            &.speaking{
                background: #d6d6d8;
            }
        }
    }
    .recording {
        position: fixed;
        left: 50%;
        top: 45%;
        transform: translate(-50%, -50%);
        width: 140px;
        height: 140px;
        padding: 5px;
        background-color: rgba(0, 0, 0, .5);
        color: #ffffff;
        border-radius: 5px;
        font-size: 14px;
        text-align: center;
        z-index: 100;
        p{
            border-radius: 3px; line-height: 1.5;
        }        
        .voice-inner{
            height: 110px;
            &.notime{
              .voice-icon{ display: none; }
              .voice-time{
                font-size: 70px; margin-left: 0;
              }
            }
            .voice-time{
                font-size: 34px; margin-left: 10px; line-height: 110px;
            }
            .voice-icon {
                width: 55px;
                height: 90px;
                background: url(../../assets/img/recording.png) no-repeat center center;
                background-size: contain;
            }
            .voice-volume {
                width: 30px;
                height: 55px;
                i {
                    display: block;
                    height: 2px;
                    margin-top: 4px;
                    min-width: 8px;
                    float: left;
                    clear: both;
                    animation-iteration-count: infinite;
                    animation-timing-function: linear;
                    animation-duration: 2000ms;
                    background-color: #e4e4e5;
                    &:nth-child(1) { width: 24px; visibility: hidden; }
                    &:nth-child(2) { width: 22px; }
                    &:nth-child(3) { width: 20px; }
                    &:nth-child(4) { width: 18px; }
                    &:nth-child(5) { width: 16px; }
                    &:nth-child(6) { width: 14px; }
                    &:nth-child(7) { width: 12px; }
                    &:nth-child(8) { width: 10px; }
                    &:nth-child(9) { width: 8px; }
                }
            }
        }
        .recording-cancel p {
            background-color: #9d383e;
        }
        .cancel-inner {
            background: url(../../assets/img/record-cancel.png) no-repeat center center;
        }
        .short-inner {
            background: url(../../assets/img/short.png) no-repeat center center;
        }
        .single-img{
            width: 110px;
            height: 110px;
            margin: 0 auto;
            background-size: contain;
        }
    }
</style>