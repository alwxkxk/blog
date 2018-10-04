(function (w, d) {
  var b = d.getElementsByTagName('body')[0]
  var s = d.createElement('script')
  var v = !('IntersectionObserver' in w) ? '8.16.0' : '10.19.0'
  s.async = true // This includes the script as async. See the "recipes" section for more information about async loading of LazyLoad.
  s.src = '/js/lazyload.' + v + '.min.js'
  w.lazyLoadOptions = {/* Your options here */}
  b.appendChild(s)
}(window, document))

setTimeout(() => {
  var myLazyLoad = new window.LazyLoad({
    elements_selector: '.lazy'
  })
}, 2000)
