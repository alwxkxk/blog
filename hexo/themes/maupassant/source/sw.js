var CACHE_NAME = 'my-site-cache-v1';
var regExp = new RegExp(/\.(png|jpg|css|svg|mp4|gif|json|mtn|woff|tff|moc|min.js|ico)/)

self.addEventListener('fetch', function(event) {
  if (event.request.method != 'GET') return;
  // 不符合条件的直接返回
  if(!regExp.test(event.request.url)){
    console.log('GET:',event.request.url)
    return;
  }

  event.respondWith(
    // 先检查缓存，若有直接返回缓存数据
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          // console.log('cache return:',response.url)
          return response;
        }

        var fetchRequest = event.request.clone();
        // 发出请求
        return fetch(fetchRequest).then(
          function(response) {
            // 不成功直接返回
            if(!response || response.status !== 200 || response.type !== 'basic') {
              // response.type: basic,cors,error,opaque,opaqueredirect
              // https://developer.mozilla.org/en-US/docs/Web/API/Response/type
              console.log('cache fail response:',event.request.url)
              return response;
            }
            
            // console.log('add cache:',response.url)
            var responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
    );
});