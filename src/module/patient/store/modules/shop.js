/**
 *{
 *    "SPH000000001": {
 *      detail: {
 *        药品详情
 *      },
 *      count: ''
 *    }
 *}
 */
const cacheShoppingCart = JSON.parse(localStorage.getItem('_cache_shopping_cart_') || '{}')
// 组件里调用方式。参考：https://vuex.vuejs.org/zh-cn/modules.html
// this.$store.commit('shop/removeCart')
export default {
  namespaced: true,
  state: {
    cart: cacheShoppingCart
  },
  mutations: {
    /**
     * 增加到购物车或者从购物车里减存每次增量为正负数字，0表示从购物车删除物品
     * @param {Object/String} thingObj 物品对象或者物品id（从购物车里增加减少时使用到id）
     * @param {Number} num 默认为1，从购物车增加减少时使用到，可以为-1，0表示从购物车删除物品
     */
    addCart(state, thingObj, num = 1) {
      debugger;
      let drugId = typeof thingObj == 'object' ? thingObj.drugInnerCode : thingObj
      if (drugId in state.cart) {
        num != 0 ? state.cart[drugId].count += num : delete state.cart[drugId]
      } else if (typeof thingObj == 'object' && num > 0) {
        state.cart[drugId] = {
          detail: thingObj,
          count: 1
        }
      }
      localStorage.setItem('_cache_shopping_cart_', JSON.stringify(state.cart))
    },
    /**
     * 清空购物车
     */
    cleanCart(state) {
      state.cart = {}
      localStorage.removeItem('_cache_shopping_cart_')
    },
    /**
     * 从购物车里移除商品，addCart也可以做到
     * @param {Object/String} thingObj 物品对象或者物品id
     */
    removeCart(state, thingObj) {
      let drugId = typeof thingObj == 'object' ? thingObj.drugInnerCode : thingObj
      if (drugId in state.cart) {
        delete state.cart[drugId]
        localStorage.setItem('_cache_shopping_cart_', JSON.stringify(state.cart))
      }
    }
  },
  actions: {
      addCarts(context,thingObj){
        context.commit('addCart',thingObj);
      }
  },
  getters: {
    // 用于显示购物车总数，列表页
    totals(state) {
      return Object.keys(state.cart).length
    },
    // 购物车内所有商品总金额
    moneys(state, getters) {
      return getters.cartList.map(item => {
        return item.detail.price * item.count
      }).reduce((sum, value) => sum + value, 0)
    },
    // 用于加载购物车列表
    cartList(state) {
      return Object.values(state.cart)
    }
  }
}
