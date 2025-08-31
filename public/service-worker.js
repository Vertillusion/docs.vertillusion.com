// 缓存版本和策略配置
const CACHE_VERSION = 'v2';
const CACHE_NAME = `vilinko-docs-cache-${CACHE_VERSION}`;
const DOCS_CACHE_NAME = `vilinko-documents-cache-${CACHE_VERSION}`;
const ASSETS_CACHE_NAME = `vilinko-assets-cache-${CACHE_VERSION}`;
const CACHE_EXPIRY_DAYS = 15;
const CACHE_EXPIRY_SECONDS = CACHE_EXPIRY_DAYS * 24 * 60 * 60;

// 核心资源 - 在安装时立即缓存
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/img/pwa-120x120.png',
  '/img/pwa-192x192.png',
  '/img/pwa-512x512.png'
];

// 文档页面缓存策略
const isDocumentRequest = (request) => {
  return request.destination === 'document' || 
         (request.url.includes('/docs/') && request.url.endsWith('.html')) ||
         (request.url.includes('/zh/') && request.url.endsWith('.html')) ||
         (request.url.includes('/en/') && request.url.endsWith('.html'));
};

// 静态资源缓存策略
const isAssetRequest = (request) => {
  const assetExtensions = ['js', 'css', 'svg', 'png', 'jpg', 'jpeg', 'ico', 'md'];
  const url = new URL(request.url);
  const extension = url.pathname.split('.').pop().toLowerCase();
  return assetExtensions.includes(extension);
};

// 缓存过期检查
const isCacheExpired = (cacheEntry) => {
  if (!cacheEntry || !cacheEntry.timestamp) return true;
  const now = Date.now();
  const age = now - cacheEntry.timestamp;
  return age > CACHE_EXPIRY_SECONDS * 1000;
};

// 安装阶段 - 立即激活新的Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // 缓存核心资源
      caches.open(CACHE_NAME)
        .then((cache) => {
          console.log('Opened core cache');
          return cache.addAll(urlsToCache);
        }),
      // 创建文档和资源缓存空间
      caches.open(DOCS_CACHE_NAME),
      caches.open(ASSETS_CACHE_NAME)
    ]).then(() => {
      // 立即激活新的Service Worker
      self.skipWaiting();
    })
  );
});

// 激活阶段 - 清理旧缓存并接管所有客户端
self.addEventListener('activate', (event) => {
  // 清理所有旧版本的缓存
  const cacheWhitelist = [CACHE_NAME, DOCS_CACHE_NAME, ASSETS_CACHE_NAME];
  event.waitUntil(
    Promise.all([
      // 删除旧缓存
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // 立即接管所有客户端
      self.clients.claim()
    ])
  );
});

// 获取带时间戳的缓存响应
const getCachedResponse = async (cache, request) => {
  const cached = await cache.match(request);
  if (!cached) return null;
  
  // 读取响应体并添加时间戳元数据
  const body = await cached.clone().blob();
  const headers = new Headers(cached.headers);
  const timestamp = headers.get('x-cache-timestamp') || Date.now().toString();
  
  return {
    response: cached,
    timestamp: parseInt(timestamp)
  };
};

// 存储响应到缓存，添加时间戳
const storeResponseInCache = async (cache, request, response) => {
  const responseToCache = response.clone();
  const headers = new Headers(responseToCache.headers);
  headers.set('x-cache-timestamp', Date.now().toString());
  
  const blob = await responseToCache.blob();
  const cacheableResponse = new Response(blob, {
    status: responseToCache.status,
    statusText: responseToCache.statusText,
    headers: headers
  });
  
  await cache.put(request, cacheableResponse);
};

// 拦截请求并根据资源类型应用不同的缓存策略
self.addEventListener('fetch', (event) => {
  const request = event.request;
  
  event.respondWith(
    (async () => {
      // 处理文档页面请求 - 使用StaleWhileRevalidate策略
      if (isDocumentRequest(request)) {
        const docsCache = await caches.open(DOCS_CACHE_NAME);
        const cachedResult = await getCachedResponse(docsCache, request);
        
        // 无论缓存是否存在，都尝试从网络获取最新版本并更新缓存
        const fetchPromise = fetch(request).then(async (networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            await storeResponseInCache(docsCache, request, networkResponse);
          }
          return networkResponse;
        }).catch(() => {
          // 网络错误时，如果有缓存就返回缓存
          return cachedResult ? cachedResult.response : null;
        });
        
        // 如果有缓存且未过期，立即返回缓存内容
        if (cachedResult && !isCacheExpired(cachedResult)) {
          return cachedResult.response;
        }
        
        // 否则等待网络请求结果
        return fetchPromise;
      }
      
      // 处理静态资源请求 - 使用CacheFirst策略
      if (isAssetRequest(request)) {
        const assetsCache = await caches.open(ASSETS_CACHE_NAME);
        const cachedResult = await getCachedResponse(assetsCache, request);
        
        // 如果有缓存且未过期，直接返回缓存
        if (cachedResult && !isCacheExpired(cachedResult)) {
          return cachedResult.response;
        }
        
        // 否则尝试从网络获取
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            await storeResponseInCache(assetsCache, request, networkResponse);
          }
          return networkResponse;
        } catch (error) {
          // 网络错误时，如果有缓存（即使已过期）也返回缓存
          return cachedResult ? cachedResult.response : null;
        }
      }
      
      // 处理核心资源请求
      const coreCache = await caches.open(CACHE_NAME);
      const coreCached = await coreCache.match(request);
      if (coreCached) {
        return coreCached;
      }
      
      // 对于其他请求，尝试从网络获取
      try {
        return await fetch(request);
      } catch (error) {
        // 离线状态下，返回首页作为回退
        return await caches.match('/');
      }
    })()
  );
});