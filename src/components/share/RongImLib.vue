<template></template>
<script>
    import { AppendScript } from '@plugins/ajax'
    export default {
      name: 'rongimlib',
      props: {
        token: String,
        appkey: String,
        receiveId: String,
        type: {
          type: String,
          default: 'PRIVATE' // GROUP, PRIVATE
        }
      },
      watch: {
        token (v) {
          if (typeof RongIMClient == 'undefined' && v) {
            this.init()
          } else if (typeof RongIMClient != 'undefined' && v) {
            this.connect()
          }
        }
      },
      created () {
        if (typeof RongIMClient == 'undefined' && this.token && this.appkey) {
            this.init()
        } else if (typeof RongIMClient != 'undefined' && this.token) {
            this.connect()
        }
      },
      beforeDestroy () {
        if(typeof RongIMClient != 'undefined') {
            try{
				RongIMClient.getInstance().disconnect()
			} catch(e) { }
        }
      },
      methods: {
        info (errorCode, message) {
          let info = ''
          /*global RongIMLib */
          switch (errorCode) {
              case RongIMLib.ErrorCode.TIMEOUT:
                  info = '连接超时'
                  break
              case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                  info = '未知错误'
                  break
              case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                  info = '在黑名单中，无法向对方发送/接收消息'
                  break
              case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                  info = '不在讨论组中'
                  break
              case RongIMLib.ErrorCode.NOT_IN_GROUP:
                  info = '不在群组中'
                  break
              case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                  info = '不在聊天室中'
                  break
              case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
                  info = '不可接受的协议版本'
                  break
              case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
                  info = 'appkey不正确'
                  break
              case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
                  info = '服务器不可用'
                  break
              default:
                  info = '其它'
                  break
          }
          info && console.log(info)
        },
        ready () {
            if (typeof RongIMClient != 'undefined' && this.token) {
                this.$emit('on-ready')
            }
        },
        connect () {
            let that = this
            let h = this.$store.state.static + '/js/rong/'
            /*global RongIMClient */
            try{
				RongIMClient.getInstance().logout()
			} catch(e) { }
            RongIMClient.init(that.appkey, null, {
                protobuf : h + "protobuf-2.2.8.min.js"
            })
            RongIMClient.setConnectionStatusListener({
                onChanged: function (status) {
                    let info = ''
                    switch (status) {
                        case RongIMLib.ConnectionStatus.CONNECTED:
                            info = '链接成功'
                            break
                        case RongIMLib.ConnectionStatus.CONNECTING:
                            info = '正在链接'
                            break
                        case RongIMLib.ConnectionStatus.DISCONNECTED:
                            info = '连接已断开'
                            break
                        case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                            info = '其他设备登录'
                            break
                        case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                            info = '网络不可用，请刷新重试'
                            break
                    }
                    info && console.log(info)
                }
            })
            // 消息监听器
            RongIMClient.setOnReceiveMessageListener({
                // 接收到的消息
                onReceived: function (message) {
                    // console.log('我接收到的消息为：', message);
                    if (that.receiveId != message.targetId) {
                        return console.log('接收目标targetId不一置')
                    }
                    // 判断是否是离线消息
                    if (message.offLineMessage) {
                        return
                    }
                    // 判断消息类型
                    switch (message.messageType) {
                        case RongIMClient.MessageType.TextMessage:
                            that.$emit('on-recive-msg', 'RC:TxtMsg', message)
                            break
                        case RongIMClient.MessageType.VoiceMessage:
                            that.$emit('on-recive-msg', 'RC:VcMsg', message)
                            break
                        case RongIMClient.MessageType.ImageMessage:
                            that.$emit('on-recive-msg', 'RC:ImgMsg', message)
                            break
                        default:
                            // 自定义消息
                            // do something...
                    }
                }
            })
            // 连接融云服务器。
            RongIMClient.connect(that.token, {
                onSuccess: function (userId) {
                    console.info('Login successfully：' + userId);
                },
                onTokenIncorrect: function () {
                    alert('token无效，请刷新重试')
                },
                onError: function (errorCode, message){
                    that.info(errorCode, message)
                }
            })
            this.ready()
        },
        emitToHtml (msg) {
            if (this.android && !msg.content.imageUri) {
                this.$http.get(this.$urls.GAINVOICESRC, {
                    messageUId: msg.messageUId
                }).then(d => {
                    msg.content.imageUri = d.fileUrl || ''
                    this.$emit('on-recive-msg', 'RC:VcMsg', msg)
                })
            } else {
                this.$emit('on-recive-msg', 'RC:VcMsg', msg)
            }
        },
        init () {
            if (typeof RongIMClient == 'undefined') {
                window.setTimeout(this.init)
            } else {
                this.connect()
            }
        }
      },
      data() {
        return {
            android: this.$store.state.android
        }
      }
    }
</script>