<template>
  <div class="vux-texting relative">
    <textarea class="textarea big14" placeholder="请输入内容"
      :id="id" v-model="currentVal" @blur="blur" @focus="focus"></textarea>
    <button class="submit absolute big14" :disabled="!context" type="submit">发送</button>
  </div>
</template>

<script>
    import debounce from 'vux/src/tools/debounce'
    export default {
      name: 'texting',
      props: {
        value: String,
        id: {
            type: String,
            default: 'msgContainer'
        },
        height: {
            type: String,
            default: '2.92rem'
        }
      },
      watch: {
        value (val) {
          this.currentVal = val
        },
        currentVal: debounce(function(val){
            let txt = document.getElementById(this.id)
            txt.style.height = this.height
            if(txt.scrollHeight > 40) {
                txt.style.height = txt.scrollHeight + 'px'
            }
            this.$emit('input', val)
            // this.scrollToView()
        }, 100)
      },
      computed: {
        context () {
          let val = this.currentVal.replace(/\s+/g, "")
          val = val.replace(/<\/?.+?>/g,"")
          val = val.replace(/[\r\n]/g, "")
          return val.length > 0
        }
      },
      methods: {
        focus () {
            // 隐藏聊天内容
            // let bodyDiv = document.querySelector('.vux-texting')
            // bodyDiv.style.marginBottom = '86vw'
            // // 输入框滚动到可视窗体内
            // window.setTimeout(this.scrollToView, 120)
        },
        scrollToView () {
          document.getElementById(this.id).scrollIntoView(false)
          // document.getElementById(this.id).scrollIntoViewIfNeeded(false)
        },
        blur () {
            let textbox = document.getElementById(this.id)
            this.start = textbox.selectionStart
            this.end = textbox.selectionEnd
            // 显示聊天内容
            // let bodyDiv = document.querySelector('.vux-texting')
            // bodyDiv.style.marginBottom = '0'
            // this.scrollToView()
        },
        insert (emj) {
            this.currentVal = this.currentVal.substring(0, this.start) + emj + this.currentVal.slice(this.end)
            this.start += emj.length
            this.end += emj.length
        }
      },
      data () {
        return {
          currentVal: '',
          start: 0,
          end: 0
        }
      }
    }
</script>
<style scoped lang="less">
    @import '../../assets/css/var';
    .vux-texting{
      font-size: 0; line-height: 0;
    }
    .submit{
        -webkit-appearance: none; box-sizing: border-box;
        right: 0; bottom: -1px; height: 2.92rem; width: 4.27rem; border: .25rem solid transparent;
        border-radius: 1.4rem; color: #fff; overflow: hidden;
        box-shadow: inset 5rem 4rem @main-color;
        &[disabled]{
          box-shadow: inset 5rem 4rem #aaa;
        }
    }
    .textarea{
        width: 100%; height: 2.92rem; line-height: 1.6rem;
        margin: 0; padding: .66rem 4.5rem .66rem 1rem;
        border-radius: 1.4rem;
        max-height: 120px;
        border: 1px solid #EFEFEF;
        box-sizing: border-box;
        background-color: #F7F7F7;
        resize: none;
        outline: none;
        -webkit-appearance: none;
    }
</style>
