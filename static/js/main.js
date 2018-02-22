/**
 * Created by perl on 2017/10/23.
 */
  (function () {
      function o() {
          document.documentElement.style.fontSize = parseInt((document.documentElement.clientWidth > 414 ? 414 : document.documentElement.clientWidth) * 13 / 375) + "px"
      }
      var e = null;
      window.addEventListener("resize", function () {
          clearTimeout(e), e = setTimeout(o, 300)
      }, !1), o()
  })(window);

