const EVENT_SCROLL = 'scroll'
function Q () {
    let elements = []
    let listeners = []
    let addListener = function (element, eventType, funcs) {
        let EVENT_SCROLL = 'scroll'
        let scrollData = {}
        // https://github.com/wangpin34/vue-scroll/issues/1
        if ((element === document.body || element === document || element === window) && eventType === 'SCROLL') {
            document.onscroll = function (e) {
                scrollData.scrollTop = document.body.scrollTop
                scrollData.scrollLeft = document.body.scrollLeft
                funcs.forEach(function (func) {
                    func && func(e, scrollData)
                })
            }
        } else {
            let listener = function (e) {
                e = e || window.event
                if (eventType === EVENT_SCROLL) {
                    scrollData.scrollTop = element.scrollTop
                    scrollData.scrollLeft = element.scrollLeft
                }
                funcs.forEach(function (func) {
                    (typeof func !== 'undefined') && func(e.target || e.srcElement, scrollData)
                })
            }

            if (element.addEventListener) {
                element.addEventListener(eventType, listener)
            } else {
                element.attachEvent('on' + eventType, listener)
            }
        }
    }

    if (typeof Q._initialized == 'undefined') {
        Q.prototype.bind = function (element, eventType, func) {
            let funcs

            if (elements.indexOf(element) < 0) {
                elements.push(element)
                listeners.push({})
                funcs = listeners[listeners.length - 1]
            } else {
                funcs = listeners[elements.indexOf(element)]
            }

            let eventFuncs
            if (!funcs[eventType]) {
                // Initialize event listeners
                funcs[eventType] = []
                // Bind to the element once
                addListener(element, eventType, funcs[eventType])
            }
            eventFuncs = funcs[eventType]
            eventFuncs.push(func)
        }

        Q.prototype.unbind = function (element, eventType, func) {
            let funcs

            if (elements.indexOf(element) < 0) {
                console.warn('There are no listener could be removed.')
                return 1
            } else {
                funcs = listeners[elements.indexOf(element)]
            }

            let eventFuncs
            if (!funcs[eventType] || (eventFuncs = funcs[eventType]).indexOf(func) < 0) {
                console.warn('There are no listener could be removed.')
                return
            }
            eventFuncs.splice(eventFuncs.indexOf(func), 1)
        }

        Q._initialized = true
    }
}

let q = new Q()

export default {
    bind: function (el, binding, vnode) {
        if (!binding.value || typeof binding.value !== 'function') {
            throw new Error('The scroll listener is not a function')
        }
        q.bind(el, EVENT_SCROLL, binding.value)
    },
    inserted: function (el, binding) {
        // To do, check whether element is scrollable and give warn message when not
    },
    update: function (el, binding) {
        if (binding.value === binding.oldValue) {
            return
        }
        if (!binding.value || typeof binding.value !== 'function') {
            throw new Error('The scroll listener is not a function')
        }
        q.bind(el, EVENT_SCROLL, binding.value)
        q.unbind(el, EVENT_SCROLL, binding.oldValue)
    },
    unbind: function (el, binding) {
        if (binding.value && typeof binding.value === 'function') {
            q.unbind(el, EVENT_SCROLL, binding.oldValue)
        } else {
            throw new Error('The scroll listener is not a function')
        }
    }
}
