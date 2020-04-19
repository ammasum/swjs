const utilityUrl = '/src/js/utility.js';
importScripts(utilityUrl);

const VERSION = 1;
const CACHE_STATIC_NAME = 'static-v' + VERSION;
const CACHE_DYNAMIC_NAME = 'dynamic-v' + VERSION;
const STATIC_FILES = [
    '/',
    '/index.html',
    '/manifest.json'
];
const DYNAMIC_FILES = [
    '/post'
];

function isDynamicUrlMatch(eventUrl) {
    for(let i = 0; i < DYNAMIC_FILES.length; i++) {
        if(eventUrl.includes(DYNAMIC_FILES[i])) {
            return true;
        }
    }
    return false;
}

self.addEventListener('fetch', (event) => {
    if(isDynamicUrlMatch(event.request.url)) {
        if(navigator.onLine) {
            event.respondWith(
                fetch(event.request)
                    .then(response => {
                        return caches.open(CACHE_DYNAMIC_NAME)
                            .then(cache => {
                                cache.put(event.request.url, response.clone());
                                return response;
                            })
                    })
                    .catch(err => {
                        return caches.match(event.request)
                            .then((response) => {
                                if(response) {
                                    return response;
                                 }
                            });
                    })
            );
            return;
        }
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    if(response) {
                        return response;
                    }
                })
        )
        return;
    }
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if(response) {
                    return response;
                }
                return fetch(event.request)
                    .then((response) => {
                        return caches.open(CACHE_DYNAMIC_NAME)
                            .then(cache => {
                                cache.put(event.request.url, response.clone());
                                return response;
                            });
                    })
            })
    );
});

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_STATIC_NAME)
            .then((cache) => {
                cache.addAll(STATIC_FILES);
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then(keys => {
                return Promise.all(keys.map((key) => {
                    if(key !== CACHE_DYNAMIC_NAME && key !== CACHE_STATIC_NAME) {
                        return caches.delete(key);
                    }
                }));
            })
    );
    return self.clients.claim();
});

self.addEventListener('sync', (event) => {
    console.log(event.tag);
    if(event.tag === 'sync-new-post') {
        readAllData('sync-post')
            .then(posts => {
                posts.forEach(post => {
                    const url  = post.sendUrl;
                    const postId = post.uxtid;
                    delete post.sendUrl;
                    delete post.uxtid;
                    fetch(url, {
                        method: 'POST',
                        body: JSON.stringify(post)
                    })
                        .then(response => {
                            deleteItem('sync-post', postId);
                            return response.json();
                        })
                        .then(data => {
                            console.log(data);
                        });
                });
            });
    }
})