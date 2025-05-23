/// <reference lib="webworker" />

// CatchSmart Service Worker v1.0.0
// Implements offline-first strategy with intelligent caching

const CACHE_NAME = 'catchsmart-v1'
const DYNAMIC_CACHE = 'catchsmart-dynamic-v1'
const IMAGE_CACHE = 'catchsmart-images-v1'

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/globals.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
]

// Cache strategies
const CACHE_STRATEGIES = {
  networkFirst: [
    '/api/',
    '/auth/',
  ],
  cacheFirst: [
    '/static/',
    '/fonts/',
    '/_next/static/',
  ],
  staleWhileRevalidate: [
    '/',
    '/equipment',
    '/catches',
    '/assistant',
    '/profile',
  ],
}

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets')
      return cache.addAll(STATIC_ASSETS.filter(asset => 
        // Only cache assets that exist
        !asset.includes('offline.html') // We'll create this later
      ))
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== IMAGE_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // Skip Chrome extensions and hot reload
  if (url.protocol === 'chrome-extension:' || 
      url.hostname === 'localhost' && url.pathname.includes('_next')) {
    return
  }

  // Network First Strategy (API calls)
  if (CACHE_STRATEGIES.networkFirst.some(path => url.pathname.includes(path))) {
    event.respondWith(networkFirst(request))
    return
  }

  // Cache First Strategy (static assets)
  if (CACHE_STRATEGIES.cacheFirst.some(path => url.pathname.includes(path))) {
    event.respondWith(cacheFirst(request))
    return
  }

  // Image caching with size optimization
  if (request.destination === 'image') {
    event.respondWith(cacheImage(request))
    return
  }

  // Stale While Revalidate (app pages)
  if (CACHE_STRATEGIES.staleWhileRevalidate.some(path => 
    url.pathname === path || url.pathname.startsWith(path))) {
    event.respondWith(staleWhileRevalidate(request))
    return
  }

  // Default: Network with cache fallback
  event.respondWith(networkWithCacheFallback(request))
})

// Caching Strategies Implementation

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    // Return offline data for API calls
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'Keine Internetverbindung. Arbeite im Offline-Modus.' 
      }),
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    return new Response('Resource not available offline', { status: 404 })
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE)
  const cachedResponse = await cache.match(request)
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  }).catch(() => null)
  
  return cachedResponse || fetchPromise || offlineFallback()
}

async function networkWithCacheFallback(request) {
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    const cachedResponse = await caches.match(request)
    return cachedResponse || offlineFallback()
  }
}

async function cacheImage(request) {
  const cache = await caches.open(IMAGE_CACHE)
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse) {
    // Refresh image in background
    fetch(request).then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse)
      }
    }).catch(() => {})
    
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    // Return placeholder image
    return new Response(
      `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#182436"/>
        <text x="50%" y="50%" text-anchor="middle" fill="#9CB5C9" font-family="Inter" font-size="16">
          Bild offline nicht verfügbar
        </text>
      </svg>`,
      { 
        headers: { 'Content-Type': 'image/svg+xml' }
      }
    )
  }
}

function offlineFallback() {
  return caches.match('/offline.html').then((response) => {
    return response || new Response(
      `<!DOCTYPE html>
      <html lang="de">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CatchSmart - Offline</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0F1B2B;
            color: #E5F4FF;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            text-align: center;
            padding: 20px;
          }
          .container {
            max-width: 400px;
          }
          h1 {
            font-size: 24px;
            margin-bottom: 16px;
          }
          p {
            color: #9CB5C9;
            line-height: 1.5;
          }
          .icon {
            font-size: 64px;
            margin-bottom: 20px;
          }
          button {
            background: #1EC6FF;
            color: #0F1B2B;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">🎣</div>
          <h1>Du bist offline</h1>
          <p>
            Keine Sorge! Deine gespeicherten Köder und Fänge sind weiterhin verfügbar. 
            Neue Empfehlungen benötigen eine Internetverbindung.
          </p>
          <button onclick="location.reload()">Erneut versuchen</button>
        </div>
      </body>
      </html>`,
      { 
        headers: { 'Content-Type': 'text/html' }
      }
    )
  })
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag)
  
  if (event.tag === 'sync-catches') {
    event.waitUntil(syncCatches())
  } else if (event.tag === 'sync-equipment') {
    event.waitUntil(syncEquipment())
  }
})

async function syncCatches() {
  // Implementation will be added when we have the API
  console.log('[SW] Syncing catches...')
}

async function syncEquipment() {
  // Implementation will be added when we have the API
  console.log('[SW] Syncing equipment...')
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'Neue Empfehlung verfügbar!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ansehen',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Schließen',
        icon: '/icons/xmark.png'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('CatchSmart', options)
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  if (event.action === 'explore') {
    clients.openWindow('/assistant')
  } else {
    clients.openWindow('/')
  }
})