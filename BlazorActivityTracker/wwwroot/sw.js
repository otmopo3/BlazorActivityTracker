var CACHE_NAME = 'my-site-cache-v1';

self.addEventListener('install', function (event) {
    console.log('ServiceWorker Install');    
});

self.addEventListener('activate', event => {
    console.log('Service Worker activating.');
    event.waitUntil(self.clients.claim());
       
});


self.addEventListener('fetch', function (event) {
    console.log('Service Worker fetching: ' + event.request.url); 
    event.respondWith(
        caches.match(event.request)
            .then(function (cachedResponse) {
                // Cache hit - return response
                if (cachedResponse) {
                    console.log('Service Worker hit cache.');   
                    return cachedResponse;
                }

                console.log('Service Worker fetching from network.');   
                // IMPORTANT: Clone the request. A request is a stream and
                // can only be consumed once. Since we are consuming this
                // once by cache and once by the browser for fetch, we need
                // to clone the response.
                var fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    function (networkResponse) {
                        // Check if we received a valid response
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            console.log('Service Worker got invalid network response.'); 
                            return networkResponse;
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        var responseToCache = networkResponse.clone();

                        console.log('Service Worker opening cache to store response.'); 

                        caches.open(CACHE_NAME)
                            .then(function (cacheToStore) {
                                cacheToStore.put(event.request, responseToCache);
                                console.log('Service Worker put response to cached.');
                            });

                        return networkResponse;
                    }
                );
            })
    );
});
