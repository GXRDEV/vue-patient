<template>
  <div class="watchPage tcenter">
      <header class="bgfff big14">
          <icon type="warn" is-msg></icon>
          <p class="gray">您还未关注“佰医汇”微信公众平台</p>
      </header>
      <section>
          <figcaption>
              <p>“长按识别下方二维码关注公号</p>
              <p>即可向您的医生/团队报到”</p>
              <figure>
                  <img :src="imgsrc($route.query.url, 'byh.jpg', 'auto')" alt="长按识别二维码关注公号">
              </figure>
          </figcaption>
      </section>
  </div>
</template>
<script>
import { Icon } from 'vux'
import { imgsrc } from '@filters'
export default {
    components: {
        Icon
    },
    methods: {
        imgsrc
    }
}
</script>

<style lang="less">
    .watchPage{
        header{
            padding: 1.5em 0 3.125em;
            .weui-icon-warn{
                font-size: 4rem;
                color: #0085D0;
                margin-bottom: 1.5rem;
            }
            p{ line-height: 1; }
        }
        figcaption{
            padding: 3.5em 0 0;
            line-height: 1.6rem;
            img{
                width: 100%;
            }
        }
        figure{
            display: block;
            width: 70%; margin: 1.5em auto 0;
        }
    }
</style>
