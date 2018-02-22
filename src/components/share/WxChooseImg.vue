<template>
    <span class="block" @click="chooseImg">
        <slot></slot>
    </span>
</template>

<script>
  import { ResizeImage } from '@plugins/api'

  export default {
    name: 'wxchooseimg',
    methods: {
      chooseImg () {
        let that = this
        if(!this.iswechat) {
            this.$vux.toast.show({ type: 'text', width: '12em', text: '仅支持微信内使用', position: 'top' })
            return
        }
        this.$wechat.chooseImage({
            count: 9, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图original还是压缩图compressed，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册album还是相机camera，默认二者都有
            success: function (res) {
                // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                res.localIds.forEach(localId => {
                    that.localIds.push(localId)
                    !window.__wxjs_is_wkwebview && that.$emit('on-choose-end', localId)
                })
                !that.isupload && that.uploadImg()
            }
        });
      },
      uploadImg () {
        let that = this
        if(that.localIds.length > 0){
            this.isupload = true
            let localId = that.localIds.shift()
            window.__wxjs_is_wkwebview && that.$wechat.getLocalImgData({
                localId: localId,
                success: function (res) {
                    that.$emit('on-choose-end', localId, res.localData)
                }
            })
            this.$wechat.uploadImage({
                localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
                isShowProgressTips: 0, // 默认为1，显示进度提示
                success: function (res) {
                    that.$http.get(that.$urls.GAINMEDIABASE64, { mediaId: res.serverId }).then(d => {
                        ResizeImage(d.fileUrl, str => {
                            that.$emit('on-choose-ok', str, d.fileUrl, localId)
                        }, 400)
                    })
                    that.uploadImg()
                },
                fail: function () {
                    that.$emit('on-choose-fail', localId)
                }
            });
        } else {
            this.isupload = false
        }
      }
    },
    data () {
        return {
            iswechat: this.$store.state.wechat,
            isupload: false,
            localIds: []
        }
    }
  }
</script>
