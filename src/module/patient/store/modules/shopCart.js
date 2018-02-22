const cacheShoppingCart = JSON.parse(localStorage.getItem('_cache_shopping_cart_') || '[]')
export default {
  namespaced: true,
  state: {
    prods: cacheShoppingCart
  },

  mutations: {
    // 添加数量(追加)
    addNum(state, prod) {
      state.prods[prod.index].num += prod.num
      state.prods[prod.index].isSelected = true
      localStorage.setItem('_cache_shopping_cart_', JSON.stringify(state.prods))
    },
    // 添加元素
    addProd(state, prod) {
      state.prods.push(prod)
      localStorage.setItem('_cache_shopping_cart_', JSON.stringify(state.prods))
    },
    saveProds(state, prods) {
      state.prods = prods
      localStorage.setItem('_cache_shopping_cart_', JSON.stringify(state.prods))
    },
    // 保存更改后的单个元素(增加)
    saveChangedMoreProd(state, prod) {
      state.prods.forEach((p) => {
        if (p.id == prod.id) {
          p.num++
        }
      })
      localStorage.setItem('_cache_shopping_cart_', JSON.stringify(state.prods))
    },
    // 保存更改后的单个元素(减少)
    saveChangedLessProd(state, prod) {
      state.prods.forEach((p) => {
        if (p.id == prod.id) {
          p.num--
        }
      })
      localStorage.setItem('_cache_shopping_cart_', JSON.stringify(state.prods))
    },
    removeProd(state, index) {
      state.prods.splice(index, 1)
      localStorage.setItem('_cache_shopping_cart_', JSON.stringify(state.prods))
    },
    // 单个商品的状态改变
    changedProdStatus(state, prod) {
      state.prods.forEach((p) => {
        if (p.id == prod.id) {
          p.isSelected = !p.isSelected
        }
      })
      localStorage.setItem('_cache_shopping_cart_', JSON.stringify(state.prods))
    },
    // 购物车全选与反选
    changedStatus(state, status) {
      state.prods.map((p) => {
          p.isSelected = status
      })
      localStorage.setItem('_cache_shopping_cart_', JSON.stringify(state.prods))
    }
  },
  actions: {
    // 判断该商品是否存在与数组中，如果存在调用追加数据改变
    addProductOrNum(context, prod) {
      let myProds = context.getters.getProds
      let index = myProds.findIndex(function(p) {
        return p.id == prod.id
      })
      if (index != -1) { // 如果查找到对应的元素，就追加
        context.commit('addNum', { index, num: prod.num })
      } else {
        context.commit('addProd', prod) // 添加一个
      }
    },
    // 购物车列表页重新存数据
    saveNewProds(context, prods) {
      context.commit('saveProds', prods)
    },
    saveNewChangedMoreProd(context, prod) {
      context.commit('saveChangedMoreProd', prod)
    },
    saveNewChangedLessProd(context, prod) {
      context.commit('saveChangedLessProd', prod)
    },
    delProd(context, index) {
      context.commit('removeProd', index)
    },
    saveChangedProdStatus(context, prod) {
      context.commit('changedProdStatus', prod)
    },
    saveChangedStatus(context, status) {
      context.commit('changedStatus', status)
    }
  },
  getters: {
    getProds(state) { // 获取所有药品
      return Object.values(state.prods)
    },
    getProdsCount(state) {
      let count = 0
      for (let i = state.prods.length - 1; i >= 0; i--) {
        count += state.prods[i].num
      }
      return count
    },
    // 初始化是否全选
    isSelectedAll(state) {
      let selectall = true
      state.prods.map((item) => {
        if (item.isSelected == false) selectall = false
      })
      if (!state.prods.length) return false
      return selectall
    },
    getTotalPrice(state) {
      let totalPrice = 0
      state.prods.forEach(function(p) {
        if (p.isSelected) {
            totalPrice += p.detail.price * p.num // 单价乘以数量
        }
      })
      totalPrice = totalPrice.toFixed(2)
      return totalPrice
    },
    // 获取选中的药品
    getSelectedDrugs(state) {
      let selectedDrugs = []
      state.prods.forEach(function(p) {
        if (p.isSelected) {
          selectedDrugs.push(p)
        }
      })
      return selectedDrugs
    },
    // 获取结算后剩余的药品
    getElseDrugs(state) {
      let elseDrugs = []
      state.prods.forEach(function(p) {
        if (!p.isSelected) {
          elseDrugs.push(p)
        }
      })
      return elseDrugs
    }
  }
}
