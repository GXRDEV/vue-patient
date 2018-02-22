import uploader from '@plugins/uploader'
import { imgsrc } from '@filters'
import { Previewer, TransferDom } from 'vux'

export default {
    components: {
        Previewer
    },
    directives: {
        TransferDom
    },
    data () {
      return {
        items: [],
        prevId: -1,
        prevItems: [],
        android: this.$store.state.android,
        iswechat: this.$store.state.wechat,
        isupload: false,
        localIds: [],
        backIds: [],
        accept: 'image/jpg,image/jpeg,image/gif,image/bmp,image/png',
        options: {
            getThumbBoundsFn (index) {
              let thumbnail = document.querySelectorAll('.weui-uploader__file')[index]
              let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
              let rect = thumbnail.getBoundingClientRect()
              return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
            },
            isClickableElement: function (el) {
                return /weui-gallery__del/.test(el.className)
            }
        }
      }
    },
    computed: {
      ids () {
        return this.items.filter(i => !i.add).map(i => i._id || i.id).join(',')
      },
      urls () {
        return this.items.filter(i => !i.add).map(i => i._url || i.url).join(',')
      }
    },
    watch: {
      list (list) {
        this.items = [...list]
      },
      items (list) {
        this.prevItems = list.map(i => {
            return {
                src: i._url || i.url
            }
        })
      }
    },
    created () {
      this.android && (this.accept = 'image/*')
      this.items = [...this.list]
    },
    mounted () {
      let that = this
      !this.android && uploader('#' + this.id, {
          url: this.$urls.UPLOADFILENEW,
          auto: true,
          type: 'file',
          compress: {
              width: 1600,
              height: 1600,
              quality: 0.8
          },
          onBeforeQueued: function (files) {
              let text = ''
              if (['image/jpg', 'image/jpeg', 'image/png', 'image/gif'].indexOf(this.type) < 0) {
                  text = '请上传图片'
              }
              if (this.size > 10 * 1024 * 1024) {
                  text = '请上传不超过10M的图片'
              }
              if (files.length > 9) {
                  text = '每次最多只能上传9张图片，请重新选择'
              }
              if (text) {
                  return this.$vux.toast.show({
                      type: 'text',
                      text,
                      position: 'top'
                  })
              }
          },
          onQueued: function (file) {
              that.onQueued(file)
          },
          onSuccess: function (res, file) {
              that.onSuccess({
                  id: file.id,
                  _id: res.upid,
                  _url: res.urlpath
              })
          },
          onError: function (file, err) {
            that.onError(file.id)
          }
      })
    },
    methods: {
      imgsrc,
      chooseImage () {
        let that = this
        if (!this.iswechat) {
            this.$vux.toast.show({ type: 'text', width: '12em', text: '仅支持微信内使用', position: 'top' })
            return
        }
        this.$wechat.chooseImage({
            count: this.multiple ? 9 : 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                res.localIds.forEach(localId => {
                    if (that.backIds.indexOf(localId) == -1) {
                        that.backIds.push(localId)
                        that.localIds.push(localId)
                        that.joinQueue(localId)
                    } else {
                        that.$vux.toast.show({
                            type: 'text',
                            text: '图片已在上传列表中',
                            position: 'top'
                        })
                    }
                })
                that.$nextTick(() => {
                    !that.isupload && that.uploadImg()
                })
            }
        })
      },
      joinQueue (localId) {
          let that = this
          window.__wxjs_is_wkwebview ? that.$wechat.getLocalImgData({
              localId: localId,
              success: function (res) {
                  that.onQueued({ id: localId, url: res.localData || localId })
              }
          }) : that.onQueued({ id: localId, url: localId })
      },
      uploadImg () {
        let that = this
        if (that.localIds.length > 0) {
            this.isupload = true
            let localId = that.localIds.shift()
            this.$wechat.uploadImage({
                localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
                isShowProgressTips: 0, // 默认为1，显示进度提示
                success: function (res) {
                    that.gainInfo(localId, res.serverId)
                },
                fail: function () {
                    that.onError(localId)
                },
                complete: function () {
                    that.uploadImg()
                }
            })
        } else {
            this.isupload = false
        }
      },
      gainInfo (localId, mediaId) {
          let i = 5
          let that = this
          let action = function () {
            that.$http.get(that.$urls.GAINMEDIAINFO, { mediaId }).then(d => {
                --i ? (d.status == 'error' && window.setTimeout(action, 5000)) : that.onError(localId)
                d.upid && that.onSuccess({
                    id: localId,
                    _id: d.upid,
                    _url: d.fileurl
                })
            })
          }
          action()
      },
      onQueued (file) {
          let item = {
            id: file.id,
            add: true,
            url: file.base64 || file.url
          }
          if (!this.multiple) {
            this.items = [item]
          } else {
            this.items.push(item)
          }
      },
      onError (fid) {
          let item = this.items.find(v => v.id == fid)
          this.$set(item, 'add', 'error')
      },
      onSuccess (obj) {
          let item = this.items.find(v => v.id == obj.id)
          this.$set(item, 'add', false)
          this.$set(item, '_id', obj._id)
          this.$set(item, '_url', obj._url)
          this.$emit('success', this.ids, this.urls)
      }
    }
}
