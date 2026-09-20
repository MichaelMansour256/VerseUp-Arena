const STATIC_CACHE = 'verseup-static-v1';
const ROUTES_CACHE = 'verseup-routes-v1';
const DYNAMIC_CACHE = 'verseup-dynamic-v1';

const PRECACHE_URLS = [
    '/', '/index.html', '/offline.html',
    '/pages/quote.html', '/pages/memory.html', '/pages/reverse.html',
    '/pages/scramble.html', '/pages/whoami.html', '/pages/wordle.html',
    '/pages/emojiverse.html', '/pages/crossword.html',
    '/css/base.css', '/css/components.css', '/css/layout.css',
    '/css/navigation.css', '/css/home.css', '/css/quote.css',
    '/css/games/common.css', '/css/games/memory.css', '/css/games/reverse.css',
    '/css/games/scramble.css', '/css/games/whoami.css', '/css/games/wordle.css',
    '/css/games/emojiverse.css', '/css/games/crossword.css'
];

self.addEventListener('install', (event) => {
    console.log('[SW] Installing VerseUp Arena service worker');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting())
            .catch(err => console.error('[SW] Precache failed:', err))
    );
    self.clients.claim();
});

self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker');
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.filter(k => k.startsWith('verseup-') && k !== STATIC_CACHE && k !== ROUTES_CACHE && k !== DYNAMIC_CACHE)
                    .map(k => caches.delete(k))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    if (request.method !== 'GET') return;
    if (url.origin !== self.location.origin) return;
    
    if (isNavigationRequest(request)) {
        event.respondWith(handleNavigation(request));
        return;
    }
    
    if (isStaticAsset(url.pathname)) {
        event.respondWith(handleStaticAsset(request));
        return;
    }
    
    event.respondWith(handleNetworkFirst(request));
});

function isNavigationRequest(request) {
    return request.mode === 'navigate' ||
           request.url.endsWith('.html') ||
           ['/', '/quote', '/memory', '/reverse', '/scramble', '/whoami', '/wordle', '/emojiverse', '/crossword'].includes(new URL(request.url).pathname);
}

function isStaticAsset(pathname) {
    return /\.(js|css|png|jpg|jpeg|svg|webp|woff|woff2|ttf|eot)$/.test(pathname) ||
           pathname.startsWith('/manifest.webmanifest') ||
           pathname.startsWith('/assets/');
}

async function handleNavigation(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(ROUTES_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    } catch (err) {
        console.log('[SW] Network navigation failed, checking cache');
        const cached = await caches.match(request);
        if (cached) return cached;
        
        const path = new URL(request.url).pathname;
        if (!path.endsWith('.html')) {
            const alt = await caches.match(path + '.html');
            if (alt) return alt;
        }
        
        console.log('[SW] Serving offline page');
        const offline = await caches.match('/offline.html');
        return offline || new Response('Offline', { status: 503 });
    }
}

async function handleStaticAsset(request) {
    const cached = await caches.match(request);
    if (cached) {
        fetch(request).then(res => {
            if (res.ok) caches.open(STATIC_CACHE).then(c => c.put(request, res));
        }).catch(() => {});
        return cached;
    }
    
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    } catch (err) {
        return new Response('Not found', { status: 404 });
    }
}

async function handleNetworkFirst(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cached = await cache.match(request);
    
    try {
        const response = await fetch(request);
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    } catch (err) {
        return cached || new Response('Error', { status: 500 });
    }
}
