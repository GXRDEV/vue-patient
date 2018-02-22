/**
 * 生成图片的缩略图
 * @param {*} src 图片地址，base64
 * @param {*} callback 成功后的回调
 * @param {*} w 缩略图宽度
 * @param {*} h 缩略图调试
 */
export default function (src, callback, w = 80, h = 0) {
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      let im = new Image()
      im.setAttribute('crossOrigin', 'anonymous')
      im.onload = function () {
          // 为传入缩放尺寸用原尺寸
          w = w || (this.width * h / this.height)
          h = h || (this.height * w / this.width)
          canvas.width = w
          canvas.height = h
          ctx.drawImage(im, 0, 0, w, h)
          callback(canvas.toDataURL('image/jpeg', 0.1))
      }
      im.src = src
  }
